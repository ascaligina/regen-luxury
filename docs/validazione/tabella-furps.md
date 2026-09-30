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
