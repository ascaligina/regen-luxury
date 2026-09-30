"""Test del servizio di inferenza con un modello ONNX fittizio (stesse dimensioni del modello reale).
Uso: python -m pytest test/  (oppure: python test/test_servizio.py)"""
import io
import json
import os
import sys
import tempfile
from pathlib import Path

import numpy as np
import onnx
from onnx import TensorProto, helper
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))
from classi import CLASSI  # noqa: E402


def crea_modello_fittizio(cartella: Path):
    """immagine [N,3,224,224] -> media per canale [N,3] -> x W [3,9] -> punteggi [N,9]"""
    pesi = np.zeros((3, len(CLASSI)), dtype=np.float32)
    pesi[0, CLASSI.index("pelle")] = 5.0  # immagini "rosse" -> pelle
    pesi[2, CLASSI.index("cotone")] = 5.0  # immagini "blu" -> cotone
    grafo = helper.make_graph(
        [
            helper.make_node("ReduceMean", ["immagine", "assi"], ["media"], keepdims=0),
            helper.make_node("MatMul", ["media", "W"], ["punteggi"]),
        ],
        "fittizio",
        [helper.make_tensor_value_info("immagine", TensorProto.FLOAT, ["lotto", 3, 224, 224])],
        [helper.make_tensor_value_info("punteggi", TensorProto.FLOAT, ["lotto", len(CLASSI)])],
        [helper.make_tensor("W", TensorProto.FLOAT, pesi.shape, pesi.flatten()), helper.make_tensor("assi", TensorProto.INT64, [2], [2, 3])],
    )
    modello = helper.make_model(grafo, opset_imports=[helper.make_opsetid("", 18)])
    modello.ir_version = 9
    onnx.checker.check_model(modello)
    onnx.save(modello, cartella / "materiali.onnx")
    (cartella / "classi.json").write_text(json.dumps(CLASSI))


def immagine(colore, formato="JPEG", dimensioni=(640, 480)):
    buffer = io.BytesIO()
    Image.new("RGB", dimensioni, colore).save(buffer, formato)
    return buffer.getvalue()


def test_servizio():
    with tempfile.TemporaryDirectory() as cartella:
        os.environ["AI_MODELLI"] = cartella
        import importlib

        import servizio

        importlib.reload(servizio)
        from fastapi.testclient import TestClient

        client = TestClient(servizio.app)

        # senza modello -> 503
        assert client.get("/health").json()["modelloCaricato"] is False
        r = client.post("/classify", files={"immagine": ("a.jpg", immagine((200, 30, 30)), "image/jpeg")})
        assert r.status_code == 503

        crea_modello_fittizio(Path(cartella))
        h = client.get("/health").json()
        assert h["modelloCaricato"] is True and h["classi"] == CLASSI

        rosso = client.post("/classify", files={"immagine": ("rosso.jpg", immagine((230, 20, 20)), "image/jpeg")}).json()
        assert rosso["materiale"] == "pelle", rosso
        assert 0 < rosso["confidenza"] <= 1 and len(rosso["alternative"]) == 2

        blu = client.post("/classify", files={"immagine": ("blu.png", immagine((20, 20, 230), "PNG", (300, 900)), "image/png")}).json()
        assert blu["materiale"] == "cotone", blu

        assert client.post("/classify", files={"immagine": ("x.txt", b"testo", "text/plain")}).status_code == 415
        assert client.post("/classify", files={"immagine": ("x.jpg", b"non un'immagine", "image/jpeg")}).status_code == 400
        grande = b"0" * (8 * 1024 * 1024 + 10)
        assert client.post("/classify", files={"immagine": ("x.jpg", grande, "image/jpeg")}).status_code == 413
        print("servizio: tutti i controlli superati", rosso["materiale"], rosso["confidenza"], blu["materiale"], blu["confidenza"])


def test_prepara_dataset():
    from prepara_dataset import prepara

    with tempfile.TemporaryDirectory() as t:
        sorgente = Path(t) / "fibre"
        for etichetta, n in {"cotton": 20, "wool": 7, "alpaca": 3, "leather": 10, "jute": 5}.items():
            (sorgente / etichetta).mkdir(parents=True)
            for i in range(n):
                Image.new("RGB", (32, 32), (i * 10 % 255, 0, 0)).save(sorgente / etichetta / f"{i}.jpg")
        riepilogo = prepara(sorgente, Path(t) / "processed", max_per_classe=15)
        totale = {c: sum(riepilogo[p].get(c, 0) for p in riepilogo) for c in ["cotone", "lana", "pelle"]}
        assert totale == {"cotone": 15, "lana": 10, "pelle": 10}, totale  # juta esclusa, alpaca -> lana, max 15
        assert riepilogo["train"]["cotone"] == 10 and riepilogo["test"]["cotone"] == 3
        assert not (Path(t) / "processed" / "train" / "jute").exists()
        print("prepara_dataset: tutti i controlli superati", riepilogo)


if __name__ == "__main__":
    test_prepara_dataset()
    test_servizio()
