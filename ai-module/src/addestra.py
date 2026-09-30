"""Addestramento del classificatore di materiali (transfer learning) ed esportazione ONNX.

Rete: MobileNetV3-Large pre-addestrata su ImageNet (torchvision), ultimo strato
sostituito con 9 uscite (le classi di materiale). Due fasi:
  1) solo il nuovo classificatore (rete congelata)       -> apprende in fretta
  2) sblocco degli ultimi blocchi con learning rate basso -> affina le feature
Metriche sul test set: accuratezza, F1 macro, report per classe, matrice di confusione.
Il modello viene esportato in ONNX: il servizio di inferenza usa onnxruntime e non
richiede PyTorch.

Uso (Colab con GPU consigliato):  python src/addestra.py --dati data/processed --uscita models
"""
import argparse
import json
import time
from pathlib import Path

import numpy as np
import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets, models, transforms

from classi import CLASSI, DEVIAZIONE, LATO, MEDIA


def trasformazioni():
    addestramento = transforms.Compose([
        transforms.RandomResizedCrop(LATO, scale=(0.6, 1.0)),
        transforms.RandomHorizontalFlip(),
        transforms.ColorJitter(brightness=0.15, contrast=0.15),  # lieve: il colore è informativo
        transforms.ToTensor(),
        transforms.Normalize(MEDIA, DEVIAZIONE),
    ])
    valutazione = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(LATO),
        transforms.ToTensor(),
        transforms.Normalize(MEDIA, DEVIAZIONE),
    ])
    return addestramento, valutazione


def carica_dati(cartella: Path, lotto: int):
    t_train, t_eval = trasformazioni()
    insiemi = {
        "train": datasets.ImageFolder(cartella / "train", t_train),
        "val": datasets.ImageFolder(cartella / "val", t_eval),
        "test": datasets.ImageFolder(cartella / "test", t_eval),
    }
    for nome, ds in insiemi.items():
        assert ds.classes == sorted(CLASSI), f"classi inattese in {nome}: {ds.classes}"
    caricatori = {n: DataLoader(ds, batch_size=lotto, shuffle=(n == "train"), num_workers=2) for n, ds in insiemi.items()}
    return insiemi, caricatori


def crea_modello(n_classi: int) -> nn.Module:
    modello = models.mobilenet_v3_large(weights=models.MobileNet_V3_Large_Weights.IMAGENET1K_V2)
    for p in modello.parameters():
        p.requires_grad = False
    ingresso = modello.classifier[-1].in_features
    modello.classifier[-1] = nn.Linear(ingresso, n_classi)
    return modello


def sblocca_ultimi_blocchi(modello: nn.Module, n: int = 4):
    for blocco in list(modello.features.children())[-n:]:
        for p in blocco.parameters():
            p.requires_grad = True


def pesi_classi(ds) -> torch.Tensor:
    conteggi = np.bincount(ds.targets, minlength=len(ds.classes)).astype(np.float32)
    pesi = conteggi.sum() / (len(conteggi) * np.maximum(conteggi, 1))
    return torch.tensor(pesi, dtype=torch.float32)


def epoca(modello, caricatore, criterio, ottimizzatore, dispositivo):
    addestra = ottimizzatore is not None
    modello.train(addestra)
    totale, corretti, perdita = 0, 0, 0.0
    with torch.set_grad_enabled(addestra):
        for x, y in caricatore:
            x, y = x.to(dispositivo), y.to(dispositivo)
            uscita = modello(x)
            loss = criterio(uscita, y)
            if addestra:
                ottimizzatore.zero_grad()
                loss.backward()
                ottimizzatore.step()
            perdita += loss.item() * len(y)
            corretti += (uscita.argmax(1) == y).sum().item()
            totale += len(y)
    return perdita / totale, corretti / totale


def valuta(modello, caricatore, dispositivo, n_classi):
    modello.eval()
    matrice = np.zeros((n_classi, n_classi), dtype=int)
    with torch.no_grad():
        for x, y in caricatore:
            previsti = modello(x.to(dispositivo)).argmax(1).cpu().numpy()
            for vero, prev in zip(y.numpy(), previsti):
                matrice[vero, prev] += 1
    precisione = np.diag(matrice) / np.maximum(matrice.sum(0), 1)
    richiamo = np.diag(matrice) / np.maximum(matrice.sum(1), 1)
    f1 = 2 * precisione * richiamo / np.maximum(precisione + richiamo, 1e-9)
    return {
        "accuratezza": float(np.trace(matrice) / matrice.sum()),
        "f1_macro": float(f1.mean()),
        "per_classe": {
            c: {"precisione": float(p), "richiamo": float(r), "f1": float(f), "campioni": int(n)}
            for c, p, r, f, n in zip(sorted(CLASSI), precisione, richiamo, f1, matrice.sum(1))
        },
        "matrice_confusione": matrice.tolist(),
    }


def salva_matrice_png(matrice, classi, percorso: Path):
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    m = np.array(matrice)
    fig, ax = plt.subplots(figsize=(7, 6))
    ax.imshow(m, cmap="Greens")
    ax.set_xticks(range(len(classi)), classi, rotation=45, ha="right")
    ax.set_yticks(range(len(classi)), classi)
    ax.set_xlabel("Classe prevista")
    ax.set_ylabel("Classe reale")
    for i in range(len(classi)):
        for j in range(len(classi)):
            ax.text(j, i, m[i, j], ha="center", va="center", fontsize=8, color="black" if m[i, j] < m.max() / 2 else "white")
    ax.set_title("Matrice di confusione (test set)")
    fig.tight_layout()
    fig.savefig(percorso, dpi=160)


def esporta_onnx(modello, percorso: Path, dispositivo):
    modello.eval().to("cpu")
    esempio = torch.randn(1, 3, LATO, LATO)
    torch.onnx.export(
        modello, esempio, str(percorso), input_names=["immagine"], output_names=["punteggi"],
        dynamic_axes={"immagine": {0: "lotto"}, "punteggi": {0: "lotto"}}, opset_version=17,
    )
    modello.to(dispositivo)
    try:  # controllo: onnxruntime deve dare lo stesso risultato di PyTorch
        import onnxruntime as ort

        sessione = ort.InferenceSession(str(percorso), providers=["CPUExecutionProvider"])
        atteso = modello.to("cpu")(esempio).detach().numpy()
        ottenuto = sessione.run(None, {"immagine": esempio.numpy()})[0]
        print(f"Verifica ONNX: differenza massima {np.abs(atteso - ottenuto).max():.2e}")
        modello.to(dispositivo)
    except ImportError:
        print("onnxruntime non installato: verifica ONNX saltata")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dati", default="data/processed")
    ap.add_argument("--uscita", default="models")
    ap.add_argument("--epoche-testa", type=int, default=3)
    ap.add_argument("--epoche-affinamento", type=int, default=5)
    ap.add_argument("--lotto", type=int, default=64)
    a = ap.parse_args()

    torch.manual_seed(42)
    dispositivo = "cuda" if torch.cuda.is_available() else ("mps" if torch.backends.mps.is_available() else "cpu")
    print(f"Dispositivo: {dispositivo}")
    uscita = Path(a.uscita)
    uscita.mkdir(parents=True, exist_ok=True)

    insiemi, caricatori = carica_dati(Path(a.dati), a.lotto)
    classi = insiemi["train"].classes
    modello = crea_modello(len(classi)).to(dispositivo)
    criterio = nn.CrossEntropyLoss(weight=pesi_classi(insiemi["train"]).to(dispositivo))

    storia, migliore, inizio = [], 0.0, time.time()
    fasi = [("testa", a.epoche_testa, 1e-3), ("affinamento", a.epoche_affinamento, 1e-4)]
    for fase, n_epoche, lr in fasi:
        if fase == "affinamento":
            sblocca_ultimi_blocchi(modello)
        ottimizzatore = torch.optim.AdamW((p for p in modello.parameters() if p.requires_grad), lr=lr, weight_decay=1e-4)
        for e in range(n_epoche):
            l_tr, a_tr = epoca(modello, caricatori["train"], criterio, ottimizzatore, dispositivo)
            l_va, a_va = epoca(modello, caricatori["val"], criterio, None, dispositivo)
            storia.append({"fase": fase, "epoca": e + 1, "loss_train": l_tr, "acc_train": a_tr, "loss_val": l_va, "acc_val": a_va})
            print(f"[{fase}] epoca {e + 1}/{n_epoche}  acc train {a_tr:.3f}  acc val {a_va:.3f}")
            if a_va > migliore:
                migliore = a_va
                torch.save(modello.state_dict(), uscita / "migliore.pt")

    modello.load_state_dict(torch.load(uscita / "migliore.pt", map_location=dispositivo))
    metriche = valuta(modello, caricatori["test"], dispositivo, len(classi))
    metriche.update({"classi": classi, "storia": storia, "durata_s": round(time.time() - inizio), "rete": "mobilenet_v3_large (ImageNet)", "immagini": {k: len(v) for k, v in insiemi.items()}})
    (uscita / "metriche.json").write_text(json.dumps(metriche, indent=2, ensure_ascii=False))
    (uscita / "classi.json").write_text(json.dumps(classi, ensure_ascii=False))
    salva_matrice_png(metriche["matrice_confusione"], classi, uscita / "matrice_confusione.png")
    esporta_onnx(modello, uscita / "materiali.onnx", dispositivo)
    print(f"\nTest set: accuratezza {metriche['accuratezza']:.3f}, F1 macro {metriche['f1_macro']:.3f}")
    print(f"File salvati in {uscita.resolve()}: materiali.onnx, classi.json, metriche.json, matrice_confusione.png")


if __name__ == "__main__":
    main()
