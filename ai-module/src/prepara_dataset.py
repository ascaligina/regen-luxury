"""Prepara il dataset per l'addestramento a partire da TextileNet-fibre.

Legge data/raw/fibre/<etichetta_textilenet>/*.jpg, raggruppa le fibre nelle 9
classi della piattaforma e crea data/processed/{train,val,test}/<classe>/
(70% / 15% / 15%, divisione stratificata e riproducibile).

Uso:  python src/prepara_dataset.py --sorgente data/raw/fibre --destinazione data/processed --max-per-classe 1500
"""
import argparse
import json
import random
import shutil
from collections import Counter
from pathlib import Path

from classi import CLASSI, MAPPA_TEXTILENET

ESTENSIONI = {".jpg", ".jpeg", ".png", ".webp"}


def raccogli(sorgente: Path) -> dict[str, list[Path]]:
    per_classe: dict[str, list[Path]] = {c: [] for c in CLASSI}
    for cartella in sorted(p for p in sorgente.iterdir() if p.is_dir()):
        classe = MAPPA_TEXTILENET.get(cartella.name)
        if classe is None:
            continue
        per_classe[classe].extend(sorted(f for f in cartella.rglob("*") if f.suffix.lower() in ESTENSIONI))
    return per_classe


def dividi(file: list[Path], seme: int, quote=(0.7, 0.15)) -> dict[str, list[Path]]:
    file = file[:]
    random.Random(seme).shuffle(file)
    n = len(file)
    n_train, n_val = int(n * quote[0]), int(n * quote[1])
    return {"train": file[:n_train], "val": file[n_train : n_train + n_val], "test": file[n_train + n_val :]}


def prepara(sorgente: Path, destinazione: Path, max_per_classe: int, seme: int = 42) -> dict:
    per_classe = raccogli(sorgente)
    if destinazione.exists():
        shutil.rmtree(destinazione)
    conteggi = {"train": Counter(), "val": Counter(), "test": Counter()}
    for classe, file in per_classe.items():
        random.Random(seme).shuffle(file)
        for parte, elenco in dividi(file[:max_per_classe], seme).items():
            conteggi[parte][classe] = len(elenco)
            if not elenco:
                continue
            cartella = destinazione / parte / classe
            cartella.mkdir(parents=True, exist_ok=True)
            for i, f in enumerate(elenco):
                shutil.copy2(f, cartella / f"{classe}_{i:05d}{f.suffix.lower()}")
    riepilogo = {parte: dict(c) for parte, c in conteggi.items()}
    (destinazione / "riepilogo.json").write_text(json.dumps(riepilogo, indent=2, ensure_ascii=False))
    return riepilogo


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--sorgente", default="data/raw/fibre")
    ap.add_argument("--destinazione", default="data/processed")
    ap.add_argument("--max-per-classe", type=int, default=1500)
    ap.add_argument("--seme", type=int, default=42)
    a = ap.parse_args()
    r = prepara(Path(a.sorgente), Path(a.destinazione), a.max_per_classe, a.seme)
    for parte, c in r.items():
        print(f"{parte:6s} {sum(c.values()):6d} immagini  {c}")
