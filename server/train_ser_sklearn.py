"""
Lightweight SER trainer using sklearn on MFCC mean features (40 dims).
Produces:
  - models/ser_sklearn.joblib
  - models/ser_labels.json

Usage:
  cd server
  python train_ser_sklearn.py --limit 4000
"""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from typing import List, Tuple

import numpy as np


def _download_sources() -> List[Path]:
    import kagglehub  # type: ignore

    roots = []
    for ds in [
        "ejlok1/toronto-emotional-speech-set-tess",
        "dmitrybabko/speech-emotion-recognition-en",
    ]:
        p = kagglehub.dataset_download(ds)
        roots.append(Path(p))
    return roots


LABELS = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"]


def _infer_label_from_path(p: str) -> str | None:
    s = p.lower()
    if "ps" in s or "surpr" in s:
        return "surprise"
    for lab in LABELS:
        if lab in s:
            return lab
    return None


def _collect_wavs(roots: List[Path], limit: int | None = None) -> List[Tuple[str, str]]:
    pairs: List[Tuple[str, str]] = []
    for r in roots:
        for root, _, files in os.walk(r):
            for f in files:
                if not f.lower().endswith((".wav", ".flac", ".mp3", ".m4a")):
                    continue
                path = os.path.join(root, f)
                lab = _infer_label_from_path(path)
                if lab is None:
                    continue
                pairs.append((path, lab))
                if limit and len(pairs) >= limit:
                    return pairs
    return pairs


def _mfcc_mean40(path: str) -> np.ndarray:
    """Load audio -> mono 16k -> center 3s -> MFCC(40) mean, no librosa.

    Uses soundfile + scipy.resample_poly + python_speech_features.
    """
    import soundfile as sf  # type: ignore
    from scipy.signal import resample_poly  # type: ignore
    from python_speech_features import mfcc as ps_mfcc  # type: ignore

    y, sr = sf.read(path, dtype="float32", always_2d=False)
    if y.ndim > 1:
        y = y.mean(axis=1)
    target_sr = 16000
    if sr != target_sr and sr > 0:
        from math import gcd

        g = gcd(int(sr), int(target_sr))
        up = target_sr // g
        down = sr // g
        y = resample_poly(y, up, down).astype(np.float32)
        sr = target_sr

    need = int(3.0 * sr)
    if len(y) > need:
        start = (len(y) - need) // 2
        y = y[start : start + need]

    # python_speech_features expects 1D float array
    mf = ps_mfcc(signal=y, samplerate=sr, numcep=40, nfft=2048)
    vec = np.mean(mf, axis=0).astype(np.float32)
    return vec


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=4000)
    args = ap.parse_args()

    roots = _download_sources()
    items = _collect_wavs(roots, limit=args.limit)
    if not items:
        raise SystemExit("No audio found")

    X = []
    y = []
    for p, lab in items:
        try:
            X.append(_mfcc_mean40(p))
            y.append(LABELS.index(lab))
        except Exception:
            continue
    X = np.array(X)
    y = np.array(y)

    from sklearn.pipeline import Pipeline
    from sklearn.preprocessing import StandardScaler
    from sklearn.linear_model import LogisticRegression
    from sklearn.metrics import accuracy_score
    from sklearn.model_selection import train_test_split
    import joblib  # type: ignore

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
    clf = Pipeline([
        ("scaler", StandardScaler()),
        ("logreg", LogisticRegression(max_iter=2000, class_weight="balanced", multi_class="auto")),
    ])
    clf.fit(X_train, y_train)
    preds = clf.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"Validation accuracy: {acc:.3f}")

    out_dir = Path(__file__).resolve().parent / "models"
    out_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(clf, out_dir / "ser_sklearn.joblib")
    (out_dir / "ser_labels.json").write_text(json.dumps(LABELS), encoding="utf-8")
    print("Saved models/ser_sklearn.joblib and models/ser_labels.json")


if __name__ == "__main__":
    main()
