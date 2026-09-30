# Regen Luxury — tracciabilità blockchain per capi di lusso rigenerati

Prototipo della tesi di laurea di Alessia Scaligina (Ingegneria Informatica, Politecnico di Bari).
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
