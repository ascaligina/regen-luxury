# Codice completo del progetto

Esportato il 22/09/2026, 18:30:59 da `rl` — 121 file.

## Indice

- `.gitignore`
- `ai-module/notebooks/addestramento_colab.ipynb`
- `ai-module/README.md`
- `ai-module/requirements-addestramento.txt`
- `ai-module/requirements.txt`
- `ai-module/src/addestra.py`
- `ai-module/src/classi.py`
- `ai-module/src/prepara_dataset.py`
- `ai-module/src/servizio.py`
- `ai-module/test/test_servizio.py`
- `backend/.env.example`
- `backend/.gitignore`
- `backend/app.js`
- `backend/config/db.js`
- `backend/config/security.js`
- `backend/controllers/authController.js`
- `backend/controllers/itemController.js`
- `backend/controllers/verifyController.js`
- `backend/data/coefficienti-lca.json`
- `backend/middleware/auth.js`
- `backend/middleware/errorHandler.js`
- `backend/middleware/limiti.js`
- `backend/middleware/valida.js`
- `backend/models/costanti.js`
- `backend/models/Item.js`
- `backend/models/User.js`
- `backend/package.json`
- `backend/routes/auth.js`
- `backend/routes/items.js`
- `backend/routes/verify.js`
- `backend/scripts/_cli.js`
- `backend/scripts/copia-db.js`
- `backend/scripts/crea-admin.js`
- `backend/scripts/imposta-db.js`
- `backend/scripts/migra-ancoraggi.js`
- `backend/scripts/misura-tempi.js`
- `backend/scripts/passaggi.js`
- `backend/scripts/passaggi.ps1`
- `backend/scripts/popola-demo.js`
- `backend/server.js`
- `backend/services/anchorService.js`
- `backend/services/blockchain/index.js`
- `backend/services/blockchain/mockLedger.js`
- `backend/services/blockchain/polygon.js`
- `backend/services/hashService.js`
- `backend/services/impactService.js`
- `backend/services/integrityService.js`
- `backend/services/qrService.js`
- `backend/services/sunService.js`
- `backend/test/auth.test.js`
- `backend/test/hash.test.js`
- `backend/test/helpers.js`
- `backend/test/integrita.test.js`
- `backend/test/items.test.js`
- `backend/test/registro-mongo.test.js`
- `backend/test/sun.test.js`
- `backend/test/verify.test.js`
- `backend/validators/schemi.js`
- `contracts/.env.example`
- `contracts/.gitignore`
- `contracts/compile.cjs`
- `contracts/crea-wallet.mjs`
- `contracts/deploy.mjs`
- `contracts/hardhat.config.cjs`
- `contracts/misura-gas.mjs`
- `contracts/package.json`
- `contracts/RegenLuxuryPassport.sol`
- `docs/costi/gas-e-costi.md`
- `docs/crediti-foto.md`
- `docs/decisioni/4.2-custodia-e-commissioni.md`
- `docs/demo.md`
- `docs/deploy.md`
- `docs/latex/bibliografia-starter.bib`
- `docs/latex/latex-workshop-settings.jsonc`
- `docs/lca/coefficienti.md`
- `docs/nfc/configurazione-tag.md`
- `docs/uml/casi_d_uso.puml`
- `docs/validazione/tabella-furps.md`
- `frontend/.env.example`
- `frontend/.gitignore`
- `frontend/index.html`
- `frontend/package.json`
- `frontend/public/favicon.svg`
- `frontend/src/App.jsx`
- `frontend/src/assets/fonts/OFL-cormorant-garamond.txt`
- `frontend/src/components/Ancoraggio.jsx`
- `frontend/src/components/Carosello.jsx`
- `frontend/src/components/Certificato.jsx`
- `frontend/src/components/Icone.jsx`
- `frontend/src/components/Layout.jsx`
- `frontend/src/components/ModuloCapo.jsx`
- `frontend/src/components/Protetta.jsx`
- `frontend/src/components/Stato.jsx`
- `frontend/src/components/StoricoMenu.jsx`
- `frontend/src/data/foto.js`
- `frontend/src/hooks/useAuth.jsx`
- `frontend/src/main.jsx`
- `frontend/src/pages/AccountPage.jsx`
- `frontend/src/pages/ArmadioPage.jsx`
- `frontend/src/pages/DashboardPage.jsx`
- `frontend/src/pages/HomePage.jsx`
- `frontend/src/pages/ItemDetailPage.jsx`
- `frontend/src/pages/LabelPage.jsx`
- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/pages/NewItemPage.jsx`
- `frontend/src/pages/NotFoundPage.jsx`
- `frontend/src/pages/ScanPage.jsx`
- `frontend/src/pages/SunPage.jsx`
- `frontend/src/pages/UsersPage.jsx`
- `frontend/src/pages/VerifyPage.jsx`
- `frontend/src/services/api.js`
- `frontend/src/styles/app.css`
- `frontend/src/utils/archivio.js`
- `frontend/src/utils/formato.js`
- `frontend/src/utils/nfc.js`
- `frontend/vite.config.js`
- `package.json`
- `README.md`
- `render.yaml`
- `tools/esporta-codice.mjs`
- `tools/pulisci-tex.mjs`

## `.gitignore`

```
# dipendenze e build
node_modules/
dist/
build/
coverage/
# credenziali (mai su Git)
.env
.env.*
!.env.example
# dati generati
backend/data/mock-ledger.json
contracts/cache/
contracts/artifacts/
ai-module/.venv/
ai-module/data/raw/*
ai-module/data/processed/*
!ai-module/data/**/.gitkeep
ai-module/models/*
!ai-module/models/.gitkeep
__pycache__/
.ipynb_checkpoints/
.pytest_cache/
# LaTeX
*.aux
*.log
*.synctex.gz
# sistema
.DS_Store
```

## `ai-module/notebooks/addestramento_colab.ipynb`

```json
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": "# Modulo AI — classificazione del materiale dei capi (Capitolo 4.3)\n\nNotebook per **Google Colab** (gratuito). Esegui le celle in ordine.\n\n1. Menu *Runtime → Cambia tipo di runtime → GPU (T4)*.\n2. Il dataset è **TextileNet-fibre** (Zhong et al., 2023, licenza CC BY): immagini di capi etichettate per fibra.\n3. Il modello è una **MobileNetV3-Large** pre-addestrata su ImageNet, riaddestrata sulle 9 classi di materiale della piattaforma (transfer learning).\n4. Alla fine scarichi `materiali.onnx`, `classi.json`, `metriche.json` e `matrice_confusione.png` da copiare in `ai-module/models/`.\n\nLe metriche finali (accuratezza, F1 macro, matrice di confusione) vanno riportate nel Capitolo 5."
  },
  {
   "cell_type": "code",
   "metadata": {},
   "execution_count": null,
   "outputs": [],
   "source": "!pip -q install gdown onnx onnxruntime\n!nvidia-smi -L || echo 'Nessuna GPU: l\\'addestramento sarà lento'"
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": "## 1. Scarica TextileNet-fibre\nLink ufficiale dal repository https://github.com/hahashu/TextileNet (Google Drive)."
  },
  {
   "cell_type": "code",
   "metadata": {},
   "execution_count": null,
   "outputs": [],
   "source": "!mkdir -p data/raw\n!gdown 1e_E9NeTs7qSuUzWszSkmK09jTHPQwdd6 -O data/raw/textilenet_fibre.zip\n!cd data/raw && unzip -q -o textilenet_fibre.zip\nimport pathlib\ncandidati = [p.parent for p in pathlib.Path('data/raw').rglob('cotton') if p.is_dir()]\nSORGENTE = candidati[0]\nprint('Cartella con le fibre:', SORGENTE)\nprint(sorted(p.name for p in SORGENTE.iterdir() if p.is_dir()))"
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": "## 2. Codice (identico ai file in `ai-module/src/`)"
  },
  {
   "cell_type": "code",
   "metadata": {},
   "execution_count": null,
   "outputs": [],
   "source": "%%writefile classi.py\n\"\"\"Classi di materiale riconosciute dal modello e corrispondenza con le etichette di TextileNet.\n\nTextileNet (Zhong et al., 2023) etichetta le immagini per FIBRA (33 classi).\nLe fibre sono raggruppate nelle 9 classi di materiale usate dalla piattaforma\n(le stesse del campo \"materialePrincipale\" del backend).\n\"\"\"\n\nCLASSI = [\"cotone\", \"lana\", \"cashmere\", \"seta\", \"lino\", \"pelle\", \"poliestere\", \"nylon\", \"viscosa\"]\n\n# etichetta TextileNet-fibre -> classe della piattaforma (le altre fibre sono escluse)\nMAPPA_TEXTILENET = {\n    \"cotton\": \"cotone\",\n    \"wool\": \"lana\",\n    \"alpaca\": \"lana\",\n    \"camel\": \"lana\",\n    \"llama\": \"lana\",\n    \"mohair\": \"lana\",\n    \"yak\": \"lana\",\n    \"angora\": \"lana\",\n    \"cashmere\": \"cashmere\",\n    \"silk\": \"seta\",\n    \"flax_linen\": \"lino\",\n    \"leather\": \"pelle\",\n    \"suede\": \"pelle\",\n    \"polyester\": \"poliestere\",\n    \"nylon\": \"nylon\",\n    \"viscose_rayon\": \"viscosa\",\n    \"modal\": \"viscosa\",\n    \"lyocell\": \"viscosa\",\n    \"cupro\": \"viscosa\",\n}\n\n# Normalizzazione ImageNet: la stessa usata dalla rete pre-addestrata\nMEDIA = [0.485, 0.456, 0.406]\nDEVIAZIONE = [0.229, 0.224, 0.225]\nLATO = 224\n"
  },
  {
   "cell_type": "code",
   "metadata": {},
   "execution_count": null,
   "outputs": [],
   "source": "%%writefile prepara_dataset.py\n\"\"\"Prepara il dataset per l'addestramento a partire da TextileNet-fibre.\n\nLegge data/raw/fibre/<etichetta_textilenet>/*.jpg, raggruppa le fibre nelle 9\nclassi della piattaforma e crea data/processed/{train,val,test}/<classe>/\n(70% / 15% / 15%, divisione stratificata e riproducibile).\n\nUso:  python src/prepara_dataset.py --sorgente data/raw/fibre --destinazione data/processed --max-per-classe 1500\n\"\"\"\nimport argparse\nimport json\nimport random\nimport shutil\nfrom collections import Counter\nfrom pathlib import Path\n\nfrom classi import CLASSI, MAPPA_TEXTILENET\n\nESTENSIONI = {\".jpg\", \".jpeg\", \".png\", \".webp\"}\n\n\ndef raccogli(sorgente: Path) -> dict[str, list[Path]]:\n    per_classe: dict[str, list[Path]] = {c: [] for c in CLASSI}\n    for cartella in sorted(p for p in sorgente.iterdir() if p.is_dir()):\n        classe = MAPPA_TEXTILENET.get(cartella.name)\n        if classe is None:\n            continue\n        per_classe[classe].extend(sorted(f for f in cartella.rglob(\"*\") if f.suffix.lower() in ESTENSIONI))\n    return per_classe\n\n\ndef dividi(file: list[Path], seme: int, quote=(0.7, 0.15)) -> dict[str, list[Path]]:\n    file = file[:]\n    random.Random(seme).shuffle(file)\n    n = len(file)\n    n_train, n_val = int(n * quote[0]), int(n * quote[1])\n    return {\"train\": file[:n_train], \"val\": file[n_train : n_train + n_val], \"test\": file[n_train + n_val :]}\n\n\ndef prepara(sorgente: Path, destinazione: Path, max_per_classe: int, seme: int = 42) -> dict:\n    per_classe = raccogli(sorgente)\n    if destinazione.exists():\n        shutil.rmtree(destinazione)\n    conteggi = {\"train\": Counter(), \"val\": Counter(), \"test\": Counter()}\n    for classe, file in per_classe.items():\n        random.Random(seme).shuffle(file)\n        for parte, elenco in dividi(file[:max_per_classe], seme).items():\n            conteggi[parte][classe] = len(elenco)\n            if not elenco:\n                continue\n            cartella = destinazione / parte / classe\n            cartella.mkdir(parents=True, exist_ok=True)\n            for i, f in enumerate(elenco):\n                shutil.copy2(f, cartella / f\"{classe}_{i:05d}{f.suffix.lower()}\")\n    riepilogo = {parte: dict(c) for parte, c in conteggi.items()}\n    (destinazione / \"riepilogo.json\").write_text(json.dumps(riepilogo, indent=2, ensure_ascii=False))\n    return riepilogo\n\n\nif __name__ == \"__main__\":\n    ap = argparse.ArgumentParser()\n    ap.add_argument(\"--sorgente\", default=\"data/raw/fibre\")\n    ap.add_argument(\"--destinazione\", default=\"data/processed\")\n    ap.add_argument(\"--max-per-classe\", type=int, default=1500)\n    ap.add_argument(\"--seme\", type=int, default=42)\n    a = ap.parse_args()\n    r = prepara(Path(a.sorgente), Path(a.destinazione), a.max_per_classe, a.seme)\n    for parte, c in r.items():\n        print(f\"{parte:6s} {sum(c.values()):6d} immagini  {c}\")\n"
  },
  {
   "cell_type": "code",
   "metadata": {},
   "execution_count": null,
   "outputs": [],
   "source": "%%writefile addestra.py\n\"\"\"Addestramento del classificatore di materiali (transfer learning) ed esportazione ONNX.\n\nRete: MobileNetV3-Large pre-addestrata su ImageNet (torchvision), ultimo strato\nsostituito con 9 uscite (le classi di materiale). Due fasi:\n  1) solo il nuovo classificatore (rete congelata)       -> apprende in fretta\n  2) sblocco degli ultimi blocchi con learning rate basso -> affina le feature\nMetriche sul test set: accuratezza, F1 macro, report per classe, matrice di confusione.\nIl modello viene esportato in ONNX: il servizio di inferenza usa onnxruntime e non\nrichiede PyTorch.\n\nUso (Colab con GPU consigliato):  python src/addestra.py --dati data/processed --uscita models\n\"\"\"\nimport argparse\nimport json\nimport time\nfrom pathlib import Path\n\nimport numpy as np\nimport torch\nfrom torch import nn\nfrom torch.utils.data import DataLoader\nfrom torchvision import datasets, models, transforms\n\nfrom classi import CLASSI, DEVIAZIONE, LATO, MEDIA\n\n\ndef trasformazioni():\n    addestramento = transforms.Compose([\n        transforms.RandomResizedCrop(LATO, scale=(0.6, 1.0)),\n        transforms.RandomHorizontalFlip(),\n        transforms.ColorJitter(brightness=0.15, contrast=0.15),  # lieve: il colore è informativo\n        transforms.ToTensor(),\n        transforms.Normalize(MEDIA, DEVIAZIONE),\n    ])\n    valutazione = transforms.Compose([\n        transforms.Resize(256),\n        transforms.CenterCrop(LATO),\n        transforms.ToTensor(),\n        transforms.Normalize(MEDIA, DEVIAZIONE),\n    ])\n    return addestramento, valutazione\n\n\ndef carica_dati(cartella: Path, lotto: int):\n    t_train, t_eval = trasformazioni()\n    insiemi = {\n        \"train\": datasets.ImageFolder(cartella / \"train\", t_train),\n        \"val\": datasets.ImageFolder(cartella / \"val\", t_eval),\n        \"test\": datasets.ImageFolder(cartella / \"test\", t_eval),\n    }\n    for nome, ds in insiemi.items():\n        assert ds.classes == sorted(CLASSI), f\"classi inattese in {nome}: {ds.classes}\"\n    caricatori = {n: DataLoader(ds, batch_size=lotto, shuffle=(n == \"train\"), num_workers=2) for n, ds in insiemi.items()}\n    return insiemi, caricatori\n\n\ndef crea_modello(n_classi: int) -> nn.Module:\n    modello = models.mobilenet_v3_large(weights=models.MobileNet_V3_Large_Weights.IMAGENET1K_V2)\n    for p in modello.parameters():\n        p.requires_grad = False\n    ingresso = modello.classifier[-1].in_features\n    modello.classifier[-1] = nn.Linear(ingresso, n_classi)\n    return modello\n\n\ndef sblocca_ultimi_blocchi(modello: nn.Module, n: int = 4):\n    for blocco in list(modello.features.children())[-n:]:\n        for p in blocco.parameters():\n            p.requires_grad = True\n\n\ndef pesi_classi(ds) -> torch.Tensor:\n    conteggi = np.bincount(ds.targets, minlength=len(ds.classes)).astype(np.float32)\n    pesi = conteggi.sum() / (len(conteggi) * np.maximum(conteggi, 1))\n    return torch.tensor(pesi, dtype=torch.float32)\n\n\ndef epoca(modello, caricatore, criterio, ottimizzatore, dispositivo):\n    addestra = ottimizzatore is not None\n    modello.train(addestra)\n    totale, corretti, perdita = 0, 0, 0.0\n    with torch.set_grad_enabled(addestra):\n        for x, y in caricatore:\n            x, y = x.to(dispositivo), y.to(dispositivo)\n            uscita = modello(x)\n            loss = criterio(uscita, y)\n            if addestra:\n                ottimizzatore.zero_grad()\n                loss.backward()\n                ottimizzatore.step()\n            perdita += loss.item() * len(y)\n            corretti += (uscita.argmax(1) == y).sum().item()\n            totale += len(y)\n    return perdita / totale, corretti / totale\n\n\ndef valuta(modello, caricatore, dispositivo, n_classi):\n    modello.eval()\n    matrice = np.zeros((n_classi, n_classi), dtype=int)\n    with torch.no_grad():\n        for x, y in caricatore:\n            previsti = modello(x.to(dispositivo)).argmax(1).cpu().numpy()\n            for vero, prev in zip(y.numpy(), previsti):\n                matrice[vero, prev] += 1\n    precisione = np.diag(matrice) / np.maximum(matrice.sum(0), 1)\n    richiamo = np.diag(matrice) / np.maximum(matrice.sum(1), 1)\n    f1 = 2 * precisione * richiamo / np.maximum(precisione + richiamo, 1e-9)\n    return {\n        \"accuratezza\": float(np.trace(matrice) / matrice.sum()),\n        \"f1_macro\": float(f1.mean()),\n        \"per_classe\": {\n            c: {\"precisione\": float(p), \"richiamo\": float(r), \"f1\": float(f), \"campioni\": int(n)}\n            for c, p, r, f, n in zip(sorted(CLASSI), precisione, richiamo, f1, matrice.sum(1))\n        },\n        \"matrice_confusione\": matrice.tolist(),\n    }\n\n\ndef salva_matrice_png(matrice, classi, percorso: Path):\n    import matplotlib\n\n    matplotlib.use(\"Agg\")\n    import matplotlib.pyplot as plt\n\n    m = np.array(matrice)\n    fig, ax = plt.subplots(figsize=(7, 6))\n    ax.imshow(m, cmap=\"Greens\")\n    ax.set_xticks(range(len(classi)), classi, rotation=45, ha=\"right\")\n    ax.set_yticks(range(len(classi)), classi)\n    ax.set_xlabel(\"Classe prevista\")\n    ax.set_ylabel(\"Classe reale\")\n    for i in range(len(classi)):\n        for j in range(len(classi)):\n            ax.text(j, i, m[i, j], ha=\"center\", va=\"center\", fontsize=8, color=\"black\" if m[i, j] < m.max() / 2 else \"white\")\n    ax.set_title(\"Matrice di confusione (test set)\")\n    fig.tight_layout()\n    fig.savefig(percorso, dpi=160)\n\n\ndef esporta_onnx(modello, percorso: Path, dispositivo):\n    modello.eval().to(\"cpu\")\n    esempio = torch.randn(1, 3, LATO, LATO)\n    torch.onnx.export(\n        modello, esempio, str(percorso), input_names=[\"immagine\"], output_names=[\"punteggi\"],\n        dynamic_axes={\"immagine\": {0: \"lotto\"}, \"punteggi\": {0: \"lotto\"}}, opset_version=17,\n    )\n    modello.to(dispositivo)\n    try:  # controllo: onnxruntime deve dare lo stesso risultato di PyTorch\n        import onnxruntime as ort\n\n        sessione = ort.InferenceSession(str(percorso), providers=[\"CPUExecutionProvider\"])\n        atteso = modello.to(\"cpu\")(esempio).detach().numpy()\n        ottenuto = sessione.run(None, {\"immagine\": esempio.numpy()})[0]\n        print(f\"Verifica ONNX: differenza massima {np.abs(atteso - ottenuto).max():.2e}\")\n        modello.to(dispositivo)\n    except ImportError:\n        print(\"onnxruntime non installato: verifica ONNX saltata\")\n\n\ndef main():\n    ap = argparse.ArgumentParser()\n    ap.add_argument(\"--dati\", default=\"data/processed\")\n    ap.add_argument(\"--uscita\", default=\"models\")\n    ap.add_argument(\"--epoche-testa\", type=int, default=3)\n    ap.add_argument(\"--epoche-affinamento\", type=int, default=5)\n    ap.add_argument(\"--lotto\", type=int, default=64)\n    a = ap.parse_args()\n\n    torch.manual_seed(42)\n    dispositivo = \"cuda\" if torch.cuda.is_available() else (\"mps\" if torch.backends.mps.is_available() else \"cpu\")\n    print(f\"Dispositivo: {dispositivo}\")\n    uscita = Path(a.uscita)\n    uscita.mkdir(parents=True, exist_ok=True)\n\n    insiemi, caricatori = carica_dati(Path(a.dati), a.lotto)\n    classi = insiemi[\"train\"].classes\n    modello = crea_modello(len(classi)).to(dispositivo)\n    criterio = nn.CrossEntropyLoss(weight=pesi_classi(insiemi[\"train\"]).to(dispositivo))\n\n    storia, migliore, inizio = [], 0.0, time.time()\n    fasi = [(\"testa\", a.epoche_testa, 1e-3), (\"affinamento\", a.epoche_affinamento, 1e-4)]\n    for fase, n_epoche, lr in fasi:\n        if fase == \"affinamento\":\n            sblocca_ultimi_blocchi(modello)\n        ottimizzatore = torch.optim.AdamW((p for p in modello.parameters() if p.requires_grad), lr=lr, weight_decay=1e-4)\n        for e in range(n_epoche):\n            l_tr, a_tr = epoca(modello, caricatori[\"train\"], criterio, ottimizzatore, dispositivo)\n            l_va, a_va = epoca(modello, caricatori[\"val\"], criterio, None, dispositivo)\n            storia.append({\"fase\": fase, \"epoca\": e + 1, \"loss_train\": l_tr, \"acc_train\": a_tr, \"loss_val\": l_va, \"acc_val\": a_va})\n            print(f\"[{fase}] epoca {e + 1}/{n_epoche}  acc train {a_tr:.3f}  acc val {a_va:.3f}\")\n            if a_va > migliore:\n                migliore = a_va\n                torch.save(modello.state_dict(), uscita / \"migliore.pt\")\n\n    modello.load_state_dict(torch.load(uscita / \"migliore.pt\", map_location=dispositivo))\n    metriche = valuta(modello, caricatori[\"test\"], dispositivo, len(classi))\n    metriche.update({\"classi\": classi, \"storia\": storia, \"durata_s\": round(time.time() - inizio), \"rete\": \"mobilenet_v3_large (ImageNet)\", \"immagini\": {k: len(v) for k, v in insiemi.items()}})\n    (uscita / \"metriche.json\").write_text(json.dumps(metriche, indent=2, ensure_ascii=False))\n    (uscita / \"classi.json\").write_text(json.dumps(classi, ensure_ascii=False))\n    salva_matrice_png(metriche[\"matrice_confusione\"], classi, uscita / \"matrice_confusione.png\")\n    esporta_onnx(modello, uscita / \"materiali.onnx\", dispositivo)\n    print(f\"\\nTest set: accuratezza {metriche['accuratezza']:.3f}, F1 macro {metriche['f1_macro']:.3f}\")\n    print(f\"File salvati in {uscita.resolve()}: materiali.onnx, classi.json, metriche.json, matrice_confusione.png\")\n\n\nif __name__ == \"__main__\":\n    main()\n"
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": "## 3. Prepara il dataset (70% train, 15% validazione, 15% test)"
  },
  {
   "cell_type": "code",
   "metadata": {},
   "execution_count": null,
   "outputs": [],
   "source": "!python prepara_dataset.py --sorgente \"$SORGENTE\" --destinazione data/processed --max-per-classe 1500"
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": "## 4. Addestramento ed esportazione ONNX\nCon GPU T4 richiede indicativamente alcune decine di minuti."
  },
  {
   "cell_type": "code",
   "metadata": {},
   "execution_count": null,
   "outputs": [],
   "source": "!python addestra.py --dati data/processed --uscita models --epoche-testa 3 --epoche-affinamento 5"
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": "## 5. Risultati"
  },
  {
   "cell_type": "code",
   "metadata": {},
   "execution_count": null,
   "outputs": [],
   "source": "import json\nfrom IPython.display import Image, display\nm = json.load(open('models/metriche.json'))\nprint(f\"Accuratezza test: {m['accuratezza']:.3f} | F1 macro: {m['f1_macro']:.3f}\")\nfor c, v in m['per_classe'].items():\n    print(f\"{c:12s} precisione {v['precisione']:.2f}  richiamo {v['richiamo']:.2f}  F1 {v['f1']:.2f}  ({v['campioni']} immagini)\")\ndisplay(Image('models/matrice_confusione.png'))"
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": "## 6. Scarica i file del modello\nCopiali nella cartella `ai-module/models/` del progetto."
  },
  {
   "cell_type": "code",
   "metadata": {},
   "execution_count": null,
   "outputs": [],
   "source": "from google.colab import files\nfor f in ['materiali.onnx', 'classi.json', 'metriche.json', 'matrice_confusione.png']:\n    files.download(f'models/{f}')"
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "name": "python"
  },
  "accelerator": "GPU",
  "colab": {
   "provenance": []
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
```

## `ai-module/README.md`

````markdown
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
````

## `ai-module/requirements-addestramento.txt`

```text
# Addestramento (su Google Colab torch e torchvision sono già installati)
torch>=2.2
torchvision>=0.17
matplotlib>=3.8
onnx>=1.16
onnxruntime>=1.18
gdown>=5.1
```

## `ai-module/requirements.txt`

```text
# Servizio di inferenza (leggero, nessun PyTorch necessario)
fastapi>=0.115,<1
uvicorn[standard]>=0.30
python-multipart>=0.0.9
onnxruntime>=1.18
numpy>=1.26
pillow>=10.3
```

## `ai-module/src/addestra.py`

```python
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
```

## `ai-module/src/classi.py`

```python
"""Classi di materiale riconosciute dal modello e corrispondenza con le etichette di TextileNet.

TextileNet (Zhong et al., 2023) etichetta le immagini per FIBRA (33 classi).
Le fibre sono raggruppate nelle 9 classi di materiale usate dalla piattaforma
(le stesse del campo "materialePrincipale" del backend).
"""

CLASSI = ["cotone", "lana", "cashmere", "seta", "lino", "pelle", "poliestere", "nylon", "viscosa"]

# etichetta TextileNet-fibre -> classe della piattaforma (le altre fibre sono escluse)
MAPPA_TEXTILENET = {
    "cotton": "cotone",
    "wool": "lana",
    "alpaca": "lana",
    "camel": "lana",
    "llama": "lana",
    "mohair": "lana",
    "yak": "lana",
    "angora": "lana",
    "cashmere": "cashmere",
    "silk": "seta",
    "flax_linen": "lino",
    "leather": "pelle",
    "suede": "pelle",
    "polyester": "poliestere",
    "nylon": "nylon",
    "viscose_rayon": "viscosa",
    "modal": "viscosa",
    "lyocell": "viscosa",
    "cupro": "viscosa",
}

# Normalizzazione ImageNet: la stessa usata dalla rete pre-addestrata
MEDIA = [0.485, 0.456, 0.406]
DEVIAZIONE = [0.229, 0.224, 0.225]
LATO = 224
```

## `ai-module/src/prepara_dataset.py`

```python
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
```

## `ai-module/src/servizio.py`

```python
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
```

## `ai-module/test/test_servizio.py`

```python
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
```

## `backend/.env.example`

```bash
# Copia questo file in ".env" e completa i valori. NON condividere .env (contiene credenziali).

# --- Database (MongoDB Atlas, database "regen_luxury") ---
MONGO_URI=mongodb+srv://<utente>:<password>@cluster0.xxxxx.mongodb.net/regen_luxury?retryWrites=true&w=majority

# --- Server ---
# 5001 e non 5000: su macOS la porta 5000 è occupata da AirPlay Receiver.
# Anche la web app (Vite) legge questo valore: basta cambiarlo qui.
PORT=5001

# --- Autenticazione (area gestionale) ---
# Stringa lunga e casuale. Generala con:  node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
JWT_SECRET=
JWT_EXPIRES=8h

# --- URL pubblico della web app (usato nei QR code e negli URL dei tag) ---
PUBLIC_BASE_URL=http://localhost:5173
# Origini ammesse per il frontend (separate da virgola). * = tutte (solo sviluppo)
CORS_ORIGIN=*
# Dietro un proxy HTTPS (es. Render) impostare 1
TRUST_PROXY=0

# --- Limiti di richieste ---
RATE_LIMIT_VERIFY_PER_MIN=120
RATE_LIMIT_LOGIN_PER_15MIN=10

# --- Blockchain ---
# mock    = registro simulato su file (nessun costo)
# polygon = smart contract reale (Polygon Amoy o chain locale Hardhat)
BLOCKCHAIN_MODE=mock
# Dove salvare il registro simulato: mongo (predefinito: collezione del database, condivisa tra Mac e
# sito online su Render, dove i file si cancellano) oppure file (separato dal database, usato dai test)
MOCK_LEDGER_STORE=mongo
MOCK_LEDGER_FILE=./data/mock-ledger.json
MOCK_CHAIN_LATENCY_MS=300
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
PLATFORM_PRIVATE_KEY=
CONTRACT_ADDRESS=
CHAIN_NAME=polygon-amoy

# --- NFC NTAG 424 DNA (Secure Dynamic Messaging) ---
# Chiavi AES-128 in esadecimale (32 caratteri). Quelle di fabbrica sono tutte zero:
# vanno cambiate sul chip e qui prima di un uso reale.
SDM_META_READ_KEY=00000000000000000000000000000000
SDM_FILE_READ_KEY=00000000000000000000000000000000
```

## `backend/.gitignore`

```
node_modules/
.env
data/mock-ledger.json
```

## `backend/app.js`

```javascript
import express from "express";
import cors from "cors";
import helmet from "helmet";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import itemsRouter from "./routes/items.js";
import verifyRouter from "./routes/verify.js";
import authRouter from "./routes/auth.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const cartellaFrontend = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../frontend/dist");

// L'app viene creata da una funzione: i test possono istanziarla con impostazioni diverse
export function creaApp() {
  const app = express();

  if (Number(process.env.TRUST_PROXY)) app.set("trust proxy", Number(process.env.TRUST_PROXY));

  // --- Middleware globali ---
  // Intestazioni di sicurezza HTTP. La CSP ammette i worker "blob:" usati dal
  // lettore di QR della web app; l'upgrade a HTTPS è attivo solo in produzione.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "worker-src": ["'self'", "blob:"],
          // foto decorative della home (Unsplash, licenza Unsplash)
          "img-src": ["'self'", "data:", "blob:", "https://images.unsplash.com"],
          // servizio AI opzionale (ai-module) su un altro dominio: AI_ORIGIN=https://…
          "connect-src": ["'self'", ...(process.env.AI_ORIGIN ? [process.env.AI_ORIGIN] : [])],
          "upgrade-insecure-requests": process.env.NODE_ENV === "production" ? [] : null,
        },
      },
    })
  );
  const origini = process.env.CORS_ORIGIN ?? "*";
  app.use(cors({ origin: origini === "*" ? true : origini.split(",").map((o) => o.trim()) }));
  app.use(express.json({ limit: "100kb" }));                    // parsing del body JSON

  // --- Rotte ---
  app.get("/api/health", (req, res) => {
    res.json({ stato: "online", blockchain: process.env.BLOCKCHAIN_MODE ?? "mock", ora: new Date().toISOString() });
  });
  app.use("/api/auth", authRouter());       // login e gestione account
  app.use("/api/items", itemsRouter);       // gestione capi (lato commerciante)
  app.use("/api/verify", verifyRouter());   // verifica pubblica (lato consumatore)
  app.use("/api", notFound);

  // --- Web app React (se compilata): stesso dominio e stesso HTTPS delle API ---
  if (fs.existsSync(path.join(cartellaFrontend, "index.html"))) {
    app.use(express.static(cartellaFrontend, { index: false, maxAge: "1h" }));
    // un file di build inesistente (es. versione precedente in cache) deve dare 404, non la pagina HTML
    app.use("/assets", (req, res) => res.status(404).end());
    app.get("*", (req, res) => res.sendFile(path.join(cartellaFrontend, "index.html")));
  } else {
    // Rotta di health-check per verificare che il server sia attivo
    app.get("/", (req, res) => {
      res.json({ stato: "online", messaggio: "Backend tracciabilità capi rigenerati" });
    });
  }

  // Middleware di gestione errori (deve stare per ultimo)
  app.use(errorHandler);
  return app;
}
```

## `backend/config/db.js`

```javascript
import mongoose from "mongoose";

// Connessione a MongoDB Atlas.
// La connection string viene letta dalla variabile d'ambiente MONGO_URI (file .env).
export async function connectDB(uri = process.env.MONGO_URI ?? process.env.MONGODB_URI) {
  if (!uri) {
    throw new Error("MONGO_URI non definita: controlla il file .env");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log("MongoDB Atlas: connesso");
}

// Traduce gli errori di connessione più comuni in un'indicazione pratica.
export function spiegaErroreMongo(err) {
  const m = String(err?.message ?? err);
  if (/bad auth|authentication failed/i.test(m)) {
    return "Atlas ha rifiutato utente o password del database. Su Atlas (Security → Database Access → Edit) salva la password con \"Update User\", poi inseriscila con: npm run imposta-db";
  }
  if (/whitelist|IP address|isn't allowed/i.test(m)) {
    return "il tuo indirizzo IP non è autorizzato. Su Atlas: Security → Network Access → Add IP Address → Add Current IP Address.";
  }
  if (/ENOTFOUND|querySrv|EBADNAME/i.test(m)) {
    return "indirizzo del cluster non trovato: controlla la parte dopo la @ in MONGO_URI e la connessione a Internet.";
  }
  if (/timed out|ETIMEDOUT|ECONNREFUSED/i.test(m)) {
    return "il database non risponde: controlla la connessione a Internet e che il tuo IP sia in Network Access su Atlas.";
  }
  return m;
}
```

## `backend/config/security.js`

```javascript
import crypto from "node:crypto";

// Segreto per firmare i token di accesso (JWT).
// In produzione è obbligatorio; in sviluppo, se manca, se ne genera uno
// temporaneo (i login andranno ripetuti a ogni riavvio del server).
let segretoTemporaneo;

export function jwtSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET obbligatorio in produzione (file .env)");
  }
  if (!segretoTemporaneo) {
    segretoTemporaneo = crypto.randomBytes(48).toString("base64url");
    console.warn("[auth] JWT_SECRET assente: uso un segreto temporaneo (solo sviluppo)");
  }
  return segretoTemporaneo;
}

export const jwtExpires = () => process.env.JWT_EXPIRES ?? "8h";
```

## `backend/controllers/authController.js`

```javascript
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { jwtSecret, jwtExpires } from "../config/security.js";

const pubblico = (u) => ({ id: String(u._id), nome: u.nome, email: u.email, ruolo: u.ruolo, organizzazione: u.organizzazione, attivo: u.attivo });

/** Login dell'area gestionale: restituisce un token valido per JWT_EXPIRES (default 8 ore). */
export async function login(req, res, next) {
  try {
    const { email, password } = req.dati.body;
    const utente = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
    const ok = utente && utente.attivo && (await bcrypt.compare(password, utente.passwordHash));
    if (!ok) return res.status(401).json({ errore: "Email o password non corretti." });
    const token = jwt.sign({ sub: String(utente._id), ruolo: utente.ruolo }, jwtSecret(), { expiresIn: jwtExpires() });
    res.json({ token, utente: pubblico(utente) });
  } catch (err) {
    next(err);
  }
}

export function me(req, res) {
  res.json({ utente: req.utente });
}

export async function cambiaPassword(req, res, next) {
  try {
    const { vecchia, nuova } = req.dati.body;
    const utente = await User.findById(req.utente.id).select("+passwordHash");
    if (!(await bcrypt.compare(vecchia, utente.passwordHash))) {
      return res.status(400).json({ errore: "La password attuale non è corretta." });
    }
    utente.passwordHash = await bcrypt.hash(nuova, 12);
    await utente.save();
    res.json({ messaggio: "Password aggiornata." });
  } catch (err) {
    next(err);
  }
}

/** Solo admin: crea l'account di un Brand Manager, commerciante o artigiano. */
export async function creaUtente(req, res, next) {
  try {
    const { password, email, ...resto } = req.dati.body;
    if (await User.exists({ email: email.toLowerCase() })) {
      return res.status(409).json({ errore: "Esiste già un utente con questa email." });
    }
    const utente = await User.create({ ...resto, email, passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json({ utente: pubblico(utente) });
  } catch (err) {
    next(err);
  }
}

export async function elencaUtenti(req, res, next) {
  try {
    const utenti = await User.find().sort({ createdAt: -1 }).lean();
    res.json({ dati: utenti.map(pubblico) });
  } catch (err) {
    next(err);
  }
}

/** Solo admin: attiva o disattiva un account (i dati storici restano). */
export async function impostaAttivo(req, res, next) {
  try {
    const { id } = req.dati.params;
    if (id === req.utente.id) return res.status(400).json({ errore: "Non puoi disattivare il tuo stesso account." });
    const utente = await User.findById(id);
    if (!utente) return res.status(404).json({ errore: "Utente non trovato." });
    utente.attivo = req.dati.body.attivo;
    await utente.save();
    res.json({ utente: pubblico(utente) });
  } catch (err) {
    next(err);
  }
}
```

## `backend/controllers/itemController.js`

```javascript
import Item from "../models/Item.js";
import { blockchain } from "../services/blockchain/index.js";
import { ancoraDatiCapo, ancoraEvento, ancoraPassaggio } from "../services/anchorService.js";
import { verificaMessaggioSun } from "../services/sunService.js";
import { urlVerifica, qrSvg, qrPng } from "../services/qrService.js";

/*
 * Controller lato COMMERCIANTE / ARTIGIANO (area gestionale, richiede login).
 * Contiene la business logic per creare capi, registrare eventi di
 * rigenerazione e passaggi di proprietà. Ogni scrittura viene poi ancorata
 * sulla blockchain in modo asincrono (services/anchorService.js).
 */

const TAG_DUPLICATO = "Questo tag risulta già associato a un altro capo.";
const nonTrovato = (res) => res.status(404).json({ errore: "Capo non trovato." });
const archiviato = (res) => res.status(409).json({ errore: "Il capo è archiviato: non può essere modificato." });
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * RF: Creazione dell'identità digitale + Associazione smart tag.
 * Crea un nuovo capo, lo salva su MongoDB e ne ancora l'impronta sulla blockchain.
 */
export async function creaItem(req, res, next) {
  try {
    const { proprietarioIniziale, ...dati } = req.dati.body;

    // Anti-duplicazione (requisito R): il tag non deve essere già in uso,
    // né nel database né sulla blockchain (un tag "bruciato" resta tale).
    if (await Item.exists({ tagId: dati.tagId })) {
      return res.status(409).json({ errore: TAG_DUPLICATO });
    }
    const chain = await blockchain();
    if ((await chain.leggiRegistro(dati.tagId)).registrato) {
      return res.status(409).json({ errore: "Questo tag risulta già registrato sulla blockchain." });
    }

    const item = await Item.create({
      ...dati,
      creatoDa: req.utente.id,
      registrazione: { stato: "in_attesa", aggiornatoIl: new Date() },
      passaggiProprieta: proprietarioIniziale
        ? [{ proprietario: proprietarioIniziale, registratoDa: req.utente.id, ancoraggio: { stato: "in_attesa", aggiornatoIl: new Date() } }]
        : [],
    });

    // Scritture blockchain asincrone: la risposta non attende la conferma (requisito P)
    ancoraDatiCapo(item._id, { nuovo: true });
    if (proprietarioIniziale) ancoraPassaggio(item._id, item.passaggiProprieta[0]._id);

    res.status(201).json(item);
  } catch (err) {
    // Gestione tag duplicato (indice unique) — coerente con RR anti-replay
    if (err.code === 11000) return res.status(409).json({ errore: TAG_DUPLICATO });
    next(err);
  }
}

/**
 * Elenco dei capi con ricerca e paginazione (dashboard del commerciante).
 * GET /api/items?q=gucci&stato=attivo&pagina=1&perPagina=20
 */
export async function elencaItems(req, res, next) {
  try {
    const { q, stato, pagina, perPagina } = req.dati.query;
    const filtro = {};
    if (stato) filtro.stato = stato === "attivo" ? { $ne: "archiviato" } : stato;
    if (q) {
      const re = new RegExp(escapeRegex(q), "i");
      filtro.$or = [{ brand: re }, { codiceModello: re }, { tagId: re }];
    }
    const [dati, totale] = await Promise.all([
      Item.find(filtro).sort({ createdAt: -1 }).skip((pagina - 1) * perPagina).limit(perPagina).lean(),
      Item.countDocuments(filtro),
    ]);
    res.json({ dati, pagina, perPagina, totale, pagine: Math.max(1, Math.ceil(totale / perPagina)) });
  } catch (err) {
    next(err);
  }
}

/** Recupera un singolo capo tramite il suo ID. */
export async function getItemById(req, res, next) {
  try {
    const item = await Item.findById(req.dati.params.id);
    if (!item) return nonTrovato(res);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

/** Ricerca per codice del tag (es. dopo aver letto un QR in negozio). */
export async function getItemByTag(req, res, next) {
  try {
    const item = await Item.findOne({ tagId: req.dati.params.tagId });
    if (!item) return nonTrovato(res);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

/**
 * Modifica i dati descrittivi del capo (il tagId non è modificabile).
 * La nuova impronta dei dati viene ancorata sulla blockchain: la versione
 * precedente resta nello storico degli eventi del contratto.
 */
export async function modificaItem(req, res, next) {
  try {
    const item = await Item.findById(req.dati.params.id);
    if (!item) return nonTrovato(res);
    if (item.stato === "archiviato") return archiviato(res);
    // null = campo svuotato dall'utente: viene rimosso
    for (const [campo, valore] of Object.entries(req.dati.body)) item.set(campo, valore === null ? undefined : valore);
    item.registrazione = { ...(item.registrazione?.toObject?.() ?? {}), stato: "in_attesa", errore: undefined, aggiornatoIl: new Date() };
    await item.save();
    ancoraDatiCapo(item._id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

/** Archivia il capo (non lo cancella: la sua storia resta verificabile). */
export async function archiviaItem(req, res, next) {
  try {
    const item = await Item.findById(req.dati.params.id);
    if (!item) return nonTrovato(res);
    if (item.stato === "archiviato") return res.status(409).json({ errore: "Il capo è già archiviato." });
    item.stato = "archiviato";
    item.registrazione = { ...(item.registrazione?.toObject?.() ?? {}), stato: "in_attesa", errore: undefined, aggiornatoIl: new Date() };
    await item.save();
    ancoraDatiCapo(item._id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

/**
 * RF: Registrazione dell'evento di rigenerazione sartoriale.
 * Aggiunge un evento all'array embedded storicoRigenerazione.
 */
export async function aggiungiEvento(req, res, next) {
  try {
    const item = await Item.findById(req.dati.params.id);
    if (!item) return nonTrovato(res);
    if (item.stato === "archiviato") return archiviato(res);

    item.storicoRigenerazione.push({
      ...req.dati.body,
      registratoDa: req.utente.id,
      ancoraggio: { stato: "in_attesa", aggiornatoIl: new Date() },
    });
    await item.save();
    ancoraEvento(item._id, item.storicoRigenerazione.at(-1)._id);

    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
}

/**
 * Registra un nuovo passaggio di proprietà.
 * RF (anti-contraffazione): il sistema deve convalidare "l'intera catena dei
 * passaggi di proprietà storici". Questo endpoint permette di costruire quella catena.
 */
export async function aggiungiPassaggioProprieta(req, res, next) {
  try {
    const item = await Item.findById(req.dati.params.id);
    if (!item) return nonTrovato(res);
    if (item.stato === "archiviato") return archiviato(res);

    item.passaggiProprieta.push({
      proprietario: req.dati.body.proprietario,
      registratoDa: req.utente.id,
      ancoraggio: { stato: "in_attesa", aggiornatoIl: new Date() },
    });
    await item.save();
    ancoraPassaggio(item._id, item.passaggiProprieta.at(-1)._id);

    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
}

/**
 * Elimina un capo (solo amministratore).
 * NOTA: utile solo per ripulire il database durante le prove della demo.
 * Non corrisponde a un requisito funzionale: sulla blockchain il tag resta
 * registrato (i record on-chain sono immutabili), quindi non potrà essere
 * riusato per un nuovo capo.
 */
export async function eliminaItem(req, res, next) {
  try {
    const item = await Item.findByIdAndDelete(req.dati.params.id);
    if (!item) return nonTrovato(res);
    res.status(200).json({ messaggio: "Capo eliminato.", id: req.dati.params.id });
  } catch (err) {
    next(err);
  }
}

/** QR code stampabile con l'URL pubblico di verifica (?formato=svg|png). */
export async function qrItem(req, res, next) {
  try {
    const item = await Item.findById(req.dati.params.id).lean();
    if (!item) return nonTrovato(res);
    const url = urlVerifica(item.tagId);
    res.set("X-Url-Verifica", url);
    if (req.query.formato === "png") {
      res.type("png").send(await qrPng(url));
    } else {
      res.type("image/svg+xml").send(await qrSvg(url));
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Associa un chip NTAG 424 DNA al capo.
 * Si invia il messaggio letto dal chip ({ e, c }): il server lo verifica con le
 * chiavi SDM e salva UID e contatore. In alternativa si può indicare l'UID.
 */
export async function associaNfc(req, res, next) {
  try {
    const item = await Item.findById(req.dati.params.id);
    if (!item) return nonTrovato(res);
    if (item.stato === "archiviato") return archiviato(res);

    let uid;
    let contatore = null;
    if (req.dati.body.e) {
      const esito = verificaMessaggioSun(req.dati.body);
      if (!esito.macValido) {
        return res.status(400).json({ errore: "Messaggio del chip non autentico: controlla le chiavi SDM." });
      }
      ({ uid, contatore } = esito);
    } else {
      uid = req.dati.body.uid.toUpperCase();
    }

    const altro = await Item.findOne({ "nfc.uid": uid, _id: { $ne: item._id } }).lean();
    if (altro) return res.status(409).json({ errore: `Questo chip è già associato al capo ${altro.tagId}.` });

    item.nfc = { uid, ultimoContatore: contatore, associatoIl: new Date() };
    await item.save();
    res.json({ tagId: item.tagId, nfc: item.nfc });
  } catch (err) {
    next(err);
  }
}
```

## `backend/controllers/verifyController.js`

```javascript
import Item from "../models/Item.js";
import { verificaIntegrita } from "../services/integrityService.js";
import { calcolaImpattoAmbientale } from "../services/impactService.js";
import { verificaMessaggioSun } from "../services/sunService.js";

/*
 * Controller lato CONSUMATORE (accesso pubblico).
 * Gestisce la scansione del tag: nessun login richiesto (requisito RU: Access Public).
 */

// Minimizzazione dei dati personali (GDPR): "Maria Rossi" -> "M. R."
const iniziali = (nome = "") =>
  nome
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => `${p[0].toUpperCase()}.`)
    .join(" ") || "—";

const ancoraggioPubblico = (a) => (a ? { stato: a.stato, txHash: a.txHash ?? null, rete: a.rete ?? null } : { stato: "non_ancorato" });

async function certificato(item) {
  const integrita = await verificaIntegrita(item);
  // Autentico solo se TUTTO coincide con la blockchain (gli stati di attesa non bastano)
  const autentico = integrita.stato === "verificato";
  return {
    capo: {
      tagId: item.tagId,
      brand: item.brand,
      codiceModello: item.codiceModello,
      materialiOriginari: item.materialiOriginari,
      filieraProvenienza: item.filieraProvenienza,
      categoria: item.categoria,
      materialePrincipale: item.materialePrincipale,
      annoProduzione: item.annoProduzione,
      stato: item.stato ?? "attivo",
      storicoRigenerazione: item.storicoRigenerazione.map((e) => ({
        tipo: e.tipo,
        descrizione: e.descrizione,
        materialiNuovi: e.materialiNuovi,
        operatore: e.operatore,
        data: e.data,
        ancoraggio: ancoraggioPubblico(e.ancoraggio),
      })),
      passaggiProprieta: item.passaggiProprieta.map((p, i) => ({
        passo: i + 1,
        proprietario: iniziali(p.proprietario),
        data: p.data,
        ancoraggio: ancoraggioPubblico(p.ancoraggio),
      })),
    },
    certificatoAutenticita: {
      autentico,
      txHash: item.registrazione?.txHash ?? item.blockchainTxHash ?? null,
      rete: integrita.rete,
      tokenId: integrita.tokenId ?? null,
      passaggiVerificati: item.passaggiProprieta.length,
      integrita,
    },
    impattoAmbientale: calcolaImpattoAmbientale(item),
    verificatoIl: new Date().toISOString(),
  };
}

/**
 * RF: Tracciamento ed emissione del certificato di autenticità.
 * RF: Dashboard della sostenibilità e calcolo dell'impatto.
 *
 * Dato il codice del tag fisico, recupera il capo, confronta i dati con quelli
 * ancorati sulla blockchain e calcola l'impatto ambientale evitato.
 */
export async function verificaCapo(req, res, next) {
  try {
    // Il requisito di performance (<2s) è supportato dall'indice su tagId (unique).
    const item = await Item.findOne({ tagId: req.dati.params.tagId }).lean();
    if (!item) {
      return res.status(404).json({
        autentico: false,
        errore: "Nessun capo associato a questo tag. Possibile contraffazione.",
      });
    }
    res.json(await certificato(item));
  } catch (err) {
    next(err);
  }
}

/**
 * Verifica tramite chip NTAG 424 DNA (URL dinamico /s?e=...&c=...).
 * 1) il messaggio deve essere autentico (CMAC corretto: il chip conosce la chiave);
 * 2) il contatore deve essere più alto dell'ultimo visto (anti-replay):
 *    l'aggiornamento è atomico, due richieste con lo stesso URL non passano entrambe.
 */
export async function verificaSun(req, res, next) {
  try {
    const esito = verificaMessaggioSun(req.dati.query);
    if (!esito.macValido) {
      return res.status(400).json({
        autentico: false,
        errore: "Il messaggio del tag non è autentico: possibile chip clonato o URL alterato.",
      });
    }

    const item = await Item.findOneAndUpdate(
      {
        "nfc.uid": esito.uid,
        $or: [{ "nfc.ultimoContatore": null }, { "nfc.ultimoContatore": { $lt: esito.contatore } }],
      },
      { $set: { "nfc.ultimoContatore": esito.contatore, "nfc.ultimaLettura": new Date() } },
      { new: true }
    ).lean();

    if (!item) {
      const associato = await Item.exists({ "nfc.uid": esito.uid });
      if (!associato) {
        return res.status(404).json({ autentico: false, errore: "Chip autentico ma non associato a nessun capo." });
      }
      return res.status(409).json({
        autentico: false,
        replay: true,
        errore: "Questo link di verifica è già stato usato. Avvicina di nuovo il telefono al tag.",
      });
    }

    const risposta = await certificato(item);
    risposta.nfc = { messaggioAutentico: true, antiReplay: "superato", contatoreLetture: esito.contatore };
    res.json(risposta);
  } catch (err) {
    next(err);
  }
}
```

## `backend/data/coefficienti-lca.json`

```json
{
  "versione": 1,
  "aggiornato": "2026-09-22",
  "metodo": "Impatto evitato = impatto di produzione di un capo nuovo equivalente (fasi dalla fibra alla vendita, esclusi uso e fine vita) x fattore di sostituzione. Ogni valore e' una STIMA da letteratura, non una misura sul singolo capo.",
  "fattoreSostituzione": {
    "valore": 0.6,
    "intervallo": [0.6, 0.85],
    "fonte": "Farrant L., Olsen S.I., Wangel A. (2010). Environmental benefits from reusing clothes. The International Journal of Life Cycle Assessment, 15, 726-736.",
    "nota": "L'acquisto di 100 capi di seconda mano evita la produzione di 60-85 capi nuovi (indagine su oltre 200 consumatori). Si usa il valore piu' prudente, 0,6."
  },
  "categorie": {
    "jeans": {
      "co2Kg": 20.0,
      "acquaL": 2922,
      "unitaFunzionale": "un paio di Levi's 501; fasi fibra, tessuto, confezione, accessori/imballaggio, trasporto e vendita (esclusi cura del consumatore e fine vita)",
      "fonte": "Levi Strauss & Co. (2015). The Life Cycle of a Jean: understanding the environmental impact of a pair of Levi's 501 jeans.",
      "calcolo": "clima: 2,9 + 9,0 + 2,6 + 1,7 + 3,8 = 20,0 kg CO2e (su 33,4 totali); acqua: 2565 + 236 + 34 + 77 + 10 = 2922 L (su 3781 totali)",
      "verificato": true
    },
    "t-shirt": {
      "co2Kg": 3.53,
      "acquaL": 725,
      "unitaFunzionale": "una t-shirt in cotone da 250 g, dalla culla al cancello (cradle-to-gate)",
      "fonte": "Forfora N. et al. (2026). A Comparative Life Cycle Assessment of T-Shirt Production Using Viscose, Lyocell, Cotton, and Polyester. Sustainability, 18(8), 4070. https://doi.org/10.3390/su18084070",
      "calcolo": "14,1 kg CO2e/kg x 0,25 kg = 3,53 kg CO2e; 2,9 m3/kg x 0,25 kg = 725 L",
      "verificato": false,
      "daVerificare": "Valori per kg estratti dal riassunto dell'articolo: controllare la tabella dei risultati prima di citarli in tesi."
    }
  }
}
```

## `backend/middleware/auth.js`

```javascript
// Autenticazione (token JWT) e autorizzazione per ruolo dell'area gestionale.
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { jwtSecret } from "../config/security.js";

export async function autentica(req, res, next) {
  const intestazione = req.headers.authorization ?? "";
  if (!intestazione.startsWith("Bearer ")) {
    return res.status(401).json({ errore: "Accesso richiesto: effettua il login." });
  }
  let payload;
  try {
    payload = jwt.verify(intestazione.slice(7), jwtSecret());
  } catch {
    return res.status(401).json({ errore: "Sessione scaduta o non valida: effettua di nuovo il login." });
  }
  try {
    const utente = await User.findById(payload.sub).lean();
    if (!utente || !utente.attivo) {
      return res.status(401).json({ errore: "Account non valido o disattivato." });
    }
    req.utente = { id: String(utente._id), nome: utente.nome, email: utente.email, ruolo: utente.ruolo };
    next();
  } catch (err) {
    next(err); // database non raggiungibile: errore del server, non login scaduto
  }
}

// L'amministratore può sempre tutto; gli altri solo i ruoli indicati
export const richiediRuolo = (...ruoli) => (req, res, next) => {
  if (req.utente?.ruolo === "admin" || ruoli.includes(req.utente?.ruolo)) return next();
  return res.status(403).json({ errore: "Operazione non consentita per il tuo ruolo." });
};
```

## `backend/middleware/errorHandler.js`

```javascript
/*
 * Middleware centralizzato per la gestione degli errori.
 * Cattura le eccezioni non gestite e restituisce una risposta JSON coerente,
 * evitando che l'applicazione si blocchi (contribuisce al requisito RR: affidabilità).
 */
export function notFound(req, res) {
  res.status(404).json({ errore: `Endpoint non trovato: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Indice UNIQUE violato (es. due richieste simultanee con lo stesso tagId)
  if (err.code === 11000) {
    const campo = Object.keys(err.keyPattern ?? err.keyValue ?? {})[0];
    const messaggi = {
      tagId: "Questo tag risulta già associato a un altro capo.",
      email: "Esiste già un account con questa email.",
    };
    return res.status(409).json({ errore: messaggi[campo] ?? (campo ? "Valore già presente." : messaggi.tagId) });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ errore: "ID del capo non valido." });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ errore: "Dati non validi", dettagli: Object.values(err.errors).map((e) => ({ campo: e.path, messaggio: e.message })) });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ errore: "JSON non valido nel corpo della richiesta." });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ errore: "Richiesta troppo grande." });
  }
  const status = err.status || 500;
  if (status >= 500) console.error("Errore interno:", err);
  res.status(status).json({ errore: status >= 500 ? "Errore interno del server." : err.message });
}
```

## `backend/middleware/limiti.js`

```javascript
// Limite al numero di richieste per indirizzo IP (protezione da abusi e scansioni automatiche).
import rateLimit from "express-rate-limit";

const risposta = (messaggio) => ({ errore: messaggio });

export const limiteVerifica = () =>
  rateLimit({
    windowMs: 60_000,
    limit: Number(process.env.RATE_LIMIT_VERIFY_PER_MIN ?? 120),
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: risposta("Troppe verifiche in poco tempo: riprova tra un minuto."),
  });

export const limiteLogin = () =>
  rateLimit({
    windowMs: 15 * 60_000,
    limit: Number(process.env.RATE_LIMIT_LOGIN_PER_15MIN ?? 10),
    skipSuccessfulRequests: true,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: risposta("Troppi tentativi di accesso: riprova tra 15 minuti."),
  });
```

## `backend/middleware/valida.js`

```javascript
// Applica gli schemi di validazione a body, query e parametri della richiesta.
// I dati validati (e normalizzati) finiscono in req.dati.
export function valida({ body, query, params } = {}) {
  return (req, res, next) => {
    const dati = {};
    for (const [parte, schema] of Object.entries({ body, query, params })) {
      if (!schema) continue;
      const esito = schema.safeParse(req[parte] ?? {});
      if (!esito.success) {
        return res.status(400).json({
          errore: "Dati non validi",
          dettagli: esito.error.issues.map((i) => ({
            campo: i.path.join(".") || parte,
            messaggio: i.code === "unrecognized_keys" ? `Campo non ammesso: ${i.keys.join(", ")}` : i.message,
          })),
        });
      }
      dati[parte] = esito.data;
    }
    req.dati = dati;
    next();
  };
}
```

## `backend/models/costanti.js`

```javascript
// Valori ammessi, condivisi da modelli, validazione e frontend.
export const TIPI_EVENTO = ["riparazione", "upcycling", "sostituzione_parti"];

export const RUOLI = ["admin", "brand_manager", "commerciante", "artigiano"];

export const CATEGORIE = [
  "giacca", "cappotto", "abito", "camicia", "t-shirt", "maglione",
  "pantaloni", "jeans", "gonna", "borsa", "scarpe", "accessorio", "altro",
];

export const MATERIALI = [
  "cotone", "lana", "seta", "lino", "cashmere", "pelle", "denim",
  "poliestere", "nylon", "viscosa", "misto", "altro",
];

export const STATI_CAPO = ["attivo", "archiviato"];

export const STATI_ANCORAGGIO = ["in_attesa", "confermato", "fallito"];

// Formato ammesso per il codice del tag fisico (es. NFC-001)
export const TAG_REGEX = /^[A-Za-z0-9_-]{3,64}$/;
```

## `backend/models/Item.js`

```javascript
import mongoose from "mongoose";
import { TIPI_EVENTO, CATEGORIE, MATERIALI, STATI_CAPO, STATI_ANCORAGGIO } from "./costanti.js";

/*
 * Stato dell'ancoraggio su blockchain di un dato (capo, evento, passaggio).
 * "hash" è l'impronta keccak256 dei dati: è l'unica cosa che va on-chain
 * (nessun dato personale sulla blockchain, per il GDPR).
 * La scrittura è asincrona (requisito P): prima "in_attesa", poi "confermato".
 */
const ancoraggioSchema = new mongoose.Schema(
  {
    stato: { type: String, enum: STATI_ANCORAGGIO, default: "in_attesa" },
    hash: { type: String },
    txHash: { type: String },
    blocco: { type: Number },
    rete: { type: String },
    errore: { type: String },
    aggiornatoIl: { type: Date },
  },
  { _id: false }
);

/*
 * Sotto-schema per un singolo evento di rigenerazione sartoriale.
 * Modellato come documento EMBEDDED all'interno dell'Item (scelta di progetto):
 * un capo = un documento che contiene l'intera sua storia.
 * Questo giustifica l'uso di MongoDB (database documentale non relazionale)
 * e soddisfa il requisito di performance (recupero in <2s con una sola query).
 * Copre RF: "Registrazione dell'evento di rigenerazione sartoriale".
 */
const regenerationEventSchema = new mongoose.Schema(
  {
    tipo: { type: String, enum: TIPI_EVENTO, required: true },
    descrizione: { type: String, required: true },
    // Origine dei nuovi materiali ecologici impiegati (RF)
    materialiNuovi: { type: String },
    operatore: { type: String }, // Artigiano / Operatore di Laboratorio
    data: { type: Date, default: Date.now },
    registratoDa: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ancoraggio: { type: ancoraggioSchema }, // assente sui dati creati prima della v2
  },
  { _id: true }
);

// Catena dei passaggi di proprietà (per la verifica anti-contraffazione)
const passaggioSchema = new mongoose.Schema(
  {
    proprietario: { type: String, required: true },
    data: { type: Date, default: Date.now },
    registratoDa: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ancoraggio: { type: ancoraggioSchema },
  },
  { _id: true }
);

/*
 * Schema principale del capo d'alta gamma.
 * Copre RF: "Creazione dell'identità digitale" e "Associazione smart hardware-software".
 */
const itemSchema = new mongoose.Schema(
  {
    // --- Metadati di fabbricazione (RF: creazione identità digitale) ---
    brand: { type: String, required: true, trim: true },
    codiceModello: { type: String, required: true, trim: true },
    materialiOriginari: { type: String, required: true, trim: true },
    filieraProvenienza: { type: String, trim: true },
    categoria: { type: String, enum: CATEGORIE },
    materialePrincipale: { type: String, enum: MATERIALI },
    annoProduzione: { type: Number },
    stato: { type: String, enum: STATI_CAPO, default: "attivo" },

    // --- Accoppiamento hardware-software (RF: associazione smart tag) ---
    // Codice univoco del tag NFC/QR fisico. L'indice UNIQUE impedisce che lo
    // stesso tag identifichi due capi (requisito R: anti-duplicazione/replay).
    tagId: { type: String, required: true, unique: true, trim: true },

    // Chip NTAG 424 DNA associato (autenticazione dinamica SUN)
    nfc: {
      uid: { type: String, index: true },
      ultimoContatore: { type: Number },
      associatoIl: { type: Date },
      ultimaLettura: { type: Date },
    },

    // --- Storico rigenerazione (array embedded) ---
    storicoRigenerazione: [regenerationEventSchema],

    // --- Blockchain ---
    // tx hash della registrazione (campo della v1, mantenuto per compatibilità)
    blockchainTxHash: { type: String },
    // stato dell'impronta dei dati del capo ancorata on-chain
    registrazione: { type: ancoraggioSchema },

    passaggiProprieta: [passaggioSchema],

    creatoDa: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true } // aggiunge createdAt / updatedAt automaticamente
);

itemSchema.index({ brand: 1, codiceModello: 1 });

export default mongoose.model("Item", itemSchema);
```

## `backend/models/User.js`

```javascript
import mongoose from "mongoose";
import { RUOLI } from "./costanti.js";

/*
 * Utenti dell'area gestionale: Brand Manager, commercianti, artigiani
 * (e un amministratore che crea gli account). I consumatori NON hanno un
 * account: la verifica è pubblica (requisito U, "Access Public").
 * La password non viene mai salvata in chiaro: si conserva solo l'hash bcrypt.
 */
const userSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    ruolo: { type: String, enum: RUOLI, default: "commerciante" },
    organizzazione: { type: String, trim: true }, // boutique, laboratorio, cooperativa
    passwordHash: { type: String, required: true, select: false },
    attivo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
```

## `backend/package.json`

```json
{
  "name": "regen-luxury-backend",
  "version": "2.0.0",
  "description": "Backend per piattaforma di tracciabilità di capi di lusso rigenerati (tesi Politecnico di Bari)",
  "main": "server.js",
  "type": "module",
  "engines": {
    "node": ">=20.10"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js",
    "imposta-db": "node scripts/imposta-db.js",
    "copia-db": "node scripts/copia-db.js",
    "test": "node --test --test-concurrency=1",
    "passaggi": "node scripts/passaggi.js",
    "misura-tempi": "node scripts/misura-tempi.js",
    "crea-admin": "node scripts/crea-admin.js",
    "popola-demo": "node scripts/popola-demo.js",
    "migra": "node scripts/migra-ancoraggi.js"
  },
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^16.6.1",
    "ethers": "^6.17.0",
    "express": "^4.22.3",
    "express-rate-limit": "^7.5.1",
    "helmet": "^8.3.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^8.24.4",
    "qrcode": "^1.5.4",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "mongodb-memory-server-core": "^10.4.3",
    "supertest": "^7.2.2"
  },
  "license": "MIT"
}
```

## `backend/routes/auth.js`

```javascript
import express from "express";
import { z } from "zod";
import { login, me, cambiaPassword, creaUtente, elencaUtenti, impostaAttivo } from "../controllers/authController.js";
import { autentica, richiediRuolo } from "../middleware/auth.js";
import { valida } from "../middleware/valida.js";
import { limiteLogin } from "../middleware/limiti.js";
import * as schemi from "../validators/schemi.js";

export default function authRouter() {
  const router = express.Router();

  router.post("/login", limiteLogin(), valida({ body: schemi.login }), login);
  router.get("/me", autentica, me);
  router.post("/password", autentica, valida({ body: schemi.cambioPassword }), cambiaPassword);

  // Gestione account (solo amministratore)
  router.get("/utenti", autentica, richiediRuolo("admin"), elencaUtenti);
  router.post("/utenti", autentica, richiediRuolo("admin"), valida({ body: schemi.nuovoUtente }), creaUtente);
  router.patch(
    "/utenti/:id",
    autentica,
    richiediRuolo("admin"),
    valida({ params: z.object({ id: schemi.objectId }), body: z.object({ attivo: z.boolean() }).strict() }),
    impostaAttivo
  );

  return router;
}
```

## `backend/routes/items.js`

```javascript
import express from "express";
import { z } from "zod";
import {
  creaItem,
  elencaItems,
  getItemById,
  getItemByTag,
  modificaItem,
  archiviaItem,
  aggiungiEvento,
  aggiungiPassaggioProprieta,
  eliminaItem,
  qrItem,
  associaNfc,
} from "../controllers/itemController.js";
import { autentica, richiediRuolo } from "../middleware/auth.js";
import { valida } from "../middleware/valida.js";
import * as schemi from "../validators/schemi.js";

const router = express.Router();
const conId = valida({ params: z.object({ id: schemi.objectId }) });

/*
 * Rotte lato COMMERCIANTE / ARTIGIANO: tutte richiedono il login.
 * Permessi per ruolo (l'amministratore può sempre tutto):
 *  - creare, modificare, associare il chip: brand_manager, commerciante
 *  - archiviare: brand_manager
 *  - eventi di rigenerazione: artigiano, commerciante
 *  - passaggi di proprietà: commerciante, brand_manager
 *  - eliminare: solo admin (strumento per la demo)
 */
router.use(autentica);

// Crea un nuovo capo (identità digitale + tag)
router.post("/", richiediRuolo("brand_manager", "commerciante"), valida({ body: schemi.nuovoCapo }), creaItem);

// Elenco con ricerca e paginazione
router.get("/", valida({ query: schemi.filtriElenco }), elencaItems);

// Ricerca per codice del tag (prima di "/:id")
router.get("/tag/:tagId", valida({ params: z.object({ tagId: schemi.tagId }) }), getItemByTag);

// Recupera un singolo capo per ID
router.get("/:id", conId, getItemById);

// Modifica dati descrittivi / archiviazione
router.patch("/:id", richiediRuolo("brand_manager", "commerciante"), valida({ params: z.object({ id: schemi.objectId }), body: schemi.modificaCapo }), modificaItem);
router.post("/:id/archivia", richiediRuolo("brand_manager"), conId, archiviaItem);

// Aggiungi un evento di rigenerazione a un capo esistente
router.post("/:id/eventi", richiediRuolo("artigiano", "commerciante"), valida({ params: z.object({ id: schemi.objectId }), body: schemi.nuovoEvento }), aggiungiEvento);

// Registra un passaggio di proprietà (anti-contraffazione)
router.post("/:id/proprieta", richiediRuolo("commerciante", "brand_manager"), valida({ params: z.object({ id: schemi.objectId }), body: schemi.nuovoPassaggio }), aggiungiPassaggioProprieta);

// QR code stampabile e associazione del chip NFC
router.get("/:id/qr", conId, qrItem);
router.post("/:id/nfc", richiediRuolo("brand_manager", "commerciante"), valida({ params: z.object({ id: schemi.objectId }), body: schemi.associaNfc }), associaNfc);

// Elimina un capo (solo admin, per pulizia in fase di demo)
router.delete("/:id", richiediRuolo("admin"), conId, eliminaItem);

export default router;
```

## `backend/routes/verify.js`

```javascript
import express from "express";
import { z } from "zod";
import { verificaCapo, verificaSun } from "../controllers/verifyController.js";
import { valida } from "../middleware/valida.js";
import { limiteVerifica } from "../middleware/limiti.js";
import * as schemi from "../validators/schemi.js";

/*
 * Rotte pubbliche lato CONSUMATORE (RU: Access Public, nessun login),
 * con limite di richieste per IP contro abusi e scansioni automatiche.
 */
export default function verifyRouter() {
  const router = express.Router();
  router.use(limiteVerifica());

  // Chip NTAG 424 DNA: URL dinamico con messaggio cifrato (prima di "/:tagId")
  router.get("/sun", valida({ query: schemi.messaggioSun }), verificaSun);

  // Scansione del QR o tag statico: si passa il tagId nell'URL
  router.get("/:tagId", valida({ params: z.object({ tagId: schemi.tagId }) }), verificaCapo);

  return router;
}
```

## `backend/scripts/_cli.js`

```javascript
// Utilità per gli script da terminale (colori, input nascosto, chiamate HTTP).
import readline from "node:readline";

export const colore = {
  verde: (t) => `\x1b[32m${t}\x1b[0m`,
  rosso: (t) => `\x1b[31m${t}\x1b[0m`,
  giallo: (t) => `\x1b[33m${t}\x1b[0m`,
  ciano: (t) => `\x1b[36m${t}\x1b[0m`,
};

// Chiede un valore al terminale. Con { nascosto: true } (password) al posto dei
// caratteri scritti o incollati compare un * per ciascuno.
export function chiedi(domanda, { nascosto = false } = {}) {
  if (nascosto && process.stdin.isTTY) return chiediNascosto(domanda);
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: !nascosto && process.stdin.isTTY });
    rl.question(domanda, (risposta) => {
      rl.close();
      resolve(risposta.trim());
    });
  });
}

// Lettura carattere per carattere in "raw mode": il terminale mostra solo asterischi.
function chiediNascosto(domanda) {
  return new Promise((resolve) => {
    const { stdin, stdout } = process;
    stdout.write(domanda);
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");
    stdin.resume();
    let valore = "";
    const fine = () => {
      stdin.off("data", suDati);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write("\n");
      resolve(valore.trim());
    };
    const suDati = (blocco) => {
      // toglie le sequenze di controllo (frecce, incolla "bracketed" del terminale)
      for (const c of blocco.replace(/\x1b\[[0-9;?]*[~A-Za-z]/g, "")) {
        if (c === "\r" || c === "\n") return fine();
        if (c === "\u0003") { // Ctrl+C
          stdin.setRawMode(false);
          stdout.write("\n");
          process.exit(130);
        }
        if (c === "\u007f" || c === "\b") { // cancella
          if (valore) {
            valore = valore.slice(0, -1);
            stdout.write("\b \b");
          }
        } else if (c >= " ") {
          valore += c;
          stdout.write("*");
        }
      }
    };
    stdin.on("data", suDati);
  });
}

export async function chiamata(base, metodo, percorso, { corpo, token } = {}) {
  const risposta = await fetch(`${base}${percorso}`, {
    method: metodo,
    headers: {
      ...(corpo ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const testo = await risposta.text();
  let dati;
  try {
    dati = JSON.parse(testo);
  } catch {
    dati = testo;
  }
  return { status: risposta.status, dati };
}

export const attendi = (ms) => new Promise((r) => setTimeout(r, ms));
```

## `backend/scripts/copia-db.js`

```javascript
/*
 * Copia negli appunti la stringa di connessione MONGO_URI del file .env,
 * senza mostrarla sullo schermo (serve per incollarla nel pannello di Render).
 * Uso:  npm run copia-db
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { colore } from "./_cli.js";

const fileEnv = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env");
const uri = fs.existsSync(fileEnv) ? dotenv.parse(fs.readFileSync(fileEnv)).MONGO_URI : undefined;
if (!uri || uri.includes("<") || uri.includes("xxxxx")) {
  console.error(colore.rosso("MONGO_URI mancante nel file .env: esegui prima npm run imposta-db"));
  process.exit(1);
}

const comando = { darwin: ["pbcopy", []], win32: ["clip", []] }[process.platform] ?? ["xclip", ["-selection", "clipboard"]];
const figlio = spawn(comando[0], comando[1], { stdio: ["pipe", "ignore", "ignore"] });
figlio.on("error", () => {
  console.error(colore.rosso("Non riesco a usare gli appunti: apri backend/.env e copia a mano il valore dopo MONGO_URI="));
  process.exit(1);
});
figlio.on("close", (codice) => {
  if (codice !== 0) return;
  console.log(colore.verde("✓ Stringa di connessione copiata negli appunti (non viene mostrata)."));
  console.log("Incollala con Cmd+V nel campo MONGO_URI di Render. Non incollarla in chat.");
});
figlio.stdin.end(uri);
```

## `backend/scripts/crea-admin.js`

```javascript
/*
 * Crea un account (di solito l'amministratore) oppure, se l'email esiste già,
 * ne reimposta la password. La password la scegli tu e non viene mai mostrata.
 * Uso:
 *   npm run crea-admin
 *   npm run crea-admin -- --email mario@boutique.it --nome "Mario Rossi" --ruolo commerciante
 *   npm run crea-admin -- --genera     # genera una password casuale e la mostra UNA volta
 */
import "dotenv/config";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB, spiegaErroreMongo } from "../config/db.js";
import User from "../models/User.js";
import { RUOLI } from "../models/costanti.js";
import { colore, chiedi } from "./_cli.js";

const LUNGHEZZA_MINIMA = 10; // stessa regola della web app
const argomento = (nome) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const esci = async (codice, messaggio) => {
  if (messaggio) console.error(colore.rosso(messaggio));
  await mongoose.disconnect().catch(() => {});
  process.exit(codice);
};

const ruolo = argomento("ruolo") ?? "admin";
if (!RUOLI.includes(ruolo)) await esci(1, `Ruolo non valido. Ruoli ammessi: ${RUOLI.join(", ")}`);

try {
  await connectDB();
} catch (err) {
  await esci(1, `Database non raggiungibile: ${spiegaErroreMongo(err)}`);
}

const email = (argomento("email") ?? (await chiedi("Email: "))).trim().toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) await esci(1, "Email non valida.");

const esistente = await User.findOne({ email });
if (esistente) {
  const risposta = await chiedi(`Esiste già l'account ${email} (${esistente.ruolo}). Vuoi reimpostarne la password? (s/n) `);
  if (!/^s/i.test(risposta)) await esci(0);
}
const nome = esistente ? esistente.nome : (argomento("nome") ?? (await chiedi("Nome e cognome: "))).trim();
if (!nome) await esci(1, "Il nome è obbligatorio.");

let password = argomento("password");
const generata = !password && process.argv.includes("--genera");
if (generata) password = crypto.randomBytes(12).toString("base64url");
for (let tentativo = 0; !password && tentativo < 3; tentativo++) {
  const prima = await chiedi(`Scegli la password dell'account (almeno ${LUNGHEZZA_MINIMA} caratteri, non verrà mostrata): `, { nascosto: true });
  if (prima.length < LUNGHEZZA_MINIMA) {
    console.log(colore.giallo(`Troppo corta: servono almeno ${LUNGHEZZA_MINIMA} caratteri.`));
    continue;
  }
  const seconda = await chiedi("Ripetila: ", { nascosto: true });
  if (prima !== seconda) {
    console.log(colore.giallo("Le due password non coincidono, riprova."));
    continue;
  }
  password = prima;
}
if (!password || password.length < LUNGHEZZA_MINIMA) await esci(1, "Nessuna password valida: account non modificato.");

const passwordHash = await bcrypt.hash(password, 12);
if (esistente) {
  esistente.passwordHash = passwordHash;
  await esistente.save();
  console.log(colore.verde(`\n✓ Password reimpostata per ${email} (ruolo: ${esistente.ruolo})`));
  if (!esistente.attivo) console.log(colore.giallo("Attenzione: l'account è disattivato (riattivalo dalla pagina Utenti)."));
} else {
  await User.create({ nome, email, ruolo, passwordHash });
  console.log(colore.verde(`\n✓ Account creato: ${email} (ruolo: ${ruolo})`));
}
if (generata) console.log(`Password generata: ${password}\nConservala ora: non verrà mostrata di nuovo.`);
console.log("Usa questa email e questa password per accedere alla web app e per npm run passaggi.\n");
await mongoose.disconnect();
```

## `backend/scripts/imposta-db.js`

```javascript
/*
 * Inserisce la password del database user di Atlas nel file .env (riga MONGO_URI)
 * e prova subito la connessione. La password non viene mai mostrata sullo schermo.
 * Uso:  npm run imposta-db
 * Se MONGO_URI manca o è ancora quella di esempio, chiede prima la stringa di
 * connessione di Atlas (Connect → Drivers).
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { colore, chiedi } from "./_cli.js";
import { spiegaErroreMongo } from "../config/db.js";

const cartella = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const fileEnv = process.env.IMPOSTA_DB_FILE ?? path.join(cartella, ".env"); // variabile usata solo dai test
const togliVirgolette = (s) => s.trim().replace(/^["'<]+|["'>]+$/g, "");

// mongodb+srv://utente:password@host/database?parametri  →  parti utili (senza password)
function analizza(testo) {
  const m = /^mongodb\+srv:\/\/([^:@/]+)(?::.*)?@([^@/?]+)(?:\/([^?]*))?(?:\?(.*))?$/.exec(togliVirgolette(testo));
  if (!m || m[1].includes("<") || m[2].includes("xxxxx")) return null;
  const parametri = new URLSearchParams(m[4] ?? "");
  if (!parametri.has("retryWrites")) parametri.set("retryWrites", "true");
  if (!parametri.has("w")) parametri.set("w", "majority");
  return { utente: decodeURIComponent(m[1]), host: m[2], database: m[3] || "regen_luxury", parametri: parametri.toString() };
}

if (!fs.existsSync(fileEnv)) {
  fs.copyFileSync(path.join(cartella, ".env.example"), fileEnv);
  console.log(colore.giallo("File .env creato copiando .env.example"));
}
const righe = fs.readFileSync(fileEnv, "utf8").split("\n");
const indice = righe.findIndex((r) => /^\s*MONGO_URI\s*=/.test(r));

let parti = indice >= 0 ? analizza(righe[indice].replace(/^\s*MONGO_URI\s*=\s*/, "")) : null;
if (!parti) {
  console.log("Incolla la stringa di connessione di Atlas (Connect → Drivers): non verrà mostrata.");
  parti = analizza(await chiedi("Stringa di connessione: ", { nascosto: true }));
  if (!parti) {
    console.error(colore.rosso("Stringa non valida: deve iniziare con mongodb+srv:// e contenere l'indirizzo del cluster."));
    process.exit(1);
  }
}

console.log(`Utente del database: ${parti.utente}   Cluster: ${parti.host}   Database: ${parti.database}`);
const password = togliVirgolette(await chiedi("Password del database user (quella di Atlas, NON quella dell'admin): ", { nascosto: true }));
if (!password) {
  console.error(colore.rosso("Password vuota: il file .env non è stato modificato."));
  process.exit(1);
}

const uri = `mongodb+srv://${encodeURIComponent(parti.utente)}:${encodeURIComponent(password)}@${parti.host}/${parti.database}?${parti.parametri}`;
const nuovaRiga = `MONGO_URI=${uri}`;
if (indice >= 0) righe[indice] = nuovaRiga;
else righe.unshift(nuovaRiga);
// JWT_SECRET vuoto: se ne genera uno casuale (firma i login; non va mai condiviso)
const indiceJwt = righe.findIndex((r) => /^\s*JWT_SECRET\s*=/.test(r));
const jwtVuoto = indiceJwt < 0 || /^\s*JWT_SECRET\s*=\s*$/.test(righe[indiceJwt]);
if (jwtVuoto) {
  const rigaJwt = `JWT_SECRET=${crypto.randomBytes(48).toString("base64url")}`;
  if (indiceJwt >= 0) righe[indiceJwt] = rigaJwt;
  else righe.push(rigaJwt);
}
fs.writeFileSync(fileEnv, righe.join("\n"));
console.log(colore.verde("✓ Password salvata nel file .env"));
if (jwtVuoto) console.log(colore.verde("✓ Generato anche JWT_SECRET (serve a firmare i login)"));

console.log("Provo la connessione ad Atlas…");
try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  await mongoose.connection.db.command({ ping: 1 });
  console.log(colore.verde(`✓ Connessione riuscita. Ora puoi avviare il server con: npm run dev`));
} catch (err) {
  console.error(colore.rosso(`✗ Connessione non riuscita: ${spiegaErroreMongo(err)}`));
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}
```

## `backend/scripts/migra-ancoraggi.js`

```javascript
/*
 * Ancora sulla blockchain i dati non ancora confermati: i capi creati con la
 * prima versione del backend (es. il capo Gucci NFC-001) e le eventuali
 * transazioni fallite. Si può rilanciare senza rischi: salta ciò che è già confermato.
 * Uso: npm run migra
 */
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Item from "../models/Item.js";
import { ancoraArretrati, attendiAncoraggi } from "../services/anchorService.js";
import { verificaIntegrita } from "../services/integrityService.js";

await connectDB();
const capi = await Item.find();
console.log(`Capi nel database: ${capi.length}`);

let operazioni = 0;
for (const item of capi) operazioni += await ancoraArretrati(item);
await attendiAncoraggi();
console.log(`Operazioni di ancoraggio eseguite: ${operazioni}\n`);

for (const item of await Item.find()) {
  const esito = await verificaIntegrita(item);
  console.log(`${item.tagId.padEnd(16)} ${esito.stato.padEnd(14)} ${esito.messaggio}`);
}
await mongoose.disconnect();
```

## `backend/scripts/misura-tempi.js`

```javascript
/*
 * Requisito P: il recupero dei dati del capo alla scansione deve richiedere meno di 2 secondi.
 * Misura il tempo di risposta della verifica pubblica su N richieste.
 * Uso: npm run misura-tempi -- --tag NFC-001 --n 50
 * (il limite predefinito è 120 verifiche al minuto per IP: non superare --n 100)
 */
import "dotenv/config";
import { colore } from "./_cli.js";

const argomento = (nome, predefinito) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > -1 ? process.argv[i + 1] : predefinito;
};
const BASE = argomento("base", `http://localhost:${process.env.PORT ?? 5001}/api`);
const TAG = argomento("tag", "NFC-001");
const N = Number(argomento("n", 50));

const tempi = [];
for (let i = 0; i < N; i++) {
  const inizio = performance.now();
  const r = await fetch(`${BASE}/verify/${TAG}`);
  await r.arrayBuffer();
  if (!r.ok) {
    console.error(colore.rosso(`Richiesta ${i + 1}: HTTP ${r.status}`));
    process.exit(1);
  }
  tempi.push(performance.now() - inizio);
}
tempi.sort((a, b) => a - b);
const media = tempi.reduce((a, b) => a + b, 0) / tempi.length;
const p95 = tempi[Math.ceil(0.95 * tempi.length) - 1];
console.log(`Richieste: ${N} su ${BASE}/verify/${TAG}`);
console.log(`Media: ${media.toFixed(1)} ms | Min: ${tempi[0].toFixed(1)} ms | Max: ${tempi.at(-1).toFixed(1)} ms | 95° percentile: ${p95.toFixed(1)} ms`);
console.log(tempi.at(-1) < 2000 ? colore.verde("Requisito P rispettato (tutte le risposte < 2000 ms)") : colore.rosso("Almeno una risposta ha superato i 2000 ms"));
```

## `backend/scripts/passaggi.js`

```javascript
/*
 * PASSAGGI 1-8 — test delle API in Node (funziona su Mac, Windows e Linux).
 * Il server deve essere avviato (npm run dev) in un altro terminale.
 *
 * Uso:
 *   npm run passaggi                    # tutti i passaggi
 *   npm run passaggi -- --passaggio 7   # solo il passaggio 7
 * Credenziali: chieste all'avvio, oppure variabili PASSAGGI_EMAIL e PASSAGGI_PASSWORD.
 * Altre opzioni: --base http://localhost:5001/api  --tag NFC-001
 */
import "dotenv/config";
import { colore, chiedi, chiamata, attendi } from "./_cli.js";

const argomento = (nome, predefinito) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > -1 ? process.argv[i + 1] : predefinito;
};
const BASE = argomento("base", `http://localhost:${process.env.PORT ?? 5001}/api`);
const TAG = argomento("tag", "NFC-001");
const SOLO = Number(argomento("passaggio", 0));

let falliti = 0;
let token;
const titolo = (n, t) => console.log(colore.ciano(`\n=== PASSAGGIO ${n} - ${t} ===`));
const verifica = (ok, messaggio) => {
  console.log(ok ? colore.verde(`  [OK]   ${messaggio}`) : colore.rosso(`  [FAIL] ${messaggio}`));
  if (!ok) falliti++;
};
const api = (metodo, percorso, corpo) => chiamata(BASE, metodo, percorso, { corpo, token });

async function idDelCapo() {
  const r = await api("GET", `/items/tag/${TAG}`);
  if (r.status !== 200) throw new Error(`Nessun capo con tagId ${TAG}: esegui prima il passaggio 2`);
  return r.dati._id;
}

async function attendiConferme(tentativi = 20) {
  for (let i = 0; i < tentativi; i++) {
    const r = await api("GET", `/verify/${TAG}`);
    if (r.status === 200 && r.dati.certificatoAutenticita.integrita.stato !== "in_attesa") return r;
    await attendi(500);
  }
  return api("GET", `/verify/${TAG}`);
}

const passaggi = {
  async 1() {
    titolo(1, "Health check del server");
    const r = await api("GET", "/health");
    verifica(r.status === 200 && r.dati.stato === "online", `Server attivo (blockchain: ${r.dati?.blockchain})`);
  },

  async 2() {
    titolo(2, `Creazione identità digitale del capo + associazione tag ${TAG}`);
    const esistente = await api("GET", `/items/tag/${TAG}`);
    if (esistente.status === 200) {
      console.log(colore.giallo(`  [INFO] Il capo con ${TAG} esiste già (id ${esistente.dati._id}): creazione saltata`));
      return;
    }
    const r = await api("POST", "/items", {
      brand: "Gucci",
      codiceModello: "GG-2024",
      materialiOriginari: "Pelle e cotone",
      filieraProvenienza: "Italia",
      categoria: "giacca",
      tagId: TAG,
    });
    verifica(r.status === 201, `Capo creato (HTTP ${r.status}) id ${r.dati?._id}`);
    verifica(r.dati?.registrazione?.stato === "in_attesa", "Registrazione sulla blockchain avviata in modo asincrono");
  },

  async 3() {
    titolo(3, "Registrazione evento di rigenerazione");
    const id = await idDelCapo();
    const r = await api("POST", `/items/${id}/eventi`, {
      tipo: "upcycling",
      descrizione: "Rifoderatura interna e sostituzione bottoni",
      materialiNuovi: "Cotone riciclato certificato",
      operatore: "Laboratorio Bari",
    });
    verifica(r.status === 200, `Evento registrato (HTTP ${r.status}), eventi totali: ${r.dati?.storicoRigenerazione?.length}`);
  },

  async 4() {
    titolo(4, "Lettura del singolo capo per ID");
    const id = await idDelCapo();
    const r = await api("GET", `/items/${id}`);
    verifica(r.status === 200 && r.dati.tagId === TAG, `Dettaglio letto: ${r.dati?.brand} ${r.dati?.codiceModello}`);
  },

  async 5() {
    titolo(5, "Passaggio di proprietà (catena di possesso)");
    const id = await idDelCapo();
    const r = await api("POST", `/items/${id}/proprieta`, { proprietario: "Maria Rossi" });
    verifica(r.status === 200, `Passaggio registrato, catena di ${r.dati?.passaggiProprieta?.length} proprietari`);
  },

  async 6() {
    titolo(6, "Verifica pubblica (scansione del consumatore, senza login)");
    const r = await chiamata(BASE, "GET", `/verify/${TAG}`);
    verifica(r.status === 200, `Certificato ricevuto (HTTP ${r.status})`);
    const nomi = (r.dati?.capo?.passaggiProprieta ?? []).map((p) => p.proprietario).join(" -> ");
    verifica(!/Rossi/.test(JSON.stringify(r.dati)), `Nomi dei proprietari minimizzati (GDPR): ${nomi || "nessuno"}`);
  },

  async 7() {
    titolo(7, `Anti-replay: rifiuto di un secondo capo con lo stesso tag ${TAG}`);
    const r = await api("POST", "/items", { brand: "Prada", codiceModello: "PR-999", materialiOriginari: "Nylon", tagId: TAG });
    verifica(r.status === 409, `Tag duplicato rifiutato: HTTP ${r.status} (atteso 409) - ${r.dati?.errore}`);
    const falso = await chiamata(BASE, "GET", "/verify/TAG-INESISTENTE-999");
    verifica(falso.status === 404 && falso.dati.autentico === false, `Tag mai registrato: HTTP ${falso.status}, autentico = ${falso.dati?.autentico}`);
    const senzaLogin = await chiamata(BASE, "POST", "/items", { corpo: { brand: "X", codiceModello: "Y", materialiOriginari: "Z", tagId: "NFC-XYZ" } });
    verifica(senzaLogin.status === 401, `Creazione senza login rifiutata: HTTP ${senzaLogin.status} (atteso 401)`);
  },

  async 8() {
    titolo(8, "Verifica finale completa dei dati (dopo gli ancoraggi asincroni)");
    const r = await attendiConferme();
    const c = r.dati?.certificatoAutenticita;
    const integrita = c?.integrita;
    verifica(r.status === 200 && c?.autentico === true, `autentico = ${c?.autentico}`);
    verifica(integrita?.stato === "verificato", `integrità = ${integrita?.stato} (${integrita?.messaggio})`);
    if (["incompleto", "non_registrato"].includes(integrita?.stato)) {
      console.log(colore.giallo("  [INFO] Dati creati con la versione precedente: esegui 'npm run migra' e ripeti il passaggio 8"));
    }
    verifica((r.dati?.capo?.storicoRigenerazione?.length ?? 0) >= 1, `Eventi di rigenerazione: ${r.dati?.capo?.storicoRigenerazione?.length}`);
    verifica((r.dati?.capo?.passaggiProprieta?.length ?? 0) >= 1, `Passaggi di proprietà: ${r.dati?.capo?.passaggiProprieta?.length}`);
    const voci = integrita?.voci;
    if (voci) console.log(`  Voci verificate on-chain: ${voci.verificate}, in attesa: ${voci.inAttesa}, non ancorate: ${voci.nonAncorate}`);
    const imp = r.dati?.impattoAmbientale;
    console.log(`  Impatto ambientale: ${imp?.disponibile ? `${imp.co2RisparmiataKg} kg CO2e, ${imp.acquaPreservataLitri} L` : imp?.nota}`);
  },
};

try {
  const email = process.env.PASSAGGI_EMAIL ?? (await chiedi("Email (account del backend): "));
  const password = process.env.PASSAGGI_PASSWORD ?? (await chiedi("Password: ", { nascosto: true }));
  const accesso = await chiamata(BASE, "POST", "/auth/login", { corpo: { email, password } });
  if (accesso.status !== 200) throw new Error(`Login fallito (HTTP ${accesso.status}): ${accesso.dati?.errore}`);
  token = accesso.dati.token;
  console.log(colore.verde(`Accesso effettuato come ${accesso.dati.utente.nome} (${accesso.dati.utente.ruolo})`));

  for (const n of SOLO ? [SOLO] : [1, 2, 3, 4, 5, 6, 7, 8]) {
    try {
      await passaggi[n]();
    } catch (err) {
      verifica(false, err.message);
    }
  }
} catch (err) {
  console.error(colore.rosso(err.cause?.code === "ECONNREFUSED" ? `Server non raggiungibile su ${BASE}: hai avviato "npm run dev"?` : err.message));
  process.exit(1);
}
console.log(falliti === 0 ? colore.verde("\nTUTTI I CONTROLLI SUPERATI") : colore.rosso(`\nCONTROLLI FALLITI: ${falliti}`));
process.exit(falliti === 0 ? 0 : 1);
```

## `backend/scripts/passaggi.ps1`

```powershell
<#
  passaggi.ps1 - Passaggi 1-8 in PowerShell (per il PC Windows), dalla cartella backend.
  Stessi controlli di "npm run passaggi" (versione Node, consigliata anche su Windows).

  Uso (server avviato con "npm run dev"):
    Set-ExecutionPolicy -Scope Process Bypass
    .\scripts\passaggi.ps1 -Email admin@esempio.it
    .\scripts\passaggi.ps1 -Email admin@esempio.it -Passaggio 7
#>
param(
    [Parameter(Mandatory = $true)][string]$Email,
    [int]$Passaggio = 0,
    [string]$BaseUrl = "http://localhost:5001/api",
    [string]$TagId = "NFC-001",
    [string]$Password = ""   # se vuoto viene chiesta in modo nascosto
)

$ErrorActionPreference = "Stop"
$script:Falliti = 0
$script:Token = $null

function Invoke-Api {
    param([string]$Method, [string]$Path, $Body = $null, [switch]$Anonimo)
    $params = @{ Method = $Method; Uri = "$BaseUrl$Path"; ContentType = "application/json; charset=utf-8" }
    if ($script:Token -and -not $Anonimo) { $params.Headers = @{ Authorization = "Bearer $($script:Token)" } }
    if ($null -ne $Body) { $params.Body = [System.Text.Encoding]::UTF8.GetBytes(($Body | ConvertTo-Json -Depth 10)) }
    Invoke-RestMethod @params
}

function Get-StatusCode($ErrorRecord) {
    try { return [int]$ErrorRecord.Exception.Response.StatusCode.value__ } catch { return $null }
}

function Titolo([int]$n, [string]$testo) { Write-Host ""; Write-Host ("=== PASSAGGIO {0} - {1} ===" -f $n, $testo) -ForegroundColor Cyan }

function Verifica([bool]$condizione, [string]$messaggio) {
    if ($condizione) { Write-Host "  [OK]   $messaggio" -ForegroundColor Green }
    else { Write-Host "  [FAIL] $messaggio" -ForegroundColor Red; $script:Falliti++ }
}

function Get-IdCapo { (Invoke-Api GET "/items/tag/$TagId")._id }

function Passaggio1 {
    Titolo 1 "Health check del server"
    $r = Invoke-Api GET "/health"
    Verifica ($r.stato -eq "online") "Server attivo (blockchain: $($r.blockchain))"
}

function Passaggio2 {
    Titolo 2 "Creazione identita digitale del capo + associazione tag $TagId"
    try { $esistente = Invoke-Api GET "/items/tag/$TagId" } catch { $esistente = $null }
    if ($esistente) { Write-Host "  [INFO] Il capo con $TagId esiste gia: creazione saltata" -ForegroundColor Yellow; return }
    $body = @{ brand = "Gucci"; codiceModello = "GG-2024"; materialiOriginari = "Pelle e cotone"; filieraProvenienza = "Italia"; categoria = "giacca"; tagId = $TagId }
    $r = Invoke-Api POST "/items" $body
    Verifica ($r.tagId -eq $TagId) "Capo creato: id $($r._id)"
}

function Passaggio3 {
    Titolo 3 "Registrazione evento di rigenerazione"
    $body = @{ tipo = "upcycling"; descrizione = "Rifoderatura interna e sostituzione bottoni"; materialiNuovi = "Cotone riciclato certificato"; operatore = "Laboratorio Bari" }
    $r = Invoke-Api POST "/items/$(Get-IdCapo)/eventi" $body
    Verifica (@($r.storicoRigenerazione).Count -ge 1) "Evento registrato, eventi totali: $(@($r.storicoRigenerazione).Count)"
}

function Passaggio4 {
    Titolo 4 "Lettura del singolo capo per ID"
    $r = Invoke-Api GET "/items/$(Get-IdCapo)"
    Verifica ($r.tagId -eq $TagId) "Dettaglio letto: $($r.brand) $($r.codiceModello)"
}

function Passaggio5 {
    Titolo 5 "Passaggio di proprieta"
    $r = Invoke-Api POST "/items/$(Get-IdCapo)/proprieta" @{ proprietario = "Maria Rossi" }
    Verifica (@($r.passaggiProprieta).Count -ge 1) "Catena di $(@($r.passaggiProprieta).Count) proprietari"
}

function Passaggio6 {
    Titolo 6 "Verifica pubblica (senza login)"
    $r = Invoke-Api GET "/verify/$TagId" -Anonimo
    Verifica ($null -ne $r.certificatoAutenticita) "Certificato ricevuto"
    $nomi = (@($r.capo.passaggiProprieta) | ForEach-Object proprietario) -join " -> "
    Verifica (-not (($r | ConvertTo-Json -Depth 10) -match "Rossi")) "Nomi minimizzati (GDPR): $nomi"
}

function Passaggio7 {
    Titolo 7 "Anti-replay: rifiuto del tag duplicato $TagId"
    $codice = $null
    try { Invoke-Api POST "/items" @{ brand = "Prada"; codiceModello = "PR-999"; materialiOriginari = "Nylon"; tagId = $TagId } | Out-Null } catch { $codice = Get-StatusCode $_ }
    Verifica ($codice -eq 409) "Tag duplicato rifiutato: HTTP $codice (atteso 409)"
    $codice = $null
    try { Invoke-Api GET "/verify/TAG-INESISTENTE-999" -Anonimo | Out-Null } catch { $codice = Get-StatusCode $_ }
    Verifica ($codice -eq 404) "Tag mai registrato: HTTP $codice (atteso 404)"
    $codice = $null
    try { Invoke-Api POST "/items" @{ brand = "X"; codiceModello = "Y"; materialiOriginari = "Z"; tagId = "NFC-XYZ" } -Anonimo | Out-Null } catch { $codice = Get-StatusCode $_ }
    Verifica ($codice -eq 401) "Creazione senza login rifiutata: HTTP $codice (atteso 401)"
}

function Passaggio8 {
    Titolo 8 "Verifica finale completa dei dati"
    for ($i = 0; $i -lt 20; $i++) {
        $r = Invoke-Api GET "/verify/$TagId" -Anonimo
        if ($r.certificatoAutenticita.integrita.stato -ne "in_attesa") { break }
        Start-Sleep -Milliseconds 500
    }
    $c = $r.certificatoAutenticita
    Verifica ($c.autentico -eq $true) "autentico = $($c.autentico)"
    Verifica ($c.integrita.stato -eq "verificato") "integrita = $($c.integrita.stato) ($($c.integrita.messaggio))"
    if ($c.integrita.stato -in @("incompleto", "non_registrato")) { Write-Host "  [INFO] Esegui 'npm run migra' e ripeti il passaggio 8" -ForegroundColor Yellow }
    Verifica (@($r.capo.storicoRigenerazione).Count -ge 1) "Eventi di rigenerazione: $(@($r.capo.storicoRigenerazione).Count)"
    Verifica (@($r.capo.passaggiProprieta).Count -ge 1) "Passaggi di proprieta: $(@($r.capo.passaggiProprieta).Count)"
}

if ($Password) { $password = $Password } else {
    $sicura = Read-Host "Password per $Email" -AsSecureString
    $password = [System.Net.NetworkCredential]::new("", $sicura).Password
}
try {
    $login = Invoke-Api POST "/auth/login" @{ email = $Email; password = $password } -Anonimo
    $script:Token = $login.token
    Write-Host "Accesso effettuato come $($login.utente.nome) ($($login.utente.ruolo))" -ForegroundColor Green
} catch {
    Write-Host "Login fallito: HTTP $(Get-StatusCode $_)" -ForegroundColor Red; exit 1
}

$daEseguire = if ($Passaggio -gt 0) { @($Passaggio) } else { 1..8 }
foreach ($n in $daEseguire) {
    try { & "Passaggio$n" } catch { Write-Host "  [ERRORE] $($_.Exception.Message)" -ForegroundColor Red; $script:Falliti++ }
}
Write-Host ""
if ($script:Falliti -eq 0) { Write-Host "TUTTI I CONTROLLI SUPERATI" -ForegroundColor Green } else { Write-Host "CONTROLLI FALLITI: $script:Falliti" -ForegroundColor Red; exit 1 }
```

## `backend/scripts/popola-demo.js`

```javascript
/*
 * CAPI DIMOSTRATIVI — per provare la piattaforma (sul Mac o sul sito online: stesso database).
 * Uso:  npm run popola-demo                       (dalla cartella principale o da backend/)
 *       npm run popola-demo -- --email tua@email.it
 * I capi vengono creati con le stesse API della web app (validazione, ancoraggio
 * sulla blockchain simulata, controllo di integrità) a nome del primo amministratore
 * attivo. I capi già presenti vengono saltati: lo script si può rilanciare.
 * DEMO-MANOMESSO viene poi alterato direttamente nel database, come farebbe chi
 * volesse falsificare lo storico: la verifica pubblica deve segnalarlo.
 * Il chip NFC di prova (vettore ufficiale NXP AN12196) viene associato a DEMO-BORSA-01:
 * il suo link vale UNA volta (anti-replay); rilanciando lo script il contatore si azzera.
 * I marchi sono inventati: nessun riferimento a brand reali.
 */
import "dotenv/config";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB, spiegaErroreMongo } from "../config/db.js";
import { jwtSecret } from "../config/security.js";
import { creaApp } from "../app.js";
import { attendiAncoraggi } from "../services/anchorService.js";
import User from "../models/User.js";
import Item from "../models/Item.js";
import { colore, chiamata } from "./_cli.js";

// Con la blockchain simulata si usa il registro condiviso con il sito online (collezione del database)
if ((process.env.BLOCKCHAIN_MODE ?? "mock") === "mock") process.env.MOCK_LEDGER_STORE = "mongo";

const argomento = (nome) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const SITO = (process.env.SITO_PUBBLICO ?? "https://regen-luxury.onrender.com").replace(/\/+$/, "");

const CAPI = [
  {
    capo: {
      tagId: "DEMO-JEANS-01",
      brand: "Atelier Moretti",
      codiceModello: "Jeans cinque tasche MR-501",
      materialiOriginari: "Denim di cotone 100%",
      filieraProvenienza: "Italia (Puglia)",
      categoria: "jeans",
      materialePrincipale: "denim",
      annoProduzione: 2019,
      proprietarioIniziale: "Boutique Vintage Bari",
    },
    eventi: [
      { tipo: "riparazione", descrizione: "Rammendo invisibile al ginocchio e rinforzo delle tasche posteriori", materialiNuovi: "Filato di cotone riciclato", operatore: "Sartoria Bari Vecchia" },
      { tipo: "upcycling", descrizione: "Orlo accorciato e bottoni sostituiti con bottoni in ottone di recupero", materialiNuovi: "Ottone recuperato", operatore: "Laboratorio Rinascita" },
    ],
    proprietari: ["Giulia Conti"],
  },
  {
    capo: {
      tagId: "DEMO-TSHIRT-01",
      brand: "Casa Vellani",
      codiceModello: "T-shirt girocollo CV-12",
      materialiOriginari: "Jersey di cotone biologico",
      filieraProvenienza: "Italia (Toscana)",
      categoria: "t-shirt",
      materialePrincipale: "cotone",
      annoProduzione: 2021,
    },
    eventi: [{ tipo: "sostituzione_parti", descrizione: "Colletto sostituito con una costina nuova", materialiNuovi: "Costina in cotone biologico", operatore: "Sartoria Bari Vecchia" }],
    proprietari: ["Marco Esposito"],
  },
  {
    capo: {
      tagId: "DEMO-BORSA-01",
      brand: "Maison Aurelia",
      codiceModello: "Borsa a mano AU-Bauletto",
      materialiOriginari: "Pelle di vitello conciata al vegetale, fodera in cotone",
      filieraProvenienza: "Italia (Firenze)",
      categoria: "borsa",
      materialePrincipale: "pelle",
      annoProduzione: 2015,
      proprietarioIniziale: "Second Hand Luxury Milano",
    },
    eventi: [
      { tipo: "sostituzione_parti", descrizione: "Nuova tracolla in pelle e moschettoni in ottone", materialiNuovi: "Pelle conciata al vegetale, ottone", operatore: "Pelletteria Artigiana Lecce" },
      { tipo: "riparazione", descrizione: "Ritocco del colore sugli angoli e fodera interna rifatta", materialiNuovi: "Tinture all'acqua, cotone", operatore: "Pelletteria Artigiana Lecce" },
    ],
    proprietari: ["Laura Ricci", "Francesca De Santis"],
  },
  {
    capo: {
      tagId: "DEMO-CAPPOTTO-01",
      brand: "Sartoria Levante",
      codiceModello: "Cappotto doppiopetto SL-1998",
      materialiOriginari: "Lana vergine e cashmere",
      filieraProvenienza: "Italia (Biella)",
      categoria: "cappotto",
      materialePrincipale: "lana",
      annoProduzione: 1998,
    },
    eventi: [{ tipo: "upcycling", descrizione: "Trasformato da cappotto lungo a giacca corta; fodera rifatta", materialiNuovi: "Fodera in viscosa", operatore: "Laboratorio Rinascita" }],
    proprietari: [],
  },
  {
    capo: {
      tagId: "DEMO-MANOMESSO",
      brand: "Maison Aurelia",
      codiceModello: "Giacca in pelle AU-Biker",
      materialiOriginari: "Pelle di agnello, fodera in viscosa",
      filieraProvenienza: "Italia (Firenze)",
      categoria: "giacca",
      materialePrincipale: "pelle",
      annoProduzione: 2017,
    },
    eventi: [{ tipo: "riparazione", descrizione: "Sostituzione della zip centrale", materialiNuovi: "Zip in metallo", operatore: "Pelletteria Artigiana Lecce" }],
    proprietari: ["Paolo Bianchi"],
    manomissione: "Pelle interamente sostituita con pelle nuova certificata (intervento mai registrato)",
  },
];
const TAG_FALSO = "DEMO-FALSO-99"; // non esiste: simula un capo contraffatto

// Chip NTAG 424 DNA di prova: messaggio SUN del documento NXP AN12196 (chiavi di fabbrica, contatore 61)
const CHIP_DEMO = { tagId: "DEMO-BORSA-01", uid: "04DE5F1EACC040", e: "EF963FF7828658A599F3041510671E88", c: "94EED9EE65337086" };

const RISULTATI = {
  verificato: colore.verde("Autentico"),
  manomesso: colore.rosso("Manomesso"),
  in_attesa: colore.giallo("In registrazione"),
  incompleto: colore.giallo("Non conclusiva"),
  non_registrato: colore.rosso("Non registrato"),
};

try {
  await connectDB();
} catch (err) {
  console.error(colore.rosso(`Database non raggiungibile: ${spiegaErroreMongo(err)}`));
  process.exit(1);
}

const email = argomento("email")?.trim().toLowerCase();
const autore = await User.findOne(email ? { email } : { ruolo: "admin", attivo: true }).sort({ createdAt: 1 });
if (!autore) {
  console.error(colore.rosso(email ? `Nessun account con email ${email}.` : "Nessun amministratore: crealo prima con npm run crea-admin"));
  await mongoose.disconnect();
  process.exit(1);
}
console.log(`Capi creati a nome di ${autore.nome} (${autore.ruolo})`);

// Stesse API della web app, su un server temporaneo in questo processo
const server = creaApp().listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const base = `http://127.0.0.1:${server.address().port}/api`;
const token = jwt.sign({ sub: String(autore._id), ruolo: autore.ruolo }, jwtSecret(), { expiresIn: "15m" });
const api = async (metodo, percorso, corpo) => {
  const r = await chiamata(base, metodo, percorso, { corpo, token });
  if (r.status >= 400 && !(metodo === "GET" && r.status === 404)) {
    throw new Error(`${metodo} ${percorso}: HTTP ${r.status} ${r.dati?.errore ?? ""}`);
  }
  return r;
};

let errori = 0;
const creati = new Set();
for (const { capo, eventi, proprietari } of CAPI) {
  try {
    if ((await api("GET", `/items/tag/${capo.tagId}`)).status === 200) {
      console.log(colore.giallo(`  = ${capo.tagId} esiste già: saltato`));
      continue;
    }
    const { dati } = await api("POST", "/items", capo);
    for (const evento of eventi) await api("POST", `/items/${dati._id}/eventi`, evento);
    for (const proprietario of proprietari) await api("POST", `/items/${dati._id}/proprieta`, { proprietario });
    creati.add(capo.tagId);
    console.log(colore.verde(`  + ${capo.tagId} creato (${capo.brand}, ${eventi.length} ${eventi.length === 1 ? "intervento" : "interventi"})`));
  } catch (err) {
    errori++;
    console.error(colore.rosso(`  ✗ ${capo.tagId}: ${err.message}`));
  }
}

console.log("Attendo le conferme della blockchain…");
await attendiAncoraggi();

// Chip NFC di prova: associato una volta sola; il contatore anti-replay viene azzerato a ogni esecuzione
let linkNfc = null;
try {
  const altro = await Item.findOne({ "nfc.uid": CHIP_DEMO.uid }).lean();
  const borsa = await Item.findOne({ tagId: CHIP_DEMO.tagId }).lean();
  if (altro && altro.tagId !== CHIP_DEMO.tagId) {
    console.log(colore.giallo(`  = chip NFC di prova già associato a ${altro.tagId}: lasciato com'è`));
  } else if (borsa) {
    if (!altro) await api("POST", `/items/${borsa._id}/nfc`, { uid: CHIP_DEMO.uid });
    await Item.updateOne({ _id: borsa._id }, { $set: { "nfc.ultimoContatore": null }, $unset: { "nfc.ultimaLettura": "" } });
    linkNfc = `${SITO}/s?e=${CHIP_DEMO.e}&c=${CHIP_DEMO.c}`;
    console.log(colore.verde(`  + chip NFC di prova pronto su ${CHIP_DEMO.tagId} (link valido una volta)`));
  }
} catch (err) {
  errori++;
  console.error(colore.rosso(`  ✗ chip NFC di prova: ${err.message}`));
}

// Manomissione simulata: modifica diretta nel database, senza passare dalle API
for (const { capo, manomissione } of CAPI) {
  if (!manomissione || !creati.has(capo.tagId)) continue;
  const item = await Item.findOne({ tagId: capo.tagId });
  item.storicoRigenerazione[0].descrizione = manomissione;
  await item.save();
  console.log(colore.giallo(`  ! ${capo.tagId}: storico alterato direttamente nel database (prova di manomissione)`));
}

console.log(`\n${"Codice tag".padEnd(18)} ${"Capo".padEnd(34)} Esito della verifica`);
for (const { capo } of CAPI) {
  const r = await api("GET", `/verify/${capo.tagId}`);
  const stato = r.dati?.certificatoAutenticita?.integrita?.stato;
  const impatto = r.dati?.impattoAmbientale?.disponibile ? ` · ${r.dati.impattoAmbientale.co2RisparmiataKg} kg CO₂e evitati` : "";
  console.log(`${capo.tagId.padEnd(18)} ${`${capo.brand} ${capo.categoria}`.padEnd(34)} ${RISULTATI[stato] ?? stato}${impatto}`);
}
const falso = await api("GET", `/verify/${TAG_FALSO}`);
console.log(`${TAG_FALSO.padEnd(18)} ${"(nessun capo)".padEnd(34)} ${falso.status === 404 ? colore.rosso("Non trovato: possibile contraffazione") : falso.status}`);

console.log(`\nProva sul sito: ${SITO}  →  campo "Hai il codice del tag?"  oppure  ${SITO}/v/DEMO-JEANS-01`);
if (linkNfc) console.log(`Chip NFC di prova (vale una volta, poi "Link già utilizzato"): ${linkNfc}`);
server.close();
await mongoose.disconnect();
process.exit(errori ? 1 : 0);
```

## `backend/server.js`

```javascript
import "dotenv/config"; // carica le variabili d'ambiente dal file .env (deve restare il primo import)
import { connectDB, spiegaErroreMongo } from "./config/db.js";
import { creaApp } from "./app.js";
import { attendiAncoraggi } from "./services/anchorService.js";

const PORT = process.env.PORT || 5001;

// --- Avvio del server dopo la connessione al DB ---
try {
  await connectDB();
  const server = creaApp().listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT} (blockchain: ${process.env.BLOCKCHAIN_MODE ?? "mock"})`);
  });
  server.on("error", (err) => {
    console.error(
      err.code === "EADDRINUSE"
        ? `La porta ${PORT} è già occupata: il server è forse già acceso in un altro terminale (chiudilo), oppure cambia PORT nel file .env.`
        : `Errore del server: ${err.message}`
    );
    process.exit(1);
  });

  // Spegnimento ordinato (Render lo chiede a ogni nuovo deploy o sospensione): si attendono
  // le scritture blockchain in corso, così nessun capo resta "in attesa" per sempre.
  const spegni = async (segnale) => {
    console.log(`${segnale}: chiusura del server, attendo le scritture blockchain in corso…`);
    server.close();
    await Promise.race([attendiAncoraggi(), new Promise((r) => setTimeout(r, 20_000))]);
    process.exit(0);
  };
  process.once("SIGTERM", () => spegni("SIGTERM"));
  process.once("SIGINT", () => spegni("SIGINT"));
} catch (err) {
  console.error("Errore di avvio:", err.message);
  const consiglio = spiegaErroreMongo(err);
  if (consiglio !== err.message) console.error(`→ ${consiglio}`);
  process.exit(1); // interrompe l'avvio se il DB non è raggiungibile
}
```

## `backend/services/anchorService.js`

```javascript
/*
 * ANCORAGGIO SU BLOCKCHAIN (asincrono, requisito P)
 * -------------------------------------------------
 * Le API rispondono subito con stato "in_attesa"; la transazione viene inviata
 * in background e, alla conferma, il documento viene aggiornato a "confermato".
 * Le operazioni di uno stesso capo sono messe in coda e eseguite in ordine:
 * la registrazione precede sempre gli eventi, e l'ultima modifica dei dati è
 * sempre l'ultima impronta scritta on-chain.
 */
import Item from "../models/Item.js";
import { blockchain } from "./blockchain/index.js";
import { improntaCapo, improntaEvento, improntaPassaggio } from "./hashService.js";

const code = new Map(); // itemId -> Promise dell'ultima operazione in coda

function inCoda(itemId, operazione) {
  const chiave = String(itemId);
  const precedente = code.get(chiave) ?? Promise.resolve();
  const prossima = precedente.then(operazione, operazione).catch((err) => {
    console.error(`[ancoraggio] ${chiave}:`, err.message);
  });
  code.set(chiave, prossima);
  prossima.finally(() => {
    if (code.get(chiave) === prossima) code.delete(chiave);
  });
  return prossima;
}

// true se questo server ha una scrittura in corso per il capo (dato in memoria, non falsificabile dal database)
export const inLavorazione = (itemId) => code.has(String(itemId));

// Attende che tutte le operazioni in coda siano concluse (usato da test, script e spegnimento del server)
export async function attendiAncoraggi() {
  while (code.size > 0) await Promise.allSettled([...code.values()]);
}

const confermato = (hash, esito) => ({ stato: "confermato", hash, ...esito, aggiornatoIl: new Date() });
const fallito = (hash, err) => ({ stato: "fallito", hash, errore: err.message, aggiornatoIl: new Date() });

/**
 * Registra (nuovo = true) o aggiorna l'impronta dei dati del capo.
 * L'impronta è calcolata al momento dell'invio, sui dati più recenti.
 */
export function ancoraDatiCapo(itemId, { nuovo = false } = {}) {
  return inCoda(itemId, async () => {
    const chain = await blockchain();
    const item = await Item.findById(itemId);
    if (!item) return;
    const hash = improntaCapo(item);
    let esito;
    try {
      const registro = await chain.leggiRegistro(item.tagId);
      if (nuovo || !registro.registrato) {
        esito = confermato(hash, await chain.registraCapo({ tagId: item.tagId, dataHash: hash }));
      } else if (registro.dataHash !== hash) {
        esito = confermato(hash, await chain.aggiornaDatiCapo({ tagId: item.tagId, dataHash: hash }));
      } else {
        esito = { ...(item.registrazione?.toObject?.() ?? {}), stato: "confermato", hash, aggiornatoIl: new Date() };
      }
    } catch (err) {
      esito = fallito(hash, err);
    }
    const aggiornato = await Item.findById(itemId);
    if (!aggiornato) return;
    // Nel frattempo i dati sono stati modificati di nuovo: la loro scrittura è già in coda,
    // quindi non si segna "confermato" un'impronta ormai superata.
    if (improntaCapo(aggiornato) !== hash && aggiornato.registrazione?.stato === "in_attesa") return;
    aggiornato.registrazione = esito;
    if (esito.stato === "confermato" && !aggiornato.blockchainTxHash) aggiornato.blockchainTxHash = esito.txHash;
    await aggiornato.save();
  });
}

function ancoraVoce(itemId, voceId, { campo, improntaDi, invia }) {
  return inCoda(itemId, async () => {
    const chain = await blockchain();
    const item = await Item.findById(itemId);
    const voce = item?.[campo].id(voceId);
    if (!voce) return;
    const hash = improntaDi(voce);
    let esito;
    try {
      // Già presente on-chain (es. conferma persa per un riavvio): non si scrive due volte,
      // altrimenti il controllo di integrità troverebbe una voce in più sulla blockchain.
      const registro = await chain.leggiRegistro(item.tagId);
      if (registro.storico.includes(hash)) {
        esito = { ...(voce.ancoraggio?.toObject?.() ?? {}), stato: "confermato", hash, errore: undefined, aggiornatoIl: new Date() };
      } else {
        esito = confermato(hash, await invia(chain, { tagId: item.tagId, hash }));
      }
    } catch (err) {
      esito = fallito(hash, err);
    }
    const aggiornato = await Item.findById(itemId);
    const daAggiornare = aggiornato?.[campo].id(voceId);
    if (!daAggiornare) return;
    daAggiornare.ancoraggio = esito;
    await aggiornato.save();
  });
}

export const ancoraEvento = (itemId, eventoId) =>
  ancoraVoce(itemId, eventoId, {
    campo: "storicoRigenerazione",
    improntaDi: improntaEvento,
    invia: (chain, dati) => chain.registraEvento(dati),
  });

export const ancoraPassaggio = (itemId, passaggioId) =>
  ancoraVoce(itemId, passaggioId, {
    campo: "passaggiProprieta",
    improntaDi: improntaPassaggio,
    invia: (chain, dati) => chain.registraPassaggio(dati),
  });

/**
 * Ancora tutto ciò che non è ancora confermato (dati creati con la v1 del
 * backend, oppure transazioni fallite). Usato da "npm run migra".
 */
export async function ancoraArretrati(item) {
  const operazioni = [];
  if (item.registrazione?.stato !== "confermato") operazioni.push(ancoraDatiCapo(item._id));
  for (const e of item.storicoRigenerazione) {
    if (e.ancoraggio?.stato !== "confermato") operazioni.push(ancoraEvento(item._id, e._id));
  }
  for (const p of item.passaggiProprieta) {
    if (p.ancoraggio?.stato !== "confermato") operazioni.push(ancoraPassaggio(item._id, p._id));
  }
  await Promise.all(operazioni);
  return operazioni.length;
}
```

## `backend/services/blockchain/index.js`

```javascript
/*
 * SERVIZIO BLOCKCHAIN — punto di accesso unico.
 * Il resto del backend usa solo queste funzioni, qualunque sia la rete:
 *   registraCapo, aggiornaDatiCapo, registraEvento, registraPassaggio, leggiRegistro
 * BLOCKCHAIN_MODE=mock    -> registro simulato su file (nessun costo, nessun wallet)
 * BLOCKCHAIN_MODE=polygon -> smart contract RegenLuxuryPassport via ethers.js
 * Sostituire la rete non richiede di toccare i controller (requisito S).
 */
let implementazione;

export async function blockchain() {
  if (!implementazione) {
    const modo = process.env.BLOCKCHAIN_MODE ?? "mock";
    const modulo = modo === "polygon" ? await import("./polygon.js") : await import("./mockLedger.js");
    implementazione = modulo.default;
  }
  return implementazione;
}

// Solo per i test: forza una nuova selezione dell'implementazione
export function reimpostaBlockchain() {
  implementazione = undefined;
}
```

## `backend/services/blockchain/mockLedger.js`

```javascript
/*
 * REGISTRO BLOCKCHAIN SIMULATO (mock)
 * -----------------------------------
 * Imita il comportamento dello smart contract RegenLuxuryPassport senza rete,
 * wallet né commissioni: le "transazioni" vengono scritte in un registro
 * append-only. Come sulla blockchain reale:
 *  - un tag può essere registrato una sola volta (anti-clonazione);
 *  - lo storico accetta solo aggiunte (nessuna cancellazione);
 *  - il registro sopravvive ai riavvii.
 * Dove vive il registro (MOCK_LEDGER_STORE):
 *  - "mongo" (predefinito): collezione "registro_simulato" dello stesso cluster.
 *    Serve per la demo online gratuita (su Render i file si cancellano a ogni
 *    riavvio) e per condividere lo stesso registro tra il Mac e il sito online.
 *    È meno indipendente dal database del file: in produzione si usa Polygon;
 *  - "file": file JSON separato dal database (MOCK_LEDGER_FILE), usato dai test.
 */
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import { improntaTag } from "../hashService.js";

const RETE = "mock-polygon";
const file = () => path.resolve(process.env.MOCK_LEDGER_FILE ?? "./data/mock-ledger.json");
const suMongo = () => (process.env.MOCK_LEDGER_STORE || "mongo").toLowerCase() === "mongo";
const latenza = () => Number(process.env.MOCK_CHAIN_LATENCY_MS ?? 300);
const attendi = (ms) => new Promise((r) => setTimeout(r, ms));
const vuoto = () => ({ blocco: 1_000_000, prossimoToken: 1, capi: {} });

async function leggiFile() {
  try {
    return JSON.parse(await fs.readFile(file(), "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return vuoto();
    throw err;
  }
}

// --- Registro su file ---
const archivioFile = {
  leggi: leggiFile,
  async aggiorna(operazione) {
    const stato = await leggiFile();
    operazione(stato);
    const destinazione = file();
    await fs.mkdir(path.dirname(destinazione), { recursive: true });
    const temporaneo = `${destinazione}.${process.pid}.tmp`;
    await fs.writeFile(temporaneo, JSON.stringify(stato, null, 2));
    await fs.rename(temporaneo, destinazione);
    return stato;
  },
};

// --- Registro su MongoDB: un solo documento con numero di versione, così due
// server (es. Mac e Render) non si sovrascrivono le scritture a vicenda ---
const ID = "stato";
const collezione = () => mongoose.connection.db.collection("registro_simulato");

async function salvaConVersione(modifica) {
  for (let tentativo = 0; tentativo < 8; tentativo++) {
    const doc = (await collezione().findOne({ _id: ID })) ?? { _id: ID, versione: 0, ...vuoto(), nuovo: true };
    const { _id, versione, nuovo, ...stato } = doc;
    if (modifica(stato) === false) return stato; // nulla da salvare
    try {
      const esito = await collezione().replaceOne({ _id: ID, versione }, { ...stato, versione: versione + 1 }, { upsert: Boolean(nuovo) });
      if (esito.matchedCount === 1 || esito.upsertedCount === 1) return stato;
    } catch (err) {
      if (err.code !== 11000) throw err; // 11000: un altro server ha creato il documento nello stesso istante
    }
    await attendi(20 + Math.random() * 80);
  }
  throw new Error("Registro simulato occupato: riprova tra poco");
}

// Una volta per avvio: porta nel database i capi del vecchio registro su file (se esiste)
let fileUnito = false;
async function unisciFileLocale() {
  if (fileUnito) return;
  const locale = await leggiFile().catch(() => vuoto());
  const voci = Object.entries(locale.capi ?? {});
  if (voci.length === 0) {
    fileUnito = true;
    return;
  }
  let importati = 0;
  await salvaConVersione((stato) => {
    const mancanti = voci.filter(([chiave]) => !stato.capi[chiave]);
    if (mancanti.length === 0) return false;
    const usati = new Set(Object.values(stato.capi).map((c) => c.tokenId));
    for (const [chiave, voce] of mancanti) {
      const tokenId = usati.has(voce.tokenId) ? Math.max(stato.prossimoToken, ...usati) + 1 : voce.tokenId;
      usati.add(tokenId);
      stato.capi[chiave] = { ...voce, tokenId };
      stato.prossimoToken = Math.max(stato.prossimoToken, tokenId + 1);
    }
    stato.blocco = Math.max(stato.blocco, locale.blocco ?? 0);
    importati = mancanti.length;
    return true;
  });
  fileUnito = true; // solo dopo un'importazione riuscita
  if (importati) console.log(`Registro simulato: ${importati} capi importati dal file locale nel database`);
}

const archivioMongo = {
  async leggi() {
    await unisciFileLocale();
    const doc = await collezione().findOne({ _id: ID });
    if (!doc) return vuoto();
    const { _id, versione, ...stato } = doc;
    return stato;
  },
  async aggiorna(operazione) {
    await unisciFileLocale();
    return salvaConVersione((stato) => {
      operazione(stato);
    });
  },
};

const archivio = () => (suMongo() ? archivioMongo : archivioFile);

let coda = Promise.resolve(); // le scritture sono serializzate, come i blocchi

function transazione(operazione) {
  const esegui = async () => {
    await attendi(latenza()); // simula il tempo di validazione del blocco
    const stato = await archivio().aggiorna((s) => {
      operazione(s); // può lanciare errori (revert)
      s.blocco += 1;
    });
    const txHash = "0x" + crypto.createHash("sha256").update(crypto.randomUUID()).digest("hex");
    return { txHash, blocco: stato.blocco, rete: RETE };
  };
  const risultato = coda.then(esegui, esegui);
  coda = risultato.catch(() => {});
  return risultato;
}

function capo(stato, tagId) {
  const voce = stato.capi[improntaTag(tagId)];
  if (!voce) throw Object.assign(new Error(`Tag ${tagId} non registrato sul registro`), { codice: "TAG_NON_REGISTRATO" });
  return voce;
}

export default {
  nome: RETE,

  registraCapo: ({ tagId, dataHash }) =>
    transazione((stato) => {
      const chiave = improntaTag(tagId);
      if (stato.capi[chiave]) {
        throw Object.assign(new Error(`Tag ${tagId} già registrato sul registro`), { codice: "TAG_GIA_REGISTRATO" });
      }
      stato.capi[chiave] = { tokenId: stato.prossimoToken++, dataHash, storico: [] };
    }),

  aggiornaDatiCapo: ({ tagId, dataHash }) =>
    transazione((stato) => {
      capo(stato, tagId).dataHash = dataHash;
    }),

  registraEvento: ({ tagId, hash }) =>
    transazione((stato) => {
      capo(stato, tagId).storico.push(hash);
    }),

  registraPassaggio: ({ tagId, hash }) =>
    transazione((stato) => {
      capo(stato, tagId).storico.push(hash);
    }),

  // Lettura gratuita (nessuna transazione)
  async leggiRegistro(tagId) {
    const voce = (await archivio().leggi()).capi[improntaTag(tagId)];
    if (!voce) return { registrato: false, tokenId: null, dataHash: null, storico: [] };
    return { registrato: true, tokenId: voce.tokenId, dataHash: voce.dataHash, storico: [...voce.storico] };
  },
};
```

## `backend/services/blockchain/polygon.js`

```javascript
/*
 * SERVIZIO BLOCKCHAIN REALE — smart contract RegenLuxuryPassport via ethers.js
 * Stessa interfaccia del registro simulato. Reti supportate: Polygon Amoy
 * (testnet) o una chain locale Hardhat (npm run chain nella cartella contracts).
 * La piattaforma firma e paga le transazioni: commercianti e acquirenti non
 * hanno bisogno di wallet né di criptovaluta (vincolo RC-5).
 */
import { ethers } from "ethers";
import { readFileSync } from "node:fs";
import { improntaTag } from "../hashService.js";

const { abi } = JSON.parse(readFileSync(new URL("./RegenLuxuryPassport.abi.json", import.meta.url)));

const RETE = process.env.CHAIN_NAME ?? "polygon-amoy";
const rpc = process.env.POLYGON_RPC_URL ?? "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(rpc);

async function creaFirmatario() {
  if (process.env.PLATFORM_PRIVATE_KEY) {
    return new ethers.NonceManager(new ethers.Wallet(process.env.PLATFORM_PRIVATE_KEY, provider));
  }
  // Chain locale Hardhat: gli account di test sono già sbloccati sul nodo
  if (/127\.0\.0\.1|localhost/.test(rpc)) return new ethers.NonceManager(await provider.getSigner(0));
  throw new Error("PLATFORM_PRIVATE_KEY mancante nel file .env");
}

let contrattoPromise;
let firmatario;
function contratto() {
  if (!contrattoPromise) {
    if (!process.env.CONTRACT_ADDRESS) throw new Error("CONTRACT_ADDRESS mancante nel file .env");
    contrattoPromise = creaFirmatario()
      .then((f) => {
        firmatario = f;
        return new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, f);
      })
      .catch((err) => {
        contrattoPromise = undefined; // es. nodo non ancora avviato: si riprova alla prossima richiesta
        throw err;
      });
  }
  return contrattoPromise;
}

// Le transazioni partono una alla volta: con un solo firmatario i nonce restano in
// sequenza. Se un invio fallisce (revert, errore della rete) il NonceManager viene
// riallineato con la rete, altrimenti resterebbe un "buco" e le transazioni
// successive non verrebbero mai confermate. Un solo server deve usare la stessa chiave.
const ATTESA_MAX_MS = Number(process.env.TX_TIMEOUT_MS ?? 120_000);
let codaInvii = Promise.resolve();

function invia(prepara) {
  const esegui = async () => {
    try {
      const tx = await prepara();
      const ricevuta = await tx.wait(1, ATTESA_MAX_MS);
      return { txHash: ricevuta.hash, blocco: ricevuta.blockNumber, rete: RETE, gasUsato: Number(ricevuta.gasUsed) };
    } catch (err) {
      firmatario?.reset?.();
      throw err;
    }
  };
  const risultato = codaInvii.then(esegui, esegui);
  codaInvii = risultato.catch(() => {});
  return risultato;
}

async function tokenDi(c, tagId) {
  const tokenId = await c.tokenByTag(improntaTag(tagId));
  if (tokenId === 0n) {
    throw Object.assign(new Error(`Tag ${tagId} non registrato on-chain`), { codice: "TAG_NON_REGISTRATO" });
  }
  return tokenId;
}

export default {
  nome: RETE,

  async registraCapo({ tagId, dataHash }) {
    const c = await contratto();
    return invia(async () => c.registerItem(await c.runner.getAddress(), improntaTag(tagId), dataHash));
  },

  async aggiornaDatiCapo({ tagId, dataHash }) {
    const c = await contratto();
    return invia(async () => c.updateDataHash(await tokenDi(c, tagId), dataHash));
  },

  async registraEvento({ tagId, hash }) {
    const c = await contratto();
    return invia(async () => c.recordRegeneration(await tokenDi(c, tagId), hash));
  },

  async registraPassaggio({ tagId, hash }) {
    const c = await contratto();
    return invia(async () => c.recordTransfer(await tokenDi(c, tagId), hash));
  },

  async leggiRegistro(tagId) {
    const c = await contratto();
    const [registrato, tokenId, dataHash, storico] = await c.recordByTag(improntaTag(tagId));
    return {
      registrato,
      tokenId: registrato ? Number(tokenId) : null,
      dataHash: registrato ? dataHash : null,
      storico: registrato ? [...storico] : [],
    };
  },
};
```

## `backend/services/hashService.js`

```javascript
// Impronte crittografiche (keccak256, la stessa funzione di hash di Ethereum/Polygon).
// Sulla blockchain si salvano SOLO queste impronte: se qualcuno modifica i dati
// nel database, l'impronta ricalcolata non coincide più con quella ancorata
// e la manomissione diventa rilevabile.
import { keccak256, toUtf8Bytes } from "ethers";

// JSON canonico: chiavi ordinate, date in ISO, id come stringhe, niente "undefined".
// Serve perché lo stesso dato produca SEMPRE la stessa impronta.
function normalizza(valore) {
  if (valore === undefined || valore === null) return null;
  if (valore instanceof Date) return valore.toISOString();
  if (typeof valore === "object" && typeof valore.toHexString === "function") return valore.toHexString(); // ObjectId
  if (Array.isArray(valore)) return valore.map(normalizza);
  if (typeof valore === "object") {
    return Object.keys(valore)
      .sort()
      .reduce((acc, chiave) => {
        const v = normalizza(valore[chiave]);
        if (v !== null) acc[chiave] = v;
        return acc;
      }, {});
  }
  return valore;
}

export const jsonCanonico = (valore) => JSON.stringify(normalizza(valore));

export const impronta = (valore) => keccak256(toUtf8Bytes(jsonCanonico(valore)));

// Impronta del codice del tag (chiave del capo sullo smart contract)
export const improntaTag = (tagId) => keccak256(toUtf8Bytes(String(tagId)));

// Dati identificativi del capo (non include lo storico, che ha impronte proprie)
export function improntaCapo(item) {
  return impronta({
    v: 1,
    tagId: item.tagId,
    brand: item.brand,
    codiceModello: item.codiceModello,
    materialiOriginari: item.materialiOriginari,
    filieraProvenienza: item.filieraProvenienza,
    categoria: item.categoria,
    materialePrincipale: item.materialePrincipale,
    annoProduzione: item.annoProduzione,
    stato: item.stato ?? "attivo",
  });
}

export function improntaEvento(evento) {
  return impronta({
    v: 1,
    tipo: "evento",
    id: String(evento._id),
    tipoEvento: evento.tipo,
    descrizione: evento.descrizione,
    materialiNuovi: evento.materialiNuovi,
    operatore: evento.operatore,
    data: evento.data ? new Date(evento.data) : null,
  });
}

// L'id del passaggio (casuale) fa da "sale": il nome del proprietario non è
// ricavabile dall'impronta per tentativi.
export function improntaPassaggio(passaggio) {
  return impronta({
    v: 1,
    tipo: "passaggio",
    id: String(passaggio._id),
    proprietario: passaggio.proprietario,
    data: passaggio.data ? new Date(passaggio.data) : null,
  });
}
```

## `backend/services/impactService.js`

```javascript
/*
 * STIMA DELL'IMPATTO AMBIENTALE EVITATO (dashboard di sostenibilità)
 * ------------------------------------------------------------------
 * Un capo rigenerato evita (in parte) l'acquisto di un capo nuovo equivalente.
 * Impatto evitato = impatto di produzione del capo nuovo x fattore di sostituzione.
 * I coefficienti e le fonti sono nel file data/coefficienti-lca.json: ogni
 * numero mostrato all'utente è tracciabile a una fonte citabile in tesi.
 * Per le categorie senza dati affidabili NON si inventano valori: la stima
 * risulta "non disponibile".
 */
import { readFileSync } from "node:fs";

const tabella = JSON.parse(readFileSync(new URL("../data/coefficienti-lca.json", import.meta.url), "utf8"));

const arrotonda = (n, cifre = 1) => Math.round(n * 10 ** cifre) / 10 ** cifre;

export function calcolaImpattoAmbientale(item) {
  const coeff = item.categoria ? tabella.categorie[item.categoria] : undefined;
  if (!coeff) {
    return {
      disponibile: false,
      nota: item.categoria
        ? `Stima non disponibile per la categoria "${item.categoria}": mancano coefficienti LCA da fonte citabile.`
        : "Stima non disponibile: categoria del capo non indicata.",
    };
  }
  const { valore, intervallo } = tabella.fattoreSostituzione;
  return {
    disponibile: true,
    co2RisparmiataKg: arrotonda(coeff.co2Kg * valore),
    acquaPreservataLitri: Math.round(coeff.acquaL * valore),
    intervallo: {
      co2Kg: intervallo.map((f) => arrotonda(coeff.co2Kg * f)),
      acquaL: intervallo.map((f) => Math.round(coeff.acquaL * f)),
    },
    categoria: item.categoria,
    metodo: `Impatto di produzione di un capo nuovo equivalente x fattore di sostituzione ${valore}`,
    unitaFunzionale: coeff.unitaFunzionale,
    fonti: [coeff.fonte, tabella.fattoreSostituzione.fonte],
    verificato: coeff.verificato,
    nota: "Valori stimati da letteratura LCA (ISO 14040/14044): sono stime, non misure sul singolo capo.",
  };
}

export const categorieConStima = () => Object.keys(tabella.categorie);
```

## `backend/services/integrityService.js`

```javascript
/*
 * CONTROLLO DI INTEGRITÀ (database <-> blockchain)
 * ------------------------------------------------
 * Ricalcola le impronte dei dati presenti nel database e le confronta con
 * quelle lette dal registro on-chain. Se qualcuno modifica o cancella un dato
 * nel database, l'impronta ricalcolata non coincide e il capo risulta
 * "manomesso": la blockchain non impedisce la modifica del database, ma la
 * rende RILEVABILE.
 *
 * Solo lo stato "verificato" certifica l'autenticità. Gli stati di attesa o di
 * scrittura fallita sono scritti nel database, quindi potrebbero essere falsificati
 * insieme ai dati: per questo non producono mai "autentico" e un'attesa è
 * considerata credibile solo se la scrittura è in corso su questo server oppure
 * è iniziata da poco (FINESTRA_ATTESA_MS). Altrimenti la verifica è "non conclusiva".
 */
import { blockchain } from "./blockchain/index.js";
import { inLavorazione } from "./anchorService.js";
import { improntaCapo, improntaEvento, improntaPassaggio } from "./hashService.js";

const finestraAttesa = () => Number(process.env.FINESTRA_ATTESA_MS ?? 10 * 60_000);

export const ESITI = {
  verificato: "Tutti i dati coincidono con quelli ancorati sulla blockchain",
  in_attesa: "Registrazione sulla blockchain in corso: la verifica sarà completa tra pochi istanti",
  incompleto: "Verifica non conclusiva: alcuni dati non risultano ancorati sulla blockchain",
  manomesso: "I dati non coincidono con quelli ancorati: possibile manomissione",
  non_registrato: "Il capo non risulta registrato sulla blockchain",
};

function attesaCredibile(item, ancoraggio) {
  if (ancoraggio?.stato !== "in_attesa") return false;
  if (inLavorazione(item._id)) return true;
  const riferimento = ancoraggio.aggiornatoIl ?? item.updatedAt;
  return riferimento ? Date.now() - new Date(riferimento).getTime() < finestraAttesa() : false;
}

export async function verificaIntegrita(item) {
  const chain = await blockchain();
  const registro = await chain.leggiRegistro(item.tagId);
  const registrazione = item.registrazione;

  if (!registro.registrato) {
    const stato = attesaCredibile(item, registrazione) ? "in_attesa" : "non_registrato";
    return { stato, messaggio: ESITI[stato], rete: chain.nome, datiCapo: stato, voci: null };
  }

  // 1) Dati identificativi del capo
  let datiCapo = "verificati";
  if (registro.dataHash !== improntaCapo(item)) {
    if (attesaCredibile(item, registrazione)) datiCapo = "in_attesa";
    else if (["in_attesa", "fallito"].includes(registrazione?.stato)) datiCapo = "non_ancorati";
    else datiCapo = "diversi"; // registrazione confermata ma dati diversi: manomissione
  }

  // 2) Storico: ogni voce del database deve comparire on-chain (e viceversa)
  const disponibili = new Map();
  for (const h of registro.storico) disponibili.set(h, (disponibili.get(h) ?? 0) + 1);

  const voci = { verificate: 0, inAttesa: 0, nonAncorate: 0, alterate: [], soloOnChain: 0 };
  const controlla = (tipo, voce, hash) => {
    const n = disponibili.get(hash) ?? 0;
    if (n > 0) {
      disponibili.set(hash, n - 1);
      voci.verificate += 1;
    } else if (attesaCredibile(item, voce.ancoraggio)) {
      voci.inAttesa += 1;
    } else if (voce.ancoraggio?.stato === "confermato") {
      voci.alterate.push({ tipo, id: String(voce._id) }); // confermata ma impronta diversa
    } else {
      voci.nonAncorate += 1; // mai ancorata, scrittura fallita o attesa scaduta
    }
  };
  item.storicoRigenerazione.forEach((e) => controlla("evento", e, improntaEvento(e)));
  item.passaggiProprieta.forEach((p) => controlla("passaggio", p, improntaPassaggio(p)));
  voci.soloOnChain = [...disponibili.values()].reduce((a, b) => a + b, 0); // voci cancellate dal DB

  let stato = "verificato";
  if (datiCapo === "diversi" || voci.alterate.length > 0 || voci.soloOnChain > 0) stato = "manomesso";
  else if (datiCapo === "in_attesa" || voci.inAttesa > 0) stato = "in_attesa";
  else if (datiCapo === "non_ancorati" || voci.nonAncorate > 0) stato = "incompleto";

  return { stato, messaggio: ESITI[stato], rete: chain.nome, tokenId: registro.tokenId, datiCapo, voci };
}
```

## `backend/services/qrService.js`

```javascript
// QR code con l'URL pubblico di verifica del capo (strategia duale NFC + QR).
import QRCode from "qrcode";

// Su Render l'indirizzo pubblico arriva da solo (RENDER_EXTERNAL_URL)
const base = () => (process.env.PUBLIC_BASE_URL || process.env.RENDER_EXTERNAL_URL || "http://localhost:5173").replace(/\/+$/, "");

export const urlVerifica = (tagId) => `${base()}/v/${encodeURIComponent(tagId)}`;

export const qrSvg = (url) => QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 2 });

export const qrPng = (url) => QRCode.toBuffer(url, { type: "png", errorCorrectionLevel: "M", margin: 2, width: 512 });
```

## `backend/services/sunService.js`

```javascript
/*
 * NFC NTAG 424 DNA — verifica del messaggio dinamico SUN (Secure Unique NFC)
 * --------------------------------------------------------------------------
 * A ogni avvicinamento del telefono il chip genera un URL diverso, per esempio
 *   https://<dominio>/s?e=<PICCData cifrato, 32 hex>&c=<SDMMAC, 16 hex>
 * dove:
 *  - e = UID del chip + contatore di letture, cifrati con AES-128 (chiave SDMMetaRead)
 *  - c = codice di autenticazione (CMAC AES-128) calcolato con una chiave di
 *        sessione derivata da UID e contatore (chiave SDMFileRead)
 * Il server decifra, ricalcola il CMAC e controlla che il contatore sia
 * maggiore dell'ultimo visto: un URL copiato o registrato non vale una
 * seconda volta (anti-replay) e un chip clonato non conosce le chiavi.
 * Riferimento: NXP AN12196 "NTAG 424 DNA and NTAG 424 DNA TagTamper features and hints".
 */
import crypto from "node:crypto";

const ZERO16 = Buffer.alloc(16);

function aesEcb(chiave, blocco) {
  const cifrario = crypto.createCipheriv("aes-128-ecb", chiave, null);
  cifrario.setAutoPadding(false);
  return Buffer.concat([cifrario.update(blocco), cifrario.final()]);
}

function xor(a, b) {
  const out = Buffer.alloc(a.length);
  for (let i = 0; i < a.length; i++) out[i] = a[i] ^ b[i];
  return out;
}

function shiftSinistra(buf) {
  const out = Buffer.alloc(buf.length);
  let riporto = 0;
  for (let i = buf.length - 1; i >= 0; i--) {
    out[i] = ((buf[i] << 1) & 0xff) | riporto;
    riporto = (buf[i] & 0x80) >> 7;
  }
  return out;
}

function sottochiavi(chiave) {
  const L = aesEcb(chiave, ZERO16);
  const K1 = shiftSinistra(L);
  if (L[0] & 0x80) K1[15] ^= 0x87;
  const K2 = shiftSinistra(K1);
  if (K1[0] & 0x80) K2[15] ^= 0x87;
  return [K1, K2];
}

/** AES-CMAC (RFC 4493). */
export function aesCmac(chiave, messaggio = Buffer.alloc(0)) {
  const [K1, K2] = sottochiavi(chiave);
  const n = Math.max(1, Math.ceil(messaggio.length / 16));
  const ultimoCompleto = messaggio.length > 0 && messaggio.length % 16 === 0;
  let ultimo = messaggio.subarray((n - 1) * 16);
  if (ultimoCompleto) {
    ultimo = xor(ultimo, K1);
  } else {
    const riempito = Buffer.alloc(16);
    ultimo.copy(riempito);
    riempito[ultimo.length] = 0x80;
    ultimo = xor(riempito, K2);
  }
  let X = ZERO16;
  for (let i = 0; i < n - 1; i++) X = aesEcb(chiave, xor(X, messaggio.subarray(i * 16, i * 16 + 16)));
  return aesEcb(chiave, xor(X, ultimo));
}

/** MAC troncato NXP: gli 8 byte in posizione dispari (1, 3, ..., 15). */
const troncaMac = (mac) => Buffer.from([1, 3, 5, 7, 9, 11, 13, 15].map((i) => mac[i]));

const chiaveDaEnv = (nome) => {
  const hex = process.env[nome] ?? "00000000000000000000000000000000";
  if (!/^[0-9a-fA-F]{32}$/.test(hex)) throw new Error(`${nome} deve essere di 32 caratteri esadecimali`);
  return Buffer.from(hex, "hex");
};

/**
 * Decifra PICCData e verifica il CMAC.
 * @returns {{ uid: string, contatore: number, macValido: boolean }}
 */
export function verificaMessaggioSun({ e, c }, chiavi = {}) {
  const kMeta = chiavi.metaRead ?? chiaveDaEnv("SDM_META_READ_KEY");
  const kFile = chiavi.fileRead ?? chiaveDaEnv("SDM_FILE_READ_KEY");

  // 1) PICCData = AES-128-CBC^-1(K_SDMMetaRead, e), IV = 0
  const decifratore = crypto.createDecipheriv("aes-128-cbc", kMeta, ZERO16);
  decifratore.setAutoPadding(false);
  const picc = Buffer.concat([decifratore.update(Buffer.from(e, "hex")), decifratore.final()]);

  const tagDati = picc[0];
  const haUid = (tagDati & 0x80) !== 0;
  const haContatore = (tagDati & 0x40) !== 0;
  const lunghezzaUid = tagDati & 0x0f;
  if (!haUid || !haContatore || lunghezzaUid !== 7) {
    return { uid: null, contatore: null, macValido: false, errore: "PICCData non valido (chiave SDMMetaRead errata?)" };
  }
  const uid = picc.subarray(1, 8);
  const contatoreLE = picc.subarray(8, 11);
  const contatore = contatoreLE[0] | (contatoreLE[1] << 8) | (contatoreLE[2] << 16);

  // 2) Chiave di sessione: CMAC(K_SDMFileRead, SV2), SV2 = 3CC3 0001 0080 || UID || contatore
  const sv2 = Buffer.concat([Buffer.from("3CC300010080", "hex"), uid, contatoreLE]);
  const kSessione = aesCmac(kFile, sv2);

  // 3) SDMMAC su input vuoto (URL con solo e= e c=), troncato a 8 byte
  const atteso = troncaMac(aesCmac(kSessione, Buffer.alloc(0)));
  const ricevuto = Buffer.from(c, "hex");
  const macValido = ricevuto.length === 8 && crypto.timingSafeEqual(atteso, ricevuto);

  return { uid: uid.toString("hex").toUpperCase(), contatore, macValido };
}
```

## `backend/test/auth.test.js`

```javascript
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { avviaAmbiente, creaUtenti, auth, capoDiProva, PASSWORD } from "./helpers.js";

describe("Autenticazione e ruoli (punto 7)", () => {
  let env, app, token;
  before(async () => {
    env = await avviaAmbiente();
    app = env.app;
    token = await creaUtenti(app);
  });
  after(() => env.chiudi());

  it("login corretto restituisce token e dati utente senza hash della password", async () => {
    const r = await request(app).post("/api/auth/login").send({ email: "commerciante@test.it", password: PASSWORD });
    assert.equal(r.status, 200);
    assert.ok(r.body.token);
    assert.equal(r.body.utente.ruolo, "commerciante");
    assert.equal(r.body.utente.passwordHash, undefined);
  });

  it("password errata -> 401", async () => {
    const r = await request(app).post("/api/auth/login").send({ email: "commerciante@test.it", password: "sbagliata" });
    assert.equal(r.status, 401);
  });

  it("area gestionale senza token -> 401, token falso -> 401", async () => {
    assert.equal((await request(app).get("/api/items")).status, 401);
    assert.equal((await request(app).get("/api/items").set(auth("abc.def.ghi"))).status, 401);
  });

  it("GET /api/auth/me restituisce l'utente del token", async () => {
    const r = await request(app).get("/api/auth/me").set(auth(token.artigiano));
    assert.equal(r.status, 200);
    assert.equal(r.body.utente.ruolo, "artigiano");
  });

  it("l'artigiano non può creare capi (403), il commerciante sì (201)", async () => {
    const vietato = await request(app).post("/api/items").set(auth(token.artigiano)).send(capoDiProva("NFC-A01"));
    assert.equal(vietato.status, 403);
    const ok = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-A01"));
    assert.equal(ok.status, 201);
  });

  it("solo l'admin crea account; l'account disattivato non può più accedere", async () => {
    const nuovo = { nome: "Laboratorio Bari", email: "lab@test.it", password: "una-password-lunga", ruolo: "artigiano" };
    assert.equal((await request(app).post("/api/auth/utenti").set(auth(token.commerciante)).send(nuovo)).status, 403);
    const creato = await request(app).post("/api/auth/utenti").set(auth(token.admin)).send(nuovo);
    assert.equal(creato.status, 201);
    assert.equal((await request(app).post("/api/auth/utenti").set(auth(token.admin)).send(nuovo)).status, 409);

    const login = await request(app).post("/api/auth/login").send({ email: "lab@test.it", password: "una-password-lunga" });
    assert.equal(login.status, 200);
    const disattiva = await request(app).patch(`/api/auth/utenti/${creato.body.utente.id}`).set(auth(token.admin)).send({ attivo: false });
    assert.equal(disattiva.status, 200);
    assert.equal((await request(app).get("/api/auth/me").set(auth(login.body.token))).status, 401);
    assert.equal((await request(app).post("/api/auth/login").send({ email: "lab@test.it", password: "una-password-lunga" })).status, 401);
  });

  it("cambio password", async () => {
    const r = await request(app).post("/api/auth/password").set(auth(token.brand_manager)).send({ vecchia: PASSWORD, nuova: "nuova-password-sicura" });
    assert.equal(r.status, 200);
    const login = await request(app).post("/api/auth/login").send({ email: "brand_manager@test.it", password: "nuova-password-sicura" });
    assert.equal(login.status, 200);
  });
});
```

## `backend/test/hash.test.js`

```javascript
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { jsonCanonico, impronta, improntaCapo } from "../services/hashService.js";

describe("Impronte crittografiche", () => {
  it("JSON canonico: l'ordine delle chiavi non cambia l'impronta", () => {
    assert.equal(jsonCanonico({ b: 1, a: { d: 2, c: 3 } }), jsonCanonico({ a: { c: 3, d: 2 }, b: 1 }));
    assert.equal(impronta({ b: 1, a: 2 }), impronta({ a: 2, b: 1 }));
  });

  it("date e campi assenti sono normalizzati", () => {
    assert.equal(jsonCanonico({ d: new Date("2026-01-01T00:00:00Z"), x: undefined, y: null }), '{"d":"2026-01-01T00:00:00.000Z"}');
  });

  it("l'impronta del capo cambia se cambia un dato", () => {
    const capo = { tagId: "NFC-1", brand: "Gucci", codiceModello: "A", materialiOriginari: "Pelle" };
    assert.notEqual(improntaCapo(capo), improntaCapo({ ...capo, brand: "Prada" }));
    assert.match(improntaCapo(capo), /^0x[0-9a-f]{64}$/);
  });
});
```

## `backend/test/helpers.js`

```javascript
// Ambiente di test: database in memoria (o MONGO_URI_TEST), blockchain simulata su file temporaneo.
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import request from "supertest";

export const PASSWORD = "Password-di-test-1";

export async function avviaAmbiente(env = {}) {
  const id = crypto.randomBytes(4).toString("hex");
  Object.assign(process.env, {
    NODE_ENV: "test",
    JWT_SECRET: "segreto-di-test",
    BLOCKCHAIN_MODE: "mock",
    MOCK_LEDGER_STORE: "file",
    MOCK_LEDGER_FILE: path.join(os.tmpdir(), `ledger-${id}.json`),
    MOCK_CHAIN_LATENCY_MS: "5",
    RATE_LIMIT_VERIFY_PER_MIN: "10000",
    RATE_LIMIT_LOGIN_PER_15MIN: "10000",
    PUBLIC_BASE_URL: "https://regen.example",
    ...env,
  });

  let server;
  let uri = process.env.MONGO_URI_TEST;
  if (!uri) {
    const { MongoMemoryServer } = await import("mongodb-memory-server-core");
    server = await MongoMemoryServer.create();
    uri = server.getUri();
  }
  await mongoose.connect(uri, { dbName: `test_${id}` });

  const { creaApp } = await import("../app.js");
  const app = creaApp();

  return {
    app,
    creaApp,
    async chiudi() {
      const { attendiAncoraggi } = await import("../services/anchorService.js");
      await attendiAncoraggi();
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
      await server?.stop();
      await fs.rm(process.env.MOCK_LEDGER_FILE, { force: true });
    },
  };
}

// Crea un utente per ruolo e restituisce i token di accesso
export async function creaUtenti(app) {
  const { default: User } = await import("../models/User.js");
  const hash = await bcrypt.hash(PASSWORD, 4);
  const token = {};
  for (const ruolo of ["admin", "brand_manager", "commerciante", "artigiano"]) {
    const email = `${ruolo}@test.it`;
    await User.create({ nome: `Utente ${ruolo}`, email, ruolo, passwordHash: hash });
    const r = await request(app).post("/api/auth/login").send({ email, password: PASSWORD });
    token[ruolo] = r.body.token;
  }
  return token;
}

export const auth = (t) => ({ Authorization: `Bearer ${t}` });

export const capoDiProva = (tagId = "NFC-001", extra = {}) => ({
  brand: "Gucci",
  codiceModello: "GG-2024",
  materialiOriginari: "Pelle e cotone",
  filieraProvenienza: "Italia",
  categoria: "jeans",
  tagId,
  ...extra,
});

export async function attendiAncoraggi() {
  const { attendiAncoraggi: attendi } = await import("../services/anchorService.js");
  await attendi();
}
```

## `backend/test/integrita.test.js`

```javascript
// Controllo di integrità: gli stati salvati nel database non possono "coprire" una manomissione
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { avviaAmbiente, creaUtenti, auth, capoDiProva, attendiAncoraggi } from "./helpers.js";

describe("Integrità: stati di attesa falsificati, campi svuotabili, date (revisione)", () => {
  let env, app, token, Item;
  const vecchio = new Date(Date.now() - 60 * 60_000); // un'ora fa: fuori dalla finestra di attesa

  before(async () => {
    env = await avviaAmbiente();
    app = env.app;
    token = await creaUtenti(app);
    ({ default: Item } = await import("../models/Item.js"));
  });
  after(() => env.chiudi());

  async function capoConfermato(tagId) {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva(tagId));
    await request(app).post(`/api/items/${r.body._id}/eventi`).set(auth(token.artigiano)).send({ tipo: "riparazione", descrizione: "Cuciture" });
    await attendiAncoraggi();
    return r.body._id;
  }
  const verifica = async (tagId) => (await request(app).get(`/api/verify/${tagId}`)).body.certificatoAutenticita;

  it("dati modificati + registrazione rimessa 'in_attesa' nel database: mai 'autentico'", async () => {
    const id = await capoConfermato("INT-001");
    await Item.collection.updateOne(
      { _id: Item.castObject({ _id: id })._id },
      { $set: { brand: "Marchio Falso", "registrazione.stato": "in_attesa", "registrazione.aggiornatoIl": vecchio, updatedAt: vecchio } }
    );
    const c = await verifica("INT-001");
    assert.equal(c.autentico, false);
    assert.notEqual(c.integrita.stato, "verificato");
  });

  it("evento falso aggiunto con ancoraggio 'fallito': verifica non conclusiva, non autentico", async () => {
    const id = await capoConfermato("INT-002");
    const item = await Item.findById(id);
    item.storicoRigenerazione.push({ tipo: "upcycling", descrizione: "Intervento inventato", ancoraggio: { stato: "fallito", aggiornatoIl: vecchio } });
    await item.save();
    const c = await verifica("INT-002");
    assert.equal(c.integrita.stato, "incompleto");
    assert.equal(c.autentico, false);
  });

  it("capo contraffatto inserito direttamente nel database 'in_attesa' da tempo: non registrato", async () => {
    await Item.collection.insertOne({
      ...capoDiProva("INT-FALSO"),
      stato: "attivo",
      registrazione: { stato: "in_attesa", aggiornatoIl: vecchio },
      storicoRigenerazione: [],
      passaggiProprieta: [],
      createdAt: vecchio,
      updatedAt: vecchio,
    });
    const c = await verifica("INT-FALSO");
    assert.equal(c.integrita.stato, "non_registrato");
    assert.equal(c.autentico, false);
  });

  it("un capo appena creato è 'in registrazione' (non ancora autentico) e poi 'verificato'", async () => {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("INT-003"));
    const subito = await verifica("INT-003");
    assert.equal(subito.integrita.stato, "in_attesa");
    assert.equal(subito.autentico, false);
    await attendiAncoraggi();
    const dopo = await verifica("INT-003");
    assert.equal(dopo.integrita.stato, "verificato");
    assert.equal(dopo.autentico, true);
    assert.ok(r.body._id);
  });

  it("modifica: un campo facoltativo svuotato (null) viene rimosso e il capo resta verificato", async () => {
    const r = await request(app)
      .post("/api/items")
      .set(auth(token.commerciante))
      .send(capoDiProva("INT-004", { annoProduzione: 2010 }));
    await attendiAncoraggi();
    const m = await request(app).patch(`/api/items/${r.body._id}`).set(auth(token.commerciante)).send({ filieraProvenienza: null, annoProduzione: null });
    assert.equal(m.status, 200);
    assert.equal(m.body.filieraProvenienza, undefined);
    assert.equal(m.body.annoProduzione, undefined);
    await attendiAncoraggi();
    assert.equal((await verifica("INT-004")).integrita.stato, "verificato");
    // brand e codice restano obbligatori
    const vuoto = await request(app).patch(`/api/items/${r.body._id}`).set(auth(token.commerciante)).send({ brand: null });
    assert.equal(vuoto.status, 400);
  });

  it("evento con la data di adesso: accettato; data nel futuro: rifiutata", async () => {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("INT-005"));
    const ora = await request(app).post(`/api/items/${r.body._id}/eventi`).set(auth(token.artigiano)).send({ tipo: "riparazione", descrizione: "Oggi", data: new Date().toISOString() });
    assert.equal(ora.status, 200);
    const futuro = await request(app)
      .post(`/api/items/${r.body._id}/eventi`)
      .set(auth(token.artigiano))
      .send({ tipo: "riparazione", descrizione: "Domani", data: new Date(Date.now() + 86_400_000).toISOString() });
    assert.equal(futuro.status, 400);
  });

  it("email duplicata: messaggio sull'account, non sul tag", async () => {
    const primo = await request(app).post("/api/auth/utenti").set(auth(token.admin)).send({ nome: "A", email: "doppio@test.it", ruolo: "artigiano", password: "Password-lunga-1" });
    assert.equal(primo.status, 201);
    const secondo = await request(app).post("/api/auth/utenti").set(auth(token.admin)).send({ nome: "B", email: "doppio@test.it", ruolo: "artigiano", password: "Password-lunga-1" });
    assert.equal(secondo.status, 409);
    assert.match(secondo.body.errore, /account|email/i);
  });
});
```

## `backend/test/items.test.js`

```javascript
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { avviaAmbiente, creaUtenti, auth, capoDiProva, attendiAncoraggi } from "./helpers.js";

describe("Gestione capi: creazione, validazione, endpoint (punti 8-9)", () => {
  let env, app, token, idCapo;
  before(async () => {
    env = await avviaAmbiente();
    app = env.app;
    token = await creaUtenti(app);
  });
  after(() => env.chiudi());

  it("crea un capo: 201, registrazione in attesa e poi confermata", async () => {
    const r = await request(app).post("/api/items").set(auth(token.brand_manager)).send(capoDiProva("NFC-001", { proprietarioIniziale: "Boutique Vintage Bari" }));
    assert.equal(r.status, 201);
    assert.equal(r.body.registrazione.stato, "in_attesa");
    idCapo = r.body._id;
    await attendiAncoraggi();
    const d = await request(app).get(`/api/items/${idCapo}`).set(auth(token.commerciante));
    assert.equal(d.body.registrazione.stato, "confermato");
    assert.match(d.body.blockchainTxHash, /^0x[0-9a-f]{64}$/);
    assert.equal(d.body.passaggiProprieta[0].ancoraggio.stato, "confermato");
  });

  it("anti-replay: stesso tag -> 409, anche con richieste simultanee", async () => {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-001"));
    assert.equal(r.status, 409);
    const risposte = await Promise.all(
      [1, 2, 3].map(() => request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-RACE")))
    );
    const codici = risposte.map((x) => x.status).sort();
    assert.deepEqual(codici, [201, 409, 409]);
  });

  it("validazione: campi mancanti, tagId non valido, campi sconosciuti -> 400 con dettagli", async () => {
    const mancanti = await request(app).post("/api/items").set(auth(token.commerciante)).send({ tagId: "NFC-X" });
    assert.equal(mancanti.status, 400);
    assert.ok(mancanti.body.dettagli.some((d) => d.campo === "brand"));
    const tagErrato = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC 001 con spazi"));
    assert.equal(tagErrato.status, 400);
    const extra = await request(app).post("/api/items").set(auth(token.commerciante)).send({ ...capoDiProva("NFC-Y"), prezzo: 10 });
    assert.equal(extra.status, 400);
    const anno = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-Z", { annoProduzione: 3000 }));
    assert.equal(anno.status, 400);
    const json = await request(app).post("/api/items").set(auth(token.commerciante)).set("Content-Type", "application/json").send("{non json");
    assert.equal(json.status, 400);
  });

  it("eventi: tipo non ammesso -> 400; artigiano registra -> 200 e ancoraggio confermato", async () => {
    const errato = await request(app).post(`/api/items/${idCapo}/eventi`).set(auth(token.artigiano)).send({ tipo: "lavaggio", descrizione: "x" });
    assert.equal(errato.status, 400);
    const r = await request(app).post(`/api/items/${idCapo}/eventi`).set(auth(token.artigiano)).send({ tipo: "upcycling", descrizione: "Rifoderatura interna", materialiNuovi: "Cotone riciclato", operatore: "Laboratorio Bari" });
    assert.equal(r.status, 200);
    assert.equal(r.body.storicoRigenerazione.length, 1);
    await attendiAncoraggi();
    const d = await request(app).get(`/api/items/${idCapo}`).set(auth(token.artigiano));
    assert.equal(d.body.storicoRigenerazione[0].ancoraggio.stato, "confermato");
  });

  it("passaggi di proprietà: l'artigiano non può (403), il commerciante sì", async () => {
    assert.equal((await request(app).post(`/api/items/${idCapo}/proprieta`).set(auth(token.artigiano)).send({ proprietario: "Luca" })).status, 403);
    const r = await request(app).post(`/api/items/${idCapo}/proprieta`).set(auth(token.commerciante)).send({ proprietario: "Maria Rossi" });
    assert.equal(r.status, 200);
    assert.equal(r.body.passaggiProprieta.length, 2);
  });

  it("elenco paginato, ricerca e ricerca per tag", async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva(`PRADA-${i}`, { brand: "Prada" }));
    }
    const pag = await request(app).get("/api/items?perPagina=2&pagina=2").set(auth(token.artigiano));
    assert.equal(pag.status, 200);
    assert.equal(pag.body.dati.length, 2);
    assert.equal(pag.body.pagina, 2);
    assert.ok(pag.body.totale >= 7);
    const cerca = await request(app).get("/api/items?q=prada").set(auth(token.artigiano));
    assert.equal(cerca.body.totale, 5);
    const perTag = await request(app).get("/api/items/tag/NFC-001").set(auth(token.artigiano));
    assert.equal(perTag.status, 200);
    assert.equal(perTag.body._id, idCapo);
    assert.equal((await request(app).get("/api/items/tag/NON-ESISTE").set(auth(token.artigiano))).status, 404);
    assert.equal((await request(app).get("/api/items?perPagina=500").set(auth(token.artigiano))).status, 400);
  });

  it("modifica: il tagId non è modificabile; la nuova impronta viene ancorata", async () => {
    const tag = await request(app).patch(`/api/items/${idCapo}`).set(auth(token.commerciante)).send({ tagId: "ALTRO" });
    assert.equal(tag.status, 400);
    const r = await request(app).patch(`/api/items/${idCapo}`).set(auth(token.commerciante)).send({ codiceModello: "GG-2024-R" });
    assert.equal(r.status, 200);
    assert.equal(r.body.codiceModello, "GG-2024-R");
    await attendiAncoraggi();
    const v = await request(app).get("/api/verify/NFC-001");
    assert.equal(v.body.certificatoAutenticita.integrita.stato, "verificato");
  });

  it("archiviazione: solo brand manager; poi il capo non è più modificabile ma resta verificabile", async () => {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-ARC"));
    assert.equal((await request(app).post(`/api/items/${r.body._id}/archivia`).set(auth(token.commerciante))).status, 403);
    const a = await request(app).post(`/api/items/${r.body._id}/archivia`).set(auth(token.brand_manager));
    assert.equal(a.status, 200);
    assert.equal(a.body.stato, "archiviato");
    assert.equal((await request(app).post(`/api/items/${r.body._id}/eventi`).set(auth(token.artigiano)).send({ tipo: "riparazione", descrizione: "x" })).status, 409);
    await attendiAncoraggi();
    const v = await request(app).get("/api/verify/NFC-ARC");
    assert.equal(v.status, 200);
    assert.equal(v.body.capo.stato, "archiviato");
    assert.equal(v.body.certificatoAutenticita.integrita.stato, "verificato");
    const attivi = await request(app).get("/api/items?stato=attivo&q=NFC-ARC").set(auth(token.admin));
    assert.equal(attivi.body.totale, 0);
  });

  it("QR code: SVG con l'URL pubblico di verifica", async () => {
    const r = await request(app).get(`/api/items/${idCapo}/qr`).set(auth(token.commerciante));
    assert.equal(r.status, 200);
    assert.match(r.headers["content-type"], /image\/svg\+xml/);
    assert.equal(r.headers["x-url-verifica"], "https://regen.example/v/NFC-001");
    const png = await request(app).get(`/api/items/${idCapo}/qr?formato=png`).set(auth(token.commerciante));
    assert.equal(png.headers["content-type"], "image/png");
  });

  it("eliminazione: solo admin; il tag resta 'bruciato' sulla blockchain", async () => {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-DEL"));
    await attendiAncoraggi();
    assert.equal((await request(app).delete(`/api/items/${r.body._id}`).set(auth(token.brand_manager))).status, 403);
    assert.equal((await request(app).delete(`/api/items/${r.body._id}`).set(auth(token.admin))).status, 200);
    const riuso = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-DEL"));
    assert.equal(riuso.status, 409);
  });

  it("ID non valido -> 400; endpoint inesistente -> 404", async () => {
    assert.equal((await request(app).get("/api/items/abc").set(auth(token.admin))).status, 400);
    assert.equal((await request(app).get("/api/nulla")).status, 404);
  });
});
```

## `backend/test/registro-mongo.test.js`

```javascript
// Registro simulato salvato su MongoDB (demo online su Render)
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import request from "supertest";
import mongoose from "mongoose";
import { avviaAmbiente, creaUtenti, auth, capoDiProva, attendiAncoraggi } from "./helpers.js";
import { improntaTag } from "../services/hashService.js";

describe("Registro simulato su MongoDB", () => {
  let env, app, token;
  before(async () => {
    env = await avviaAmbiente({ MOCK_LEDGER_STORE: "mongo" });
    // vecchio registro su file con un capo già registrato: deve essere importato nel database
    await fs.writeFile(
      process.env.MOCK_LEDGER_FILE,
      JSON.stringify({ blocco: 1_000_010, prossimoToken: 2, capi: { [improntaTag("NFC-FILE")]: { tokenId: 1, dataHash: "0xabc", storico: [] } } })
    );
    app = env.app;
    token = await creaUtenti(app);
  });
  after(() => env.chiudi());

  it("importa il registro su file, registra i nuovi capi nel database e la verifica risulta integra", async () => {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-900"));
    assert.equal(r.status, 201);
    await request(app).post(`/api/items/${r.body._id}/eventi`).set(auth(token.artigiano)).send({ tipo: "riparazione", descrizione: "Cuciture" });
    await attendiAncoraggi();

    const v = await request(app).get("/api/verify/NFC-900");
    assert.equal(v.status, 200);
    assert.equal(v.body.certificatoAutenticita.integrita.stato, "verificato");

    const doc = await mongoose.connection.db.collection("registro_simulato").findOne({ _id: "stato" });
    assert.ok(doc.versione >= 3, "ogni transazione aumenta la versione");
    assert.ok(doc.capi[improntaTag("NFC-900")], "il nuovo capo è nel registro su database");
    assert.equal(doc.capi[improntaTag("NFC-FILE")].tokenId, 1, "il capo del file è stato importato");
    assert.equal(doc.capi[improntaTag("NFC-900")].tokenId, 2, "i token non si sovrappongono");
  });

  it("un tag già registrato nel registro importato non si può riusare", async () => {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-FILE"));
    assert.equal(r.status, 409);
  });

  it("modifiche concorrenti di due server non si perdono (controllo di versione)", async () => {
    const { default: registro } = await import("../services/blockchain/mockLedger.js");
    const col = mongoose.connection.db.collection("registro_simulato");
    const prima = await col.findOne({ _id: "stato" });
    // un "altro server" aggiunge un capo mentre questo registra il suo
    const altro = col.updateOne({ _id: "stato" }, { $set: { [`capi.${improntaTag("NFC-ALTRO")}`]: { tokenId: 99, dataHash: "0x1", storico: [] } }, $inc: { versione: 1 } });
    const mio = registro.registraCapo({ tagId: "NFC-MIO", dataHash: "0x2" });
    await Promise.all([altro, mio]);
    const dopo = await col.findOne({ _id: "stato" });
    assert.ok(dopo.capi[improntaTag("NFC-ALTRO")] && dopo.capi[improntaTag("NFC-MIO")]);
    assert.ok(dopo.versione >= prima.versione + 2);
  });
});
```

## `backend/test/sun.test.js`

```javascript
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { aesCmac, verificaMessaggioSun } from "../services/sunService.js";
import { avviaAmbiente, creaUtenti, auth, capoDiProva, attendiAncoraggi } from "./helpers.js";

// Vettore ufficiale NXP AN12196 (chiavi di fabbrica tutte a zero)
const VETTORE = { e: "EF963FF7828658A599F3041510671E88", c: "94EED9EE65337086" };

describe("NFC NTAG 424 DNA: crittografia SUN e anti-replay (punto 16)", () => {
  it("AES-CMAC: vettori di prova RFC 4493", () => {
    const K = Buffer.from("2b7e151628aed2a6abf7158809cf4f3c", "hex");
    const M = Buffer.from(
      "6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710",
      "hex"
    );
    const attesi = { 0: "bb1d6929e95937287fa37d129b756746", 16: "070a16b46b4d4144f79bdd9dd04a287c", 40: "dfa66747de9ae63030ca32611497c827", 64: "51f0bebf7e3b9d92fc49741779363cfe" };
    for (const [n, mac] of Object.entries(attesi)) assert.equal(aesCmac(K, M.subarray(0, Number(n))).toString("hex"), mac);
  });

  it("messaggio SUN del vettore AN12196: UID 04DE5F1EACC040, contatore 61, CMAC valido", () => {
    const r = verificaMessaggioSun(VETTORE, { metaRead: Buffer.alloc(16), fileRead: Buffer.alloc(16) });
    assert.deepEqual(r, { uid: "04DE5F1EACC040", contatore: 61, macValido: true });
  });

  it("CMAC alterato o chiave sbagliata -> non valido", () => {
    const zero = { metaRead: Buffer.alloc(16), fileRead: Buffer.alloc(16) };
    assert.equal(verificaMessaggioSun({ ...VETTORE, c: "94EED9EE65337087" }, zero).macValido, false);
    assert.equal(verificaMessaggioSun(VETTORE, { ...zero, fileRead: Buffer.alloc(16, 1) }).macValido, false);
  });

  describe("endpoint", () => {
    let env, app, token, idCapo;
    before(async () => {
      env = await avviaAmbiente({ SDM_META_READ_KEY: "0".repeat(32), SDM_FILE_READ_KEY: "0".repeat(32) });
      app = env.app;
      token = await creaUtenti(app);
      const r = await request(app).post("/api/items").set(auth(token.brand_manager)).send(capoDiProva("NFC-424"));
      idCapo = r.body._id;
      await attendiAncoraggi();
    });
    after(() => env.chiudi());

    it("chip non ancora associato -> 404", async () => {
      const r = await request(app).get(`/api/verify/sun?e=${VETTORE.e}&c=${VETTORE.c}`);
      assert.equal(r.status, 404);
    });

    it("associazione del chip al capo tramite messaggio SUN", async () => {
      const r = await request(app).post(`/api/items/${idCapo}/nfc`).set(auth(token.brand_manager)).send({ uid: "04DE5F1EACC040" });
      assert.equal(r.status, 200);
      assert.equal(r.body.nfc.uid, "04DE5F1EACC040");
    });

    it("prima lettura -> certificato; stesso URL riusato -> 409 replay", async () => {
      const prima = await request(app).get(`/api/verify/sun?e=${VETTORE.e}&c=${VETTORE.c}`);
      assert.equal(prima.status, 200);
      assert.equal(prima.body.capo.tagId, "NFC-424");
      assert.equal(prima.body.nfc.antiReplay, "superato");
      assert.equal(prima.body.nfc.contatoreLetture, 61);
      const seconda = await request(app).get(`/api/verify/sun?e=${VETTORE.e}&c=${VETTORE.c}`);
      assert.equal(seconda.status, 409);
      assert.equal(seconda.body.replay, true);
    });

    it("messaggio alterato -> 400; parametri malformati -> 400", async () => {
      assert.equal((await request(app).get(`/api/verify/sun?e=${VETTORE.e}&c=94EED9EE65337087`)).status, 400);
      assert.equal((await request(app).get("/api/verify/sun?e=123&c=xyz")).status, 400);
    });

    it("associazione con messaggio non autentico -> 400", async () => {
      const r = await request(app).post(`/api/items/${idCapo}/nfc`).set(auth(token.brand_manager)).send({ e: VETTORE.e, c: "0000000000000000" });
      assert.equal(r.status, 400);
    });
  });
});
```

## `backend/test/verify.test.js`

```javascript
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";
import { avviaAmbiente, creaUtenti, auth, capoDiProva, attendiAncoraggi } from "./helpers.js";

describe("Verifica pubblica, integrità e limiti (punti 8, 10, 13)", () => {
  let env, app, token, Item;
  before(async () => {
    env = await avviaAmbiente();
    app = env.app;
    token = await creaUtenti(app);
    ({ default: Item } = await import("../models/Item.js"));
  });
  after(() => env.chiudi());

  async function capoCompleto(tagId) {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva(tagId, { proprietarioIniziale: "Boutique Vintage" }));
    await request(app).post(`/api/items/${r.body._id}/eventi`).set(auth(token.artigiano)).send({ tipo: "riparazione", descrizione: "Nuova fodera", operatore: "Lab Bari" });
    await request(app).post(`/api/items/${r.body._id}/proprieta`).set(auth(token.commerciante)).send({ proprietario: "Maria Rossi" });
    await attendiAncoraggi();
    return r.body._id;
  }

  it("certificato pubblico senza login: autentico, integrità verificata, nomi minimizzati, impatto con fonti", async () => {
    await capoCompleto("NFC-100");
    const r = await request(app).get("/api/verify/NFC-100");
    assert.equal(r.status, 200);
    const c = r.body.certificatoAutenticita;
    assert.equal(c.autentico, true);
    assert.equal(c.integrita.stato, "verificato");
    assert.equal(c.integrita.voci.verificate, 3);
    assert.deepEqual(r.body.capo.passaggiProprieta.map((p) => p.proprietario), ["B. V.", "M. R."]);
    assert.ok(!JSON.stringify(r.body).includes("Rossi"));
    const imp = r.body.impattoAmbientale;
    assert.equal(imp.disponibile, true);
    assert.equal(imp.co2RisparmiataKg, 12); // 20,0 kg CO2e x 0,6
    assert.equal(imp.acquaPreservataLitri, 1753); // 2922 L x 0,6
    assert.equal(imp.fonti.length, 2);
  });

  it("tag mai registrato -> 404 con autentico = false", async () => {
    const r = await request(app).get("/api/verify/NFC-FALSO");
    assert.equal(r.status, 404);
    assert.equal(r.body.autentico, false);
  });

  it("categoria senza coefficienti: impatto 'non disponibile' invece di numeri inventati", async () => {
    await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-BORSA", { categoria: "borsa" }));
    await attendiAncoraggi();
    const r = await request(app).get("/api/verify/NFC-BORSA");
    assert.equal(r.body.impattoAmbientale.disponibile, false);
  });

  it("manomissione di un evento direttamente nel database -> 'manomesso'", async () => {
    const id = await capoCompleto("NFC-200");
    await Item.updateOne({ _id: id }, { $set: { "storicoRigenerazione.0.descrizione": "Riparazione mai avvenuta" } });
    const r = await request(app).get("/api/verify/NFC-200");
    assert.equal(r.body.certificatoAutenticita.integrita.stato, "manomesso");
    assert.equal(r.body.certificatoAutenticita.autentico, false);
    assert.equal(r.body.certificatoAutenticita.integrita.voci.alterate.length, 1);
  });

  it("manomissione dei dati del capo (brand) -> 'manomesso'", async () => {
    const id = await capoCompleto("NFC-300");
    await Item.updateOne({ _id: id }, { $set: { brand: "Hermès" } });
    const r = await request(app).get("/api/verify/NFC-300");
    assert.equal(r.body.certificatoAutenticita.integrita.datiCapo, "diversi");
    assert.equal(r.body.certificatoAutenticita.integrita.stato, "manomesso");
  });

  it("cancellazione di un passaggio di proprietà dal database -> 'manomesso' (voce presente solo on-chain)", async () => {
    const id = await capoCompleto("NFC-400");
    await Item.updateOne({ _id: id }, { $pop: { passaggiProprieta: 1 } });
    const r = await request(app).get("/api/verify/NFC-400");
    assert.equal(r.body.certificatoAutenticita.integrita.voci.soloOnChain, 1);
    assert.equal(r.body.certificatoAutenticita.integrita.stato, "manomesso");
  });

  it("dati della versione precedente (mai ancorati) -> 'non_registrato', poi 'verificato' dopo la migrazione", async () => {
    const legacy = await Item.collection.insertOne({
      brand: "Gucci", codiceModello: "GG-2024", materialiOriginari: "Pelle e cotone", filieraProvenienza: "Italia",
      tagId: "NFC-V1", blockchainTxHash: "0xabc",
      storicoRigenerazione: [{ _id: new mongoose.Types.ObjectId(), tipo: "upcycling", descrizione: "Rifoderatura interna", data: new Date() }],
      passaggiProprieta: [{ _id: new mongoose.Types.ObjectId(), proprietario: "Maria Rossi", data: new Date() }],
      createdAt: new Date(), updatedAt: new Date(),
    });
    let r = await request(app).get("/api/verify/NFC-V1");
    assert.equal(r.body.certificatoAutenticita.integrita.stato, "non_registrato");
    const { ancoraArretrati } = await import("../services/anchorService.js");
    const item = await Item.findById(legacy.insertedId);
    assert.equal(await ancoraArretrati(item), 3);
    await attendiAncoraggi();
    r = await request(app).get("/api/verify/NFC-V1");
    assert.equal(r.body.certificatoAutenticita.integrita.stato, "verificato");
  });

  it("limite di richieste sulla verifica pubblica -> 429", async () => {
    process.env.RATE_LIMIT_VERIFY_PER_MIN = "3";
    const appLimitata = env.creaApp();
    process.env.RATE_LIMIT_VERIFY_PER_MIN = "10000";
    const codici = [];
    for (let i = 0; i < 5; i++) codici.push((await request(appLimitata).get("/api/verify/NFC-100")).status);
    assert.deepEqual(codici, [200, 200, 200, 429, 429]);
  });
});
```

## `backend/validators/schemi.js`

```javascript
// Validazione dei dati in ingresso (requisito R: nessun dato malformato nel database).
import { z } from "zod";
import { TIPI_EVENTO, RUOLI, CATEGORIE, MATERIALI, STATI_CAPO, TAG_REGEX } from "../models/costanti.js";

const testo = (max) => z.string().trim().min(1, "Campo obbligatorio").max(max, `Massimo ${max} caratteri`);
const testoOpzionale = (max) => z.string().trim().max(max, `Massimo ${max} caratteri`).optional();

export const tagId = z.string().trim().regex(TAG_REGEX, "Il tagId deve avere 3-64 caratteri tra lettere, numeri, - e _");
export const objectId = z.string().regex(/^[a-f\d]{24}$/i, "ID non valido");

export const login = z.object({
  email: z.string().trim().email("Email non valida"),
  password: z.string().min(1, "Password obbligatoria").max(200),
});

export const nuovoUtente = z.object({
  nome: testo(100),
  email: z.string().trim().email("Email non valida"),
  password: z.string().min(10, "La password deve avere almeno 10 caratteri").max(200),
  ruolo: z.enum(RUOLI),
  organizzazione: testoOpzionale(150),
});

export const cambioPassword = z.object({
  vecchia: z.string().min(1).max(200),
  nuova: z.string().min(10, "La nuova password deve avere almeno 10 caratteri").max(200),
});

const campiCapo = {
  brand: testo(100),
  codiceModello: testo(100),
  materialiOriginari: testo(300),
  filieraProvenienza: testoOpzionale(200),
  categoria: z.enum(CATEGORIE).optional(),
  materialePrincipale: z.enum(MATERIALI).optional(),
  annoProduzione: z.coerce
    .number()
    .int()
    .min(1900)
    .refine((a) => a <= new Date().getFullYear(), "L'anno non può essere nel futuro")
    .optional(),
};

// In modifica i campi facoltativi si possono svuotare inviando null
const svuotabile = (schema) => schema.unwrap().nullable().optional();

export const nuovoCapo = z
  .object({ ...campiCapo, tagId, proprietarioIniziale: testoOpzionale(100) })
  .strict();

// Il tagId NON è modificabile: è il legame con il chip fisico
export const modificaCapo = z
  .object({
    ...campiCapo,
    filieraProvenienza: svuotabile(campiCapo.filieraProvenienza),
    categoria: svuotabile(campiCapo.categoria),
    materialePrincipale: svuotabile(campiCapo.materialePrincipale),
    annoProduzione: svuotabile(campiCapo.annoProduzione),
  })
  .partial()
  .strict()
  .refine((d) => Object.keys(d).length > 0, "Nessun campo da modificare");

export const nuovoEvento = z
  .object({
    tipo: z.enum(TIPI_EVENTO, {
      errorMap: () => ({ message: `Il campo 'tipo' deve essere uno tra: ${TIPI_EVENTO.join(", ")}` }),
    }),
    descrizione: testo(1000),
    materialiNuovi: testoOpzionale(300),
    operatore: testoOpzionale(100),
    data: z.coerce
      .date()
      .refine((d) => d.getTime() <= Date.now() + 60_000, "La data non può essere nel futuro")
      .optional(),
  })
  .strict();

export const nuovoPassaggio = z.object({ proprietario: testo(100) }).strict();

export const filtriElenco = z.object({
  q: z.string().trim().max(100).optional(),
  stato: z.enum(STATI_CAPO).optional(),
  pagina: z.coerce.number().int().min(1).default(1),
  perPagina: z.coerce.number().int().min(1).max(100).default(20),
});

const hex = (n) => z.string().regex(new RegExp(`^[0-9A-Fa-f]{${n}}$`), `Atteso un valore esadecimale di ${n} caratteri`);

// Messaggio SUN del chip NTAG 424 DNA (parametri dell'URL: e = PICCData, c = CMAC)
export const messaggioSun = z.object({ e: hex(32), c: hex(16) });

export const associaNfc = z.union([messaggioSun.strict(), z.object({ uid: hex(14) }).strict()]);
```

## `contracts/.env.example`

```bash
# Copia in ".env" (NON condividere). Usa un wallet DEDICATO ai test.
# Polygon Amoy testnet (chainId 80002). Per la chain locale: http://127.0.0.1:8545
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
# Generata da "npm run crea-wallet" (non incollarla a mano in chat o documenti)
PLATFORM_PRIVATE_KEY=
# Opzionale: indirizzo del forwarder EIP-2771 (vuoto = solo transazioni dirette)
TRUSTED_FORWARDER=
```

## `contracts/.gitignore`

```
node_modules/
.env
cache/
artifacts/
```

## `contracts/compile.cjs`

```javascript
// Compila RegenLuxuryPassport.sol con solc-js.
// Produce: RegenLuxuryPassport.json (abi + bytecode) e copia l'ABI nel backend.
// Uso: npm run compile
const solc = require("solc");
const fs = require("fs");
const path = require("path");

const source = fs.readFileSync(path.join(__dirname, "RegenLuxuryPassport.sol"), "utf8");
const input = {
  language: "Solidity",
  sources: { "RegenLuxuryPassport.sol": { content: source } },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    evmVersion: "cancun", // richiesto da OpenZeppelin 5.x (opcode mcopy); supportato da Polygon PoS
    outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
  },
};

function findImports(importPath) {
  try {
    return { contents: fs.readFileSync(path.join(__dirname, "node_modules", importPath), "utf8") };
  } catch {
    return { error: `Import non trovato: ${importPath}` };
  }
}

const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
for (const e of output.errors ?? []) console.log(e.severity.toUpperCase(), e.formattedMessage);
const c = output.contracts?.["RegenLuxuryPassport.sol"]?.RegenLuxuryPassport;
if (!c) process.exit(1);

fs.writeFileSync(
  path.join(__dirname, "RegenLuxuryPassport.json"),
  JSON.stringify({ abi: c.abi, bytecode: "0x" + c.evm.bytecode.object }, null, 2)
);
const abiBackend = path.join(__dirname, "..", "backend", "services", "blockchain", "RegenLuxuryPassport.abi.json");
if (fs.existsSync(path.dirname(abiBackend))) fs.writeFileSync(abiBackend, JSON.stringify({ abi: c.abi }, null, 2));
console.log("Compilazione OK -> RegenLuxuryPassport.json (ABI copiata anche nel backend)");
```

## `contracts/crea-wallet.mjs`

```javascript
// Crea un wallet DI TEST per la piattaforma e salva la chiave privata nel file .env
// (la chiave non viene mai stampata a schermo). Mostra solo l'indirizzo pubblico,
// da incollare nel faucet di Polygon Amoy per ricevere POL di prova.
// Uso: npm run crea-wallet
import fs from "node:fs";
import { Wallet } from "ethers";

const file = new URL("./.env", import.meta.url);
let contenuto = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : fs.readFileSync(new URL("./.env.example", import.meta.url), "utf8");

const esistente = contenuto.match(/^PLATFORM_PRIVATE_KEY=(0x[0-9a-fA-F]{64})\s*$/m);
if (esistente) {
  console.log("Wallet già presente nel file .env. Indirizzo:", new Wallet(esistente[1]).address);
  process.exit(0);
}

const wallet = Wallet.createRandom();
contenuto = /^PLATFORM_PRIVATE_KEY=.*$/m.test(contenuto)
  ? contenuto.replace(/^PLATFORM_PRIVATE_KEY=.*$/m, `PLATFORM_PRIVATE_KEY=${wallet.privateKey}`)
  : `${contenuto.trimEnd()}\nPLATFORM_PRIVATE_KEY=${wallet.privateKey}\n`;
fs.writeFileSync(file, contenuto, { mode: 0o600 });

console.log("Wallet di test creato. Chiave privata salvata in contracts/.env (non condividerla).");
console.log("Indirizzo pubblico:", wallet.address);
console.log("Prossimo passo: chiedi POL di prova per questo indirizzo al faucet di Polygon Amoy.");
```

## `contracts/deploy.mjs`

```javascript
// Deploy di RegenLuxuryPassport.
//  - Chain locale (npm run chain):  POLYGON_RPC_URL=http://127.0.0.1:8545  (nessuna chiave necessaria)
//  - Polygon Amoy (testnet):         POLYGON_RPC_URL + PLATFORM_PRIVATE_KEY nel file .env
// Uso: npm run deploy
import "dotenv/config";
import { ethers } from "ethers";
import { readFileSync } from "node:fs";

const { abi, bytecode } = JSON.parse(readFileSync(new URL("./RegenLuxuryPassport.json", import.meta.url)));
const rpc = process.env.POLYGON_RPC_URL ?? "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(rpc);

const locale = /127\.0\.0\.1|localhost/.test(rpc);
const firmatario = process.env.PLATFORM_PRIVATE_KEY
  ? new ethers.Wallet(process.env.PLATFORM_PRIVATE_KEY, provider)
  : locale
    ? await provider.getSigner(0)
    : null;
if (!firmatario) {
  console.error("PLATFORM_PRIVATE_KEY mancante: esegui prima 'npm run crea-wallet'.");
  process.exit(1);
}

const indirizzo = await firmatario.getAddress();
const saldo = await provider.getBalance(indirizzo);
const rete = await provider.getNetwork();
console.log(`Rete: chainId ${rete.chainId} | account: ${indirizzo} | saldo: ${ethers.formatEther(saldo)} POL`);
if (saldo === 0n) {
  console.error("Saldo zero: richiedi POL di prova al faucet di Amoy e riprova.");
  process.exit(1);
}

const forwarder = process.env.TRUSTED_FORWARDER || ethers.ZeroAddress; // nessun forwarder = solo tx dirette
const contratto = await new ethers.ContractFactory(abi, bytecode, firmatario).deploy(forwarder, indirizzo);
const ricevuta = await contratto.deploymentTransaction().wait();

console.log("Contratto deployato a:", await contratto.getAddress());
console.log(`Gas usato per il deploy: ${ricevuta.gasUsed}`);
console.log("Copia l'indirizzo in CONTRACT_ADDRESS nel file backend/.env e imposta BLOCKCHAIN_MODE=polygon");
```

## `contracts/hardhat.config.cjs`

```javascript
// Solo per "npm run chain": avvia una blockchain locale di prova (chainId 31337)
// con 20 account già finanziati. Nessun costo, nessun wallet reale.
module.exports = {
  solidity: "0.8.24",
  networks: { hardhat: { chainId: 31337, hardfork: "cancun" } },
};
```

## `contracts/misura-gas.mjs`

```javascript
/*
 * Misura il gas di ogni operazione della piattaforma (dati per il Capitolo 6).
 * Esegue: deploy, registrazione di un capo, aggiornamento dati, evento di
 * rigenerazione, passaggio di proprietà e lettura pubblica.
 * Uso (con la chain locale avviata in un altro terminale: npm run chain):
 *   npm run misura-gas
 *   npm run misura-gas -- --gwei 30 --prezzo-pol 0.20      (stima dei costi in euro)
 * Il gas usato è lo stesso su Amoy e sulla rete principale Polygon (stessa EVM);
 * il COSTO dipende da prezzo del gas (gwei) e prezzo di POL: indicare valori con data e fonte.
 */
import { ethers } from "ethers";
import { readFileSync, writeFileSync } from "node:fs";

const argomento = (nome, predefinito) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > -1 ? process.argv[i + 1] : predefinito;
};
const rpc = argomento("rpc", "http://127.0.0.1:8545");
const gwei = argomento("gwei");
const prezzoPol = argomento("prezzo-pol");

const { abi, bytecode } = JSON.parse(readFileSync(new URL("./RegenLuxuryPassport.json", import.meta.url)));
const provider = new ethers.JsonRpcProvider(rpc);
const firmatario = await provider.getSigner(0);
const indirizzo = await firmatario.getAddress();
const h = (s) => ethers.id(s);

const misure = [];
const registra = async (operazione, promessaTx) => {
  const tx = await promessaTx;
  const r = await tx.wait();
  misure.push({ operazione, gas: Number(r.gasUsed) });
  return r;
};

const factory = new ethers.ContractFactory(abi, bytecode, firmatario);
const c = await factory.deploy(ethers.ZeroAddress, indirizzo);
const ricevutaDeploy = await c.deploymentTransaction().wait();
misure.push({ operazione: "Deploy del contratto (una tantum)", gas: Number(ricevutaDeploy.gasUsed) });

await registra("Registrazione di un capo (mint)", c.registerItem(indirizzo, h("NFC-GAS-1"), h("dati-v1")));
await registra("Registrazione di un secondo capo", c.registerItem(indirizzo, h("NFC-GAS-2"), h("dati-v1")));
await registra("Aggiornamento dati / archiviazione", c.updateDataHash(1, h("dati-v2")));
await registra("Evento di rigenerazione (primo)", c.recordRegeneration(1, h("evento-1")));
await registra("Evento di rigenerazione (successivo)", c.recordRegeneration(1, h("evento-2")));
await registra("Passaggio di proprietà", c.recordTransfer(1, h("passaggio-1")));

// Controlli di sicurezza del contratto
const [registrato, , dataHash, storico] = await c.recordByTag(h("NFC-GAS-1"));
console.assert(registrato && dataHash === h("dati-v2") && storico.length === 3, "lettura pubblica non coerente");
let duplicato = false;
try {
  await c.registerItem.staticCall(indirizzo, h("NFC-GAS-1"), h("x"));
} catch (err) {
  duplicato = err.revert?.name === "TagAlreadyRegistered";
}
console.assert(duplicato, "il tag duplicato doveva essere rifiutato");
const estraneo = ethers.Wallet.createRandom().connect(provider);
let negato = false;
try {
  await c.connect(estraneo).recordRegeneration.staticCall(1, h("x"));
} catch (err) {
  negato = err.revert?.name === "AccessControlUnauthorizedAccount";
}
console.assert(negato, "un account senza ruolo doveva essere rifiutato");

const righe = misure.map((m) => {
  const riga = { ...m };
  if (gwei && prezzoPol) {
    const costoPol = (m.gas * Number(gwei)) / 1e9;
    riga.costoPol = costoPol;
    riga.costoEuro = costoPol * Number(prezzoPol);
  }
  return riga;
});

console.log("\nGas per operazione (RegenLuxuryPassport, solc 0.8.24, optimizer 200 runs)\n");
for (const r of righe) {
  const costo = r.costoEuro !== undefined ? ` | ${r.costoPol.toFixed(6)} POL | ${r.costoEuro.toFixed(5)} EUR` : "";
  console.log(`${r.operazione.padEnd(40)} ${String(r.gas).padStart(9)} gas${costo}`);
}
console.log(`\nLettura pubblica recordByTag: 0 gas (chiamata di sola lettura)`);
console.log(`Controlli: tag duplicato rifiutato = ${duplicato}; account senza ruolo rifiutato = ${negato}`);
if (!gwei) console.log("Per stimare i costi: npm run misura-gas -- --gwei <prezzo gas> --prezzo-pol <euro per POL>");

const letturaCoerente = registrato && dataHash === h("dati-v2") && storico.length === 3;
writeFileSync(
  new URL("../docs/costi/misure-gas.json", import.meta.url),
  JSON.stringify({ data: new Date().toISOString(), rpc, gwei, prezzoPol, controlli: { letturaCoerente, duplicato, negato }, misure: righe }, null, 2)
);
console.log("Risultati salvati in docs/costi/misure-gas.json");

// Un controllo di sicurezza non superato deve far fallire lo script (codice di uscita 1)
if (!letturaCoerente || !duplicato || !negato) {
  console.error("CONTROLLI DI SICUREZZA NON SUPERATI");
  process.exitCode = 1;
}
```

## `contracts/package.json`

```json
{
  "name": "regen-luxury-contracts",
  "version": "2.0.0",
  "private": true,
  "description": "Smart contract RegenLuxuryPassport (ERC-721) - Capitolo 4.2",
  "type": "module",
  "scripts": {
    "compile": "node compile.cjs",
    "chain": "hardhat node --config hardhat.config.cjs",
    "deploy": "node deploy.mjs",
    "crea-wallet": "node crea-wallet.mjs",
    "misura-gas": "node misura-gas.mjs"
  },
  "dependencies": {
    "@openzeppelin/contracts": "^5.6.1",
    "dotenv": "^16.6.1",
    "ethers": "^6.17.0",
    "solc": "0.8.24"
  },
  "devDependencies": {
    "hardhat": "^2.29.1"
  },
  "license": "MIT"
}
```

## `contracts/RegenLuxuryPassport.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Passaporto digitale on-chain dei capi rigenerati (Capitolo 4.2).
// Principi:
//  - nessun dato personale on-chain (GDPR): si salvano solo IMPRONTE (keccak256)
//  - un tag = un solo token: un tag già registrato non può identificare un altro capo
//  - storico append-only: rigenerazioni e passaggi di proprietà si possono solo aggiungere
//  - la piattaforma custodisce i token e paga il gas (utente finale senza wallet, RC-5)
//  - ERC-2771: predisposto per meta-transazioni tramite un trusted forwarder

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC2771Context} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";

contract RegenLuxuryPassport is ERC721, AccessControl, ERC2771Context {
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE"); // brand manager / piattaforma
    bytes32 public constant ARTISAN_ROLE = keccak256("ARTISAN_ROLE");     // laboratori di rigenerazione

    uint256 private _nextTokenId = 1;

    /// impronta del tagId fisico -> tokenId (0 = non registrato)
    mapping(bytes32 => uint256) public tokenByTag;
    /// impronta attuale dei dati identificativi del capo
    mapping(uint256 => bytes32) public dataHashOf;
    /// storico immutabile delle impronte (rigenerazioni e passaggi di proprietà)
    mapping(uint256 => bytes32[]) private _history;

    event ItemRegistered(uint256 indexed tokenId, bytes32 indexed tagHash, bytes32 dataHash);
    event DataHashUpdated(uint256 indexed tokenId, bytes32 previousHash, bytes32 newHash);
    event RegenerationRecorded(uint256 indexed tokenId, bytes32 eventHash, address indexed operator);
    event OwnershipRecorded(uint256 indexed tokenId, bytes32 transferHash);

    error TagAlreadyRegistered(bytes32 tagHash);
    error UnknownToken(uint256 tokenId);

    constructor(address trustedForwarder, address admin)
        ERC721("Regen Luxury Passport", "RLP")
        ERC2771Context(trustedForwarder)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REGISTRAR_ROLE, admin);
        _grantRole(ARTISAN_ROLE, admin);
    }

    /// Crea l'identità digitale del capo (mint del token) legata all'impronta del tag.
    function registerItem(address custody, bytes32 tagHash, bytes32 dataHash)
        external
        onlyRole(REGISTRAR_ROLE)
        returns (uint256 tokenId)
    {
        if (tokenByTag[tagHash] != 0) revert TagAlreadyRegistered(tagHash);
        tokenId = _nextTokenId++;
        tokenByTag[tagHash] = tokenId;
        dataHashOf[tokenId] = dataHash;
        _safeMint(custody, tokenId);
        emit ItemRegistered(tokenId, tagHash, dataHash);
    }

    /// Aggiorna l'impronta dei dati (modifica o archiviazione): la precedente resta negli eventi.
    function updateDataHash(uint256 tokenId, bytes32 newHash) external onlyRole(REGISTRAR_ROLE) {
        _requireExists(tokenId);
        emit DataHashUpdated(tokenId, dataHashOf[tokenId], newHash);
        dataHashOf[tokenId] = newHash;
    }

    /// Ancora l'impronta di un intervento di rigenerazione.
    function recordRegeneration(uint256 tokenId, bytes32 eventHash) external onlyRole(ARTISAN_ROLE) {
        _requireExists(tokenId);
        _history[tokenId].push(eventHash);
        emit RegenerationRecorded(tokenId, eventHash, _msgSender());
    }

    /// Ancora l'impronta di un passaggio di proprietà (i nomi restano off-chain).
    function recordTransfer(uint256 tokenId, bytes32 transferHash) external onlyRole(REGISTRAR_ROLE) {
        _requireExists(tokenId);
        _history[tokenId].push(transferHash);
        emit OwnershipRecorded(tokenId, transferHash);
    }

    /// Verifica pubblica: lettura gratuita, nessuna transazione.
    function recordByTag(bytes32 tagHash)
        external
        view
        returns (bool registered, uint256 tokenId, bytes32 dataHash, bytes32[] memory history)
    {
        tokenId = tokenByTag[tagHash];
        if (tokenId == 0) return (false, 0, bytes32(0), new bytes32[](0));
        return (true, tokenId, dataHashOf[tokenId], _history[tokenId]);
    }

    function _requireExists(uint256 tokenId) private view {
        if (_ownerOf(tokenId) == address(0)) revert UnknownToken(tokenId);
    }

    // --- override richiesti dall'ereditarietà multipla ---
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _msgSender() internal view override(Context, ERC2771Context) returns (address) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }

    function _contextSuffixLength() internal view override(Context, ERC2771Context) returns (uint256) {
        return ERC2771Context._contextSuffixLength();
    }
}
```

## `docs/costi/gas-e-costi.md`

```markdown
# Costi on-chain misurati — dati per il Capitolo 6 (punto 14)

Misure ottenute con `npm run misura-gas` nella cartella `contracts/` (chain locale Hardhat, solc 0.8.24,
ottimizzatore 200 run, contratto `RegenLuxuryPassport`). Il **gas** di ogni operazione è lo stesso su Polygon
Amoy e sulla rete principale Polygon PoS (stessa EVM); il **costo** dipende da prezzo del gas e prezzo di POL.

| Operazione | Gas |
|---|---:|
| Deploy del contratto (una tantum) | 1.633.950 |
| Registrazione del primo capo (mint) | 124.074 |
| Registrazione di un capo successivo | 106.974 |
| Aggiornamento dati / archiviazione | 33.720 |
| Primo evento di rigenerazione | 73.186 |
| Evento di rigenerazione successivo | 56.086 |
| Passaggio di proprietà | 55.503 |
| Verifica pubblica (`recordByTag`) | 0 (sola lettura) |

**Ciclo di vita tipico di un capo** (registrazione + 3 interventi + 2 passaggi di proprietà): **403.338 gas**.

## Costo per capo: scenari

costo (POL) = gas × prezzo del gas (gwei) × 10⁻⁹ — costo (€) = costo (POL) × prezzo di POL (€)

| Prezzo del gas | POL a 0,10 € | POL a 0,50 € |
|---|---:|---:|
| 30 gwei | 0,0012 € | 0,0061 € |
| 100 gwei | 0,0040 € | 0,0202 € |
| 300 gwei | 0,0121 € | 0,0605 € |

Anche nello scenario più sfavorevole il costo dell'intera storia di un capo resta sotto i **7 centesimi**.

## Come ottenere i valori da citare in tesi

I prezzi cambiano di continuo: nella tesi va indicato un valore **con data e fonte**.

1. Prezzo del gas su Polygon PoS: PolygonScan Gas Tracker — https://polygonscan.com/gastracker
2. Prezzo di POL in euro: CoinGecko — https://www.coingecko.com/en/coins/polygon/eur
3. Ricalcolo: `npm run misura-gas -- --gwei <valore> --prezzo-pol <valore>` (salva i risultati e l'esito dei controlli di sicurezza in `docs/costi/misure-gas.json`; se un controllo fallisce lo script termina con errore).

## Direzioni per la sostenibilità economica (Cap. 6, §3.3.3)

1. **Costo assorbito dalla piattaforma**: con costi marginali di frazioni di centesimo per capo, anche mille
   capi l'anno costano pochi euro.
2. **Quota associativa simbolica** di una cooperativa di operatori, che copre gas e hosting.
3. **Ancoraggio a lotti**: invece di una transazione per evento, un'unica impronta (radice di un *Merkle tree*)
   al giorno per tutti gli eventi → costo quasi indipendente dal numero di capi (sviluppo futuro).
```

## `docs/crediti-foto.md`

```markdown
# Crediti delle foto e dei font della web app

## Foto dei caroselli della home

Foto decorative ospitate da Unsplash e caricate direttamente dal loro server (`images.unsplash.com`),
con la **licenza Unsplash** (uso gratuito, anche commerciale, senza obbligo di attribuzione:
<https://unsplash.com/license>). Sono state scelte foto senza loghi in evidenza: la licenza non copre
marchi e loghi, che restano dei rispettivi titolari. Elenco in `frontend/src/data/foto.js`.

| Fascia | Didascalia | Pagina della foto |
|---|---|---|
| I capi | Giacca in pelle | https://unsplash.com/photos/nsRBbE6-YLs |
| I capi | Borsa in pelle | https://unsplash.com/photos/oCXVxwTFwqE |
| I capi | Pelle vissuta | https://unsplash.com/photos/3OFBcQQTN64 |
| I capi | Trench e accessori | https://unsplash.com/photos/W-7k72ThEr0 |
| I capi | Tracolla in pelle | https://unsplash.com/photos/ZB4eQcNqVUs |
| I capi | Montoni vintage | https://unsplash.com/photos/eTCogYz7kQE |
| La rigenerazione | Laboratorio sartoriale | https://unsplash.com/photos/TAZUc51iPUM |
| La rigenerazione | Boutique vintage | https://unsplash.com/photos/vFcfeKAKGlg |
| La rigenerazione | La vetrina | https://unsplash.com/photos/bUg7Fdq6nXo |
| La rigenerazione | Cucitura di precisione | https://unsplash.com/photos/jNKv4QohAk0 |
| La rigenerazione | Seconda vita | https://unsplash.com/photos/UdQt3FT6rxM |
| La rigenerazione | Riparazione | https://unsplash.com/photos/F14VKsS0iL8 |
| La rigenerazione | Pelle rigenerata | https://unsplash.com/photos/KgjNOmuTlNw |
| La rigenerazione | Filati e forbici | https://unsplash.com/photos/tX62O5F3AfU |

Se una foto non si carica (offline o rimossa), al suo posto resta un riquadro scuro con la didascalia.
Per la demo o per la stampa si possono sostituire con foto proprie: basta cambiare gli indirizzi in `foto.js`.

## Font

**Cormorant Garamond** (titoli), Copyright 2015 The Cormorant Project Authors, **SIL Open Font License 1.1**.
File `.woff2` (sottoinsieme latino) e testo della licenza in `frontend/src/assets/fonts/`.
```

## `docs/decisioni/4.2-custodia-e-commissioni.md`

```markdown
# Decisione da condividere con il relatore — Capitolo 4.2 (punto 11)

**Chi possiede i token dei capi e chi paga le commissioni (gas)?**
La scelta riguarda il vincolo RC-5 (costo nullo o trascurabile per l'utente) e va motivata nel §4.2 e nel Cap. 6.

## Le tre opzioni

| | A. Custodia della piattaforma *(implementata)* | B. Wallet degli operatori + meta-transazioni EIP-2771 | C. Account astratti ERC-4337 + paymaster |
|---|---|---|---|
| Chi firma le transazioni | Il wallet della piattaforma (backend) | Ogni commerciante/artigiano con un proprio wallet; un *relayer* le inoltra | Uno *smart account* per operatore; un *paymaster* paga il gas |
| Chi paga il gas | La piattaforma | La piattaforma (tramite il relayer) | La piattaforma (tramite il paymaster) |
| Cosa serve all'operatore | Solo login alla web app | Un wallet (es. MetaMask) e firmare ogni operazione | Un account creato dalla piattaforma, anche con passkey |
| Cosa serve al cliente | Nulla | Nulla | Nulla |
| Tracciabilità di *chi* ha fatto cosa on-chain | Nel database (campo `registratoDa`); on-chain c'è solo la piattaforma | Sì: l'indirizzo dell'operatore compare nell'evento | Sì |
| Fiducia richiesta | Nella piattaforma (è l'unica a scrivere) | Distribuita tra gli operatori | Distribuita tra gli operatori |
| Complessità | Bassa: già funzionante e testata (8/8 passaggi su chain reale) | Media: contratto già predisposto (`ERC2771Context`), serve un forwarder e firme nel frontend | Alta: bundler, paymaster, account factory |
| Adatta a piccoli negozi senza competenze IT (requisito U) | Sì | Parzialmente (gestione del wallet) | Sì, ma con più infrastruttura |

## Proposta

1. **Prototipo della tesi: opzione A** (custodia della piattaforma). È coerente con il requisito di usabilità,
   azzera i costi per operatori e clienti ed è già implementata e verificata.
2. **Evoluzione dichiarata nel Cap. 6: opzione B**, perché il contratto eredita già `ERC2771Context` e basta un
   forwarder (per esempio `ERC2771Forwarder` di OpenZeppelin) per passare a firme individuali senza costi per l'operatore.
3. **Opzione C come sviluppo futuro**, citando ERC-4337 senza implementarla.

## Punti deboli da dichiarare (difendibilità)

- Con l'opzione A la blockchain garantisce che i dati **non vengano alterati dopo la registrazione** (controllo
  di integrità), ma non prova *quale* operatore li ha inseriti: questa informazione resta nel database.
- La piattaforma deve custodire una chiave privata: in produzione servirebbe un servizio di gestione delle
  chiavi (KMS/HSM); nel prototipo sta nel file `.env`, escluso da Git.

## Domande per il relatore

1. Va bene l'opzione A per il prototipo, con B come evoluzione descritta nel Cap. 6?
2. Serve dimostrare su **Polygon Amoy** (testnet pubblica) o basta la **chain locale** di prova?
3. Nel Cap. 2 si cita DeepFashion: posso dichiarare TextileNet come dataset di addestramento (licenza CC BY, download diretto)?
```

## `docs/demo.md`

```markdown
# Copione della demo per la discussione (punto 28)

Durata: 5–7 minuti. Materiale: telefono, un capo con tag NTAG 424 DNA cucito, un'etichetta QR stampata,
il portatile con la web app aperta sull'area gestionale.

## Prima di iniziare (10 minuti prima)

- [ ] Apri `https://regen-luxury.onrender.com/api/health` per "svegliare" il server (piano gratuito).
- [ ] Sul Mac: `npm run popola-demo` (ricrea i capi di prova se mancano e rende di nuovo valido il link del chip di prova).
- [ ] Prova una lettura del tag e del QR.
- [ ] Accedi all'area gestionale con un account **artigiano** e uno **commerciante** (due schede).
- [ ] Tieni pronte le schermate in `docs/validazione/schermate/` come piano B se la rete non funziona.

## Sequenza

1. **Il problema (30 s).** "Un capo di lusso rigenerato cambia mani più volte: come fa l'acquirente a fidarsi
   della sua storia, senza app e senza costi?"
2. **Tocco sul tag (1 min).** Avvicina il telefono al tag: si apre il certificato con "Capo autentico" e
   "Chip NFC autentico · lettura n. X". Mostra storia della rigenerazione, catena dei proprietari (solo
   iniziali, GDPR) e impatto ambientale con le fonti ("Come è calcolato").
3. **Anti-replay (30 s).** Ricarica la stessa pagina: "Link già utilizzato". Spiega: ogni lettura genera un
   codice nuovo firmato dal chip con AES; un URL copiato non vale una seconda volta.
4. **QR code (30 s).** Inquadra l'etichetta: stesso certificato, strategia duale.
5. **Rigenerazione in laboratorio (1,5 min).** Dal portatile, come artigiano: nuovo intervento → stato
   "In registrazione…" → "Registrato sulla blockchain". Ricarica il certificato sul telefono: l'intervento c'è.
6. **Manomissione (1 min).** In Atlas (Data Explorer) modifica la descrizione di un intervento. Ricarica il
   certificato: "Attenzione: dati non coincidenti". Ripristina il testo originale: torna "Capo autentico".
   Messaggio chiave: *la blockchain non impedisce di modificare il database, ma rende la modifica evidente*.
   Senza toccare Atlas: apri `/v/DEMO-MANOMESSO` (storico già alterato nel database da `npm run popola-demo`).
7. **Contraffazione (30 s).** Apri `/v/DEMO-FALSO-99`: "Capo non trovato — possibile contraffazione".
8. **Costo zero (30 s).** "Il ciclo di vita di un capo costa meno di un centesimo di commissioni, pagate dalla
   piattaforma; l'utente non ha wallet né criptovaluta" (dati in `docs/costi/gas-e-costi.md`).

## Piano B senza chip fisico

- Tocco sul tag → link del chip di prova (vettore NXP AN12196):
  `https://regen-luxury.onrender.com/s?e=EF963FF7828658A599F3041510671E88&c=94EED9EE65337086` (vale una volta;
  la seconda apertura mostra "Link già utilizzato").
- Capi pronti: `DEMO-JEANS-01` (impatto con fonti), `DEMO-BORSA-01` (3 proprietari), `DEMO-MANOMESSO`, `DEMO-FALSO-99`.
- "Il tuo armadio" e "Storico" in alto: salvati solo sul telefono, nessun account.

## Domande probabili

- *Perché Polygon e non Ethereum?* Stessa tecnologia (EVM), commissioni molto più basse, Proof-of-Stake.
- *E se la piattaforma chiude?* Le impronte restano sulla blockchain pubblica; i dati completi servono però dal database (limite dichiarato).
- *Chi paga il gas?* La piattaforma: costo misurato in `docs/costi/gas-e-costi.md` (decisione 4.2).
```

## `docs/deploy.md`

```markdown
# Pubblicazione gratuita con HTTPS (punto 27)

Serve un indirizzo **HTTPS pubblico** perché il telefono, leggendo il tag o il QR, apra la pagina di verifica
(e perché la fotocamera del browser funzioni fuori da `localhost`).

**Soluzione:** un solo servizio su **Render** (piano gratuito, regione Frankfurt): il backend espone le API e
serve la web app React compilata. Il file `render.yaml` nella radice del repository configura tutto.
Controlla sul sito di Render le condizioni attuali del piano gratuito prima della demo.

## Come funziona la versione online

- **Database:** lo stesso cluster Atlas usato sul Mac → sul sito online si vedono gli stessi capi.
- **Blockchain:** per ora registro **simulato** salvato nel database (collezione `registro_simulato`,
  `MOCK_LEDGER_STORE=mongo`, valore predefinito), perché su Render il disco si cancella a ogni riavvio. Anche il Mac
  usa lo stesso registro, così Mac e sito online restano allineati (al primo avvio l'eventuale vecchio file
  `backend/data/mock-ledger.json` viene importato).
  Limite da dichiarare: il registro simulato su database è meno indipendente del file; nella versione finale si
  passa a **Polygon Amoy** (vedi in fondo).
- **Indirizzo pubblico:** il backend usa da solo quello assegnato da Render (`RENDER_EXTERNAL_URL`) per QR e link.

## Passi (una volta sola)

1. **Codice su GitHub** — in VS Code: pannello *Controllo del codice sorgente* → **Pubblica in GitHub** →
   **repository privato**. Per gli aggiornamenti successivi: *Sincronizza modifiche*.
2. **Atlas** — *Security → Network Access → Add IP Address → Allow access from anywhere* (`0.0.0.0/0`) →
   **Confirm**. Il piano gratuito di Render non ha un IP fisso; l'accesso resta protetto da utente e password del
   database. Compromesso accettabile per un prototipo: dichiaralo come limite.
3. **Render** — https://render.com → *Get Started* → accedi con **GitHub** → autorizza l'accesso al repository
   `regen-luxury` → **New → Blueprint** → scegli il repository. Render legge `render.yaml` e chiede un solo valore:
   - `MONGO_URI` → nel terminale `npm run copia-db` (la copia negli appunti senza mostrarla) → **Cmd+V**.
   Poi **Apply / Deploy Blueprint**. `JWT_SECRET` viene generato automaticamente.
4. Aspetta la fine della build (3–5 minuti, log in *Events/Logs*). Il sito è all'indirizzo mostrato in alto,
   es. `https://regen-luxury.onrender.com`. Controllo: `https://<indirizzo>/api/health` → `{"stato":"online",…}`.
5. Gli account sono gli stessi del Mac (stesso database): accedi con la tua email e password.

**Aggiornare il sito:** fai commit e *Sincronizza modifiche* in VS Code; Render ripubblica da solo a ogni push.

## Da sapere per la demo

- Il servizio gratuito **si sospende dopo circa 15 minuti** senza visite: la prima apertura può richiedere
  quasi un minuto. Aprilo qualche minuto prima di mostrarlo. Le misure del requisito P (< 2 s) vanno fatte con
  il servizio già attivo.
- Le foto della home arrivano da Unsplash: servono Internet e la CSP del backend le ammette (`images.unsplash.com`).
- "Il tuo armadio" e lo storico restano nel browser di chi visita il sito: ognuno vede i propri.

## Più avanti: blockchain reale su Polygon Amoy

1. `cd contracts && npm run crea-wallet` → POL di prova dal faucet → `npm run deploy`.
2. Su Render (*Environment*): `BLOCKCHAIN_MODE=polygon`, `POLYGON_RPC_URL=https://rpc-amoy.polygon.technology`,
   `CHAIN_NAME=polygon-amoy`, `CONTRACT_ADDRESS`, `PLATFORM_PRIVATE_KEY` (la chiave solo lì, mai nel repository).
3. `npm run migra` una volta, così i capi già presenti vengono registrati sul contratto.
4. Ristampa le etichette QR e riscrivi i tag NFC con il dominio definitivo.
```

## `docs/latex/bibliografia-starter.bib`

```bibtex
% bibliografia-starter.bib - BASE DI PARTENZA per la tesi (BibTeX)
% Voci di riferimento per le affermazioni più esposte in discussione.
% Prima dell'uso: verificare ogni voce, aggiornare le date di consultazione
% (campo note) e unire con la bibliografia del Cap. 2 già costruita.
% Richiede \usepackage{url} o \usepackage{hyperref} per il campo \url.

% ===================== 2.1 Blockchain a basso impatto =====================
@misc{nakamoto2008bitcoin,
  author       = {Nakamoto, Satoshi},
  title        = {Bitcoin: A Peer-to-Peer Electronic Cash System},
  year         = {2008},
  howpublished = {\url{https://bitcoin.org/bitcoin.pdf}}
}

@misc{buterin2014ethereum,
  author       = {Buterin, Vitalik},
  title        = {Ethereum: A Next-Generation Smart Contract and Decentralized Application Platform},
  year         = {2014},
  howpublished = {\url{https://ethereum.org/en/whitepaper/}}
}

@misc{ethereum_energy,
  author       = {{Ethereum Foundation}},
  title        = {Ethereum Energy Consumption},
  howpublished = {\url{https://ethereum.org/en/energy-consumption/}},
  note         = {Fonte della riduzione di circa il 99{,}95\% dopo The Merge. Ultimo accesso: GG/MM/AAAA}
}

@techreport{ccri2022merge,
  author       = {{Crypto Carbon Ratings Institute}},
  title        = {The Merge -- Implications on the Electricity Consumption and Carbon Footprint of the Ethereum Network},
  institution  = {CCRI},
  year         = {2022},
  month        = sep
}

@misc{polygon_pos_docs,
  author       = {{Polygon Labs}},
  title        = {Polygon PoS Documentation},
  howpublished = {\url{https://docs.polygon.technology/pos/}},
  note         = {Ultimo accesso: GG/MM/AAAA}
}

@misc{eip721,
  author       = {Entriken, William and Shirley, Dieter and Evans, Jacob and Sachs, Nastassia},
  title        = {{ERC-721}: Non-Fungible Token Standard},
  year         = {2018},
  howpublished = {\url{https://eips.ethereum.org/EIPS/eip-721}}
}

@misc{eip2771,
  author       = {Sandford, Ronan and Siri, Liraz and Tirosh, Dror and Weiss, Yoav and Forshtat, Alex and Croubois, Hadrien and Tomar, Sachin and McCorry, Patrick and Venturo, Nicolas and Vogelsteller, Fabian and John, Gavin},
  title        = {{EIP-2771}: Secure Protocol for Native Meta Transactions},
  year         = {2020},
  howpublished = {\url{https://eips.ethereum.org/EIPS/eip-2771}}
}

@misc{erc4337,
  author       = {Buterin, Vitalik and Weiss, Yoav and Tirosh, Dror and Nacson, Shahar and Forshtat, Alex and Gazso, Kristof and Hess, Tjaden},
  title        = {{ERC-4337}: Account Abstraction Using Alt Mempool},
  year         = {2021},
  howpublished = {\url{https://eips.ethereum.org/EIPS/eip-4337}}
}

@misc{openzeppelin_contracts,
  author       = {{OpenZeppelin}},
  title        = {OpenZeppelin Contracts 5.x Documentation},
  howpublished = {\url{https://docs.openzeppelin.com/contracts/5.x/}},
  note         = {Ultimo accesso: GG/MM/AAAA}
}

% ===================== 2.2 Smart Tag: NFC e QR Code =====================
@manual{nxp_ntag424dna,
  author       = {{NXP Semiconductors}},
  title        = {{NTAG 424 DNA} and {NTAG 424 DNA TagTamper} -- Secure {NFC} {T4T} compliant {IC}},
  note         = {Product data sheet NT4H2421Gx},
  howpublished = {\url{https://www.nxp.com/docs/en/data-sheet/NT4H2421Gx.pdf}}
}

@misc{iso18004,
  author       = {{ISO/IEC}},
  title        = {{ISO/IEC} 18004 -- Information technology -- Automatic identification and data capture techniques -- {QR} Code bar code symbology specification},
  year         = {2015},
  note         = {Verificare l'edizione più recente prima della consegna}
}

% ===================== 2.3 Intelligenza Artificiale =====================
@inproceedings{liu2016deepfashion,
  author       = {Liu, Ziwei and Luo, Ping and Qiu, Shi and Wang, Xiaogang and Tang, Xiaoou},
  title        = {{DeepFashion}: Powering Robust Clothes Recognition and Retrieval with Rich Annotations},
  booktitle    = {Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR)},
  pages        = {1096--1104},
  year         = {2016}
}

% ===================== LCA e impatto ambientale =====================
@misc{iso14040,
  author       = {{International Organization for Standardization}},
  title        = {{ISO} 14040:2006 -- Environmental management -- Life cycle assessment -- Principles and framework},
  year         = {2006}
}

@misc{iso14044,
  author       = {{International Organization for Standardization}},
  title        = {{ISO} 14044:2006 -- Environmental management -- Life cycle assessment -- Requirements and guidelines},
  year         = {2006}
}

@techreport{emf2017textiles,
  author       = {{Ellen MacArthur Foundation}},
  title        = {A New Textiles Economy: Redesigning Fashion's Future},
  institution  = {Ellen MacArthur Foundation},
  year         = {2017}
}

% ===================== Normativa: Passaporto Digitale del Prodotto =====================
@misc{ue2024espr,
  author       = {{Parlamento europeo e Consiglio dell'Unione europea}},
  title        = {Regolamento ({UE}) 2024/1781 del 13 giugno 2024 che stabilisce il quadro per la definizione delle specifiche di progettazione ecocompatibile dei prodotti sostenibili ({ESPR})},
  year         = {2024},
  note         = {Gazzetta ufficiale dell'Unione europea, serie L, 28 giugno 2024. Istituisce il Passaporto Digitale del Prodotto}
}

% ===================== Cap. 3: requisiti FURPS+ =====================
@book{grady1992metrics,
  author       = {Grady, Robert B.},
  title        = {Practical Software Metrics for Project Management and Process Improvement},
  publisher    = {Prentice Hall},
  year         = {1992}
}

@book{larman2004uml,
  author       = {Larman, Craig},
  title        = {Applying {UML} and Patterns: An Introduction to Object-Oriented Analysis and Design and Iterative Development},
  edition      = {3},
  publisher    = {Prentice Hall},
  year         = {2004}
}
```

## `docs/latex/latex-workshop-settings.jsonc`

```jsonc
{
  // .vscode/settings.json - LaTeX Workshop su Windows SENZA latexmk (che richiede Perl)
  "latex-workshop.latex.tools": [
    {
      "name": "pdflatex",
      "command": "pdflatex",
      "args": ["-synctex=1", "-interaction=nonstopmode", "-file-line-error", "%DOC%"]
    },
    {
      "name": "bibtex",
      "command": "bibtex",
      "args": ["%DOCFILE%"]
    }
  ],
  "latex-workshop.latex.recipes": [
    { "name": "pdflatex x2", "tools": ["pdflatex", "pdflatex"] },
    { "name": "pdflatex -> bibtex -> pdflatex x2", "tools": ["pdflatex", "bibtex", "pdflatex", "pdflatex"] }
  ],
  "latex-workshop.latex.recipe.default": "first",
  "latex-workshop.latex.autoBuild.run": "onSave",
  "latex-workshop.latex.clean.fileTypes": ["*.aux", "*.bbl", "*.blg", "*.log", "*.out", "*.toc", "*.lof", "*.lot", "*.synctex.gz"]
}
```

## `docs/lca/coefficienti.md`

```markdown
# Coefficienti LCA per la stima dell'impatto evitato (punto 23)

Il calcolo è nel backend (`backend/services/impactService.js`, dati in `backend/data/coefficienti-lca.json`).

**Metodo.** Un capo rigenerato evita in parte l'acquisto di un capo nuovo equivalente:

> impatto evitato = impatto di produzione del capo nuovo × fattore di sostituzione

Si considerano solo le fasi di **produzione** (fibra → tessuto → confezione → distribuzione): l'uso e il fine
vita avvengono comunque, con capo nuovo o rigenerato. Il risultato è una **stima**, non una misura.

## Fattore di sostituzione

| Valore usato | Intervallo | Fonte |
|---|---|---|
| **0,60** (prudente) | 0,60 – 0,85 | Farrant L., Olsen S.I., Wangel A. (2010). *Environmental benefits from reusing clothes*. Int. J. Life Cycle Assessment, 15, 726–736: l'acquisto di 100 capi di seconda mano evita la produzione di 60–85 capi nuovi. |

## Impatto di produzione per categoria

| Categoria | kg CO₂e | Litri d'acqua | Unità funzionale | Fonte | Stato |
|---|---|---|---|---|---|
| jeans | **20,0** | **2.922** | un paio di Levi's 501; fasi fibra, tessuto, confezione, accessori/imballaggio, trasporto e vendita | Levi Strauss & Co. (2015), *The Life Cycle of a Jean*. Totale ciclo di vita 33,4 kg CO₂e e 3.781 L: esclusi cura del consumatore (12,5 kg; 860 L) e fine vita (0,9 kg; 0 L) | verificato sulla presentazione dei risultati LCA |
| t-shirt | 3,53 | 725 | t-shirt in cotone da 250 g, cradle-to-gate | Forfora N. et al. (2026), *A Comparative Life Cycle Assessment of T-Shirt Production Using Viscose, Lyocell, Cotton, and Polyester*, Sustainability 18(8), 4070: 14,1 kg CO₂e/kg e 2,9 m³/kg | **da verificare** sulla tabella dei risultati dell'articolo |

Risultato mostrato per un paio di jeans: 20,0 × 0,6 = **12 kg CO₂e** e 2.922 × 0,6 = **1.753 L**
(intervallo 12–17 kg e 1.753–2.484 L con fattore 0,60–0,85).

## Categorie senza dati

Per le altre categorie (giacca, borsa, scarpe, …) la web app mostra "stima non disponibile" invece di un
numero senza fonte. Per aggiungerne una, inserire nel JSON valori con **fonte, anno, unità funzionale e
confini del sistema** (ISO 14040/14044) e impostare `"verificato": true` solo dopo aver letto la fonte.

## Nota sul prototipo precedente

La prima versione del backend usava 15 kg CO₂e e 2.700 L per capo, moltiplicati per il numero di interventi,
senza fonte: sono stati sostituiti da questo metodo, più prudente e citabile. Il dato molto diffuso "2.700 litri
per una t-shirt" (WWF, 2013) è un'impronta idrica (water footprint), dovuta soprattutto alla coltivazione del
cotone: è una grandezza calcolata con un metodo diverso dal consumo d'acqua dell'LCA, quindi non va mescolata
con i valori di questa tabella.
```

## `docs/nfc/configurazione-tag.md`

```markdown
# Tag NFC e QR code (punti 15 e 16)

La piattaforma usa una **strategia duale**:

| | QR code / tag NFC statico | Chip NTAG 424 DNA con messaggio dinamico (SUN) |
|---|---|---|
| URL scritto nel tag | `https://<dominio>/v/<tagId>` (sempre uguale) | `https://<dominio>/s?e=<dati cifrati>&c=<codice>` (cambia a ogni lettura) |
| Costo | QR stampato: quasi zero; tag NTAG 213/215: pochi centesimi | Tag NTAG 424 DNA: più costoso |
| Anticlonazione | No: l'URL si può copiare | Sì: senza le chiavi AES non si generano codici validi; un URL già usato viene rifiutato |
| Uso consigliato | Etichetta di riserva, capi di valore medio | Capi di lusso |

Il backend verifica i messaggi SUN (`backend/services/sunService.js`): AES-128 per decifrare UID e contatore,
AES-CMAC per il codice di autenticazione, contatore strettamente crescente contro il riutilizzo dell'URL.
L'implementazione è verificata con il vettore di prova ufficiale NXP (AN12196: UID `04DE5F1EACC040`,
contatore 61) e con i vettori AES-CMAC della RFC 4493.

## 1. QR code stampabile (punto 15)

- Area gestionale → apri il capo → **Etichetta QR** → Stampa.
- Via API: `GET /api/items/:id/qr` (SVG) oppure `?formato=png`.
- Il QR contiene `PUBLIC_BASE_URL/v/<tagId>`: imposta `PUBLIC_BASE_URL` nel `backend/.env` con l'indirizzo
  pubblico HTTPS della web app prima di stampare le etichette definitive.

## 2. Tag NFC statico (NTAG 213/215/216)

App **NXP TagWriter** (Android/iOS) → Write tags → New dataset → **Link** → URL `https://<dominio>/v/<tagId>` →
scrivi. Su iPhone e Android la lettura del tag apre direttamente la pagina di verifica, senza app.

## 3. NTAG 424 DNA con messaggio dinamico (punto 16)

1. **URL modello** da scrivere nel file NDEF del chip:
   `https://<dominio>/s?e=00000000000000000000000000000000&c=0000000000000000`
2. **Mirroring SDM** (NXP TagWriter, manuale utente §4.7 "SDM mirroring for NTAG 424", oppure l'app
   open source *Ntag424SdmFeature*):
   - PICC data **cifrata** (UID + contatore) → offset: primo carattere dopo `e=`
   - SDM MAC → offset: primo carattere dopo `c=`
   - SDM MAC Input Offset **uguale** all'SDM MAC Offset (MAC calcolato su input vuoto, come si aspetta il backend)
   - chiave SDM Meta Read = chiave 3, chiave SDM File Read = chiave 4 (convenzione comune; il backend usa i valori
     di `SDM_META_READ_KEY` e `SDM_FILE_READ_KEY`)
3. **Chiavi.** I chip nuovi hanno chiavi tutte a zero, che il backend usa per default: vanno bene per la demo,
   **non** per un uso reale. Per cambiarle servono strumenti come NXP TagXplorer/RFIDDiscover con lettore USB o
   l'app *Ntag424SdmFeature*; poi si copiano le nuove chiavi nel `backend/.env`.
   Attenzione: non attivare l'autenticazione LRP (è irreversibile).
4. **Associazione al capo.** Area gestionale → capo → *Chip NFC*:
   - su Android con Chrome: "Leggi il chip con il telefono" (il server verifica il messaggio e salva UID e contatore);
   - su altri dispositivi: inserisci a mano l'UID (14 caratteri esadecimali, leggibile con NXP TagInfo).
5. **Prova.** Avvicina il telefono: si apre `/s?...` con "Chip NFC autentico · lettura n. X". Ricaricando la
   stessa pagina compare "Link già utilizzato" (anti-replay).

Fonti: NXP AN12196 *NTAG 424 DNA and NTAG 424 DNA TagTamper features and hints*
(https://www.nxp.com/docs/en/application-note/AN12196.pdf); datasheet NT4H2421Gx.
```

## `docs/uml/casi_d_uso.puml`

```plantuml
@startuml casi_d_uso
' Diagramma dei casi d'uso - trascrizione di "casi duso.pdf" (versione nel Project)
' Se la versione approvata dal relatore è diversa, vale QUELLA: non modificare
' nulla oltre alle correzioni richieste esplicitamente.
left to right direction
skinparam packageStyle rectangle
skinparam usecase {
  BackgroundColor white
  BorderColor black
}

actor "Brand Manager" as BM
actor "Commerciante" as COM
actor "Acquirente" as ACQ
actor "Sistema Blockchain" as BC

rectangle "Piattaforma di tracciabilità capi rigenerati" {
  usecase "Registra nuovo\ncapo di lusso" as UC1
  usecase "Associa NFC" as UC2
  usecase "Invia transazione\nblockchain" as UC3
  usecase "Registra intervento\ndi rigenerazione" as UC4
  usecase "Richiede lettura\nhardware del chip" as UC5
  usecase "Fornisce suggerimenti di riciclo\ne calcola l'impatto" as UC6
  usecase "Verifica capo\ncon scansione" as UC7
  usecase "Visualizza dashboard\nsostenibilità" as UC8
  usecase "Notifica l'evento\nimmutabile" as UC9
}

BM -- UC1
COM -- UC4
ACQ -- UC7
UC3 --> BC
BC --> UC9

UC1 ..> UC2 : <<include>>
UC2 ..> UC3 : <<include>>
UC4 ..> UC5 : <<include>>
UC4 ..> UC3 : <<include>>
UC4 ..> UC6 : <<include>>
UC8 ..> UC7 : <<extend>>
UC8 ..> UC4 : <<extend>>
@enduml
```

## `docs/validazione/tabella-furps.md`

````markdown
# Validazione: requisiti FURPS+ → test → esiti (punti 25 e 26)

Colonna **Esito (prova di sviluppo)**: test eseguiti il 22/09/2026 in ambiente di sviluppo (database locale,
blockchain simulata e chain locale Hardhat per lo smart contract). Colonna **Esito sul Mac con Atlas**: prove
del 22/09/2026 sul Mac mini (Node.js 24, MongoDB Atlas, blockchain simulata) con `npm run passaggi` (8/8 superati)
e `npm run misura-tempi`. Legenda: ✅ verificato · ⏭️ ancora da provare in questo ambiente · — non dipende dal database.

Come rieseguire tutto:

```bash
npm test                                     # 48 test automatici (database in memoria), dalla cartella principale
npm run dev                                  # in un secondo terminale:
npm run passaggi                             # Passaggi 1-8 sull'API reale
npm run misura-tempi                         # requisito P (< 2 s)
cd contracts && npm install && npm run compile
npm run chain                                # in un terzo terminale, poi:
npm run misura-gas                           # gas e controlli di sicurezza (esce con errore se un controllo fallisce)
cd ../ai-module && python -m pytest test/    # servizio AI
```

| Req. | Requisito (§3.2) | Come è verificato | Esito (prova di sviluppo) | Esito sul Mac con Atlas |
|---|---|---|---|---|
| F | Creazione dell'identità digitale del capo | `items.test.js` "crea un capo…"; Passaggio 2 | ✅ 201, registrazione on-chain confermata || ✅ 201, registrazione on-chain confermata |
| F | Associazione hardware-software (tag ↔ capo) | tagId univoco; `sun.test.js` associazione chip; etichetta QR (`items.test.js` "QR code") | ✅ || ✅ tag NFC-001 associato e univoco · ⏭️ QR e chip NFC |
| F | Registrazione degli interventi di rigenerazione | `items.test.js` "eventi…"; Passaggio 3 | ✅ evento salvato e ancorato || ✅ evento salvato e ancorato |
| F | Certificato di autenticità con catena dei proprietari | `verify.test.js` "certificato pubblico…"; Passaggi 5, 6, 8 | ✅ || ✅ certificato con catena dei proprietari |
| F | Dashboard di sostenibilità (CO₂, acqua) | `verify.test.js`: jeans → 12 kg CO₂e, 1.753 L con fonti; categoria senza dati → "non disponibile" | ✅ || ✅ categoria senza dati (giacca) → "non disponibile" · ⏭️ jeans |
| U | Interfaccia mobile-first | Test nel browser (Chromium, schermo 390×844): home, certificato, gestione, etichetta, NFC | ✅ schermate in `docs/validazione/schermate/` || ⏭️ da provare nel browser (`npm run web`) |
| U | Accesso pubblico senza registrazione | Passaggio 6 (verifica senza token) | ✅ || ✅ |
| R | Immutabilità / rilevazione delle manomissioni | `verify.test.js`: modifica di un evento, dei dati del capo e cancellazione di un passaggio direttamente nel database → "manomesso"; stesso test su smart contract reale. `integrita.test.js`: stati di attesa o di errore falsificati nel database non danno mai "autentico" | ✅ rilevate tutte e 3 le manomissioni || ✅ integrità "verificato" (Passaggio 8) · ⏭️ manomissione simulata |
| R | Anti-duplicazione del tag | `items.test.js` anti-replay (anche 3 richieste simultanee: 1×201, 2×409); Passaggio 7; tag eliminato non riusabile | ✅ || ✅ 409 sul tag duplicato |
| R | Anti-replay del chip NFC (chip clonato) | `sun.test.js`: vettore NXP AN12196, stesso URL riusato → 409, CMAC alterato → 400 | ✅ || — serve il chip fisico |
| R | Accesso controllato all'area gestionale | `auth.test.js`: 401 senza login, 403 per ruolo non ammesso, account disattivato | ✅ || ✅ 401 senza login |
| R | Dati in ingresso validi | `items.test.js` "validazione…": campi mancanti, tagId non valido, campi sconosciuti, anno futuro, JSON malformato → 400 | ✅ || — controllo prima del database |
| R | Protezione da abusi | `verify.test.js` limite di richieste → 429 | ✅ || — non dipende dal database |
| P | Risposta alla scansione < 2 s | `npm run misura-tempi` (50 richieste) | ✅ media 5,7 ms, max 79 ms (database locale) | ✅ media 37,9 ms, 95° percentile 41,9 ms, max 68 ms (50 richieste) |
| P | Scritture blockchain asincrone | risposta immediata con stato "in_attesa", poi "confermato" (Passaggio 2) | ✅ || ✅ 2 voci confermate, 0 in attesa |
| S | Provider blockchain sostituibile | stessi Passaggi 1–8 con `BLOCKCHAIN_MODE=mock` e con `BLOCKCHAIN_MODE=polygon` (contratto su chain locale) | ✅ 8/8 in entrambi i modi || ✅ 8/8 in modalità mock · ⏭️ polygon dopo il deploy su Amoy |
| + | Stack open-source/LTS, licenze permissive | Node.js, Express, MongoDB, React, ethers.js, OpenZeppelin (MIT), TextileNet (CC BY) | ✅ || — |
| + | Dati conformi al Passaporto Digitale del Prodotto (bozza) | Campi: brand, modello, materiali, filiera, anno, storico interventi e proprietà | ⚠️ allineamento concettuale: i requisiti di dettaglio per il tessile arriveranno con gli atti delegati ESPR || — |
| — | Smart contract: tag duplicato e ruoli | `npm run misura-gas`: `TagAlreadyRegistered`, `AccessControlUnauthorizedAccount` | ✅ || — |
| — | Modulo AI: servizio di inferenza | `ai-module/test`: modello ONNX fittizio, errori 415/400/413/503 | ✅ servizio; ❌ addestramento da eseguire su Colab || — |

## Limiti da dichiarare nel Capitolo 5

- I tempi con Atlas (media 37,9 ms contro 5,7 ms in locale) includono la latenza di rete verso il cluster, ma la
  blockchain era ancora simulata: vanno rimisurati dopo il deploy del contratto su Polygon Amoy.
- L'anticlonazione del chip è verificata con il vettore ufficiale NXP, non ancora con un chip fisico.
- Il registro blockchain simulato della demo online è salvato nello stesso cluster del database: dimostra il
  meccanismo, ma l'indipendenza reale dei dati si ottiene solo con Polygon Amoy.
- "Autentico" solo quando tutto coincide con la blockchain. Una scrittura fallita lascia il capo in "verifica non
  conclusiva" finché un operatore non esegue `npm run migra`: il riancoraggio non è automatico apposta, per non
  registrare sulla blockchain dati eventualmente alterati nel database.
- Il modulo AI non è ancora addestrato: accuratezza e matrice di confusione arriveranno dal notebook.
- Con la custodia della piattaforma (decisione 4.2) la blockchain prova l'integrità dei dati, non l'identità
  dell'operatore che li ha inseriti.
````

## `frontend/.env.example`

```bash
# Indirizzo delle API. Vuoto = stesso dominio della web app (consigliato).
VITE_API_URL=
# Indirizzo del servizio AI (ai-module) per suggerire il materiale da una foto. Vuoto = funzione nascosta.
VITE_AI_URL=
```

## `frontend/.gitignore`

```
node_modules/
dist/
.env
```

## `frontend/index.html`

```html
<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#1c1b19" />
    <meta name="description" content="Verifica l'autenticità e la storia di un capo di lusso rigenerato." />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>Regen Luxury — Passaporto digitale del capo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## `frontend/package.json`

```json
{
  "name": "regen-luxury-frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "qr-scanner": "^1.4.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.7.0",
    "vite": "^6.4.1"
  }
}
```

## `frontend/public/favicon.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1c1b19"/><path d="M20 44V20h13a8 8 0 0 1 0 16h-6l11 8" fill="none" stroke="#c9a25c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
```

## `frontend/src/App.jsx`

```jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Protetta from "./components/Protetta.jsx";
import HomePage from "./pages/HomePage.jsx";
import ArmadioPage from "./pages/ArmadioPage.jsx";
import VerifyPage from "./pages/VerifyPage.jsx";
import SunPage from "./pages/SunPage.jsx";
import ScanPage from "./pages/ScanPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import NewItemPage from "./pages/NewItemPage.jsx";
import ItemDetailPage from "./pages/ItemDetailPage.jsx";
import LabelPage from "./pages/LabelPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Area pubblica (consumatore): nessun login */}
        <Route index element={<HomePage />} />
        <Route path="v/:tagId" element={<VerifyPage />} />
        <Route path="s" element={<SunPage />} />
        <Route path="scan" element={<ScanPage />} />
        <Route path="armadio" element={<ArmadioPage />} />
        <Route path="login" element={<LoginPage />} />

        {/* Area gestionale (commercianti, artigiani, brand manager) */}
        <Route path="gestione" element={<Protetta />}>
          <Route index element={<DashboardPage />} />
          <Route path="nuovo" element={<Protetta ruoli={["brand_manager", "commerciante"]} />}>
            <Route index element={<NewItemPage />} />
          </Route>
          <Route path="capi/:id" element={<ItemDetailPage />} />
          <Route path="capi/:id/etichetta" element={<LabelPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="utenti" element={<Protetta ruoli={["admin"]} />}>
            <Route index element={<UsersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
```

## `frontend/src/assets/fonts/OFL-cormorant-garamond.txt`

```text
Copyright 2015 The Cormorant Project Authors (github.com/CatharsisFonts/Cormorant) CormorantGaramond-Italic[wght].ttf: Copyright 2015 The Cormorant Project Authors (github.com/CatharsisFonts/Cormorant)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
```

## `frontend/src/components/Ancoraggio.jsx`

```jsx
import { hashBreve } from "../utils/formato.js";

const ETICHETTE = {
  confermato: "Registrato sulla blockchain",
  in_attesa: "In registrazione…",
  fallito: "Registrazione non riuscita",
  non_ancorato: "Non registrato sulla blockchain",
};

// Piccolo indicatore dello stato di registrazione on-chain di un dato
export default function Ancoraggio({ ancoraggio }) {
  const stato = ancoraggio?.stato ?? "non_ancorato";
  return (
    <span className={`ancoraggio ancoraggio-${stato}`} title={ancoraggio?.txHash ?? ""}>
      <span className="puntino" aria-hidden="true" />
      {ETICHETTE[stato] ?? stato}
      {ancoraggio?.txHash && <code>{hashBreve(ancoraggio.txHash)}</code>}
    </span>
  );
}
```

## `frontend/src/components/Carosello.jsx`

```jsx
// Fascia di foto che scorre all'infinito: l'elenco è ripetuto due volte e
// l'animazione CSS lo sposta di metà lunghezza, così il giro non ha salti.
// Decorativa: nascosta ai lettori di schermo; ferma con "riduci movimento".
function Foto({ foto }) {
  return (
    <figure className="carosello-foto">
      <img
        src={foto.src}
        alt=""
        loading="eager"
        decoding="async"
        onError={(e) => e.currentTarget.parentElement.classList.add("foto-assente")}
      />
      <figcaption>{foto.didascalia}</figcaption>
    </figure>
  );
}

export default function Carosello({ foto, verso = "avanti", orientamento = "verticale", etichetta }) {
  return (
    <div className={`carosello carosello-${orientamento} carosello-${verso}`} aria-hidden="true">
      {etichetta && <p className="carosello-etichetta">{etichetta}</p>}
      <div className="carosello-finestra">
        <div className="carosello-traccia">
          {[...foto, ...foto].map((f, i) => (
            <Foto key={`${f.id}-${i}`} foto={f} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

## `frontend/src/components/Certificato.jsx`

```jsx
import { Link } from "react-router-dom";
import Ancoraggio from "./Ancoraggio.jsx";
import { IconaGruccia } from "./Icone.jsx";
import { aggiungiAllArmadio, riassuntoCapo, rimuoviDallArmadio, useArmadio } from "../utils/archivio.js";
import { TIPI_EVENTO, data, hashBreve, numero, maiuscola } from "../utils/formato.js";

const ESITI = {
  verificato: { classe: "ok", titolo: "Capo autentico", icona: "✓" },
  // "Autentico" solo quando tutto coincide con la blockchain
  in_attesa: { classe: "attesa", titolo: "Registrazione in corso", icona: "…" },
  incompleto: { classe: "attesa", titolo: "Verifica non conclusiva", icona: "!" },
  manomesso: { classe: "ko", titolo: "Attenzione: dati non coincidenti", icona: "✕" },
  non_registrato: { classe: "ko", titolo: "Capo non registrato sulla blockchain", icona: "✕" },
};

function Esito({ certificato, nfc }) {
  const integrita = certificato.integrita;
  const esito = ESITI[integrita.stato] ?? ESITI.non_registrato;
  return (
    <div className={`esito esito-${esito.classe}`}>
      <span className="esito-icona" aria-hidden="true">
        {esito.icona}
      </span>
      <div>
        <h2>{esito.titolo}</h2>
        <p>{integrita.messaggio}</p>
        {nfc && (
          <p className="esito-nfc">
            Chip NFC autentico · lettura n. {nfc.contatoreLetture} · link monouso verificato
          </p>
        )}
      </div>
    </div>
  );
}

// "Aggiungi al mio armadio": solo per capi verificati; l'elenco resta sul dispositivo
function AzioniArmadio({ dati }) {
  const armadio = useArmadio();
  const { tagId } = dati.capo;
  const presente = armadio.some((c) => c.tagId === tagId);
  if (!presente && !dati.certificatoAutenticita.autentico) return null;
  return (
    <div className="azioni-armadio">
      {presente ? (
        <>
          <span className="nel-armadio">
            <IconaGruccia dimensione={20} /> Nel tuo armadio
          </span>
          <Link to="/armadio">Apri l’armadio</Link>
          <button type="button" className="link" onClick={() => rimuoviDallArmadio(tagId)}>
            Rimuovi
          </button>
        </>
      ) : (
        <>
          <button type="button" className="pulsante" onClick={() => aggiungiAllArmadio(riassuntoCapo(dati))}>
            <IconaGruccia dimensione={20} /> Aggiungi al mio armadio
          </button>
          <span className="nota">Hai acquistato questo capo? Conservane il passaporto su questo dispositivo.</span>
        </>
      )}
    </div>
  );
}

function Impatto({ impatto }) {
  if (!impatto?.disponibile) {
    return (
      <section className="sezione">
        <h3>Impatto ambientale</h3>
        <p className="nota">{impatto?.nota ?? "Stima non disponibile."}</p>
      </section>
    );
  }
  return (
    <section className="sezione">
      <h3>Impatto ambientale evitato</h3>
      <div className="indicatori">
        <div className="indicatore">
          <span className="valore">{numero(impatto.co2RisparmiataKg)}</span>
          <span className="unita">kg di CO₂e</span>
          <span className="intervallo">
            stima {numero(impatto.intervallo.co2Kg[0])}–{numero(impatto.intervallo.co2Kg[1])} kg
          </span>
        </div>
        <div className="indicatore">
          <span className="valore">{numero(impatto.acquaPreservataLitri, 0)}</span>
          <span className="unita">litri d’acqua</span>
          <span className="intervallo">
            stima {numero(impatto.intervallo.acquaL[0], 0)}–{numero(impatto.intervallo.acquaL[1], 0)} L
          </span>
        </div>
      </div>
      {impatto.verificato === false && (
        <p className="nota">Valori di letteratura ancora da verificare sulla fonte originale: considerali indicativi.</p>
      )}
      <details className="fonti">
        <summary>Come è calcolato</summary>
        <p>{impatto.metodo}.</p>
        <p>Unità di riferimento: {impatto.unitaFunzionale}.</p>
        <ul>
          {impatto.fonti.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="nota">{impatto.nota}</p>
      </details>
    </section>
  );
}

export default function Certificato({ dati }) {
  const { capo, certificatoAutenticita: cert, impattoAmbientale, nfc } = dati;
  return (
    <article className="certificato">
      <header className="certificato-testata">
        <p className="sopratitolo">Passaporto digitale · {capo.tagId}</p>
        <h1>{capo.brand}</h1>
        <p className="sottotitolo">
          {capo.codiceModello}
          {capo.categoria && ` · ${maiuscola(capo.categoria)}`}
          {capo.stato === "archiviato" && <span className="etichetta">Archiviato</span>}
        </p>
      </header>

      <Esito certificato={cert} nfc={nfc} />
      <AzioniArmadio dati={dati} />

      <section className="sezione">
        <h3>Scheda del capo</h3>
        <dl className="scheda-dati">
          <dt>Materiali originari</dt>
          <dd>{capo.materialiOriginari}</dd>
          {capo.materialePrincipale && (
            <>
              <dt>Materiale principale</dt>
              <dd>{maiuscola(capo.materialePrincipale)}</dd>
            </>
          )}
          {capo.filieraProvenienza && (
            <>
              <dt>Filiera</dt>
              <dd>{capo.filieraProvenienza}</dd>
            </>
          )}
          {capo.annoProduzione && (
            <>
              <dt>Anno di produzione</dt>
              <dd>{capo.annoProduzione}</dd>
            </>
          )}
        </dl>
      </section>

      <section className="sezione">
        <h3>Storia della rigenerazione</h3>
        {capo.storicoRigenerazione.length === 0 ? (
          <p className="nota">Nessun intervento registrato.</p>
        ) : (
          <ol className="linea-tempo">
            {capo.storicoRigenerazione.map((e, i) => (
              <li key={i}>
                <span className="linea-data">{data(e.data)}</span>
                <strong>{TIPI_EVENTO[e.tipo] ?? e.tipo}</strong>
                <p>{e.descrizione}</p>
                {e.materialiNuovi && <p className="nota">Materiali: {e.materialiNuovi}</p>}
                {e.operatore && <p className="nota">Laboratorio: {e.operatore}</p>}
                <Ancoraggio ancoraggio={e.ancoraggio} />
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="sezione">
        <h3>Catena dei proprietari</h3>
        {capo.passaggiProprieta.length === 0 ? (
          <p className="nota">Nessun passaggio di proprietà registrato.</p>
        ) : (
          <ol className="catena">
            {capo.passaggiProprieta.map((p) => (
              <li key={p.passo}>
                <span className="passo">{p.passo}</span>
                <span>
                  <strong>{p.proprietario}</strong>
                  <span className="nota"> · {data(p.data)}</span>
                </span>
                <Ancoraggio ancoraggio={p.ancoraggio} />
              </li>
            ))}
          </ol>
        )}
        <p className="nota">Per la privacy dei proprietari sono mostrate solo le iniziali.</p>
      </section>

      <Impatto impatto={impattoAmbientale} />

      <section className="sezione">
        <h3>Registro blockchain</h3>
        <dl className="scheda-dati">
          <dt>Rete</dt>
          <dd>{cert.rete}</dd>
          {cert.tokenId && (
            <>
              <dt>Token</dt>
              <dd>#{cert.tokenId}</dd>
            </>
          )}
          <dt>Ultima transazione sui dati</dt>
          <dd>
            <code>{hashBreve(cert.txHash)}</code>
          </dd>
          {cert.integrita.voci && (
            <>
              <dt>Voci verificate</dt>
              <dd>
                {cert.integrita.voci.verificate} su {capo.storicoRigenerazione.length + capo.passaggiProprieta.length}
              </dd>
            </>
          )}
        </dl>
        <p className="nota">Verificato il {new Date(dati.verificatoIl).toLocaleString("it-IT")}</p>
      </section>
    </article>
  );
}
```

## `frontend/src/components/Icone.jsx`

```jsx
// Icone lineari (SVG in linea: nessuna libreria esterna)
const Base = ({ children, dimensione = 22, ...resto }) => (
  <svg width={dimensione} height={dimensione} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...resto}>
    {children}
  </svg>
);

export const IconaScansione = (p) => (
  <Base {...p}>
    <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
    <path d="M7 12h10" />
  </Base>
);
export const IconaScudo = (p) => (
  <Base {...p}>
    <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </Base>
);
export const IconaAgo = (p) => (
  <Base {...p}>
    <path d="M19 5L7 17M16 4l4 4M5 19c1-2 2-3 4-3" />
    <path d="M14 6c-4 0-9 3-9 8" strokeDasharray="2 2.5" />
  </Base>
);
export const IconaFoglia = (p) => (
  <Base {...p}>
    <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14" />
    <path d="M5 19l7-7" />
  </Base>
);
export const IconaGruccia = (p) => (
  <Base {...p}>
    <path d="M12 7a2 2 0 1 1 2-2c0 1.2-2 1.5-2 3v1" />
    <path d="M12 9L3 16a1 1 0 0 0 .6 1.8h16.8A1 1 0 0 0 21 16l-9-7z" />
  </Base>
);
export const IconaOrologio = (p) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Base>
);
export const IconaUtente = (p) => (
  <Base {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c1-3.5 3.8-5 7-5s6 1.5 7 5" />
  </Base>
);
export const IconaChip = (p) => (
  <Base {...p}>
    <path d="M6 8.5a8 8 0 0 1 0 7M9.5 6.5a12 12 0 0 1 0 11M13 5a15 15 0 0 1 0 14" />
    <rect x="16" y="9" width="4" height="6" rx="1" />
  </Base>
);
export const IconaCestino = (p) => (
  <Base {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3" />
  </Base>
);
export const IconaFreccia = (p) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
);
```

## `frontend/src/components/Layout.jsx`

```jsx
import { useEffect, useRef } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { useArmadio } from "../utils/archivio.js";
import StoricoMenu from "./StoricoMenu.jsx";
import { IconaGruccia, IconaScansione, IconaUtente } from "./Icone.jsx";

export default function Layout() {
  const { utente, logout } = useAuth();
  const armadio = useArmadio();
  const naviga = useNavigate();
  const { pathname } = useLocation();
  const testata = useRef(null);

  // Altezza reale della testata in una variabile CSS (serve alle fasce fisse della home)
  useEffect(() => {
    const el = testata.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const aggiorna = () => document.documentElement.style.setProperty("--h-testata", `${el.offsetHeight}px`);
    aggiorna();
    const osservatore = new ResizeObserver(aggiorna);
    osservatore.observe(el);
    return () => osservatore.disconnect();
  }, []);

  return (
    <div className="pagina">
      <header ref={testata} className={`testata${utente ? " testata-operatore" : ""}`}>
        <div className="testata-vuoto" aria-hidden="true" />
        <Link to="/" className="marchio" aria-label="Regen Luxury, torna alla home">
          <span className="marchio-nome">
            Regen <em>Luxury</em>
          </span>
          <span className="marchio-motto">Passaporto digitale · moda rigenerata</span>
        </Link>
        <nav className="menu" aria-label="Menu principale">
          <NavLink to="/scan" className="menu-voce">
            <IconaScansione dimensione={18} />
            <span>Verifica</span>
          </NavLink>
          <NavLink to="/armadio" className="menu-voce">
            <IconaGruccia dimensione={18} />
            <span className="testo-lungo">Il tuo armadio</span>
            <span className="testo-corto">Armadio</span>
            {armadio.length > 0 && <span className="contatore">{armadio.length}</span>}
          </NavLink>
          <StoricoMenu />
          {utente ? (
            <>
              <NavLink to="/gestione" className="menu-voce">
                <IconaUtente dimensione={18} />
                <span>Gestione</span>
              </NavLink>
              <button
                type="button"
                className="menu-voce menu-esci"
                onClick={() => {
                  logout();
                  naviga("/");
                }}
              >
                Esci
              </button>
            </>
          ) : (
            <NavLink to="/login" className="menu-voce">
              <IconaUtente dimensione={18} />
              <span>Accedi</span>
            </NavLink>
          )}
        </nav>
      </header>
      <main className={pathname === "/" ? "contenuto contenuto-home" : "contenuto"}>
        <Outlet />
      </main>
      <footer className="piede">
        <p className="piede-marchio">
          Regen <em>Luxury</em>
        </p>
        <p>Passaporto digitale dei capi rigenerati · prototipo di tesi, Politecnico di Bari</p>
        <p className="piede-crediti">Foto decorative: Unsplash (licenza Unsplash) · I marchi citati appartengono ai rispettivi titolari</p>
      </footer>
    </div>
  );
}
```

## `frontend/src/components/ModuloCapo.jsx`

```jsx
import { useState } from "react";
import { CATEGORIE, MATERIALI, maiuscola } from "../utils/formato.js";
import { AI_URL, classificaFoto } from "../services/api.js";

const VUOTO = { brand: "", codiceModello: "", materialiOriginari: "", filieraProvenienza: "", categoria: "", materialePrincipale: "", annoProduzione: "", tagId: "", proprietarioIniziale: "" };

// Modulo per creare (nuovo = true) o modificare i dati di un capo
export default function ModuloCapo({ iniziale = {}, nuovo = false, onInvia, inCorso, etichettaInvio }) {
  const [valori, setValori] = useState({ ...VUOTO, ...iniziale });
  const [suggerimento, setSuggerimento] = useState(null);
  const cambia = (campo) => (e) => setValori((v) => ({ ...v, [campo]: e.target.value }));

  const invia = (e) => {
    e.preventDefault();
    const dati = {};
    for (const [chiave, valore] of Object.entries(valori)) {
      if (!nuovo && (chiave === "tagId" || chiave === "proprietarioIniziale")) continue;
      if (valore === "" || valore === undefined || valore === null) {
        // in modifica, un campo facoltativo svuotato viene cancellato (null)
        if (!nuovo && iniziale[chiave] != null && iniziale[chiave] !== "") dati[chiave] = null;
        continue;
      }
      dati[chiave] = chiave === "annoProduzione" ? Number(valore) : typeof valore === "string" ? valore.trim() : valore;
    }
    onInvia(dati);
  };

  const suggerisciMateriale = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSuggerimento({ stato: "in_corso" });
    try {
      const r = await classificaFoto(file);
      setSuggerimento({ stato: "ok", ...r });
      if (r.materiale && MATERIALI.includes(r.materiale)) setValori((v) => ({ ...v, materialePrincipale: r.materiale }));
    } catch (err) {
      setSuggerimento({ stato: "errore", messaggio: err.message });
    }
  };

  return (
    <form className="modulo" onSubmit={invia}>
      {nuovo && (
        <label>
          Codice del tag (NFC/QR) *
          <input value={valori.tagId} onChange={cambia("tagId")} required pattern="[A-Za-z0-9_\-]{3,64}" placeholder="es. NFC-002" autoCapitalize="characters" />
          <small>Lettere, numeri, trattino. Non sarà più modificabile.</small>
        </label>
      )}
      <label>
        Brand *
        <input value={valori.brand} onChange={cambia("brand")} required maxLength={100} placeholder="es. Gucci" />
      </label>
      <label>
        Codice modello *
        <input value={valori.codiceModello} onChange={cambia("codiceModello")} required maxLength={100} placeholder="es. GG-2024" />
      </label>
      <label>
        Materiali originari *
        <input value={valori.materialiOriginari} onChange={cambia("materialiOriginari")} required maxLength={300} placeholder="es. Pelle e cotone" />
      </label>
      <div className="riga">
        <label>
          Categoria
          <select value={valori.categoria} onChange={cambia("categoria")}>
            <option value="">—</option>
            {CATEGORIE.map((c) => (
              <option key={c} value={c}>
                {maiuscola(c)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Materiale principale
          <select value={valori.materialePrincipale} onChange={cambia("materialePrincipale")}>
            <option value="">—</option>
            {MATERIALI.map((m) => (
              <option key={m} value={m}>
                {maiuscola(m)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {AI_URL && (
        <label className="riquadro-ai">
          Suggerisci il materiale da una foto (modulo AI)
          <input type="file" accept="image/*" capture="environment" onChange={suggerisciMateriale} />
          {suggerimento?.stato === "in_corso" && <small>Analisi della foto…</small>}
          {suggerimento?.stato === "ok" && (
            <small>
              Suggerito: <strong>{maiuscola(suggerimento.materiale)}</strong> (affidabilità {Math.round(suggerimento.confidenza * 100)}%). Controlla sempre l’etichetta del capo.
            </small>
          )}
          {suggerimento?.stato === "errore" && <small>{suggerimento.messaggio}</small>}
        </label>
      )}
      <div className="riga">
        <label>
          Filiera di provenienza
          <input value={valori.filieraProvenienza} onChange={cambia("filieraProvenienza")} maxLength={200} placeholder="es. Italia" />
        </label>
        <label>
          Anno di produzione
          <input type="number" value={valori.annoProduzione} onChange={cambia("annoProduzione")} min={1900} max={new Date().getFullYear()} />
        </label>
      </div>
      {nuovo && (
        <label>
          Primo proprietario (facoltativo)
          <input value={valori.proprietarioIniziale} onChange={cambia("proprietarioIniziale")} maxLength={100} placeholder="es. Boutique Vintage Bari" />
        </label>
      )}
      <button className="pulsante" disabled={inCorso}>
        {inCorso ? "Salvataggio…" : etichettaInvio}
      </button>
    </form>
  );
}
```

## `frontend/src/components/Protetta.jsx`

```jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { Caricamento } from "./Stato.jsx";

// Protegge le pagine dell'area gestionale: login obbligatorio ed eventuale ruolo
export default function Protetta({ ruoli }) {
  const { utente, pronto, puo } = useAuth();
  const posizione = useLocation();
  if (!pronto) return <Caricamento />;
  if (!utente) return <Navigate to="/login" replace state={{ da: posizione.pathname }} />;
  if (ruoli && !puo(...ruoli)) {
    return (
      <section className="scheda">
        <h1>Accesso non consentito</h1>
        <p>Il tuo ruolo non permette di aprire questa pagina.</p>
      </section>
    );
  }
  return <Outlet />;
}
```

## `frontend/src/components/Stato.jsx`

```jsx
export function Caricamento({ testo = "Caricamento…" }) {
  return (
    <div className="stato" role="status">
      <span className="rotella" aria-hidden="true" />
      {testo}
    </div>
  );
}

export function Errore({ errore, titolo = "Qualcosa non ha funzionato" }) {
  if (!errore) return null;
  const dettagli = errore.dati?.dettagli;
  return (
    <div className="avviso avviso-errore" role="alert">
      <strong>{titolo}</strong>
      <p>{errore.message}</p>
      {dettagli?.length > 0 && (
        <ul>
          {dettagli.map((d) => (
            <li key={d.campo + d.messaggio}>
              {d.campo}: {d.messaggio}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## `frontend/src/components/StoricoMenu.jsx`

```jsx
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useStorico, svuotaStorico } from "../utils/archivio.js";
import { ESITO_BREVE, tempoFa } from "../utils/formato.js";
import { IconaOrologio } from "./Icone.jsx";

// Voce "Storico" della testata: si apre a tendina con le ultime verifiche
export default function StoricoMenu() {
  const storico = useStorico();
  const [aperto, setAperto] = useState(false);
  const contenitore = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => setAperto(false), [pathname]);
  useEffect(() => {
    if (!aperto) return undefined;
    const fuori = (e) => !contenitore.current?.contains(e.target) && setAperto(false);
    const esc = (e) => e.key === "Escape" && setAperto(false);
    document.addEventListener("pointerdown", fuori);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", fuori);
      document.removeEventListener("keydown", esc);
    };
  }, [aperto]);

  return (
    <div className="menu-tendina" ref={contenitore}>
      <button
        type="button"
        className={`menu-voce${aperto ? " active" : ""}`}
        aria-expanded={aperto}
        aria-controls="tendina-storico"
        onClick={() => setAperto((a) => !a)}
      >
        <IconaOrologio dimensione={18} />
        <span>Storico</span>
        {storico.length > 0 && <span className="contatore">{storico.length}</span>}
        <span className="freccina" aria-hidden="true">▾</span>
      </button>

      {aperto && (
        <div className="tendina" id="tendina-storico" role="region" aria-label="Storico delle verifiche">
          <div className="tendina-testa">
            <strong>Le tue verifiche</strong>
            <span>salvate solo su questo dispositivo</span>
          </div>
          {storico.length === 0 ? (
            <p className="tendina-vuota">Nessuna verifica per ora. Scansiona il QR code o il tag NFC di un capo: lo ritroverai qui.</p>
          ) : (
            <ul className="tendina-elenco">
              {storico.slice(0, 8).map((v) => {
                const esito = ESITO_BREVE[v.esito] ?? ESITO_BREVE.non_registrato;
                return (
                  <li key={v.tagId}>
                    <Link to={`/v/${encodeURIComponent(v.tagId)}`} className="voce-storico">
                      <span className="voce-testo">
                        <strong>{v.brand ?? "Codice sconosciuto"}</strong>
                        <span>
                          {v.codiceModello ?? v.tagId} · {tempoFa(v.data)}
                          {v.volte > 1 && ` · ${v.volte} verifiche`}
                        </span>
                      </span>
                      <span className={`bollino bollino-${esito.classe}`}>{esito.testo}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="tendina-piede">
            <Link to="/scan">Nuova verifica</Link>
            {storico.length > 0 && (
              <button type="button" className="link" onClick={svuotaStorico}>
                Cancella storico
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

## `frontend/src/data/foto.js`

```javascript
/*
 * Foto decorative dei caroselli della home: Unsplash, licenza Unsplash
 * (uso gratuito, anche commerciale; https://unsplash.com/license).
 * Scelte senza loghi in evidenza: i marchi restano dei rispettivi titolari.
 * Crediti completi in docs/crediti-foto.md.
 */
const unsplash = (id, larghezza = 360, altezza = 480) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${larghezza}&h=${altezza}&q=70`;

// Fascia sinistra: i capi e gli accessori
export const FOTO_CAPI = [
  { id: "1551028719-00167b16eac5", didascalia: "Giacca in pelle", pagina: "nsRBbE6-YLs" },
  { id: "1584917865442-de89df76afd3", didascalia: "Borsa in pelle", pagina: "oCXVxwTFwqE" },
  { id: "1623854156816-4c4fc355ffc7", didascalia: "Pelle vissuta", pagina: "3OFBcQQTN64" },
  { id: "1589363358751-ab05797e5629", didascalia: "Trench e accessori", pagina: "W-7k72ThEr0" },
  { id: "1559563458-527698bf5295", didascalia: "Tracolla in pelle", pagina: "ZB4eQcNqVUs" },
  { id: "1559551409-dadc959f76b8", didascalia: "Montoni vintage", pagina: "eTCogYz7kQE" },
].map((f) => ({ ...f, src: unsplash(f.id) }));

// Fascia destra: rigenerazione, laboratori e boutique
export const FOTO_RIGENERAZIONE = [
  { id: "1606501126768-b78d4569d3f9", didascalia: "Laboratorio sartoriale", pagina: "TAZUc51iPUM" },
  { id: "1621261027519-a71ac66d5a68", didascalia: "Boutique vintage", pagina: "vFcfeKAKGlg" },
  { id: "1621785847991-884bae1f95f1", didascalia: "La vetrina", pagina: "bUg7Fdq6nXo" },
  { id: "1497997092403-f091fcf5b6c4", didascalia: "Cucitura di precisione", pagina: "jNKv4QohAk0" },
  { id: "1596484552993-aec4311d3381", didascalia: "Seconda vita", pagina: "UdQt3FT6rxM" },
  { id: "1641320197434-6ae0ca235048", didascalia: "Riparazione", pagina: "F14VKsS0iL8" },
  { id: "1760533091973-1262bf57d244", didascalia: "Pelle rigenerata", pagina: "KgjNOmuTlNw" },
  { id: "1578353022142-09264fd64295", didascalia: "Filati e forbici", pagina: "tX62O5F3AfU" },
].map((f) => ({ ...f, src: unsplash(f.id) }));
```

## `frontend/src/hooks/useAuth.jsx`

```jsx
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, token } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utente, setUtente] = useState(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (!token.leggi()) {
      setPronto(true);
      return;
    }
    api("/auth/me")
      .then((d) => setUtente(d.utente))
      // solo un 401 significa sessione non valida; rete assente o server in avvio no
      .catch((err) => err.status === 401 && token.cancella())
      .finally(() => setPronto(true));
  }, []);

  useEffect(() => {
    const scaduta = () => setUtente(null);
    window.addEventListener("regen:sessione-scaduta", scaduta);
    return () => window.removeEventListener("regen:sessione-scaduta", scaduta);
  }, []);

  const login = useCallback(async (email, password) => {
    const d = await api("/auth/login", { metodo: "POST", corpo: { email, password } });
    token.salva(d.token);
    setUtente(d.utente);
    return d.utente;
  }, []);

  const logout = useCallback(() => {
    token.cancella();
    setUtente(null);
  }, []);

  // L'amministratore può tutto; gli altri solo i ruoli indicati
  const puo = useCallback((...ruoli) => !!utente && (utente.ruolo === "admin" || ruoli.includes(utente.ruolo)), [utente]);

  return <AuthContext.Provider value={{ utente, pronto, login, logout, puo }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
```

## `frontend/src/main.jsx`

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";
import "./styles/app.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

## `frontend/src/pages/AccountPage.jsx`

```jsx
import { useState } from "react";
import { api } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { Errore } from "../components/Stato.jsx";
import { RUOLI } from "../utils/formato.js";

export default function AccountPage() {
  const { utente } = useAuth();
  const [vecchia, setVecchia] = useState("");
  const [nuova, setNuova] = useState("");
  const [esito, setEsito] = useState(null);
  const [errore, setErrore] = useState(null);

  const invia = async (e) => {
    e.preventDefault();
    setErrore(null);
    setEsito(null);
    try {
      await api("/auth/password", { metodo: "POST", corpo: { vecchia, nuova } });
      setEsito("Password aggiornata.");
      setVecchia("");
      setNuova("");
    } catch (err) {
      setErrore(err);
    }
  };

  return (
    <section className="scheda scheda-stretta">
      <h1>Il tuo account</h1>
      <p>
        {utente.nome} · {utente.email} · {RUOLI[utente.ruolo]}
      </p>
      <h2>Cambia password</h2>
      <form className="modulo" onSubmit={invia}>
        <label>
          Password attuale
          <input type="password" value={vecchia} onChange={(e) => setVecchia(e.target.value)} required autoComplete="current-password" />
        </label>
        <label>
          Nuova password (almeno 10 caratteri)
          <input type="password" value={nuova} onChange={(e) => setNuova(e.target.value)} required minLength={10} autoComplete="new-password" />
        </label>
        <Errore errore={errore} />
        {esito && <div className="avviso avviso-ok">{esito}</div>}
        <button className="pulsante">Aggiorna la password</button>
      </form>
    </section>
  );
}
```

## `frontend/src/pages/ArmadioPage.jsx`

```jsx
import { Link } from "react-router-dom";
import { useArmadio, rimuoviDallArmadio } from "../utils/archivio.js";
import { ESITO_BREVE, data, iniziali, maiuscola, numero } from "../utils/formato.js";
import { IconaFoglia, IconaGruccia, IconaScansione } from "../components/Icone.jsx";

export default function ArmadioPage() {
  const armadio = useArmadio();
  const co2 = armadio.reduce((s, c) => s + (c.co2Kg ?? 0), 0);
  const acqua = armadio.reduce((s, c) => s + (c.acquaL ?? 0), 0);

  return (
    <section className="armadio">
      <header className="pagina-testa">
        <p className="sopratitolo">Il tuo armadio</p>
        <h1>I capi che hai scelto, con la loro storia.</h1>
        <p className="pagina-intro">
          Aggiungi qui i capi verificati che hai acquistato: ritrovi in un tocco il loro passaporto digitale. L’elenco resta
          solo su questo dispositivo, senza account e senza inviare dati.
        </p>
      </header>

      {armadio.length === 0 ? (
        <div className="armadio-vuoto">
          <span className="armadio-vuoto-icona">
            <IconaGruccia dimensione={40} />
          </span>
          <h2>Il tuo armadio è ancora vuoto</h2>
          <p>Verifica un capo e, nel suo certificato, premi «Aggiungi al mio armadio».</p>
          <Link to="/scan" className="pulsante pulsante-grande">
            <IconaScansione dimensione={20} /> Verifica un capo
          </Link>
        </div>
      ) : (
        <>
          <dl className="riepilogo">
            <div>
              <dt>Capi</dt>
              <dd>{armadio.length}</dd>
            </div>
            <div>
              <dt>CO₂ evitata</dt>
              <dd>
                {numero(co2)} <small>kg</small>
              </dd>
            </div>
            <div>
              <dt>Acqua preservata</dt>
              <dd>
                {numero(acqua, 0)} <small>L</small>
              </dd>
            </div>
          </dl>
          {armadio.some((c) => c.co2Kg == null) && (
            <p className="nota">Per alcune categorie di capi la stima ambientale non è ancora disponibile.</p>
          )}

          <ul className="armadio-griglia">
            {armadio.map((c) => {
              const esito = ESITO_BREVE[c.esito] ?? ESITO_BREVE.non_registrato;
              return (
                <li key={c.tagId} className="capo-carta">
                  <div className="capo-monogramma" aria-hidden="true">
                    {iniziali(c.brand)}
                  </div>
                  <div className="capo-info">
                    <p className="sopratitolo">
                      {maiuscola(c.categoria ?? "capo")}
                      {c.materialePrincipale && ` · ${c.materialePrincipale}`}
                    </p>
                    <h2>{c.brand}</h2>
                    <p>
                      {c.codiceModello}
                      {c.annoProduzione && ` · ${c.annoProduzione}`}
                    </p>
                    <p className="capo-dettagli">
                      <span className={`bollino bollino-${esito.classe}`}>{esito.testo}</span>
                      {c.co2Kg != null && (
                        <span className="capo-impatto">
                          <IconaFoglia dimensione={16} /> {numero(c.co2Kg)} kg CO₂e evitati
                        </span>
                      )}
                    </p>
                    <p className="nota">
                      Tag {c.tagId} · nel tuo armadio dal {data(c.aggiuntoIl)}
                    </p>
                  </div>
                  <div className="capo-azioni">
                    <Link className="pulsante" to={`/v/${encodeURIComponent(c.tagId)}`}>
                      Rivedi il certificato
                    </Link>
                    <button type="button" className="link link-pericolo" onClick={() => rimuoviDallArmadio(c.tagId)}>
                      Rimuovi
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
```

## `frontend/src/pages/DashboardPage.jsx`

```jsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import Ancoraggio from "../components/Ancoraggio.jsx";
import { Caricamento, Errore } from "../components/Stato.jsx";
import { RUOLI, data } from "../utils/formato.js";

export default function DashboardPage() {
  const { utente, puo } = useAuth();
  const [parametri, setParametri] = useSearchParams();
  const q = parametri.get("q") ?? "";
  const stato = parametri.get("stato") ?? "";
  const pagina = Number(parametri.get("pagina") ?? 1);
  const [ricerca, setRicerca] = useState(q);
  const [risultato, setRisultato] = useState({ caricamento: true });

  useEffect(() => {
    const query = new URLSearchParams({ pagina: String(pagina), perPagina: "10" });
    if (q) query.set("q", q);
    if (stato) query.set("stato", stato);
    setRisultato((r) => ({ ...r, caricamento: true }));
    api(`/items?${query}`)
      .then((dati) => setRisultato({ dati }))
      .catch((errore) => setRisultato({ errore }));
  }, [q, stato, pagina]);

  const aggiorna = (nuovi) => {
    const p = new URLSearchParams(parametri);
    for (const [k, v] of Object.entries(nuovi)) v ? p.set(k, v) : p.delete(k);
    setParametri(p);
  };

  return (
    <section>
      <div className="intestazione-sezione">
        <div>
          <p className="sopratitolo">
            {utente.nome} · {RUOLI[utente.ruolo]}
          </p>
          <h1>Capi registrati</h1>
        </div>
        <div className="azioni">
          {puo("brand_manager", "commerciante") && (
            <Link to="/gestione/nuovo" className="pulsante">
              Nuovo capo
            </Link>
          )}
          {puo("admin") && (
            <Link to="/gestione/utenti" className="pulsante pulsante-secondario">
              Utenti
            </Link>
          )}
          <Link to="/gestione/account" className="pulsante pulsante-secondario">
            Account
          </Link>
        </div>
      </div>

      <form
        className="modulo modulo-in-linea"
        onSubmit={(e) => {
          e.preventDefault();
          aggiorna({ q: ricerca.trim(), pagina: "" });
        }}
      >
        <input value={ricerca} onChange={(e) => setRicerca(e.target.value)} placeholder="Cerca per brand, modello o tag" aria-label="Cerca" />
        <select value={stato} onChange={(e) => aggiorna({ stato: e.target.value, pagina: "" })} aria-label="Stato">
          <option value="">Tutti</option>
          <option value="attivo">Attivi</option>
          <option value="archiviato">Archiviati</option>
        </select>
        <button className="pulsante">Cerca</button>
      </form>

      {risultato.errore && <Errore errore={risultato.errore} />}
      {risultato.caricamento && !risultato.dati && <Caricamento />}
      {risultato.dati && (
        <>
          <p className="nota">{risultato.dati.totale === 1 ? "1 capo trovato" : `${risultato.dati.totale} capi trovati`}</p>
          <ul className="elenco-capi">
            {risultato.dati.dati.map((capo) => (
              <li key={capo._id}>
                <Link to={`/gestione/capi/${capo._id}`} className="riga-capo">
                  <span>
                    <strong>{capo.brand}</strong> {capo.codiceModello}
                    <span className="nota"> · {capo.tagId}</span>
                    {capo.stato === "archiviato" && <span className="etichetta">Archiviato</span>}
                  </span>
                  <span className="nota">
                    {capo.storicoRigenerazione?.length ?? 0} {(capo.storicoRigenerazione?.length ?? 0) === 1 ? "intervento" : "interventi"} · creato il {data(capo.createdAt)}
                  </span>
                  <Ancoraggio ancoraggio={capo.registrazione} />
                </Link>
              </li>
            ))}
          </ul>
          {risultato.dati.pagine > 1 && (
            <nav className="paginazione" aria-label="Pagine">
              <button className="link" disabled={pagina <= 1} onClick={() => aggiorna({ pagina: String(pagina - 1) })}>
                ← Precedente
              </button>
              <span>
                Pagina {pagina} di {risultato.dati.pagine}
              </span>
              <button className="link" disabled={pagina >= risultato.dati.pagine} onClick={() => aggiorna({ pagina: String(pagina + 1) })}>
                Successiva →
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
```

## `frontend/src/pages/HomePage.jsx`

```jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Carosello from "../components/Carosello.jsx";
import { FOTO_CAPI, FOTO_RIGENERAZIONE } from "../data/foto.js";
import { IconaAgo, IconaChip, IconaFoglia, IconaFreccia, IconaGruccia, IconaScansione, IconaScudo } from "../components/Icone.jsx";

const PASSI = [
  { titolo: "Scansiona", testo: "Avvicina il telefono al tag NFC cucito nel capo oppure inquadra il QR code dell’etichetta." },
  { titolo: "Scopri la storia", testo: "Autenticità, interventi di rigenerazione, proprietari precedenti e impatto ambientale evitato." },
  { titolo: "Conservalo", testo: "Se lo acquisti, aggiungilo al tuo armadio: il suo passaporto resta a portata di mano." },
];

const CARATTERISTICHE = [
  {
    Icona: IconaScudo,
    titolo: "Autenticità",
    testo: "I dati del capo sono confrontati con le impronte registrate sulla blockchain Polygon: ogni modifica non autorizzata viene rilevata.",
  },
  {
    Icona: IconaAgo,
    titolo: "Rigenerazione",
    testo: "Riparazioni, upcycling e sostituzioni di parti, con i materiali impiegati e il laboratorio artigiano che li ha eseguiti.",
  },
  {
    Icona: IconaFoglia,
    titolo: "Sostenibilità",
    testo: "Stima della CO₂ e dell’acqua risparmiate rispetto a un capo nuovo, con le fonti scientifiche utilizzate.",
  },
];

export default function HomePage() {
  const [codice, setCodice] = useState("");
  const naviga = useNavigate();
  const valido = /^[A-Za-z0-9_-]{3,64}$/.test(codice.trim());

  return (
    <div className="home">
      <aside className="home-fascia">
        <Carosello foto={FOTO_CAPI} verso="avanti" etichetta="I capi" />
      </aside>

      <div className="home-centro">
        <section className="eroe">
          <p className="sopratitolo">Moda di lusso rigenerata</p>
          <h1>
            La storia di ogni capo, <em>verificabile in un tocco.</em>
          </h1>
          <p className="eroe-testo">
            Avvicina il telefono al tag NFC cucito nel capo oppure inquadra il QR code: vedrai autenticità, interventi di
            rigenerazione, passaggi di proprietà e impatto ambientale evitato. Senza app e senza registrazione.
          </p>
          <div className="eroe-azioni">
            <Link to="/scan" className="pulsante pulsante-grande">
              <IconaScansione dimensione={20} /> Verifica un capo
            </Link>
            <Link to="/armadio" className="pulsante pulsante-grande pulsante-secondario">
              <IconaGruccia dimensione={20} /> Il tuo armadio
            </Link>
          </div>
          <ul className="garanzie">
            <li>
              <IconaScudo dimensione={18} /> Registro su blockchain
            </li>
            <li>
              <IconaChip dimensione={18} /> Chip NFC anticlonazione
            </li>
            <li>
              <IconaFoglia dimensione={18} /> Impatto ambientale con fonti
            </li>
          </ul>
        </section>

        <Carosello foto={[...FOTO_CAPI, ...FOTO_RIGENERAZIONE]} orientamento="orizzontale" />

        <section className="scheda scheda-codice">
          <div>
            <h2>Hai il codice del tag?</h2>
            <p className="nota">Lo trovi sull’etichetta del capo, sotto il QR code.</p>
          </div>
          <form
            className="modulo modulo-in-linea"
            onSubmit={(e) => {
              e.preventDefault();
              if (valido) naviga(`/v/${encodeURIComponent(codice.trim())}`);
            }}
          >
            <input value={codice} onChange={(e) => setCodice(e.target.value)} placeholder="es. NFC-001" aria-label="Codice del tag" />
            <button className="pulsante" disabled={!valido}>
              Verifica <IconaFreccia dimensione={18} />
            </button>
          </form>
        </section>

        <section className="come-funziona">
          <p className="sopratitolo">Come funziona</p>
          <h2>Tre gesti, nessuna app da installare</h2>
          <ol className="passi">
            {PASSI.map((p, i) => (
              <li key={p.titolo}>
                <span className="passi-numero">{i + 1}</span>
                <h3>{p.titolo}</h3>
                <p>{p.testo}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="caratteristiche">
          {CARATTERISTICHE.map(({ Icona, titolo, testo }) => (
            <article key={titolo}>
              <span className="caratteristica-icona">
                <Icona dimensione={26} />
              </span>
              <h3>{titolo}</h3>
              <p>{testo}</p>
            </article>
          ))}
        </section>
      </div>

      <aside className="home-fascia">
        <Carosello foto={FOTO_RIGENERAZIONE} verso="indietro" etichetta="La rigenerazione" />
      </aside>
    </div>
  );
}
```

## `frontend/src/pages/ItemDetailPage.jsx`

```jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import Ancoraggio from "../components/Ancoraggio.jsx";
import ModuloCapo from "../components/ModuloCapo.jsx";
import { Caricamento, Errore } from "../components/Stato.jsx";
import { TIPI_EVENTO, data, dataOra, maiuscola } from "../utils/formato.js";
import { nfcDisponibile, leggiTagNfc } from "../utils/nfc.js";
import { interpretaCodice } from "../utils/formato.js";

const inAttesa = (capo) =>
  capo.registrazione?.stato === "in_attesa" ||
  capo.storicoRigenerazione.some((e) => e.ancoraggio?.stato === "in_attesa") ||
  capo.passaggiProprieta.some((p) => p.ancoraggio?.stato === "in_attesa");

function ModuloEvento({ onInvia, inCorso }) {
  const [v, setV] = useState({ tipo: "riparazione", descrizione: "", materialiNuovi: "", operatore: "" });
  const cambia = (k) => (e) => setV((x) => ({ ...x, [k]: e.target.value }));
  return (
    <form
      className="modulo"
      onSubmit={(e) => {
        e.preventDefault();
        const dati = Object.fromEntries(Object.entries(v).filter(([, x]) => x.trim() !== ""));
        onInvia(dati).then((ok) => ok && setV({ tipo: "riparazione", descrizione: "", materialiNuovi: "", operatore: "" }));
      }}
    >
      <label>
        Tipo di intervento
        <select value={v.tipo} onChange={cambia("tipo")}>
          {Object.entries(TIPI_EVENTO).map(([k, t]) => (
            <option key={k} value={k}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label>
        Descrizione *
        <textarea value={v.descrizione} onChange={cambia("descrizione")} required maxLength={1000} rows={3} placeholder="es. Rifoderatura interna e sostituzione bottoni" />
      </label>
      <div className="riga">
        <label>
          Nuovi materiali e origine
          <input value={v.materialiNuovi} onChange={cambia("materialiNuovi")} maxLength={300} placeholder="es. Cotone riciclato certificato" />
        </label>
        <label>
          Laboratorio / operatore
          <input value={v.operatore} onChange={cambia("operatore")} maxLength={100} placeholder="es. Laboratorio Bari" />
        </label>
      </div>
      <button className="pulsante" disabled={inCorso}>
        Registra l’intervento
      </button>
    </form>
  );
}

function ModuloPassaggio({ onInvia, inCorso }) {
  const [nome, setNome] = useState("");
  return (
    <form
      className="modulo modulo-in-linea"
      onSubmit={(e) => {
        e.preventDefault();
        onInvia({ proprietario: nome.trim() }).then((ok) => ok && setNome(""));
      }}
    >
      <input value={nome} onChange={(e) => setNome(e.target.value)} required maxLength={100} placeholder="Nome del nuovo proprietario" aria-label="Nuovo proprietario" />
      <button className="pulsante" disabled={inCorso || !nome.trim()}>
        Registra
      </button>
    </form>
  );
}

function ModuloNfc({ onInvia, inCorso }) {
  const [uid, setUid] = useState("");
  const [messaggio, setMessaggio] = useState("");
  const leggi = async () => {
    setMessaggio("Avvicina il telefono al chip…");
    try {
      const letto = await leggiTagNfc();
      const d = interpretaCodice(letto.url);
      if (d?.tipo === "sun") {
        const ok = await onInvia({ e: d.e, c: d.c });
        setMessaggio(ok ? "Chip associato e verificato con le chiavi SDM." : "");
      } else if (letto.uid) {
        setUid(letto.uid);
        setMessaggio("UID letto: controlla e conferma.");
      }
    } catch (err) {
      setMessaggio(err.message);
    }
  };
  return (
    <div>
      {nfcDisponibile() && (
        <button className="pulsante pulsante-secondario" onClick={leggi} disabled={inCorso}>
          Leggi il chip con il telefono
        </button>
      )}
      <form
        className="modulo modulo-in-linea"
        onSubmit={(e) => {
          e.preventDefault();
          onInvia({ uid: uid.trim() });
        }}
      >
        <input value={uid} onChange={(e) => setUid(e.target.value.toUpperCase())} pattern="[0-9A-Fa-f]{14}" placeholder="UID del chip (14 caratteri esadecimali)" aria-label="UID del chip" />
        <button className="pulsante" disabled={inCorso || uid.length !== 14}>
          Associa
        </button>
      </form>
      {messaggio && <p className="nota">{messaggio}</p>}
    </div>
  );
}

export default function ItemDetailPage() {
  const { id } = useParams();
  const posizione = useLocation();
  const { puo } = useAuth();
  const [capo, setCapo] = useState(null);
  const [errore, setErrore] = useState(null);
  const [azione, setAzione] = useState(null);
  const [modifica, setModifica] = useState(false);

  const carica = useCallback(() => api(`/items/${id}`).then(setCapo).catch(setErrore), [id]);
  useEffect(() => {
    carica();
  }, [carica]);

  // Le scritture sulla blockchain sono asincrone: si aggiorna finché ci sono conferme in attesa
  // (al massimo 60 controlli di fila, circa 2 minuti: oltre, basta ricaricare la pagina)
  const controlli = useRef(0);
  useEffect(() => {
    if (!capo || !inAttesa(capo)) {
      controlli.current = 0;
      return undefined;
    }
    if (controlli.current >= 60) return undefined;
    controlli.current += 1;
    const timer = setTimeout(carica, 2000);
    return () => clearTimeout(timer);
  }, [capo, carica]);

  const esegui = async (nome, percorso, metodo, corpo) => {
    setAzione(nome);
    setErrore(null);
    controlli.current = 0;
    try {
      const r = await api(percorso, { metodo, corpo });
      if (r?._id) setCapo(r);
      else await carica();
      return true;
    } catch (err) {
      setErrore(err);
      return false;
    } finally {
      setAzione(null);
    }
  };

  if (!capo && !errore) return <Caricamento />;
  if (!capo) return <Errore errore={errore} />;
  const archiviato = capo.stato === "archiviato";

  return (
    <section>
      {posizione.state?.creato && <div className="avviso avviso-ok">Capo creato. La registrazione sulla blockchain è in corso.</div>}
      <div className="intestazione-sezione">
        <div>
          <p className="sopratitolo">Tag {capo.tagId}</p>
          <h1>
            {capo.brand} <span className="leggero">{capo.codiceModello}</span>
          </h1>
          <Ancoraggio ancoraggio={capo.registrazione} />
          {archiviato && <span className="etichetta">Archiviato</span>}
        </div>
        <div className="azioni">
          <Link className="pulsante pulsante-secondario" to={`/v/${encodeURIComponent(capo.tagId)}`}>
            Pagina pubblica
          </Link>
          <Link className="pulsante pulsante-secondario" to={`/gestione/capi/${capo._id}/etichetta`}>
            Etichetta QR
          </Link>
        </div>
      </div>

      <Errore errore={errore} titolo="Operazione non riuscita" />

      <div className="scheda">
        <h2>Dati del capo</h2>
        {modifica ? (
          <ModuloCapo
            iniziale={Object.fromEntries(["brand", "codiceModello", "materialiOriginari", "filieraProvenienza", "categoria", "materialePrincipale", "annoProduzione"].map((k) => [k, capo[k] ?? ""]))}
            inCorso={azione === "modifica"}
            etichettaInvio="Salva le modifiche"
            onInvia={async (dati) => {
              if (await esegui("modifica", `/items/${capo._id}`, "PATCH", dati)) setModifica(false);
            }}
          />
        ) : (
          <>
            <dl className="scheda-dati">
              <dt>Materiali originari</dt>
              <dd>{capo.materialiOriginari}</dd>
              <dt>Categoria</dt>
              <dd>{capo.categoria ? maiuscola(capo.categoria) : "—"}</dd>
              <dt>Materiale principale</dt>
              <dd>{capo.materialePrincipale ? maiuscola(capo.materialePrincipale) : "—"}</dd>
              <dt>Filiera</dt>
              <dd>{capo.filieraProvenienza || "—"}</dd>
              <dt>Anno</dt>
              <dd>{capo.annoProduzione || "—"}</dd>
              <dt>Chip NFC</dt>
              <dd>{capo.nfc?.uid ? `${capo.nfc.uid} (associato il ${data(capo.nfc.associatoIl)})` : "non associato"}</dd>
              <dt>Creato</dt>
              <dd>{dataOra(capo.createdAt)}</dd>
            </dl>
            {!archiviato && puo("brand_manager", "commerciante") && (
              <button className="link" onClick={() => setModifica(true)}>
                Modifica i dati
              </button>
            )}
          </>
        )}
      </div>

      <div className="scheda">
        <h2>Interventi di rigenerazione</h2>
        {capo.storicoRigenerazione.length === 0 && <p className="nota">Nessun intervento registrato.</p>}
        <ol className="linea-tempo">
          {capo.storicoRigenerazione.map((e) => (
            <li key={e._id}>
              <span className="linea-data">{data(e.data)}</span>
              <strong>{TIPI_EVENTO[e.tipo] ?? e.tipo}</strong>
              <p>{e.descrizione}</p>
              {(e.materialiNuovi || e.operatore) && <p className="nota">{[e.materialiNuovi, e.operatore].filter(Boolean).join(" · ")}</p>}
              <Ancoraggio ancoraggio={e.ancoraggio} />
            </li>
          ))}
        </ol>
        {!archiviato && puo("artigiano", "commerciante") && (
          <details className="apribile">
            <summary>Registra un nuovo intervento</summary>
            <ModuloEvento inCorso={azione === "evento"} onInvia={(dati) => esegui("evento", `/items/${capo._id}/eventi`, "POST", dati)} />
          </details>
        )}
      </div>

      <div className="scheda">
        <h2>Passaggi di proprietà</h2>
        {capo.passaggiProprieta.length === 0 && <p className="nota">Nessun passaggio registrato.</p>}
        <ol className="catena">
          {capo.passaggiProprieta.map((p, i) => (
            <li key={p._id}>
              <span className="passo">{i + 1}</span>
              <span>
                <strong>{p.proprietario}</strong>
                <span className="nota"> · {data(p.data)}</span>
              </span>
              <Ancoraggio ancoraggio={p.ancoraggio} />
            </li>
          ))}
        </ol>
        {!archiviato && puo("commerciante", "brand_manager") && (
          <ModuloPassaggio inCorso={azione === "passaggio"} onInvia={(dati) => esegui("passaggio", `/items/${capo._id}/proprieta`, "POST", dati)} />
        )}
      </div>

      {puo("brand_manager", "commerciante") && (
        <div className="scheda">
          <h2>Chip NFC</h2>
          <p className="nota">Associa un chip NTAG 424 DNA: con il messaggio dinamico il server verifica che il chip sia autentico.</p>
          <ModuloNfc inCorso={azione === "nfc"} onInvia={(dati) => esegui("nfc", `/items/${capo._id}/nfc`, "POST", dati)} />
        </div>
      )}

      {!archiviato && puo("brand_manager") && (
        <div className="scheda zona-rischio">
          <h2>Archiviazione</h2>
          <p className="nota">Il capo non sarà più modificabile, ma la sua storia resterà verificabile.</p>
          <button
            className="pulsante pulsante-pericolo"
            disabled={azione === "archivia"}
            onClick={() => {
              if (window.confirm("Archiviare definitivamente questo capo?")) esegui("archivia", `/items/${capo._id}/archivia`, "POST");
            }}
          >
            Archivia il capo
          </button>
        </div>
      )}
    </section>
  );
}
```

## `frontend/src/pages/LabelPage.jsx`

```jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api.js";
import { Caricamento, Errore } from "../components/Stato.jsx";

// Etichetta stampabile con il QR code (fallback universale del tag NFC)
export default function LabelPage() {
  const { id } = useParams();
  const [capo, setCapo] = useState(null);
  const [qr, setQr] = useState(null);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    let url;
    Promise.all([api(`/items/${id}`), api(`/items/${id}/qr`, { formato: "blob" })])
      .then(([c, immagine]) => {
        setCapo(c);
        url = URL.createObjectURL(immagine);
        setQr({ src: url, indirizzo: immagine.urlVerifica });
      })
      .catch(setErrore);
    return () => url && URL.revokeObjectURL(url);
  }, [id]);

  if (errore) return <Errore errore={errore} />;
  if (!capo || !qr) return <Caricamento />;
  // l'indirizzo stampato è lo stesso contenuto nel QR (PUBLIC_BASE_URL del backend)
  const indirizzo = qr.indirizzo ?? `${window.location.origin}/v/${encodeURIComponent(capo.tagId)}`;

  return (
    <section>
      <div className="azioni non-stampare">
        <Link to={`/gestione/capi/${id}`} className="link">
          ← Torna al capo
        </Link>
        <button className="pulsante" onClick={() => window.print()}>
          Stampa l’etichetta
        </button>
      </div>
      <div className="etichetta-stampa">
        <img src={qr.src} alt={`QR code di verifica del capo ${capo.tagId}`} />
        <div>
          <p className="sopratitolo">Passaporto digitale</p>
          <h2>{capo.brand}</h2>
          <p>{capo.codiceModello}</p>
          <p className="codice">{capo.tagId}</p>
          <p className="nota">Inquadra per verificare autenticità e storia del capo</p>
          <p className="nota url">{indirizzo}</p>
        </div>
      </div>
    </section>
  );
}
```

## `frontend/src/pages/LoginPage.jsx`

```jsx
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { Errore } from "../components/Stato.jsx";

export default function LoginPage() {
  const { login, utente } = useAuth();
  const naviga = useNavigate();
  const posizione = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState(null);
  const [inCorso, setInCorso] = useState(false);

  if (utente) return <Navigate to="/gestione" replace />;

  const invia = async (e) => {
    e.preventDefault();
    setInCorso(true);
    setErrore(null);
    try {
      await login(email, password);
      naviga(posizione.state?.da ?? "/gestione", { replace: true });
    } catch (err) {
      setErrore(err);
    } finally {
      setInCorso(false);
    }
  };

  return (
    <section className="scheda scheda-stretta">
      <h1>Area gestionale</h1>
      <p className="nota">Per boutique, laboratori artigiani e brand manager. I clienti non hanno bisogno di accedere.</p>
      <form className="modulo" onSubmit={invia}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
        <Errore errore={errore} titolo="Accesso non riuscito" />
        <button className="pulsante" disabled={inCorso}>
          {inCorso ? "Accesso…" : "Accedi"}
        </button>
      </form>
    </section>
  );
}
```

## `frontend/src/pages/NewItemPage.jsx`

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import ModuloCapo from "../components/ModuloCapo.jsx";
import { Errore } from "../components/Stato.jsx";

export default function NewItemPage() {
  const naviga = useNavigate();
  const [errore, setErrore] = useState(null);
  const [inCorso, setInCorso] = useState(false);

  const crea = async (dati) => {
    setInCorso(true);
    setErrore(null);
    try {
      const capo = await api("/items", { metodo: "POST", corpo: dati });
      naviga(`/gestione/capi/${capo._id}`, { state: { creato: true } });
    } catch (err) {
      setErrore(err);
      setInCorso(false);
    }
  };

  return (
    <section className="scheda">
      <h1>Nuovo capo</h1>
      <p className="nota">Crea l’identità digitale del capo e collegala al codice del tag fisico. La registrazione sulla blockchain avviene in background.</p>
      <Errore errore={errore} titolo="Capo non creato" />
      <ModuloCapo nuovo onInvia={crea} inCorso={inCorso} etichettaInvio="Crea il capo" />
    </section>
  );
}
```

## `frontend/src/pages/NotFoundPage.jsx`

```jsx
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="scheda">
      <h1>Pagina non trovata</h1>
      <p>
        L’indirizzo non esiste. <Link to="/">Torna alla home</Link>.
      </p>
    </section>
  );
}
```

## `frontend/src/pages/ScanPage.jsx`

```jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from "qr-scanner";
import { interpretaCodice } from "../utils/formato.js";
import { nfcDisponibile, leggiTagNfc } from "../utils/nfc.js";

export default function ScanPage() {
  const video = useRef(null);
  const naviga = useNavigate();
  const [messaggio, setMessaggio] = useState("Inquadra il QR code del capo");
  const [nfcAttivo, setNfcAttivo] = useState(false);

  const vai = (testo) => {
    const destinazione = interpretaCodice(testo);
    if (!destinazione) {
      setMessaggio("Codice non riconosciuto: non appartiene a un capo della piattaforma.");
      return false;
    }
    if (destinazione.tipo === "sun") naviga(`/s?e=${destinazione.e}&c=${destinazione.c}`);
    else naviga(`/v/${encodeURIComponent(destinazione.tagId)}`);
    return true;
  };

  useEffect(() => {
    if (!video.current) return;
    const lettore = new QrScanner(video.current, (risultato) => {
      if (vai(risultato.data)) lettore.stop();
    }, { returnDetailedScanResult: true, highlightScanRegion: true, preferredCamera: "environment" });
    lettore.start().catch(() => setMessaggio("Fotocamera non disponibile: consenti l’accesso oppure inserisci il codice a mano."));
    return () => lettore.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leggiNfc = async () => {
    setNfcAttivo(true);
    setMessaggio("Avvicina il telefono al tag NFC…");
    try {
      const { url } = await leggiTagNfc();
      if (!url || !vai(url)) setMessaggio("Il tag non contiene un indirizzo di verifica valido.");
    } catch (err) {
      setMessaggio(err.message);
    } finally {
      setNfcAttivo(false);
    }
  };

  return (
    <section className="scansione">
      <h1>Verifica un capo</h1>
      <div className="cornice-video">
        <video ref={video} muted playsInline />
      </div>
      <p className="nota" aria-live="polite">
        {messaggio}
      </p>
      {nfcDisponibile() && (
        <button className="pulsante pulsante-secondario" onClick={leggiNfc} disabled={nfcAttivo}>
          Leggi il tag NFC
        </button>
      )}
      <p className="nota">Su iPhone basta avvicinare il telefono al tag: la verifica si apre da sola.</p>
    </section>
  );
}
```

## `frontend/src/pages/SunPage.jsx`

```jsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../services/api.js";
import Certificato from "../components/Certificato.jsx";
import { Caricamento, Errore } from "../components/Stato.jsx";
import { aggiornaNellArmadio, registraVerifica, riassuntoCapo } from "../utils/archivio.js";

// Una sola richiesta per link: il link del chip vale una volta (anti-replay) e in
// sviluppo React esegue gli effetti due volte, quindi la richiesta viene condivisa.
const richieste = new Map();
function verificaLink(e, c) {
  const chiave = `${e}|${c}`;
  if (!richieste.has(chiave)) {
    const richiesta = api(`/verify/sun?e=${encodeURIComponent(e)}&c=${encodeURIComponent(c)}`);
    // errore di rete: si può riprovare (il link non è stato consumato dal server)
    richiesta.catch((err) => err.status === 0 && richieste.delete(chiave));
    richieste.set(chiave, richiesta);
  }
  return richieste.get(chiave);
}

// Pagina aperta dal chip NTAG 424 DNA: /s?e=<dati cifrati>&c=<codice di autenticazione>
export default function SunPage() {
  const [parametri] = useSearchParams();
  const e = parametri.get("e") ?? "";
  const c = parametri.get("c") ?? "";
  const [stato, setStato] = useState({ caricamento: true });

  useEffect(() => {
    let attivo = true;
    verificaLink(e, c)
      .then((dati) => {
        if (!attivo) return;
        setStato({ dati });
        const riassunto = riassuntoCapo(dati);
        registraVerifica(riassunto);
        aggiornaNellArmadio(riassunto);
      })
      .catch((errore) => attivo && setStato({ errore }));
    return () => {
      attivo = false;
    };
  }, [e, c]);

  if (stato.caricamento) return <Caricamento testo="Verifica del chip in corso…" />;

  const messaggi = {
    409: {
      titolo: "Link già utilizzato",
      testo: "Per sicurezza ogni lettura del chip genera un link valido una sola volta. Avvicina di nuovo il telefono al tag per una nuova verifica.",
    },
    400: {
      titolo: "Tag non autentico",
      testo: "Il codice letto non è stato generato da un chip registrato: possibile clonazione o link alterato.",
    },
    404: {
      titolo: "Chip non associato",
      testo: "Il chip è autentico ma non è ancora associato a nessun capo della piattaforma.",
    },
  };
  const m = messaggi[stato.errore?.status];
  if (m) {
    return (
      <section className={`scheda esito ${stato.errore.status === 409 ? "esito-attesa" : "esito-ko"}`}>
        <span className="esito-icona" aria-hidden="true">
          {stato.errore.status === 409 ? "↻" : "✕"}
        </span>
        <div>
          <h1>{m.titolo}</h1>
          <p>{m.testo}</p>
          <Link to="/scan">Torna alla verifica</Link>
        </div>
      </section>
    );
  }
  if (stato.errore) return <Errore errore={stato.errore} />;
  return <Certificato dati={stato.dati} />;
}
```

## `frontend/src/pages/UsersPage.jsx`

```jsx
import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { Caricamento, Errore } from "../components/Stato.jsx";
import { RUOLI } from "../utils/formato.js";

export default function UsersPage() {
  const { utente } = useAuth();
  const [utenti, setUtenti] = useState(null);
  const [errore, setErrore] = useState(null);
  const [nuovo, setNuovo] = useState({ nome: "", email: "", ruolo: "commerciante", organizzazione: "", password: "" });
  const [creato, setCreato] = useState(null);

  const carica = () => api("/auth/utenti").then((d) => setUtenti(d.dati)).catch(setErrore);
  useEffect(() => {
    carica();
  }, []);

  const cambia = (k) => (e) => setNuovo((v) => ({ ...v, [k]: e.target.value }));

  const crea = async (e) => {
    e.preventDefault();
    setErrore(null);
    try {
      const corpo = Object.fromEntries(Object.entries(nuovo).filter(([, v]) => v !== ""));
      const r = await api("/auth/utenti", { metodo: "POST", corpo });
      setCreato(r.utente);
      setNuovo({ nome: "", email: "", ruolo: "commerciante", organizzazione: "", password: "" });
      carica();
    } catch (err) {
      setErrore(err);
    }
  };

  const impostaAttivo = async (u) => {
    try {
      await api(`/auth/utenti/${u.id}`, { metodo: "PATCH", corpo: { attivo: !u.attivo } });
      carica();
    } catch (err) {
      setErrore(err);
    }
  };

  return (
    <section>
      <h1>Utenti</h1>
      <Errore errore={errore} />
      <div className="scheda">
        <h2>Nuovo account</h2>
        {creato && (
          <div className="avviso avviso-ok">
            Account creato per {creato.email}. Comunica la password in modo sicuro: potrà cambiarla dalla pagina Account.
          </div>
        )}
        <form className="modulo" onSubmit={crea}>
          <div className="riga">
            <label>
              Nome *
              <input value={nuovo.nome} onChange={cambia("nome")} required maxLength={100} />
            </label>
            <label>
              Email *
              <input type="email" value={nuovo.email} onChange={cambia("email")} required />
            </label>
          </div>
          <div className="riga">
            <label>
              Ruolo *
              <select value={nuovo.ruolo} onChange={cambia("ruolo")}>
                {Object.entries(RUOLI).map(([k, t]) => (
                  <option key={k} value={k}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Organizzazione
              <input value={nuovo.organizzazione} onChange={cambia("organizzazione")} maxLength={150} placeholder="es. Boutique Vintage Bari" />
            </label>
          </div>
          <label>
            Password iniziale * (almeno 10 caratteri)
            <input type="text" value={nuovo.password} onChange={cambia("password")} required minLength={10} autoComplete="new-password" />
          </label>
          <button className="pulsante">Crea l’account</button>
        </form>
      </div>
      {!utenti ? (
        <Caricamento />
      ) : (
        <ul className="elenco-capi">
          {utenti.map((u) => (
            <li key={u.id} className="riga-capo">
              <span>
                <strong>{u.nome}</strong> <span className="nota">{u.email}</span>
              </span>
              <span className="nota">
                {RUOLI[u.ruolo]}
                {u.organizzazione && ` · ${u.organizzazione}`}
                {!u.attivo && " · disattivato"}
              </span>
              {u.id !== utente.id && (
                <button className="link" onClick={() => impostaAttivo(u)}>
                  {u.attivo ? "Disattiva" : "Riattiva"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

## `frontend/src/pages/VerifyPage.jsx`

```jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api.js";
import Certificato from "../components/Certificato.jsx";
import { Caricamento, Errore } from "../components/Stato.jsx";
import { aggiornaNellArmadio, registraVerifica, riassuntoCapo } from "../utils/archivio.js";

export default function VerifyPage() {
  const { tagId } = useParams();
  const [stato, setStato] = useState({ caricamento: true });

  useEffect(() => {
    let attivo = true;
    setStato({ caricamento: true });
    api(`/verify/${encodeURIComponent(tagId)}`)
      .then((dati) => {
        if (!attivo) return;
        setStato({ dati });
        const riassunto = riassuntoCapo(dati);
        registraVerifica(riassunto); // storico sul dispositivo
        aggiornaNellArmadio(riassunto);
      })
      .catch((errore) => {
        if (!attivo) return;
        setStato({ errore });
        if (errore.status === 404) registraVerifica({ tagId, brand: null, codiceModello: null, esito: "non_trovato" });
      });
    return () => {
      attivo = false;
    };
  }, [tagId]);

  if (stato.caricamento) return <Caricamento testo="Verifica del capo in corso…" />;
  if (stato.errore?.status === 404) {
    return (
      <section className="scheda esito esito-ko">
        <span className="esito-icona" aria-hidden="true">
          ✕
        </span>
        <div>
          <h1>Capo non trovato</h1>
          <p>Nessun capo è associato al codice «{tagId}». Potrebbe trattarsi di una contraffazione: non procedere all’acquisto senza ulteriori verifiche.</p>
          <Link to="/scan">Prova un’altra scansione</Link>
        </div>
      </section>
    );
  }
  if (stato.errore) return <Errore errore={stato.errore} />;
  return <Certificato dati={stato.dati} />;
}
```

## `frontend/src/services/api.js`

```javascript
// Accesso alle API del backend. Il token di accesso resta nel browser di chi usa l'area gestionale.
const BASE = (import.meta.env.VITE_API_URL || "") + "/api";
const CHIAVE_TOKEN = "regen.token";

export const token = {
  leggi: () => {
    try {
      return localStorage.getItem(CHIAVE_TOKEN);
    } catch {
      return null;
    }
  },
  salva: (t) => {
    try {
      localStorage.setItem(CHIAVE_TOKEN, t);
    } catch {
      /* navigazione privata: il login dura fino alla chiusura della pagina */
    }
  },
  cancella: () => {
    try {
      localStorage.removeItem(CHIAVE_TOKEN);
    } catch {
      /* niente da fare */
    }
  },
};

export class ErroreApi extends Error {
  constructor(status, dati) {
    super(dati?.errore ?? `Errore ${status}`);
    this.status = status;
    this.dati = dati;
  }
}

export async function api(percorso, { metodo = "GET", corpo, formato = "json" } = {}) {
  const t = token.leggi();
  let risposta;
  try {
    risposta = await fetch(BASE + percorso, {
      method: metodo,
      headers: {
        ...(corpo ? { "Content-Type": "application/json" } : {}),
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
      },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new ErroreApi(0, { errore: "Server non raggiungibile. Controlla la connessione." });
  }

  if (risposta.status === 401 && t) {
    token.cancella();
    window.dispatchEvent(new Event("regen:sessione-scaduta"));
  }
  if (formato === "blob" && risposta.ok) {
    const blob = await risposta.blob();
    // il QR code riporta nell'intestazione l'indirizzo che contiene
    return Object.assign(blob, { urlVerifica: risposta.headers.get("X-Url-Verifica") });
  }

  const testo = await risposta.text();
  let dati = null;
  try {
    dati = testo ? JSON.parse(testo) : null;
  } catch {
    dati = { errore: testo };
  }
  if (!risposta.ok) throw new ErroreApi(risposta.status, dati);
  return dati;
}

// Servizio AI opzionale: suggerisce il materiale principale da una foto del capo
export const AI_URL = import.meta.env.VITE_AI_URL || "";

export async function classificaFoto(file) {
  const dati = new FormData();
  dati.append("immagine", file);
  const r = await fetch(`${AI_URL}/classify`, { method: "POST", body: dati });
  if (!r.ok) throw new Error("Servizio AI non disponibile");
  return r.json();
}
```

## `frontend/src/styles/app.css`

```css
/* Regen Luxury — stile mobile-first. Palette: nero inchiostro, avorio, oro. */

/* Font dei titoli: Cormorant Garamond (SIL Open Font License, file in src/assets/fonts) */
@font-face { font-family: "Cormorant Garamond"; font-style: normal; font-weight: 500; font-display: swap; src: url("../assets/fonts/cormorant-garamond-latin-500-normal.woff2") format("woff2"); }
@font-face { font-family: "Cormorant Garamond"; font-style: normal; font-weight: 600; font-display: swap; src: url("../assets/fonts/cormorant-garamond-latin-600-normal.woff2") format("woff2"); }
@font-face { font-family: "Cormorant Garamond"; font-style: normal; font-weight: 700; font-display: swap; src: url("../assets/fonts/cormorant-garamond-latin-700-normal.woff2") format("woff2"); }
@font-face { font-family: "Cormorant Garamond"; font-style: italic; font-weight: 500; font-display: swap; src: url("../assets/fonts/cormorant-garamond-latin-500-italic.woff2") format("woff2"); }

:root {
  --nero: #141311;
  --inchiostro: #1c1b19;
  --avorio: #f6f2ea;
  --carta: #fffdf8;
  --grigio: #6b665e;
  --linea: #e6dfd2;
  --oro: #a8843f;
  --oro-vivo: #c9a25c;
  --oro-chiaro: #f3ead9;
  --verde: #2f6b4f;
  --verde-chiaro: #e6f1eb;
  --ambra: #9a6a12;
  --ambra-chiaro: #faf0dc;
  --rosso: #a23b2c;
  --rosso-chiaro: #f8e7e3;
  --display: "Cormorant Garamond", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --raggio: 16px;
  --ombra: 0 1px 2px rgba(20, 19, 17, 0.04), 0 12px 32px rgba(20, 19, 17, 0.07);
}

* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: var(--avorio);
  color: var(--inchiostro);
  font: 17px/1.6 var(--sans);
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3 { font-family: var(--display); font-weight: 600; line-height: 1.12; letter-spacing: 0.005em; margin: 0 0 0.5rem; }
/* Cormorant usa numeri "all'antica" (1 simile a I): qui servono numeri allineati */
h1, h2, h3, .riepilogo dd, .indicatore .valore, .passi-numero, .marchio-nome, .tendina-testa strong { font-variant-numeric: lining-nums; }
h1 { font-size: clamp(2.1rem, 6vw, 3rem); }
h2 { font-size: 1.75rem; }
h3 { font-size: 1.35rem; }
p { margin: 0 0 0.75rem; }
a { color: var(--inchiostro); text-decoration-color: var(--oro); text-underline-offset: 3px; }
code { font-size: 0.85em; background: var(--oro-chiaro); padding: 0.1em 0.35em; border-radius: 6px; word-break: break-all; }

.pagina { min-height: 100vh; display: flex; flex-direction: column; }
.contenuto { width: 100%; max-width: 820px; margin: 0 auto; padding: 1.75rem 1.1rem 4rem; flex: 1; }
.contenuto-home { max-width: 1500px; padding-top: 1rem; }

/* ---------- Testata: fascia nera, titolo al centro, menu a destra ---------- */
.testata {
  position: sticky; top: 0; z-index: 20;
  display: grid; grid-template-columns: 1fr; justify-items: center; gap: 0.6rem;
  padding: 1rem 1rem 0.75rem;
  background: var(--nero); color: var(--avorio);
  border-bottom: 1px solid rgba(201, 162, 92, 0.35);
}
.testata-vuoto { display: none; }
.marchio { display: grid; justify-items: center; color: inherit; text-decoration: none; line-height: 1; }
.marchio-nome { font-family: var(--display); font-weight: 600; font-size: clamp(2rem, 6.5vw, 3rem); letter-spacing: 0.02em; }
.marchio-nome em { color: var(--oro-vivo); font-style: italic; font-weight: 500; }
.marchio-motto { margin-top: 0.4rem; font-size: 0.64rem; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(246, 242, 234, 0.6); }

.menu { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 0.25rem 0.35rem; }
.menu-voce {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.45rem 0.8rem; border-radius: 999px; border: 1px solid transparent;
  background: none; color: rgba(246, 242, 234, 0.82); text-decoration: none;
  font: 500 0.95rem var(--sans); cursor: pointer; white-space: nowrap;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}
.menu-voce:hover { color: #fff; border-color: rgba(201, 162, 92, 0.45); }
.menu-voce.active { color: #fff; border-color: var(--oro-vivo); background: rgba(201, 162, 92, 0.14); }
.menu-voce svg { color: var(--oro-vivo); }
.menu-esci { color: rgba(246, 242, 234, 0.6); }
.contatore {
  display: inline-grid; place-items: center; min-width: 1.3rem; height: 1.3rem; padding: 0 0.35rem;
  border-radius: 999px; background: var(--oro-vivo); color: var(--nero); font-size: 0.72rem; font-weight: 700;
}
.freccina { font-size: 0.7rem; opacity: 0.7; }
.testo-corto { display: none; }

@media (max-width: 540px) {
  .testata { padding: 0.85rem 0.5rem 0.6rem; gap: 0.45rem; }
  .marchio-motto { font-size: 0.56rem; letter-spacing: 0.22em; }
  .menu { gap: 0.1rem; }
  .menu-voce { padding: 0.4rem 0.55rem; font-size: 0.86rem; gap: 0.3rem; }
  .menu-voce > svg { display: none; }
  .testo-lungo { display: none; }
  .testo-corto { display: inline; }
}
/* Su schermi larghi: titolo al centro e menu sulla destra, su una sola riga */
@media (min-width: 1360px) {
  .testata:not(.testata-operatore) { grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 1.25rem; padding: 1.35rem 2rem; }
  .testata:not(.testata-operatore) .testata-vuoto { display: block; }
  .testata:not(.testata-operatore) .menu { justify-self: end; flex-wrap: nowrap; }
}
@media (min-width: 1600px) {
  .testata-operatore { grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 1.25rem; padding: 1.35rem 2rem; }
  .testata-operatore .testata-vuoto { display: block; }
  .testata-operatore .menu { justify-self: end; flex-wrap: nowrap; }
}

/* Etichetta breve "Armadio" dove lo spazio è poco (e sempre per gli operatori) */
@media (min-width: 1360px) and (max-width: 1439px) { .testo-lungo { display: none; } .testo-corto { display: inline; } }
.testata-operatore .testo-lungo { display: none; }
.testata-operatore .testo-corto { display: inline; }

/* Storico a tendina */
.menu-tendina { position: relative; }
.tendina {
  position: fixed; left: 50%; transform: translateX(-50%); top: calc(var(--h-testata, 120px) + 0.5rem);
  width: min(400px, calc(100vw - 1.5rem)); z-index: 30; overflow: hidden; text-align: left;
  background: var(--carta); color: var(--inchiostro); border: 1px solid var(--linea); border-radius: 18px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
}
@media (min-width: 1360px) {
  .testata:not(.testata-operatore) .tendina { position: absolute; left: auto; right: 0; transform: none; top: calc(100% + 0.8rem); }
}
.tendina-testa { display: grid; padding: 1rem 1.15rem 0.75rem; border-bottom: 1px solid var(--linea); }
.tendina-testa strong { font-family: var(--display); font-size: 1.45rem; line-height: 1.1; }
.tendina-testa span { font-size: 0.78rem; color: var(--grigio); }
.tendina-vuota { padding: 1rem 1.15rem; margin: 0; color: var(--grigio); font-size: 0.93rem; }
.tendina-elenco { list-style: none; margin: 0; padding: 0.35rem 0; max-height: min(380px, 55vh); overflow-y: auto; }
.voce-storico { display: flex; align-items: center; justify-content: space-between; gap: 0.8rem; padding: 0.65rem 1.15rem; color: inherit; text-decoration: none; }
.voce-storico:hover { background: var(--avorio); }
.voce-testo { display: grid; min-width: 0; }
.voce-testo strong { font-size: 0.98rem; }
.voce-testo span { font-size: 0.8rem; color: var(--grigio); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tendina-piede { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 0.75rem 1.15rem; border-top: 1px solid var(--linea); background: var(--avorio); font-size: 0.9rem; }

.bollino { flex: none; display: inline-block; padding: 0.22rem 0.6rem; border-radius: 999px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
.bollino-ok { background: var(--verde-chiaro); color: var(--verde); }
.bollino-attesa { background: var(--ambra-chiaro); color: var(--ambra); }
.bollino-ko { background: var(--rosso-chiaro); color: var(--rosso); }

/* ---------- Piede ---------- */
.piede { text-align: center; color: var(--grigio); font-size: 0.84rem; padding: 2.2rem 1rem 2.6rem; border-top: 1px solid var(--linea); background: var(--carta); }
.piede p { margin: 0.2rem 0; }
.piede-marchio { font-family: var(--display); font-size: 1.6rem; font-weight: 600; color: var(--inchiostro); }
.piede-marchio em { color: var(--oro); font-weight: 500; }
.piede-crediti { font-size: 0.74rem; opacity: 0.8; }

/* ---------- Blocchi comuni ---------- */
.scheda { background: var(--carta); border: 1px solid var(--linea); border-radius: var(--raggio); padding: 1.35rem; margin-bottom: 1rem; box-shadow: var(--ombra); }
.scheda-stretta { max-width: 470px; margin-left: auto; margin-right: auto; }
.sezione { border-top: 1px solid var(--linea); padding-top: 1.1rem; margin-top: 1.1rem; }
.sopratitolo { text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.72rem; color: var(--oro); margin-bottom: 0.45rem; font-weight: 700; }
.sottotitolo { color: var(--grigio); font-size: 1.05rem; }
.leggero { font-weight: 400; color: var(--grigio); }
.nota { color: var(--grigio); font-size: 0.9rem; }
.etichetta { display: inline-block; margin-left: 0.5rem; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; background: var(--oro-chiaro); color: var(--ambra); padding: 0.15rem 0.5rem; border-radius: 999px; vertical-align: middle; }
.pagina-testa { padding: 1rem 0 1.5rem; }
.pagina-testa h1 { font-size: clamp(2.3rem, 6.5vw, 3.5rem); line-height: 1.04; }
.pagina-intro { font-size: 1.1rem; color: var(--grigio); max-width: 40rem; }
.griglia-tre { display: grid; gap: 1rem; margin-top: 1rem; }
@media (min-width: 680px) { .griglia-tre { grid-template-columns: repeat(3, 1fr); } }

/* ---------- Home ---------- */
.home { display: grid; grid-template-columns: minmax(0, 1fr); }
.home-fascia { display: none; }
.home-centro { min-width: 0; }
@media (min-width: 1100px) {
  .home { grid-template-columns: 200px minmax(0, 1fr) 200px; gap: 3rem; }
  .home-fascia {
    display: block; position: sticky; align-self: start;
    top: calc(var(--h-testata, 120px) + 1.25rem);
    height: calc(100vh - var(--h-testata, 120px) - 2.5rem);
  }
  .home-centro { width: 100%; max-width: 820px; margin: 0 auto; }
  .carosello-orizzontale { display: none; }
}
@media (min-width: 1440px) { .home { grid-template-columns: 250px minmax(0, 1fr) 250px; gap: 4rem; } }

.eroe { padding: 2.2rem 0 1.5rem; }
.eroe h1 { font-size: clamp(2.6rem, 7.5vw, 4.6rem); line-height: 1.02; letter-spacing: -0.005em; margin-bottom: 1.2rem; }
.eroe h1 em { color: var(--oro); font-weight: 500; }
.eroe-testo { font-size: clamp(1.08rem, 2.3vw, 1.28rem); line-height: 1.6; color: var(--grigio); max-width: 42rem; }
.eroe-azioni { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 1.7rem 0 1.5rem; }
@media (max-width: 540px) { .eroe { padding-top: 1.2rem; } .eroe-azioni .pulsante { width: 100%; } }
.garanzie { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.55rem 1.4rem; color: var(--grigio); font-size: 0.93rem; }
.garanzie li { display: inline-flex; align-items: center; gap: 0.45rem; }
.garanzie svg { color: var(--oro); }

.scheda-codice { display: grid; gap: 1rem; padding: 1.6rem; margin: 1rem 0 3.5rem; }
.scheda-codice h2 { margin-bottom: 0.15rem; }
.scheda-codice .nota { margin: 0; }
.scheda-codice .modulo { margin: 0; }
.scheda-codice input { min-height: 54px; font-size: 1.05rem; }
.scheda-codice .pulsante { min-height: 54px; }
@media (min-width: 760px) { .scheda-codice { grid-template-columns: 1fr 1.25fr; align-items: center; gap: 2rem; } }

.come-funziona { margin: 0 0 3.5rem; }
.come-funziona h2 { font-size: clamp(1.9rem, 4.5vw, 2.7rem); margin-bottom: 1.4rem; }
.passi { list-style: none; margin: 0; padding: 0; display: grid; gap: 1rem; }
@media (min-width: 720px) { .passi { grid-template-columns: repeat(3, 1fr); } }
.passi li { background: var(--carta); border: 1px solid var(--linea); border-radius: var(--raggio); padding: 1.4rem 1.3rem 1.3rem; box-shadow: var(--ombra); }
.passi-numero { display: block; font-family: var(--display); font-size: 2.8rem; line-height: 1; color: var(--oro); margin-bottom: 0.5rem; }
.passi h3 { font-size: 1.55rem; }
.passi p { color: var(--grigio); margin: 0; font-size: 0.98rem; }

.caratteristiche { display: grid; gap: 1px; background: rgba(201, 162, 92, 0.3); border-radius: 24px; overflow: hidden; margin-bottom: 1rem; }
@media (min-width: 760px) { .caratteristiche { grid-template-columns: repeat(3, 1fr); } }
.caratteristiche article { background: var(--nero); color: var(--avorio); padding: 1.9rem 1.6rem; }
.caratteristiche h3 { font-size: 1.75rem; color: #fff; margin: 1rem 0 0.5rem; }
.caratteristiche p { margin: 0; color: rgba(246, 242, 234, 0.74); font-size: 0.98rem; }
.caratteristica-icona { display: grid; place-items: center; width: 54px; height: 54px; border-radius: 50%; border: 1px solid rgba(201, 162, 92, 0.6); color: var(--oro-vivo); }

/* Caroselli di foto */
.carosello { display: flex; flex-direction: column; height: 100%; }
.carosello-etichetta { margin: 0 0 0.8rem; text-align: center; font: 700 0.68rem var(--sans); letter-spacing: 0.3em; text-transform: uppercase; color: var(--oro); }
.carosello-finestra {
  flex: 1; overflow: hidden; border-radius: 20px;
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 7%, #000 93%, transparent);
  mask-image: linear-gradient(to bottom, transparent, #000 7%, #000 93%, transparent);
}
.carosello-traccia { display: flex; flex-direction: column; gap: 14px; animation: scorri-verticale 70s linear infinite; }
.carosello-indietro .carosello-traccia { animation-direction: reverse; }
.carosello:hover .carosello-traccia { animation-play-state: paused; }
@keyframes scorri-verticale { to { transform: translateY(calc(-50% - 7px)); } }
.carosello-foto { position: relative; flex: none; margin: 0; aspect-ratio: 3 / 4; border-radius: 16px; overflow: hidden; background: linear-gradient(160deg, #26231f, #7a6440); }
.carosello-foto img { display: block; width: 100%; height: 100%; object-fit: cover; filter: saturate(0.9); transition: transform 0.9s ease, filter 0.9s ease; }
.carosello-foto:hover img { transform: scale(1.05); filter: saturate(1.05); }
.carosello-foto figcaption {
  position: absolute; inset: auto 0 0; padding: 1.8rem 0.9rem 0.75rem;
  font: italic 500 1.1rem/1.1 var(--display); color: #fff;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.58));
}
.foto-assente img { visibility: hidden; }

.carosello-orizzontale { height: auto; margin: 0.5rem -1.1rem 2.2rem; }
.carosello-orizzontale .carosello-finestra {
  border-radius: 0;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
}
.carosello-orizzontale .carosello-traccia { flex-direction: row; width: max-content; animation: scorri-orizzontale 90s linear infinite; }
.carosello-orizzontale .carosello-foto { width: 150px; }
@keyframes scorri-orizzontale { to { transform: translateX(calc(-50% - 7px)); } }
@media (min-width: 1100px) { .home-centro .carosello-orizzontale { display: none; } }
@media (prefers-reduced-motion: reduce) {
  .carosello-traccia { animation: none !important; }
  .carosello-orizzontale .carosello-finestra { overflow-x: auto; }
}

/* ---------- Il tuo armadio ---------- */
.armadio-vuoto {
  display: grid; justify-items: center; gap: 0.4rem; text-align: center;
  padding: 3rem 1.5rem; background: var(--carta); border: 1px dashed var(--oro); border-radius: 24px;
}
.armadio-vuoto h2 { font-size: 2rem; }
.armadio-vuoto p { color: var(--grigio); max-width: 26rem; margin-bottom: 1rem; }
.armadio-vuoto-icona { display: grid; place-items: center; width: 88px; height: 88px; margin-bottom: 0.5rem; border-radius: 50%; background: var(--oro-chiaro); color: var(--oro); }
.riepilogo { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin: 0 0 0.75rem; }
.riepilogo div { background: var(--nero); color: var(--avorio); border-radius: 18px; padding: 1rem 1.1rem; }
.riepilogo dt { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--oro-vivo); }
.riepilogo dd { margin: 0.35rem 0 0; font-family: var(--display); font-size: clamp(1.8rem, 6vw, 2.5rem); font-weight: 600; line-height: 1; }
.riepilogo small { font-family: var(--sans); font-size: 0.85rem; opacity: 0.7; }
.armadio-griglia { list-style: none; margin: 1.25rem 0 0; padding: 0; display: grid; gap: 1rem; }
.capo-carta { display: grid; grid-template-columns: 84px 1fr; gap: 1rem 1.2rem; padding: 1.1rem; background: var(--carta); border: 1px solid var(--linea); border-radius: 20px; box-shadow: var(--ombra); }
.capo-monogramma { display: grid; place-items: center; width: 84px; height: 106px; border-radius: 14px; background: linear-gradient(160deg, #1d1b18, #5a4a2e); color: var(--oro-vivo); font: italic 500 2.4rem var(--display); }
.capo-info { min-width: 0; }
.capo-info .sopratitolo { margin-bottom: 0.2rem; }
.capo-info h2 { font-size: 1.9rem; margin: 0 0 0.1rem; }
.capo-info p { margin: 0 0 0.35rem; }
.capo-dettagli { display: flex; flex-wrap: wrap; align-items: center; gap: 0.45rem 0.9rem; }
.capo-impatto { display: inline-flex; align-items: center; gap: 0.3rem; color: var(--verde); font-size: 0.9rem; font-weight: 600; }
.capo-azioni { grid-column: 1 / -1; display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem 1.25rem; padding-top: 0.9rem; border-top: 1px solid var(--linea); }
@media (min-width: 720px) {
  .capo-carta { grid-template-columns: 100px 1fr auto; align-items: center; padding: 1.25rem 1.4rem; }
  .capo-monogramma { width: 100px; height: 126px; }
  .capo-azioni { grid-column: auto; flex-direction: column; align-items: flex-end; padding-top: 0; border-top: 0; }
}

/* ---------- Pulsanti e moduli ---------- */
.pulsante {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  min-height: 48px; padding: 0 1.3rem; border-radius: 999px; border: 1px solid var(--inchiostro);
  background: var(--inchiostro); color: var(--avorio); font: 600 0.97rem var(--sans); text-decoration: none; cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
}
.pulsante:hover:not(:disabled) { box-shadow: 0 8px 22px rgba(20, 19, 17, 0.18); transform: translateY(-1px); }
.pulsante svg { color: var(--oro-vivo); }
.pulsante:disabled { opacity: 0.5; cursor: not-allowed; }
.pulsante-grande { min-height: 56px; padding: 0 1.7rem; font-size: 1.04rem; }
.pulsante-secondario { background: transparent; color: var(--inchiostro); }
.pulsante-secondario svg { color: var(--oro); }
.pulsante-pericolo { background: var(--rosso); border-color: var(--rosso); }
.link { background: none; border: 0; padding: 0; color: var(--inchiostro); text-decoration: underline; text-decoration-color: var(--oro); text-underline-offset: 3px; cursor: pointer; font: inherit; }
.link:disabled { opacity: 0.4; cursor: default; }
.link-pericolo { color: var(--rosso); text-decoration-color: var(--rosso); }

.modulo { display: grid; gap: 0.85rem; margin: 0.75rem 0; }
.modulo label { display: grid; gap: 0.3rem; font-weight: 600; font-size: 0.92rem; }
.modulo small { font-weight: 400; color: var(--grigio); }
.modulo input, .modulo select, .modulo textarea {
  width: 100%; min-height: 48px; padding: 0.6rem 0.85rem; border: 1px solid var(--linea); border-radius: 12px;
  background: #fff; font: 16px var(--sans); color: var(--inchiostro);
}
.modulo textarea { min-height: auto; resize: vertical; }
.modulo input:focus, .modulo select:focus, .modulo textarea:focus { outline: 2px solid var(--oro); outline-offset: 1px; }
.riga { display: grid; gap: 0.85rem; }
@media (min-width: 560px) { .riga { grid-template-columns: 1fr 1fr; } }
.modulo-in-linea { grid-template-columns: 1fr auto; align-items: end; }
.modulo-in-linea:has(select) { grid-template-columns: 1fr auto auto; }
@media (max-width: 480px) { .modulo-in-linea:has(select) { grid-template-columns: 1fr 1fr; } .modulo-in-linea:has(select) input { grid-column: 1 / -1; } }
.riquadro-ai { background: var(--oro-chiaro); padding: 0.8rem; border-radius: 10px; }

.intestazione-sezione { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 1rem; margin-bottom: 1rem; }
.azioni { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }

/* ---------- Avvisi e stati ---------- */
.avviso { border-radius: 12px; padding: 0.85rem 1rem; margin: 0.75rem 0; }
.avviso p, .avviso ul { margin: 0.25rem 0 0; }
.avviso-errore { background: var(--rosso-chiaro); color: var(--rosso); }
.avviso-ok { background: var(--verde-chiaro); color: var(--verde); }
.stato { display: flex; align-items: center; gap: 0.7rem; justify-content: center; padding: 3rem 1rem; color: var(--grigio); }
.rotella { width: 20px; height: 20px; border: 2px solid var(--linea); border-top-color: var(--oro); border-radius: 50%; animation: gira 0.8s linear infinite; }
@keyframes gira { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .rotella { animation: none; } }

/* ---------- Certificato ---------- */
.certificato-testata { padding: 0.25rem 0 1.1rem; }
.certificato-testata h1 { font-size: clamp(2.6rem, 9vw, 3.8rem); line-height: 1; margin-bottom: 0.3rem; }
.certificato { background: var(--carta); border: 1px solid var(--linea); border-radius: 22px; padding: 1.5rem 1.35rem; box-shadow: var(--ombra); }
@media (min-width: 720px) { .certificato { padding: 2rem 2.2rem; } }
.certificato h3 { font-size: 1.5rem; }
.esito { display: flex; gap: 0.9rem; align-items: flex-start; border-radius: var(--raggio); padding: 1rem 1.1rem; }
.esito h1, .esito h2 { font-size: 1.5rem; margin-bottom: 0.25rem; }
.esito p { margin: 0 0 0.3rem; }
.esito-icona { flex: none; width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; font-size: 1.2rem; font-weight: 700; color: #fff; }
.esito-ok { background: var(--verde-chiaro); }
.esito-ok .esito-icona { background: var(--verde); }
.esito-attesa { background: var(--ambra-chiaro); }
.esito-attesa .esito-icona { background: var(--ambra); }
.esito-ko { background: var(--rosso-chiaro); }
.esito-ko .esito-icona { background: var(--rosso); }
.esito-nfc { font-size: 0.85rem; font-weight: 600; color: var(--verde); }
.azioni-armadio { display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem 1.1rem; margin: 1.1rem 0 0.25rem; }
.azioni-armadio .nota { margin: 0; flex: 1 1 14rem; }
.nel-armadio { display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 700; color: var(--verde); }
.nel-armadio svg { color: var(--verde); }

.scheda-dati { display: grid; grid-template-columns: minmax(8rem, auto) 1fr; gap: 0.45rem 1rem; margin: 0; }
.scheda-dati dt { color: var(--grigio); font-size: 0.9rem; }
.scheda-dati dd { margin: 0; }

.linea-tempo { list-style: none; margin: 0; padding: 0 0 0 1.1rem; border-left: 2px solid var(--oro-chiaro); }
.linea-tempo li { position: relative; padding: 0 0 1rem 0.6rem; }
.linea-tempo li::before { content: ""; position: absolute; left: -1.55rem; top: 0.35rem; width: 12px; height: 12px; border-radius: 50%; background: var(--oro); border: 3px solid var(--carta); }
.linea-tempo p { margin: 0.15rem 0; }
.linea-data { display: block; font-size: 0.78rem; color: var(--grigio); text-transform: uppercase; letter-spacing: 0.06em; }

.catena { list-style: none; margin: 0 0 0.5rem; padding: 0; display: grid; gap: 0.5rem; }
.catena li { display: flex; flex-wrap: wrap; gap: 0.3rem 0.7rem; align-items: center; }
.passo { width: 26px; height: 26px; border-radius: 50%; background: var(--inchiostro); color: var(--avorio); display: grid; place-items: center; font-size: 0.8rem; font-weight: 700; }

.ancoraggio { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 0.35rem; font-size: 0.78rem; color: var(--grigio); }
.ancoraggio .puntino { width: 8px; height: 8px; border-radius: 50%; background: var(--grigio); }
.ancoraggio-confermato .puntino { background: var(--verde); }
.ancoraggio-in_attesa .puntino { background: var(--ambra); }
.ancoraggio-fallito .puntino, .ancoraggio-non_ancorato .puntino { background: var(--rosso); }

.indicatori { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 0.5rem 0; }
.indicatore { background: var(--verde-chiaro); border-radius: 14px; padding: 1rem; display: grid; }
.indicatore .valore { font-family: var(--display); font-size: 2.4rem; font-weight: 600; color: var(--verde); line-height: 1.05; }
.indicatore .unita { font-weight: 600; }
.indicatore .intervallo { font-size: 0.78rem; color: var(--grigio); }
.fonti summary, .apribile summary { cursor: pointer; font-weight: 600; margin: 0.5rem 0; }
.fonti ul { padding-left: 1.1rem; font-size: 0.85rem; color: var(--grigio); }

/* ---------- Area gestionale ---------- */
.elenco-capi { list-style: none; padding: 0; margin: 0.5rem 0; display: grid; gap: 0.5rem; }
.riga-capo { display: grid; gap: 0.2rem; background: var(--carta); border: 1px solid var(--linea); border-radius: 14px; padding: 0.85rem 1rem; text-decoration: none; }
a.riga-capo:hover { border-color: var(--oro); }
.paginazione { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; font-size: 0.9rem; }
.zona-rischio { border-color: var(--rosso-chiaro); }

/* ---------- Scansione ---------- */
.scansione { text-align: center; }
.cornice-video { position: relative; width: 100%; max-width: 420px; aspect-ratio: 1; margin: 1rem auto; border-radius: var(--raggio); overflow: hidden; background: #000; }
.cornice-video video { width: 100%; height: 100%; object-fit: cover; }

/* ---------- Etichetta stampabile ---------- */
.etichetta-stampa { display: flex; gap: 1.25rem; align-items: center; background: #fff; border: 1px dashed var(--grigio); border-radius: 12px; padding: 1rem; max-width: 520px; margin: 1rem 0; }
.etichetta-stampa img { width: 170px; height: 170px; flex: none; }
.etichetta-stampa .codice { font-family: ui-monospace, Menlo, monospace; font-size: 1.1rem; letter-spacing: 0.05em; }
.etichetta-stampa .url { word-break: break-all; font-size: 0.75rem; }
@media print {
  .testata, .piede, .non-stampare { display: none !important; }
  body, .contenuto { background: #fff; padding: 0; }
  .etichetta-stampa { border: 1px solid #000; }
}
```

## `frontend/src/utils/archivio.js`

```javascript
/*
 * "Il tuo armadio" e "Storico delle verifiche" del consumatore.
 * Restano SOLO nel browser di questo dispositivo (localStorage): nessun account,
 * nessun dato inviato al server — coerente con il requisito U (accesso pubblico
 * senza registrazione) e con la minimizzazione dei dati personali (GDPR).
 */
import { useSyncExternalStore } from "react";

const CHIAVI = { armadio: "regen.armadio", storico: "regen.storico" };
const MAX_STORICO = 30;
const ascoltatori = new Set();
const cache = {};

function leggi(nome) {
  if (!(nome in cache)) {
    try {
      const valore = JSON.parse(localStorage.getItem(CHIAVI[nome]) ?? "[]");
      cache[nome] = Array.isArray(valore) ? valore : [];
    } catch {
      cache[nome] = [];
    }
  }
  return cache[nome];
}

function scrivi(nome, elenco) {
  cache[nome] = elenco;
  try {
    localStorage.setItem(CHIAVI[nome], JSON.stringify(elenco));
  } catch {
    /* navigazione privata o spazio pieno: resta in memoria per questa sessione */
  }
  ascoltatori.forEach((f) => f());
}

// Aggiornamento anche se l'armadio cambia in un'altra scheda del browser
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    const nome = Object.keys(CHIAVI).find((k) => CHIAVI[k] === e.key);
    if (nome) {
      delete cache[nome];
      ascoltatori.forEach((f) => f());
    }
  });
}

const iscriviti = (f) => {
  ascoltatori.add(f);
  return () => ascoltatori.delete(f);
};

// Riassunto del capo dai dati del certificato (solo ciò che serve a riconoscerlo)
export function riassuntoCapo(dati) {
  const { capo, certificatoAutenticita: cert, impattoAmbientale: imp } = dati;
  return {
    tagId: capo.tagId,
    brand: capo.brand,
    codiceModello: capo.codiceModello,
    categoria: capo.categoria ?? null,
    materialePrincipale: capo.materialePrincipale ?? null,
    annoProduzione: capo.annoProduzione ?? null,
    esito: cert?.integrita?.stato ?? "non_registrato",
    co2Kg: imp?.disponibile ? imp.co2RisparmiataKg : null,
    acquaL: imp?.disponibile ? imp.acquaPreservataLitri : null,
  };
}

// --- Storico delle verifiche ---
export function registraVerifica(voce) {
  const precedente = leggi("storico").find((v) => v.tagId === voce.tagId);
  const nuova = { ...precedente, ...voce, volte: (precedente?.volte ?? 0) + 1, data: new Date().toISOString() };
  scrivi("storico", [nuova, ...leggi("storico").filter((v) => v.tagId !== voce.tagId)].slice(0, MAX_STORICO));
}
export const svuotaStorico = () => scrivi("storico", []);
export const useStorico = () => useSyncExternalStore(iscriviti, () => leggi("storico"), () => []);

// --- Armadio ---
export function aggiungiAllArmadio(capo) {
  const altri = leggi("armadio").filter((c) => c.tagId !== capo.tagId);
  scrivi("armadio", [{ ...capo, aggiuntoIl: new Date().toISOString() }, ...altri]);
}
export const rimuoviDallArmadio = (tagId) => scrivi("armadio", leggi("armadio").filter((c) => c.tagId !== tagId));
export const useArmadio = () => useSyncExternalStore(iscriviti, () => leggi("armadio"), () => []);
// Dopo una nuova verifica aggiorna esito e impatto del capo, se è nell'armadio
export function aggiornaNellArmadio(capo) {
  const elenco = leggi("armadio");
  if (!elenco.some((c) => c.tagId === capo.tagId)) return;
  scrivi("armadio", elenco.map((c) => (c.tagId === capo.tagId ? { ...c, ...capo, aggiuntoIl: c.aggiuntoIl } : c)));
}
```

## `frontend/src/utils/formato.js`

```javascript
export const TIPI_EVENTO = {
  riparazione: "Riparazione",
  upcycling: "Upcycling",
  sostituzione_parti: "Sostituzione di parti",
};

export const RUOLI = {
  admin: "Amministratore",
  brand_manager: "Brand manager",
  commerciante: "Commerciante",
  artigiano: "Artigiano",
};

export const CATEGORIE = ["giacca", "cappotto", "abito", "camicia", "t-shirt", "maglione", "pantaloni", "jeans", "gonna", "borsa", "scarpe", "accessorio", "altro"];
export const MATERIALI = ["cotone", "lana", "seta", "lino", "cashmere", "pelle", "denim", "poliestere", "nylon", "viscosa", "misto", "altro"];

export const data = (d) =>
  d ? new Date(d).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }) : "—";

export const dataOra = (d) =>
  d ? new Date(d).toLocaleString("it-IT", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

export const hashBreve = (h) => (h ? `${h.slice(0, 10)}…${h.slice(-6)}` : "—");

export const numero = (n, cifre = 1) => Number(n).toLocaleString("it-IT", { maximumFractionDigits: cifre });

export const maiuscola = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

// Estrae la destinazione da un QR o da un tag NFC letto
export function interpretaCodice(testo) {
  const valore = String(testo ?? "").trim();
  try {
    const url = new URL(valore);
    const v = url.pathname.match(/\/v\/([A-Za-z0-9_-]{3,64})\/?$/);
    if (v) return { tipo: "tag", tagId: decodeURIComponent(v[1]) };
    const e = url.searchParams.get("e");
    const c = url.searchParams.get("c");
    if (e && c) return { tipo: "sun", e, c };
  } catch {
    /* non è un URL */
  }
  if (/^[A-Za-z0-9_-]{3,64}$/.test(valore)) return { tipo: "tag", tagId: valore };
  return null;
}

// "3 minuti fa", "ieri", "2 settimane fa"
export function tempoFa(d) {
  if (!d) return "";
  const secondi = (new Date(d).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("it", { numeric: "auto" });
  const unita = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [nome, durata] of unita) {
    if (Math.abs(secondi) >= durata) return rtf.format(Math.round(secondi / durata), nome);
  }
  return "adesso";
}

// Iniziali del brand per il monogramma delle schede dell'armadio
export const iniziali = (testo = "") =>
  testo.trim().split(/\s+/).slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join("") || "?";

// Esito di una verifica → etichetta breve e colore
export const ESITO_BREVE = {
  verificato: { testo: "Autentico", classe: "ok" },
  in_attesa: { testo: "In registrazione", classe: "attesa" },
  incompleto: { testo: "Non conclusiva", classe: "attesa" },
  manomesso: { testo: "Dati alterati", classe: "ko" },
  non_registrato: { testo: "Non registrato", classe: "ko" },
  non_trovato: { testo: "Non trovato", classe: "ko" },
};
```

## `frontend/src/utils/nfc.js`

```javascript
// Lettura dei tag NFC dal browser (Web NFC): disponibile solo su Chrome per Android.
// Su iPhone non serve: il sistema apre da solo l'URL scritto nel tag.
export const nfcDisponibile = () => typeof window !== "undefined" && "NDEFReader" in window;

export async function leggiTagNfc({ signal } = {}) {
  // eslint-disable-next-line no-undef
  const lettore = new NDEFReader();
  await lettore.scan({ signal });
  return new Promise((resolve, reject) => {
    lettore.onreadingerror = () => reject(new Error("Tag non leggibile: riprova avvicinando il telefono."));
    lettore.onreading = (evento) => {
      const uid = (evento.serialNumber ?? "").replaceAll(":", "").toUpperCase() || null;
      for (const record of evento.message.records) {
        if (record.recordType === "url" || record.recordType === "absolute-url") {
          resolve({ url: new TextDecoder().decode(record.data), uid });
          return;
        }
      }
      resolve({ url: null, uid });
    };
  });
}
```

## `frontend/vite.config.js`

```javascript
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// In sviluppo le chiamate a /api vengono inoltrate al backend: frontend e API
// risultano sullo stesso indirizzo, come in produzione. La porta del backend
// viene letta da backend/.env (PORT), così si cambia in un solo punto.
export default defineConfig(({ mode }) => {
  const cartellaBackend = fileURLToPath(new URL("../backend", import.meta.url));
  const { PORT } = loadEnv(mode, cartellaBackend, "PORT");
  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true, // raggiungibile anche dal telefono sulla stessa rete Wi-Fi
      proxy: { "/api": `http://localhost:${PORT || 5001}` },
    },
    build: { outDir: "dist", sourcemap: false },
  };
});
```

## `package.json`

```json
{
  "name": "regen-luxury",
  "private": true,
  "description": "Comandi rapidi dalla cartella principale: inoltrano a backend/ e frontend/ (così funzionano da qualsiasi terminale di VS Code)",
  "scripts": {
    "dev": "npm --prefix backend run dev",
    "web": "npm --prefix frontend run dev",
    "imposta-db": "npm --prefix backend run imposta-db",
    "copia-db": "npm --prefix backend run copia-db",
    "crea-admin": "npm --prefix backend run crea-admin --",
    "popola-demo": "npm --prefix backend run popola-demo --",
    "passaggi": "npm --prefix backend run passaggi --",
    "misura-tempi": "npm --prefix backend run misura-tempi --",
    "migra": "npm --prefix backend run migra",
    "test": "npm --prefix backend test",
    "installa": "npm --prefix backend install && npm --prefix frontend install"
  }
}
```

## `README.md`

````markdown
# Regen Luxury — tracciabilità blockchain per capi di lusso rigenerati

Prototipo della tesi di laurea di Giuseppe Leonardo Viola (Ingegneria Informatica, Politecnico di Bari).
Stato del progetto, decisioni e prompt: [`docs/Handoff.md`](docs/Handoff.md).

**Online:** https://regen-luxury.onrender.com (Render, piano gratuito: la prima apertura dopo una pausa richiede ~1 minuto).

| Cartella | Contenuto | Stato |
|---|---|---|
| `backend/` | API REST Node.js + Express + MongoDB: login e ruoli, capi, interventi, passaggi di proprietà, verifica pubblica con controllo di integrità sulla blockchain, QR, NFC NTAG 424 DNA | ✅ 48 test + Passaggi 1–8 |
| `frontend/` | Web app React mobile-first: verifica pubblica (`/v/:tagId`, `/s` per NFC, `/scan`), area gestionale | ✅ |
| `contracts/` | Smart contract `RegenLuxuryPassport` (ERC-721, OpenZeppelin), chain locale, deploy, misura del gas | ✅ testato su chain locale |
| `ai-module/` | Classificazione del materiale da foto (notebook Colab + servizio ONNX) | 🟡 da addestrare su Colab |
| `docs/` | HandOff, validazione FURPS+, costi, deploy, demo, NFC, decisioni, LaTeX, UML | ✅ |

## Requisiti

- **Node.js 20 o successivo** e npm (`node -v`; sul Mac c'è la 24, su Render la 22) — https://nodejs.org
- **Git** (`git --version`)
- Account **MongoDB Atlas** con un cluster gratuito (M0), un *database user* e il tuo IP in *Network Access*
- Solo per il modulo AI: **Python 3.11+**

## Avvio in locale (Mac)

I comandi si lanciano dalla cartella principale `regen-luxury` (dove si aprono i terminali di VS Code):
inoltrano da soli a `backend/` e `frontend/`.

```bash
# 0) Una volta sola
npm run installa             # dipendenze di backend e web app
npm run imposta-db           # chiede la password del database user di Atlas (nascosta), la salva nel .env,
                             # genera JWT_SECRET se manca e prova subito la connessione
npm run crea-admin           # crea il tuo account (la password la scegli tu, nascosta); se l'email esiste la reimposta
npm run popola-demo          # capi dimostrativi (vedi sotto); si può rilanciare

# 1) Backend  (terminale 1, resta aperto)
npm run dev                  # "MongoDB Atlas: connesso" + API su http://localhost:5001 (la 5000 su macOS è di AirPlay)

# 2) Web app  (terminale 2)
npm run web                  # http://localhost:5173  (le chiamate /api vanno al backend)

# 3) Test  (terminale 3, con il backend avviato)
npm run passaggi             # Passaggi 1-8: email e password del TUO account, non quella del database
npm run misura-tempi         # requisito P (< 2 s)
npm test                     # 48 test automatici (database in memoria)
```

Le password sono due e diverse: quella del *database user* di Atlas (sta solo nel `.env`, si imposta con
`npm run imposta-db`) e quella del tuo account della piattaforma (login nella web app e `npm run passaggi`,
si imposta con `npm run crea-admin`). Solo per dati creati con la versione precedente del backend: `npm run migra`.

Blockchain: di default `BLOCKCHAIN_MODE=mock` (registro simulato, gratuito, salvato nel database e condiviso
con il sito online). Per lo smart contract reale: `cd contracts && npm install && npm run compile`, poi
`npm run chain` (terminale dedicato) → `npm run deploy` → nel `backend/.env` imposta `BLOCKCHAIN_MODE=polygon`,
`POLYGON_RPC_URL=http://127.0.0.1:8545` e `CONTRACT_ADDRESS`. Un solo server alla volta deve usare la stessa chiave.

## Dati dimostrativi

`npm run popola-demo` crea (una volta) questi capi, con marchi inventati, interventi e proprietari. Il codice va
scritto nel campo **«Hai il codice del tag?»** della home, oppure si apre `…/v/<codice>`:

| Codice | Capo | Cosa mostra |
|---|---|---|
| `DEMO-JEANS-01` | Atelier Moretti, jeans | autentico, 2 interventi, 2 proprietari, impatto evitato (fonte verificata) |
| `DEMO-TSHIRT-01` | Casa Vellani, t-shirt | autentico, impatto con valori «da verificare» |
| `DEMO-BORSA-01` | Maison Aurelia, borsa | autentico, 3 proprietari, chip NFC di prova |
| `DEMO-CAPPOTTO-01` | Sartoria Levante, cappotto | autentico, impatto non disponibile per la categoria |
| `DEMO-MANOMESSO` | Maison Aurelia, giacca | storico alterato nel database → **manomesso** |
| `DEMO-FALSO-99` | — | nessun capo → **non trovato**, possibile contraffazione |
| `NFC-001` | capo dei Passaggi 1–8 | creato da `npm run passaggi` |

Chip NFC di prova (vettore NXP AN12196): `/s?e=EF963FF7828658A599F3041510671E88&c=94EED9EE65337086` apre il
certificato di `DEMO-BORSA-01` **una sola volta**; poi risponde «Link già utilizzato» (anti-replay). Rilanciando
`npm run popola-demo` il link torna valido.

## API principali

| Metodo | Percorso | Chi | Descrizione |
|---|---|---|---|
| GET | `/api/health` | pubblico | stato del server e modalità blockchain |
| POST | `/api/auth/login` | tutti | login dell'area gestionale |
| GET | `/api/auth/me` · POST `/api/auth/password` | loggati | profilo · cambio password |
| GET, POST | `/api/auth/utenti` · PATCH `/api/auth/utenti/:id` | admin | account degli operatori |
| GET | `/api/items?q=&stato=&pagina=&perPagina=` | loggati | elenco con ricerca e pagine |
| POST | `/api/items` | brand manager, commerciante | nuovo capo (409 se il tag esiste già) |
| GET | `/api/items/tag/:tagId` · `/api/items/:id` | loggati | ricerca per tag · dettaglio |
| PATCH | `/api/items/:id` | brand manager, commerciante | modifica dati (tagId non modificabile) |
| POST | `/api/items/:id/archivia` | brand manager | archiviazione |
| POST | `/api/items/:id/eventi` | artigiano, commerciante | intervento di rigenerazione |
| POST | `/api/items/:id/proprieta` | commerciante, brand manager | passaggio di proprietà |
| GET | `/api/items/:id/qr` | loggati | QR code (SVG o `?formato=png`) |
| POST | `/api/items/:id/nfc` | brand manager, commerciante | associa un chip NTAG 424 DNA |
| DELETE | `/api/items/:id` | admin | eliminazione (solo per la demo) |
| GET | `/api/verify/:tagId` | **pubblico** | certificato + integrità + impatto |
| GET | `/api/verify/sun?e=&c=` | **pubblico** | verifica del chip NFC con anti-replay |

## Estensioni VS Code consigliate

ESLint, Prettier, MongoDB for VS Code, Solidity (Juan Blanco), PlantUML (jebbs), Python, Jupyter,
PowerShell, LaTeX Workshop.

## Dove tenere il progetto

Meglio **fuori** dalle cartelle sincronizzate con iCloud (Scrivania e Documenti, se la sincronizzazione è attiva):
iCloud può spostare nel cloud file di `.git` e `node_modules`, rallentando Git e creando copie in conflitto.
Consigliato: `~/Progetti/regen-luxury` (vedi `docs/Handoff.md`, §8.1).

## Sicurezza

I file `.env` (stringa Atlas, segreto JWT, chiave privata del wallet) **non vanno mai** condivisi né messi su Git.
````

## `render.yaml`

```yaml
# Deploy gratuito su Render (https://render.com) — vedi docs/deploy.md
# Un solo servizio: il backend espone le API e serve la web app React compilata (stesso dominio HTTPS).
services:
  - type: web
    name: regen-luxury
    runtime: node
    plan: free
    region: frankfurt
    # --include=dev: con NODE_ENV=production npm salterebbe Vite (dipendenza di sviluppo) e la build fallirebbe
    buildCommand: cd frontend && npm ci --include=dev && npm run build && cd ../backend && npm ci --omit=dev
    startCommand: cd backend && node server.js
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: NODE_VERSION
        value: "22"
      - key: TRUST_PROXY
        value: "1"
      - key: MONGO_URI # stringa di connessione Atlas: si inserisce nel pannello di Render, mai nel repository
        sync: false
      - key: JWT_SECRET
        generateValue: true
      # Registro blockchain simulato salvato nel database (il disco di Render si cancella a ogni riavvio).
      # Dopo il deploy del contratto su Polygon Amoy: BLOCKCHAIN_MODE=polygon e, nel pannello di Render,
      # POLYGON_RPC_URL, CONTRACT_ADDRESS, PLATFORM_PRIVATE_KEY, CHAIN_NAME (vedi docs/deploy.md).
      - key: BLOCKCHAIN_MODE
        value: mock
      - key: MOCK_LEDGER_STORE
        value: mongo
      # PUBLIC_BASE_URL non serve: il backend usa l'indirizzo assegnato da Render (RENDER_EXTERNAL_URL).
```

## `tools/esporta-codice.mjs`

```javascript
// Esporta tutto il codice del progetto in un unico file Markdown (da allegare all'HandOff o a una chat).
// Funziona su Mac, Windows e Linux:   node tools/esporta-codice.mjs [cartella] [file-di-uscita]
// Esclude dipendenze, build, credenziali (.env), file binari e lockfile.
import fs from "node:fs";
import path from "node:path";

const radice = path.resolve(process.argv[2] ?? ".");
const uscita = path.resolve(process.argv[3] ?? "docs/codice-completo.md");
const escluseCartelle = new Set(["node_modules", ".git", "dist", "build", "cache", "artifacts", ".venv", "__pycache__", "schermate", ".pytest_cache"]);
const escluso = (completo) => /ai-module[\\/](data|models)([\\/]|$)/.test(completo);
const esclusiFile = new Set([".env", "package-lock.json", "misure-gas.json", "RegenLuxuryPassport.json", "RegenLuxuryPassport.abi.json", "Handoff.md", path.basename(uscita)]);
const linguaggi = { ".js": "javascript", ".mjs": "javascript", ".cjs": "javascript", ".jsx": "jsx", ".json": "json", ".sol": "solidity", ".py": "python", ".ps1": "powershell", ".md": "markdown", ".css": "css", ".html": "html", ".yaml": "yaml", ".yml": "yaml", ".puml": "plantuml", ".bib": "bibtex", ".jsonc": "jsonc", ".txt": "text", ".example": "bash", ".ipynb": "json", ".svg": "xml" };

function* file(dir) {
  for (const voce of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const completo = path.join(dir, voce.name);
    if (voce.isDirectory()) {
      if (!escluseCartelle.has(voce.name) && !escluso(completo)) yield* file(completo);
    } else if (!esclusiFile.has(voce.name) && (linguaggi[path.extname(voce.name)] || voce.name === ".gitignore")) {
      yield completo;
    }
  }
}

const elenco = [...file(radice)].filter((f) => path.resolve(f) !== uscita);
const parti = [`# Codice completo del progetto\n\nEsportato il ${new Date().toLocaleString("it-IT")} da \`${path.basename(radice)}\` — ${elenco.length} file.\n\n## Indice\n`];
for (const f of elenco) parti.push(`- \`${path.relative(radice, f)}\``);
for (const f of elenco) {
  const contenuto = fs.readFileSync(f, "utf8").trimEnd();
  const recinto = "`".repeat(Math.max(3, ...[...contenuto.matchAll(/`+/g)].map((m) => m[0].length + 1)));
  parti.push(`\n## \`${path.relative(radice, f)}\`\n\n${recinto}${linguaggi[path.extname(f)] ?? ""}\n${contenuto}\n${recinto}`);
}
fs.mkdirSync(path.dirname(uscita), { recursive: true });
fs.writeFileSync(uscita, parti.join("\n") + "\n");
console.log(`Esportati ${elenco.length} file in ${path.relative(process.cwd(), uscita)}`);
```

## `tools/pulisci-tex.mjs`

```javascript
// pulisci-tex.mjs - Ripulisce un file .tex dagli artefatti Unicode del copia-incolla
// dalla chat (spazi invisibili, pedici/apici Unicode, % non escapati, ecc.).
//
// Uso (serve solo Node.js, già installato per il backend):
//   node tools/pulisci-tex.mjs capitolo2.tex
// -> crea "capitolo2.pulito.tex" accanto all'originale e stampa un report.
//    L'originale NON viene modificato: controlla il risultato e poi sostituiscilo.
import { readFileSync, writeFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Uso: node tools/pulisci-tex.mjs <file.tex>');
  process.exit(1);
}

let text = readFileSync(file, 'utf8');
const report = [];
const count = (re) => (text.match(re) || []).length;

function sostituisci(descrizione, re, replacement) {
  const n = count(re);
  if (n > 0) {
    text = text.replace(re, replacement);
    report.push(`${String(n).padStart(4)}  ${descrizione}`);
  }
}

// 1) caratteri invisibili (zero-width, BOM, soft hyphen, word joiner)
sostituisci('caratteri invisibili rimossi (U+200B/C/D, U+2060, U+FEFF, U+00AD)', /[\u200B\u200C\u200D\u2060\uFEFF\u00AD]/g, '');
// 2) spazi non standard -> spazio normale
sostituisci('spazi speciali convertiti (NBSP, narrow NBSP, thin space...)', /[\u00A0\u202F\u2007\u2009\u200A]/g, ' ');
// 3) pedici e apici Unicode -> comandi LaTeX
const pedici = '₀₁₂₃₄₅₆₇₈₉';
const apici = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
sostituisci('pedici Unicode -> \\textsubscript{} (es. CO₂)', /[₀-₉]+/g, (m) =>
  `\\textsubscript{${[...m].map((c) => pedici.indexOf(c)).join('')}}`);
sostituisci('apici Unicode -> \\textsuperscript{} (es. m²)', /[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) =>
  `\\textsuperscript{${[...m].map((c) => apici[c]).join('')}}`);
// 4) percentuali non escapate dopo un numero ("99,95%" commenterebbe il resto della riga!)
sostituisci('simboli % dopo un numero escapati in \\%', /(\d)\s?(?<!\\)%/g, '$1\\%');
// 5) spazi multipli e spazi a fine riga
sostituisci('spazi a fine riga rimossi', /[ \t]+$/gm, '');

// --- solo segnalazioni (da correggere a mano) ---
const warnings = [];
text.split('\n').forEach((riga, i) => {
  const n = i + 1;
  if (/^\s*[●•▪◦]/.test(riga)) warnings.push(`riga ${n}: elenco puntato "●" -> usare \\begin{itemize} \\item ...`);
  if (/(?<!\\)&/.test(riga) && !/tabular|align|\\\\\s*$/.test(riga)) warnings.push(`riga ${n}: "&" non escapato (fuori da tabelle usare \\&)`);
  if (/(?<!\\)[#](?!\d)/.test(riga)) warnings.push(`riga ${n}: "#" non escapato (usare \\#)`);
  const strani = riga.match(/[^\x00-\x7F\u00C0-\u017F“”‘’–—…«»°€]/gu);
  if (strani) warnings.push(`riga ${n}: caratteri da verificare: ${[...new Set(strani)].join(' ')}`);
});

const out = file.replace(/\.tex$/i, '') + '.pulito.tex';
writeFileSync(out, text, 'utf8');

console.log(`File pulito: ${out}\n`);
console.log(report.length ? 'Correzioni automatiche:\n' + report.join('\n') : 'Nessuna correzione automatica necessaria.');
console.log(warnings.length ? `\nDa controllare a mano (${warnings.length}):\n` + warnings.map((w) => '  - ' + w).join('\n') : '\nNessuna segnalazione.');
```
