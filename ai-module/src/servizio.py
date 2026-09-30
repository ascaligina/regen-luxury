"""Servizio di classificazione del materiale (FastAPI + onnxruntime).

Endpoint:
  GET  /health    stato del servizio e del modello
  POST /classify  immagine (multipart, campo "immagine") -> materiale suggerito

Il modello (models/materiali.onnx + models/classi.json) si ottiene con il notebook
di addestramento. Il servizio NON richiede PyTorch: bastano onnxruntime, numpy e Pillow.

Avvio:  uvicorn servizio:app --app-dir src --port 8000
"""
import io
import json
import os
from pathlib import Path

import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from classi import DEVIAZIONE, LATO, MEDIA

CARTELLA_MODELLI = Path(os.environ.get("AI_MODELLI", Path(__file__).resolve().parent.parent / "models"))
DIMENSIONE_MASSIMA = 8 * 1024 * 1024  # 8 MB
SOGLIA_AFFIDABILITA = 0.5

app = FastAPI(title="Regen Luxury - classificazione materiali", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("AI_CORS_ORIGIN", "*").split(","),
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

_modello = {"sessione": None, "classi": None}


def carica_modello():
    """Carica il modello ONNX se presente (altrimenti il servizio risponde 503)."""
    percorso = CARTELLA_MODELLI / "materiali.onnx"
    file_classi = CARTELLA_MODELLI / "classi.json"
    # servono entrambi i file: se ne manca uno il modello resta "non caricato" (503), mai a metà
    if _modello["sessione"] is None and percorso.exists() and file_classi.exists():
        import onnxruntime as ort

        classi = json.loads(file_classi.read_text())
        sessione = ort.InferenceSession(str(percorso), providers=["CPUExecutionProvider"])
        _modello["classi"] = classi
        _modello["sessione"] = sessione
    return _modello["sessione"]


def preprocessa(immagine: Image.Image) -> np.ndarray:
    """Stessa trasformazione della valutazione: lato corto 256, ritaglio centrale 224, normalizzazione ImageNet."""
    immagine = immagine.convert("RGB")
    w, h = immagine.size
    scala = 256 / min(w, h)
    immagine = immagine.resize((max(LATO, round(w * scala)), max(LATO, round(h * scala))), Image.BILINEAR)
    w, h = immagine.size
    sinistra, alto = (w - LATO) // 2, (h - LATO) // 2
    immagine = immagine.crop((sinistra, alto, sinistra + LATO, alto + LATO))
    x = np.asarray(immagine, dtype=np.float32) / 255.0
    x = (x - np.array(MEDIA, dtype=np.float32)) / np.array(DEVIAZIONE, dtype=np.float32)
    return x.transpose(2, 0, 1)[np.newaxis, ...]  # NCHW


def softmax(z: np.ndarray) -> np.ndarray:
    z = z - z.max()
    e = np.exp(z)
    return e / e.sum()


@app.get("/health")
def health():
    sessione = carica_modello()
    return {"stato": "online", "modelloCaricato": sessione is not None, "classi": _modello["classi"]}


@app.post("/classify")
async def classifica(immagine: UploadFile = File(...)):
    sessione = carica_modello()
    if sessione is None:
        raise HTTPException(503, "Modello non ancora addestrato: esegui il notebook e copia materiali.onnx e classi.json in models/")
    if immagine.content_type and not immagine.content_type.startswith("image/"):
        raise HTTPException(415, "Il file deve essere un'immagine")
    contenuto = await immagine.read(DIMENSIONE_MASSIMA + 1)
    if len(contenuto) > DIMENSIONE_MASSIMA:
        raise HTTPException(413, "Immagine troppo grande (massimo 8 MB)")
    try:
        img = Image.open(io.BytesIO(contenuto))
        img.load()
    except (UnidentifiedImageError, OSError):
        raise HTTPException(400, "Immagine non leggibile")

    punteggi = sessione.run(None, {sessione.get_inputs()[0].name: preprocessa(img)})[0][0]
    probabilita = softmax(punteggi)
    ordine = np.argsort(probabilita)[::-1]
    classi = _modello["classi"]
    migliore = int(ordine[0])
    risposta = {
        "materiale": classi[migliore],
        "confidenza": round(float(probabilita[migliore]), 4),
        "alternative": [{"materiale": classi[int(i)], "confidenza": round(float(probabilita[int(i)]), 4)} for i in ordine[1:3]],
        "nota": "Suggerimento automatico: va sempre confermato con l'etichetta di composizione del capo.",
    }
    if risposta["confidenza"] < SOGLIA_AFFIDABILITA:
        risposta["avviso"] = "Affidabilità bassa: il modello non è sicuro, verifica manualmente."
    return risposta
