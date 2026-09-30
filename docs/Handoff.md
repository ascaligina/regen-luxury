# HANDOFF — Tesi: piattaforma blockchain di tracciabilità per capi di lusso rigenerati

> **Autore:** Giuseppe Leonardo Viola — Ingegneria Informatica (Sistemi Informativi), Politecnico di Bari (DEI)
> **Aggiornato al:** 22/09/2026, sera (versione 3)
> **Sito online:** https://regen-luxury.onrender.com (Render, piano gratuito)
> **Progetto sul Mac:** `~/Desktop/regen-luxury` (da spostare fuori da iCloud, §8.1) — aperto in VS Code
> **Repository GitHub (privato):** `Messiah1522/https-github.com-tuo-utente-regen-luxury` (nome da semplificare, §8.1)
> **Codice completo:** [`docs/codice-completo.md`](codice-completo.md) (rigenerabile con `node tools/esporta-codice.mjs`)

---

## 0. Come usare questo file

1. **Nuova chat con un assistente AI** → allega questo file (e, se serve il codice, `codice-completo.md`) e incolla
   il *prompt di ripresa* (§9.1). Poi usa il prompt del compito (§9.2–9.13).
2. **Per lavorare sull'app** → §7.1 (sul Mac), §7.2 (sito online), §7.3 (dati di prova).
3. **Cose che solo tu puoi fare** (account, password, chip fisici, relatore) → §8.1.

---

## 1. Il progetto in breve

Piattaforma di **tracciabilità digitale basata su blockchain** per capi di **moda di lusso rigenerati**, pensata
per **piccoli operatori** (boutique vintage, outlet indipendenti, cooperative artigiane) e utilizzabile a
**costo nullo o trascurabile** (vincolo **RC-5**). Due classi di attori: operatori (area gestionale con login) e
consumatori (verifica pubblica senza login né app). Ponte fisico-digitale: **NFC NTAG 424 DNA** + **QR code**.
Modulo AI: classificazione del materiale da foto; impatto ambientale evitato stimato con coefficienti **LCA**.
Tesi in italiano, LaTeX con template PoliBa/DEI.

| Livello | Tecnologia |
|---|---|
| Backend | Node.js (ES modules), Express 4, Mongoose 8, JWT + bcrypt, zod, helmet, express-rate-limit |
| Database | MongoDB Atlas (nuovo account, settembre 2026): cluster gratuito `tesis` (AWS Frankfurt), database `regen_luxury` |
| Blockchain | Polygon PoS (Amoy per i test), smart contract `RegenLuxuryPassport` (ERC-721 + AccessControl + ERC2771Context, OpenZeppelin 5), ethers.js 6; oggi **registro simulato** salvato nel database |
| Frontend | React 18 + Vite 6 + React Router 6, mobile-first, font Cormorant Garamond, lettore QR (`qr-scanner`), Web NFC su Android |
| NFC | NTAG 424 DNA, messaggi SUN (AES-128 + AES-CMAC, anti-replay con contatore) |
| AI | MobileNetV3-Large (transfer learning) su TextileNet-fibre, esportato in ONNX; servizio FastAPI + onnxruntime |
| Hosting | Render (piano gratuito, Frankfurt): un solo servizio con API + web app, deploy automatico da GitHub |
| Documento | LaTeX (VS Code + LaTeX Workshop, recipe `pdflatex ×2`), BibTeX |

---

## 2. Cronologia del lavoro

| Quando | Cosa |
|---|---|
| 1/9 (chat) | Primo backend Node/Express/MongoDB (capo Gucci `NFC-001`, Passaggi 1–6 in PowerShell) |
| 21/9 | **Versione 2**: backend unificato (login e ruoli, validazione, limiti, integrità on-chain, QR, NFC SUN), smart contract su chain locale e misura del gas, web app React, modulo AI (notebook + servizio ONNX), validazione FURPS+, documenti; cartella in VS Code e primo commit Git |
| 22/9 mattina | **Nuovo account Atlas**: `npm run imposta-db` (password nascosta + prova di connessione), `crea-admin` con password scelta, messaggi d'errore chiari, porta 5001, comandi dalla cartella principale; sul Mac con Atlas Passaggi 8/8 e verifica media 37,9 ms |
| 22/9 | **Grafica rinnovata**: testata con titolo centrale, home con caroselli di foto, **Il tuo armadio** e **Storico delle verifiche** (solo sul dispositivo) |
| 22/9 | **Online su Render** (https://regen-luxury.onrender.com): registro simulato nel database, build con Vite anche in produzione; password del database cambiata dopo essere finita in chat |
| 22/9 sera | **Revisione completa** (22 problemi, §4) e correzioni, **48 test**; **dati dimostrativi** (`npm run popola-demo`), 15 schermate nuove, spostamenti di file, questo HandOff |

---

## 3. Stato di avanzamento

### 3.1 Applicazione

| Componente | Stato | Dettaglio |
|---|---|---|
| Backend (Cap. 4.1) | ✅ | Login e ruoli, validazione, limite di richieste, integrità on-chain, QR, NFC, spegnimento ordinato. **48 test automatici** |
| Passaggi 1–8 | ✅ | In sviluppo e **sul Mac con Atlas** (8/8, verifica media 37,9 ms, max 68 ms) |
| Smart contract (Cap. 4.2) | ✅ chain locale · ⏭️ Amoy | Compilato e deployato su Hardhat; adattatore Polygon provato anche dopo un errore (nonce riallineato) |
| Gas e costi (Cap. 6) | ✅ | 403.338 gas per il ciclo di vita tipico di un capo → da 0,1 a 6 centesimi (`docs/costi/`) |
| Frontend | ✅ | Verifica pubblica, pagina NFC, scansione QR, area gestionale, armadio e storico; provato su computer e telefono |
| Sito online | ✅ | Render + Atlas; stesso database e stesso registro del Mac |
| NFC NTAG 424 DNA | ✅ software · ⏭️ chip fisico | Verifica SUN sul vettore ufficiale NXP AN12196; chip di prova attivo online su `DEMO-BORSA-01` |
| Modulo AI (Cap. 4.3) | 🟡 | Notebook Colab e servizio pronti e testati; **addestramento da eseguire su Colab** |
| LCA | 🟡 | Jeans verificato (Levi's 2015); t-shirt «da verificare» (la pagina lo dice); altre categorie «non disponibile» |
| Validazione (Cap. 5) | 🟡 | Tabella FURPS+ con colonna «Mac con Atlas»; 15 schermate; mancano chip fisico e Amoy |

### 3.2 Tesi

| Parte | Stato |
|---|---|
| Titolo | 🟡 proposta: *Tracciabilità digitale per la moda di lusso rigenerata — Progettazione di una piattaforma blockchain a costo zero per l'anticontraffazione e l'economia circolare* (da confermare) |
| Abstract + keywords | 🟡 bozza di ~155 parole; keyword: tracciabilità digitale, blockchain, moda di lusso rigenerata, economia circolare, Passaporto Digitale del Prodotto |
| Introduzione, Cap. 1 | ⚪ stato da verificare |
| Cap. 2 | 🟡 scritto (~3.100 parole) e in LaTeX; bibliografia `unsrt`; controllare le `\cite{}` mancanti |
| Cap. 3 | ✅ completo, in LaTeX; diagramma architetturale in §3.4 |
| Cap. 4 | 🟡 codice pronto per 4.1 e 4.2; testo da scrivere (§9.4–9.6) |
| Cap. 5 | 🟡 dati e schermate pronti, testo da scrivere (§9.7) |
| Cap. 6 | ⏭️ da scrivere, con la sostenibilità economica (dati in `docs/costi/`) |

---

## 4. Revisione del 22/09 (sera): problemi trovati e correzioni

Revisione completa di backend, frontend, contratto, modulo AI e documenti. Problemi più importanti:

| # | Problema | Correzione |
|---|---|---|
| 1 | **Mac e sito online usavano registri blockchain diversi** sullo stesso database: un capo creato da una parte risultava «non registrato» dall'altra | Registro simulato **nel database per impostazione predefinita** (`MOCK_LEDGER_STORE=mongo`), anche nel `.env` del Mac; il vecchio file viene importato da solo |
| 2 | **Una manomissione si poteva nascondere** riscrivendo nel database lo stato «in attesa» o «fallito»: la pagina diceva comunque «Autentico» | «Autentico» **solo se tutto coincide** con la blockchain; l'attesa vale solo se la scrittura è in corso su questo server o è iniziata da meno di 10 minuti; altrimenti «Verifica non conclusiva». Nuovi test in `integrita.test.js` |
| 3 | Una modifica fatta mentre la precedente era ancora in scrittura poteva far comparire per un attimo «manomesso» | Si segna «confermato» solo se l'impronta scritta è ancora quella attuale |
| 4 | Se il server si spegneva (Render lo fa spesso) le scritture in corso restavano «in attesa» per sempre | Spegnimento ordinato: si attendono le scritture in corso; una voce già presente on-chain non viene riscritta. Il riancoraggio resta **manuale** (`npm run migra`) apposta, per non registrare dati alterati |
| 5 | Polygon: dopo una transazione fallita tutte le successive potevano bloccarsi (nonce) | Invii in coda unica, riallineamento del nonce, timeout di conferma, nuovo tentativo di connessione |
| 6 | La data massima degli interventi era fissata all'avvio del server (dopo un minuto «data nel futuro») | Controllo calcolato a ogni richiesta |
| 7 | Nel modulo di modifica non si potevano svuotare i campi facoltativi | Campo svuotato = campo rimosso (e nuova impronta) |
| 8 | `npm run deploy` falliva su un clone nuovo (contratto compilato escluso da Git) | Artefatto del contratto nel repository; `npm run compile` nelle istruzioni |
| 9–22 | Minori: CSP per il servizio AI, file di build mancanti = 404, indirizzo stampato = indirizzo del QR, un errore del database non fa più uscire dal login, messaggio corretto per email duplicate, NFC non associabile a capi archiviati, link NFC riprovabile dopo un errore di rete, avviso sui valori LCA «da verificare», servizio AI robusto, `misura-gas` fallisce se un controllo non passa e salva in `docs/costi/`, conteggi dei test, documenti aggiornati | ✅ |

Non corretto (dichiarato come limite): indice univoco sul chip NFC (serve una migrazione dell'indice su Atlas);
controllo di integrità che si fida della finestra di 10 minuti basata su date salvate nel database (però non può
mai produrre «Autentico»).

**Spostamenti di file**: `backend/test-powershell/passaggi.ps1` → `backend/scripts/passaggi.ps1`;
`docs/latex/pulisci-tex.mjs` → `tools/pulisci-tex.mjs`; `ai-module/lca/coefficienti.md` → `docs/lca/coefficienti.md`;
eliminati `tools/esporta-codice.ps1` (doppione) e il file vuoto `copia-db` nella radice; `contracts/RegenLuxuryPassport.json`
ora è versionato.

---

## 5. Decisioni prese (e perché)

| Decisione | Motivazione |
|---|---|
| **Una sola versione del backend**, nata dal codice del 1/9 | Stessi nomi di campo e stessi endpoint documentati nei Passaggi |
| Login con **JWT** e ruoli `admin`, `brand_manager`, `commerciante`, `artigiano` | Solo gli operatori scrivono; i clienti restano senza account (requisito U) |
| **Validazione** con zod, campi sconosciuti rifiutati, `tagId` non modificabile | Requisito R; il tag è il legame con il chip fisico |
| **Limite di richieste**: 120 verifiche/min e 10 tentativi di login/15 min per IP | Protezione da abusi |
| **Solo impronte on-chain** (keccak256 di JSON canonico), nomi mai sulla blockchain | GDPR; l'id casuale della voce fa da «sale» |
| **Controllo di integrità** database ↔ blockchain; «Autentico» solo se tutto coincide | La modifica del database diventa **rilevabile** e non si può mascherare con gli stati di attesa |
| Scritture **asincrone e in coda per capo**; riancoraggio solo manuale | Requisito P + ordine garantito; non si «ripuliscono» dati alterati |
| **Registro simulato nel database** (`registro_simulato`, con controllo di versione) | Su Render il disco si cancella; Mac e sito online restano allineati. Limite: meno indipendente di una blockchain vera → Polygon Amoy |
| Contratto v2 con `dataHashOf`, `updateDataHash`, `recordByTag` | Confronto dei dati attuali e lettura gratuita in una chiamata |
| **Custodia della piattaforma** (paga il gas, nessun wallet per gli utenti) | RC-5 + usabilità; EIP-2771 come evoluzione — da confermare col relatore (`docs/decisioni/`) |
| **Impatto LCA** = produzione del capo nuovo × 0,6 (Farrant et al., 2010); nessun numero senza fonte | Stima difendibile; i valori non verificati sono segnalati sulla pagina |
| **TextileNet** invece di DeepFashion | Licenza CC BY, download diretto, etichette per fibra |
| **ONNX + onnxruntime** per il servizio AI | Sul Mac non serve PyTorch; addestramento su Colab gratuito |
| **Un solo servizio web** su Render (API + web app) | Stesso dominio HTTPS per tag, QR e fotocamera |
| **Armadio e storico solo nel browser** (localStorage) | Nessun account per i clienti, nessun dato personale sul server |
| **Foto decorative Unsplash** senza loghi, **marchi inventati** nei dati di prova | Diritti d'autore e marchi; crediti in `docs/crediti-foto.md` |
| Porta **5001** | Su macOS la 5000 è occupata da AirPlay Receiver |
| UML: solo le modifiche richieste dal relatore | Evita cicli di revisione |

---

## 6. Struttura del repository

```
regen-luxury/
├── package.json       comandi rapidi dalla radice (dev, web, imposta-db, crea-admin, popola-demo, passaggi, …)
├── render.yaml        deploy gratuito su Render
├── backend/           server.js, app.js, config/, models/, controllers/, routes/, middleware/, validators/,
│                      services/ (blockchain, anchor, integrity, impact, sun, qr, hash), data/coefficienti-lca.json,
│                      scripts/ (imposta-db, copia-db, crea-admin, popola-demo, passaggi .js/.ps1, misura-tempi, migra),
│                      test/ (48 test node:test)
├── frontend/          src/pages (Home, Verify, Sun, Scan, Armadio, Login, Dashboard, NewItem, ItemDetail, Label,
│                      Users, Account, NotFound), src/components (Layout, StoricoMenu, Carosello, Certificato, …),
│                      src/utils/archivio.js (armadio e storico), src/data/foto.js, src/assets/fonts, src/styles
├── contracts/         RegenLuxuryPassport.sol + .json compilato, compile.cjs, deploy.mjs, crea-wallet.mjs, misura-gas.mjs
├── ai-module/         src/ (classi, prepara_dataset, addestra, servizio), notebooks/, test/
├── docs/              Handoff.md, codice-completo.md, deploy.md, demo.md, crediti-foto.md, validazione/ (FURPS+ e
│                      15 schermate), costi/, decisioni/, lca/, nfc/, latex/, uml/
└── tools/             esporta-codice.mjs, pulisci-tex.mjs
```

Endpoint: tabella nel `README.md` della radice.

---

## 7. Come si usa

### 7.1 Sul Mac

Tutti i comandi dalla cartella principale `regen-luxury` (i terminali di VS Code si aprono lì):

```bash
npm run installa            # dipendenze di backend e web app (una volta, o dopo un aggiornamento)
npm run imposta-db          # password del database user di Atlas (nascosta) → .env + prova di connessione
npm run crea-admin          # il tuo account: password scelta da te (nascosta); se esiste la reimposta
npm run popola-demo         # capi dimostrativi (§7.3)
npm run dev                 # terminale 1: "MongoDB Atlas: connesso" + "Server in ascolto sulla porta 5001"
npm run web                 # terminale 2: http://localhost:5173
npm run passaggi            # terminale 3: Passaggi 1–8 (email e password del TUO account)
npm run misura-tempi        # requisito P
npm test                    # 48 test automatici
```

Smart contract in locale (facoltativo): `cd contracts && npm install && npm run compile`, poi `npm run chain`
(terminale dedicato) → `npm run deploy` → nel `backend/.env` `BLOCKCHAIN_MODE=polygon`, `POLYGON_RPC_URL=http://127.0.0.1:8545`,
`CONTRACT_ADDRESS`.

**Due password diverse**: quella del *database user* di Atlas (solo nel `.env`, con `npm run imposta-db`, mai in chat)
e quella del tuo account della piattaforma (login e `npm run passaggi`, con `npm run crea-admin`). Nei terminali le
password compaiono come asterischi.

### 7.2 Sito online (Render)

- Indirizzo: **https://regen-luxury.onrender.com** — stesso database e stesso registro del Mac.
- **Aggiornare il sito**: in VS Code *Controllo del codice sorgente* → messaggio → **Commit** → **Sincronizza
  modifiche**. Render ripubblica da solo in 3–5 minuti (pagina *Events* del servizio).
- Variabili su Render (*Environment*): `MONGO_URI` (con `npm run copia-db`, mai in chat), `JWT_SECRET` (generato),
  `BLOCKCHAIN_MODE=mock`, `MOCK_LEDGER_STORE=mongo`, `NODE_ENV=production`, `NODE_VERSION=22`, `TRUST_PROXY=1`.
- Piano gratuito: si sospende dopo ~15 minuti senza visite; la prima apertura richiede ~1 minuto.
- Se cambi la password del database: Atlas **Update User** → `npm run imposta-db` → `npm run copia-db` → Render
  *Environment* → `MONGO_URI` → incolla → **Save and deploy**.
- Guida completa: `docs/deploy.md`.

### 7.3 Dati dimostrativi

`npm run popola-demo` crea (una volta; si può rilanciare) capi con **marchi inventati**, usando le stesse API
della web app. Il codice si scrive nel campo **«Hai il codice del tag?»** della home oppure si apre `/v/<codice>`:

| Codice | Capo | Cosa mostra |
|---|---|---|
| `DEMO-JEANS-01` | Atelier Moretti, jeans | autentico, 2 interventi, 2 proprietari, **12 kg CO₂e** evitati (fonte verificata) |
| `DEMO-TSHIRT-01` | Casa Vellani, t-shirt | autentico, impatto con valori «da verificare» |
| `DEMO-BORSA-01` | Maison Aurelia, borsa | autentico, 3 proprietari, chip NFC di prova |
| `DEMO-CAPPOTTO-01` | Sartoria Levante, cappotto | autentico, impatto «non disponibile» per la categoria |
| `DEMO-MANOMESSO` | Maison Aurelia, giacca | storico alterato nel database → **«Attenzione: dati non coincidenti»** |
| `DEMO-FALSO-99` | — | **«Capo non trovato»**: possibile contraffazione |
| `NFC-001` | capo dei Passaggi 1–8 | creato da `npm run passaggi` |

**Chip NFC di prova** (vettore NXP AN12196, chiavi di fabbrica):
`https://regen-luxury.onrender.com/s?e=EF963FF7828658A599F3041510671E88&c=94EED9EE65337086` → certificato di
`DEMO-BORSA-01` con «Chip NFC autentico · lettura n. 61». Vale **una volta**: poi «Link già utilizzato»
(anti-replay). Rilanciando `npm run popola-demo` torna valido.

---

## 8. Cosa resta da fare

### 8.1 Solo tu (account, password, hardware, relatore)

- [x] Node.js sul Mac (v24) · Atlas (nuovo account) · `imposta-db` · `crea-admin` · Passaggi 8/8 · web app sul Mac
- [x] GitHub (repository privato) e **Render** online
- [ ] **Mandare su GitHub le correzioni di stasera**: VS Code → *Sincronizza modifiche* (Render ripubblica da solo)
- [ ] **`npm run popola-demo`** sul Mac (crea i capi di prova su Atlas, visibili anche online)
- [ ] **Spostare il progetto fuori da iCloud**: la Scrivania è sincronizzata e iCloud ha già spostato nel cloud file di
      `.git`. Chiudi VS Code → Finder → crea `~/Progetti` (nella cartella Inizio, non in Scrivania/Documenti) →
      trascina `regen-luxury` dentro → VS Code → *File → Apri cartella*. Poi, nell'app Claude, collega la nuova cartella.
- [ ] (Facoltativo) **Rinominare il repository** GitHub in `regen-luxury` (*Settings → Repository name*); poi controllare
      su Render che il servizio sia ancora collegato
- [ ] **Relatore**: le 3 domande in `docs/decisioni/4.2-custodia-e-commissioni.md`
- [ ] **Amoy**: `npm run crea-wallet` → POL di prova dal faucet (login e captcha) → `npm run deploy` → variabili su Render
- [ ] **Colab**: eseguire `ai-module/notebooks/addestramento_colab.ipynb` e copiare il modello in `ai-module/models/`
- [ ] **Chip fisico**: acquistare NTAG 424 DNA, configurare SDM (`docs/nfc/configurazione-tag.md`), associarlo a un capo

### 8.2 Sviluppo (anche con un assistente AI)

- [ ] Verificare i valori della t-shirt (Forfora et al., 2026) e aggiungere categorie LCA con fonte
- [ ] Indice univoco sul chip NFC (migrazione dell'indice su Atlas)
- [ ] Ancoraggio «a lotti» con radice di Merkle (sviluppo futuro, Cap. 6)
- [ ] Passaggio a EIP-2771 (firme degli operatori) se il relatore lo chiede
- [ ] Scrivere i capitoli 4, 5, 6 (§9)

---

## 9. Prompt pronti all'uso

> Allegare sempre questo HandOff. Per il codice, allegare `docs/codice-completo.md` o i file interessati.

### 9.1 Ripresa del contesto

```text
Sei il mio assistente per la tesi triennale in Ingegneria Informatica (Sistemi Informativi) al Politecnico di Bari. Ti allego il file HANDOFF con lo stato del progetto regen-luxury: leggilo tutto prima di rispondere.
Come voglio lavorare:
- italiano, conciso, operativo, senza preamboli;
- passaggi incrementali: dopo ogni passaggio aspetta la mia conferma o l'output del terminale;
- ho basi da principiante in AI e blockchain: tutto deve essere difendibile oralmente da me; segnala le affermazioni rischiose e proponi fonti, senza allarmismi;
- correzioni mirate, non riscritture complete; sui diagrammi UML solo le modifiche richieste dal relatore;
- password e stringhe di connessione non vanno mai in chat: si inseriscono solo nel terminale (npm run imposta-db) o nel pannello di Render (npm run copia-db);
- ambiente: Mac (e PC Windows), VS Code, Node.js, MongoDB Atlas, Render, LaTeX con recipe pdflatex x2.
Per iniziare: riassumi in 5 righe lo stato del progetto e proponi il prossimo passo più importante. Poi aspetta.
```

### 9.2 Riprendere lo sviluppo sul Mac

```text
Riprendiamo lo sviluppo di regen-luxury sul Mac. Guidami un comando alla volta dalla cartella principale: npm run installa, npm run dev (terminale 1), npm run web (terminale 2), npm test.
Poi aiutami con: [descrivi la modifica]. Dopo ogni modifica: test, commit in VS Code e "Sincronizza modifiche" per aggiornare il sito su Render.
```

### 9.3 `.bib` e citazioni del Capitolo 2

```text
Ti allego capitolo2.tex e bibliography.bib (stile unsrt). Obiettivo: una tabella "frase -> chiave -> dove inserire \cite{}" per ogni affermazione fattuale, sezione per sezione, e l'elenco delle affermazioni ancora senza fonte (in particolare: ~99,95% con The Merge, NTAG 424 DNA, coefficienti LCA).
Non inventare riferimenti: se una fonte non è certa, scrivi [DA VERIFICARE]. Correggi anche "direttiva" -> "Regolamento (UE) 2024/1781 (ESPR)" dove si parla del Passaporto Digitale del Prodotto.
```

### 9.4 Testo del §4.1 (backend)

```text
Scriviamo il §4.1 "Sviluppo del Back end e gestione della logica di business" dal codice in codice-completo.md (cartella backend).
Struttura: architettura a livelli (rotte, middleware, controller, servizi, modelli) · modello dati MongoDB con sottodocumenti embedded · API REST (tabella) · login e ruoli · validazione e limite di richieste · anti-duplicazione del tag · scrittura asincrona sulla blockchain e interfaccia sostituibile · gestione degli errori.
Registro accessibile come nel Cap. 3; collega ogni scelta al requisito FURPS+; al massimo 2-3 frammenti di codice brevi (lstlisting). Una sottosezione alla volta.
```

### 9.5 Testo del §4.2 (blockchain)

```text
Scriviamo il §4.2 dal contratto RegenLuxuryPassport.sol e dai servizi backend/services/blockchain e integrityService.js.
1) Spiegami il contratto riga per riga come se dovessi difenderlo in commissione.
2) Testo: impronte keccak256 e JSON canonico, cosa va on-chain e cosa no (GDPR), registro simulato vs Polygon, controllo di integrità (manomissione rilevabile), custodia della piattaforma e costi (decisione in docs/decisioni).
3) Figura: sequenza "registrazione capo -> ancoraggio asincrono -> verifica pubblica".
```

### 9.6 Testo del §4.3 (modulo AI)

```text
Scriviamo il §4.3 da ai-module (README, src/addestra.py, src/servizio.py, docs/lca/coefficienti.md) e, se disponibili, da models/metriche.json e matrice_confusione.png.
Spiega a livello principiante: transfer learning, perché MobileNetV3, perché TextileNet (licenza e accesso rispetto a DeepFashion), divisione 70/15/15, metriche, esportazione ONNX, perché il suggerimento va sempre confermato. Poi il metodo di stima dell'impatto (produzione x 0,6) con le fonti.
```

### 9.7 Capitolo 5 — Validazione

```text
Scriviamo il Capitolo 5 da docs/validazione/tabella-furps.md, dalle schermate in docs/validazione/schermate e dai risultati già riportati nella colonna "Mac con Atlas" (Passaggi 8/8, verifica media 37,9 ms) e da npm test (48 test).
5.1: tabella requisito -> test -> esito; 5.2: tracciabilità e anticontraffazione (duplicazione del tag, anti-replay NFC con vettore NXP, rilevazione delle manomissioni). Dichiara onestamente i limiti (chip fisico, modulo AI, custodia, registro simulato nello stesso cluster). Usa la dimostrazione DEMO-MANOMESSO come esempio di manomissione rilevata.
```

### 9.8 Capitolo 6 — Conclusioni e sostenibilità economica

```text
Scriviamo il Capitolo 6. Il §3.3.3 rimanda qui per la sostenibilità del modello zero-cost. Dati: docs/costi/gas-e-costi.md (gas misurato, scenari di costo).
1) Aggiorna gli scenari con prezzo del gas e di POL di oggi, con data e fonte.
2) Confronta: costo assorbito dalla piattaforma, quota associativa di una cooperativa, ancoraggio a lotti con radice di Merkle.
3) 6.1 sintesi e impatto; 6.2 sviluppi futuri (EIP-2771, chip con chiavi diversificate, atti delegati ESPR per il tessile, modulo AI su più dati).
```

### 9.9 Titolo

```text
Proposta attuale: "Tracciabilità digitale per la moda di lusso rigenerata — Progettazione di una piattaforma blockchain a costo zero per l'anticontraffazione e l'economia circolare". Valutala rispetto a ciò che il prototipo dimostra davvero e proponi al massimo 3 alternative con pro e contro.
```

### 9.10 Trasposizione in LaTeX

```text
Trasponi in LaTeX (template PoliBa/DEI) il testo che ti incollo: \section coerenti con l'indice, itemize al posto di "●", CO\textsubscript{2}, \% nelle percentuali, figure in images/ con \label e \caption, citazioni \cite{}. Deve compilare con pdflatex -> bibtex -> pdflatex x2. Non cambiare il contenuto; segnala a parte le frasi da rivedere. (Dopo: node tools/pulisci-tex.mjs file.tex)
```

### 9.11 Revisione UML

```text
Il relatore chiede queste modifiche al [diagramma]: [richieste]. Ti allego il sorgente. Applica SOLO queste modifiche, senza riorganizzare o rinominare. Restituisci il sorgente completo e l'elenco puntuale delle modifiche.
```

### 9.12 Simulazione della discussione

```text
Simula la commissione. Una domanda alla volta sui punti più esposti: The Merge ~99,95%, NTAG 424 DNA e anti-replay, fonti LCA e fattore 0,6, chi paga il gas, cosa è davvero immutabile (impronte on-chain vs database), perché Polygon, perché MongoDB, GDPR, TextileNet vs DeepFashion, limiti del prototipo. Dopo ogni risposta: voto 1-5, cosa mancava, versione migliore in 4 frasi.
```

### 9.13 Deploy su Polygon Amoy

```text
Voglio passare dalla blockchain simulata a Polygon Amoy (testnet) sul sito online. Ho già: [wallet sì/no, POL di prova sì/no].
Guidami: npm run crea-wallet (la chiave privata resta nel file contracts/.env, mai in chat), faucet, npm run deploy, variabili su Render (BLOCKCHAIN_MODE=polygon, POLYGON_RPC_URL, CHAIN_NAME, CONTRACT_ADDRESS, PLATFORM_PRIVATE_KEY), npm run migra, verifica di NFC-001 e dei capi DEMO. Ricorda: una sola istanza del server deve usare quella chiave.
```

---

## 10. Punti a rischio per la discussione

1. **«~99,95% di riduzione dei consumi con The Merge»**: riguarda Ethereum; fonti ethereum.org e CCRI (2022). Polygon è PoS ma non ha lo stesso numero.
2. **NTAG 424 DNA**: il software è verificato con il vettore NXP, il chip fisico non ancora. Chiavi di fabbrica (zero) solo per la demo.
3. **LCA**: jeans da Levi's (2015) solo fasi di produzione; t-shirt da verificare; fattore 0,6 da Farrant et al. (2010). Sono stime.
4. **«Direttiva» → Regolamento (UE) 2024/1781 (ESPR)** per il Passaporto Digitale del Prodotto (§3.2.6).
5. **Immutabilità**: formulazione difendibile: *la modifica del database diventa rilevabile* (test e `DEMO-MANOMESSO`); «Autentico» solo se tutto coincide.
6. **Registro simulato nel database**: nella demo online è nello stesso cluster dei dati; l'indipendenza vera arriva con Amoy.
7. **Custodia della piattaforma**: la blockchain prova l'integrità, non l'identità dell'operatore.
8. **Dataset**: il Cap. 2 cita DeepFashion, l'addestramento usa TextileNet → motivare.
9. **Deploy gratuito**: il server si sospende dopo 15 minuti; «svegliarlo» prima della demo.
10. **Atlas aperto a 0.0.0.0/0** per Render gratuito: limite da dichiarare (accesso comunque protetto da utente e password).

---

## 11. Lezioni apprese e trappole note

- Nessuna affermazione fattuale senza fonte; nessun numero LCA senza unità funzionale. UML: solo le richieste del relatore.
- LaTeX su Windows: recipe `pdflatex ×2`; con bibliografia `pdflatex → bibtex → pdflatex ×2`; dopo il copia-incolla: `node tools/pulisci-tex.mjs file.tex`.
- PowerShell: `backend/scripts/passaggi.ps1` (serve il token); i vecchi comandi del 1/9 senza login non funzionano più.
- Credenziali (Atlas, JWT, chiave del wallet) solo nei file `.env` o nel pannello di Render; mai in chat, mai su Git.
  Se una password finisce in chat: cambiarla subito su Atlas (**Update User**) e rifare `imposta-db` e `copia-db`.
- Dopo il cambio password su Atlas serve circa un minuto prima che sia valida («bad auth» nel frattempo).
- Non modificare `backend/.env` a mano con il file aperto in VS Code: salvandolo si sovrascrivono le modifiche degli
  script (è successo con `MOCK_LEDGER_STORE` e `PORT`). Usare `npm run imposta-db`.
- Su macOS la porta **5000** è di AirPlay: il backend usa la **5001**.
- I terminali di VS Code si aprono nella cartella principale: i comandi `npm run …` funzionano da lì.
- Render: con `NODE_ENV=production` npm salta le dipendenze di sviluppo → la build usa `npm ci --include=dev` per Vite.
- Il sito su Render e il Mac usano lo **stesso database e lo stesso registro**: ciò che si crea da una parte si vede dall'altra.
- iCloud (Scrivania e Documenti) sposta nel cloud file di `.git` e `node_modules`: meglio tenere il progetto in `~/Progetti`.
- Un tag eliminato dal database resta registrato on-chain e non può essere riusato (comportamento voluto).
- OpenZeppelin 5 richiede la compilazione con EVM **cancun**. Una sola istanza del server per chiave privata (nonce).

---

## Appendice — strumenti

- `tools/esporta-codice.mjs` — esporta tutto il codice in `docs/codice-completo.md`
- `tools/pulisci-tex.mjs` — pulizia dei caratteri Unicode del copia-incolla nei `.tex`
- `docs/latex/latex-workshop-settings.jsonc` — recipe `pdflatex ×2` per VS Code
- `docs/latex/bibliografia-starter.bib` — 18 voci di riferimento (da unire a `bibliography.bib`)
- `docs/uml/casi_d_uso.puml` — trascrizione del diagramma dei casi d'uso (vale la versione approvata dal relatore)
- `docs/validazione/schermate/` — 15 schermate (telefono 390×844 e computer 1440×900) della versione attuale
