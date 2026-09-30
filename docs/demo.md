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
