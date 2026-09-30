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
