"""
Train a lightweight Speech Emotion Recognition model (MFCC mean -> LSTM) on
public Kaggle datasets and save for the FastAPI server to use.

This script downloads datasets via kagglehub, builds a small dataset of
mean MFCC vectors (length 40), trains an LSTM-based classifier, and writes:
  - models/ser_lstm.keras
  - models/ser_labels.json

Run:
  cd server
  python train_ser.py --epochs 30 --limit 4000

First run may take time to download datasets. You can rerun to fine‑tune.
"""
from __future__ import annotations

import argparse
import json
import os
import re
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
    # Normalize common abbreviations
    if "ps" in s or "surpr" in s:
        return "surprise"
    for lab in LABELS:
        if lab in s:
            return lab
    # TESS filenames like OAF_back_sad.wav include label at end sometimes
    m = re.search(r"_([a-z]{2,})\.wav$", s)
    if m:
        cand = m.group(1)
        if cand in LABELS:
            return cand
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
    import librosa  # type: ignore

    y, sr = librosa.load(path, sr=16000, mono=True)
    # focus on center 3s if long
    dur = 3.0
    need = int(dur * sr)
    if len(y) > need:
        start = (len(y) - need) // 2
        y = y[start : start + need]
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
    vec = np.mean(mfcc.T, axis=0).astype(np.float32)
    return vec


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--epochs", type=int, default=30)
    ap.add_argument("--batch", type=int, default=64)
    ap.add_argument("--limit", type=int, default=4000, help="max files to use (speed)")
    args = ap.parse_args()

    print("Downloading datasets via kagglehub…")
    roots = _download_sources()
    print("Scanning audio files…")
    items = _collect_wavs(roots, limit=args.limit)
    if not items:
        raise SystemExit("No labeled audio found. Ensure Kaggle datasets downloaded.")

    print(f"Using {len(items)} files")
    X = []
    y = []
    for path, lab in items:
        try:
            X.append(_mfcc_mean40(path))
            y.append(LABELS.index(lab))
        except Exception:
            continue
    X = np.array(X, dtype=np.float32)
    y = np.array(y, dtype=np.int64)
    if X.size == 0:
        raise SystemExit("No features extracted.")

    # reshape to (time, feat) = (40,1) like the sample notebook
    X = np.expand_dims(X, -1)

    # one-hot
    from tensorflow.keras.utils import to_categorical  # type: ignore

    Y = to_categorical(y, num_classes=len(LABELS))

    # model
    from tensorflow import keras  # type: ignore
    from tensorflow.keras import layers  # type: ignore

    model = keras.Sequential(
        [
            layers.LSTM(256, return_sequences=False, input_shape=(40, 1)),
            layers.Dropout(0.2),
            layers.Dense(128, activation="relu"),
            layers.Dropout(0.2),
            layers.Dense(64, activation="relu"),
            layers.Dropout(0.2),
            layers.Dense(len(LABELS), activation="softmax"),
        ]
    )
    model.compile(loss="categorical_crossentropy", optimizer="adam", metrics=["accuracy"])
    model.summary()

    ckpt_dir = Path(__file__).resolve().parent / "models"
    ckpt_dir.mkdir(parents=True, exist_ok=True)
    model_path = ckpt_dir / "ser_lstm.keras"
    labels_path = ckpt_dir / "ser_labels.json"

    cb = [
        keras.callbacks.EarlyStopping(monitor="val_accuracy", patience=5, restore_best_weights=True),
    ]
    model.fit(X, Y, validation_split=0.2, epochs=args.epochs, batch_size=args.batch, callbacks=cb, verbose=2)

    model.save(model_path)
    with labels_path.open("w", encoding="utf-8") as f:
        json.dump(LABELS, f)

    print(f"Saved: {model_path}")
    print(f"Saved: {labels_path}")


if __name__ == "__main__":
    main()

