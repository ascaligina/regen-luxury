# Modulo AI — classificazione del materiale e stima dell'impatto (Capitolo 4.3)

Da una foto del capo il modulo **suggerisce il materiale principale** (cotone, lana, cashmere, seta, lino,
pelle, poliestere, nylon, viscosa). Il suggerimento compare nel modulo "Nuovo capo" della web app e va
sempre confermato con l'etichetta di composizione. L'**impatto ambientale** evitato non è calcolato dalla
rete neurale: lo calcola il backend a partire dalla categoria del capo e da coefficienti LCA con fonte
(`backend/data/coefficienti-lca.json`, vedi `docs/lca/coefficienti.md`).

## Scelta del dataset (punto 21)

| | DeepFashion (citato nel Cap. 2) | **TextileNet-fibre (scelto)** |
|---|---|---|
| Contenuto | 800.000 immagini, 1.000 attributi in 5 gruppi (texture, **fabric**, shape, part, style) | 442.035 immagini etichettate per **fibra** (33 classi) |
| Licenza | Solo ricerca non commerciale | CC BY (codice MIT) |
| Accesso | Accordo firmato inviato da email istituzionale, password per gli archivi | Download diretto (Google Drive / OneDrive) |
| Adatto al compito | Parziale: gli attributi "fabric" descrivono tessuti (es. tweed, pelle), non la composizione | Sì: le etichette sono le fibre, raggruppabili nelle 9 classi della piattaforma |

Fonti: Liu Z. et al. (2016), *DeepFashion*, CVPR, pp. 1096–1104; Zhong S., Ribul M., Cho Y., Obrist M. (2023),
*TextileNet: A Material Taxonomy-based Fashion Textile Dataset*, arXiv:2301.06160.
**Da decidere con il relatore:** il Cap. 2 cita DeepFashion; si può mantenere come riferimento e dichiarare
TextileNet come dataset di addestramento (motivazione: licenza, accesso, etichette per fibra).

Corrispondenza fibre → classi (`src/classi.py`): wool, alpaca, camel, llama, mohair, yak, angora → lana;
leather, suede → pelle; viscose_rayon, modal, lyocell, cupro → viscosa; le altre fibre sono escluse.

## Addestramento (punto 22) — Google Colab, gratuito

1. Apri `notebooks/addestramento_colab.ipynb` su https://colab.research.google.com (File → Carica notebook).
2. Runtime → Cambia tipo di runtime → **GPU**.
3. Esegui le celle in ordine: scarica TextileNet, prepara 1.500 immagini per classe (70/15/15),
   addestra MobileNetV3-Large (transfer learning in due fasi), calcola accuratezza, F1 macro e matrice
   di confusione, esporta il modello in **ONNX**.
4. Scarica `materiali.onnx`, `classi.json`, `metriche.json`, `matrice_confusione.png` e copiali in `models/`.

Prima di iniziare controlla la dimensione dell'archivio TextileNet su Google Drive: se è molto grande,
riduci `--max-per-classe`. Le metriche e la matrice di confusione vanno nel Capitolo 5.

## Servizio di inferenza (punto 24)

Il servizio usa **onnxruntime**: sul Mac non serve installare PyTorch.

```bash
cd ai-module
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn servizio:app --app-dir src --port 8000
```

- `GET  http://localhost:8000/health` → stato e classi del modello
- `POST http://localhost:8000/classify` (campo multipart `immagine`) →
  `{ "materiale": "pelle", "confidenza": 0.87, "alternative": [...], "nota": "..." }`

Per attivarlo nella web app: nel file `frontend/.env` imposta `VITE_AI_URL=http://localhost:8000`
e riavvia `npm run dev`. Nel modulo "Nuovo capo" compare "Suggerisci il materiale da una foto".

## Test

```bash
pip install onnx pytest httpx
python -m pytest test/     # servizio con un modello ONNX fittizio + preparazione del dataset
```

## Struttura

| Cartella | Contenuto |
|---|---|
| `src/classi.py` | classi, corrispondenza TextileNet, normalizzazione |
| `src/prepara_dataset.py` | divisione train/val/test stratificata e riproducibile |
| `src/addestra.py` | transfer learning, metriche, esportazione ONNX |
| `src/servizio.py` | API FastAPI `/classify` |
| `notebooks/` | notebook per Colab (stesso codice di `src/`) |
| `models/` | modello addestrato (non versionato) |
| `../docs/lca/` | coefficienti ambientali con fonti (usati dal backend) |
| `data/` | dataset (non versionato) |
