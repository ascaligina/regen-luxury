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
