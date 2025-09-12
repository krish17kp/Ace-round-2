from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pathlib import Path
from datetime import datetime
import numpy as np
from scipy.io import wavfile
from scipy.signal import resample_poly
import io
import os
import json

# Lazy import transformers as optional fallback
try:
    from transformers import pipeline as hf_pipeline  # type: ignore
except Exception:  # pragma: no cover
    hf_pipeline = None


ROOT = Path(__file__).resolve().parent
UPLOAD_DIR = ROOT / "uploads"
LOG_DIR = ROOT / "logs"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
LOG_DIR.mkdir(parents=True, exist_ok=True)
LOG_FILE = LOG_DIR / "records.jsonl"

MODEL_ID = "ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition"

app = FastAPI(title="Emotion Analyzer API", version="1.0.0")

# CORS for local Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


_pipe = None
_ser_model = None
_ser_labels = None
_sk_model = None
_sk_labels = None


def get_pipeline():
    global _pipe
    if _pipe is None:
        if hf_pipeline is None:
            raise RuntimeError("transformers not installed")
        _pipe = hf_pipeline(
            "audio-classification",
            model=MODEL_ID,
            device=-1,  # CPU
        )
    return _pipe


def _save_log(entry: dict):
    try:
        with LOG_FILE.open("a", encoding="utf-8") as f:
            import json

            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception:
        # Non-fatal if logging fails
        pass


def _ensure_mono_16k(wav_bytes: bytes) -> tuple[np.ndarray, int]:
    # Read WAV from bytes, convert to mono 16k float32 -1..1
    sr, data = wavfile.read(io.BytesIO(wav_bytes))

    # Convert to float32 -1..1
    if data.dtype == np.int16:
        audio = data.astype(np.float32) / 32768.0
    elif data.dtype == np.int32:
        audio = data.astype(np.float32) / 2147483648.0
    elif data.dtype == np.uint8:
        audio = (data.astype(np.float32) - 128.0) / 128.0
    else:
        audio = data.astype(np.float32)

    # If multi-channel, average to mono
    if audio.ndim == 2:
        audio = audio.mean(axis=1)

    target_sr = 16000
    if sr != target_sr:
        # Resample using polyphase to reduce deps
        # Factor = target_sr / sr
        from math import gcd

        g = gcd(int(sr), int(target_sr))
        up = target_sr // g
        down = sr // g
        audio = resample_poly(audio, up, down).astype(np.float32)
        sr = target_sr

    return audio, sr


# ---------------- Local MFCC+LSTM SER ----------------
def _ser_model_paths() -> tuple[Path, Path]:
    root = ROOT / "models"
    root.mkdir(parents=True, exist_ok=True)
    return root / "ser_lstm.keras", root / "ser_labels.json"

def _sk_model_paths() -> tuple[Path, Path]:
    root = ROOT / "models"
    root.mkdir(parents=True, exist_ok=True)
    return root / "ser_sklearn.joblib", root / "ser_labels.json"


def load_local_ser_if_available() -> bool:
    global _ser_model, _ser_labels
    if _ser_model is not None and _ser_labels is not None:
        return True
    try:
        from tensorflow import keras  # type: ignore
        model_path, labels_path = _ser_model_paths()
        if model_path.exists() and labels_path.exists():
            _ser_model = keras.models.load_model(model_path)
            with labels_path.open("r", encoding="utf-8") as f:
                _ser_labels = json.load(f)
            return True
    except Exception:
        _ser_model = None
        _ser_labels = None
    return False


def load_sklearn_ser_if_available() -> bool:
    """Load the sklearn MFCC classifier if present (trained via train_ser_sklearn.py)."""
    global _sk_model, _sk_labels
    if _sk_model is not None and _sk_labels is not None:
        return True
    try:
        import joblib  # type: ignore
        model_path, labels_path = _sk_model_paths()
        if model_path.exists() and labels_path.exists():
            _sk_model = joblib.load(model_path)
            with labels_path.open("r", encoding="utf-8") as f:
                _sk_labels = json.load(f)
            return True
    except Exception:
        _sk_model = None
        _sk_labels = None
    return False


def _mfcc_mean_40(audio: np.ndarray, sr: int) -> np.ndarray:
    import librosa  # lazy import

    if audio.ndim > 1:
        audio = audio.mean(axis=1)
    audio = audio.astype(np.float32)

    # choose highest-energy 3s window
    target = 3.0
    need = int(target * sr)
    if len(audio) > need:
        hop = int(sr * 0.5)
        best_i, best_e = 0, -1.0
        for i in range(0, len(audio) - need + 1, hop):
            seg = audio[i : i + need]
            e = float(np.mean(seg * seg))
            if e > best_e:
                best_e, best_i = e, i
        audio = audio[best_i : best_i + need]

    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=40)
    feat = np.mean(mfcc.T, axis=0).astype(np.float32)  # (40,)
    feat = np.expand_dims(feat, -1)  # (40,1)
    return feat


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    # Expect a WAV file (we transcode to WAV client-side to minimize server deps)
    content = await file.read()
    try:
        audio, sr = _ensure_mono_16k(content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid WAV: {e}")

    # Save uploaded wav to disk (website log)
    ts = datetime.utcnow().strftime("%Y%m%dT%H%M%S%fZ")
    safe_name = f"rec_{ts}.wav"
    save_path = UPLOAD_DIR / safe_name
    try:
        with save_path.open("wb") as f:
            f.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")

    # Pre-process: select best 4s window by energy and normalize
    def _best_window(sig: np.ndarray, fs: int, win_s: float = 4.0, hop_s: float = 0.5) -> np.ndarray:
        if sig.size == 0:
            return sig
        win = max(1, int(win_s * fs))
        hop = max(1, int(hop_s * fs))
        if sig.size <= win:
            seg = sig
        else:
            best_e = -1.0
            best_i = 0
            for i in range(0, sig.size - win + 1, hop):
                e = float(np.mean(sig[i : i + win] ** 2))
                if e > best_e:
                    best_e = e
                    best_i = i
            seg = sig[best_i : best_i + win]
        # normalize to target RMS
        rms = float(np.sqrt(np.mean(seg**2))) if seg.size else 0.0
        target = 0.12  # ~ -18 dBFS
        if rms > 1e-6:
            seg = seg * (target / rms)
            seg = np.clip(seg, -1.0, 1.0)
        return seg.astype(np.float32)

    audio_proc = _best_window(audio, sr)

    # Run emotion classification
    try:
        preds_sorted = []
        if load_sklearn_ser_if_available():
            feat = _mfcc_mean_40(audio_proc, sr).reshape(1, -1)  # (1,40)
            # Some pipelines may expect flattened feature
            try:
                probs = _sk_model.predict_proba(feat)[0].tolist()  # type: ignore
            except Exception:
                # Fall back to decision_function -> softmax-like
                scores = _sk_model.decision_function(feat)  # type: ignore
                # convert to positive probs
                exp = np.exp(scores - np.max(scores))
                probs = (exp / np.sum(exp)).tolist()
            labels = list(_sk_labels)  # type: ignore
            preds_sorted = sorted(
                [{"label": lbl, "score": float(p)} for lbl, p in zip(labels, probs)],
                key=lambda z: z["score"],
                reverse=True,
            )
        elif load_local_ser_if_available():
            feat = _mfcc_mean_40(audio_proc, sr)
            x = np.expand_dims(feat, 0)  # (1,40,1)
            probs = _ser_model.predict(x, verbose=0)[0].tolist()  # type: ignore
            labels = list(_ser_labels)  # type: ignore
            preds_sorted = sorted(
                [{"label": lbl, "score": float(p)} for lbl, p in zip(labels, probs)],
                key=lambda z: z["score"],
                reverse=True,
            )
        else:
            clf = get_pipeline()
            preds = clf(
                {"array": audio_proc, "sampling_rate": sr},
                top_k=None,
                chunk_length_s=4.0,
                stride_length_s=1.0,
                aggregation_strategy="mean",
            )
            preds_sorted = sorted(preds, key=lambda x: x.get("score", 0.0), reverse=True)
    except Exception as e:
        # Clean up on failure
        try:
            os.remove(save_path)
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=f"Model inference failed: {e}")

    # Normalize output: list of {label, score} sorted desc
    top = preds_sorted[0] if preds_sorted else {"label": "unknown", "score": 0.0}

    # Log entry
    entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "file": str(save_path.relative_to(ROOT)),
        "model": (
            "sklearn-ser" if _sk_model is not None else
            ("local-ser" if _ser_model is not None else MODEL_ID)
        ),
        "top": top,
        "predictions": preds_sorted,
    }
    _save_log(entry)

    return JSONResponse(
        {
            "file": entry["file"],
            "model": MODEL_ID,
            "predictions": preds_sorted,
            "top": top,
        }
    )


@app.get("/health")
async def health():
    return {"status": "ok"}

# Compatibility path with Vite proxy expecting /api/analyze
@app.post("/api/analyze")
async def analyze_api(file: UploadFile = File(...)):
    return await analyze(file)
