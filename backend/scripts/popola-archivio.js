/*
 * ARCHIVIO DIMOSTRATIVO — popola il database (Atlas) con 216 capi di lusso d'epoca e di oggi.
 * Uso:  npm run popola-archivio                          (dalla cartella principale o da backend/)
 *       npm run popola-archivio -- --email tua@email.it  (capi creati a nome di quell'account)
 *       npm run popola-archivio -- --quanti 50           (solo i primi 50)
 *       npm run popola-archivio -- --prova               (mostra il riepilogo senza toccare il database)
 *       npm run popola-archivio -- --esporta archivio.json (salva i dati generati in un file)
 *       npm run popola-archivio -- --verifica-tutti      (al termine verifica ogni capo, non un campione)
 * I capi vengono creati con le stesse API della web app (validazione, ancoraggio sulla blockchain
 * simulata, controllo di integrità) a nome del primo amministratore attivo, poi marcati
 * "dimostrativo". Lo script si può rilanciare: i capi già presenti vengono saltati.
 * TUTTI I DATI SONO INVENTATI (marchi citati a solo scopo illustrativo, persone e laboratori
 * inesistenti, scambi e date casuali tra il 1980 e oggi): si veda data/archivio-lusso.js.
 * Nota: sulla blockchain un tag registrato non si cancella; i capi possono essere eliminati
 * dal database ma i loro codici tag restano "bruciati" nel registro.
 */
import "dotenv/config";
import fs from "node:fs/promises";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB, spiegaErroreMongo } from "../config/db.js";
import { jwtSecret } from "../config/security.js";
import { creaApp } from "../app.js";
import { attendiAncoraggi, inLavorazione } from "../services/anchorService.js";
import User from "../models/User.js";
import Item from "../models/Item.js";
import { generaArchivio, riepilogoArchivio, NUMERO_CAPI_PREDEFINITO } from "../data/archivio-lusso.js";
import { colore, chiamata, attendi } from "./_cli.js";

const argomento = (nome) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const opzione = (nome) => process.argv.includes(`--${nome}`);

const quanti = Number(argomento("quanti") ?? NUMERO_CAPI_PREDEFINITO);
if (!Number.isInteger(quanti) || quanti < 1 || quanti > 1000) {
  console.error(colore.rosso("--quanti deve essere un numero intero tra 1 e 1000."));
  process.exit(1);
}
const archivio = generaArchivio({ quanti });
const r = riepilogoArchivio(archivio);
console.log(
  `Archivio generato: ${r.capi} capi · ${r.brand} maison · ${r.passaggi} passaggi di proprietà in ${r.paesi} paesi · ${r.eventi} interventi · ${r.annoMin}–${r.annoMax}`
);

if (argomento("esporta")) {
  await fs.writeFile(argomento("esporta"), JSON.stringify(archivio, null, 2));
  console.log(colore.verde(`Dati salvati in ${argomento("esporta")}`));
}
if (opzione("prova") || argomento("esporta")) process.exit(0);

// Il registro simulato vive nel database (condiviso con il sito online); latenza ridotta per velocizzare
if ((process.env.BLOCKCHAIN_MODE ?? "mock") === "mock") process.env.MOCK_LEDGER_STORE = "mongo";
process.env.MOCK_CHAIN_LATENCY_MS ??= "20";
process.env.RATE_LIMIT_VERIFY_PER_MIN = "100000"; // server temporaneo di questo processo: nessun limite alle verifiche dello script

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
await new Promise((resolve) => server.once("listening", resolve));
const base = `http://127.0.0.1:${server.address().port}/api`;
const token = jwt.sign({ sub: String(autore._id), ruolo: autore.ruolo }, jwtSecret(), { expiresIn: "3h" });
const api = async (metodo, percorso, corpo) => {
  const risposta = await chiamata(base, metodo, percorso, { corpo, token });
  if (risposta.status >= 400 && !(metodo === "GET" && risposta.status === 404)) {
    const dettagli = risposta.dati?.dettagli?.map((d) => `${d.campo}: ${d.messaggio}`).join("; ");
    throw new Error(`${metodo} ${percorso}: HTTP ${risposta.status} ${risposta.dati?.errore ?? ""} ${dettagli ?? ""}`.trim());
  }
  return risposta;
};

const inizio = Date.now();
const contatori = { creati: 0, saltati: 0, errori: 0, fatti: 0 };
const coda = [...archivio];
const parallelismo = Math.min(Math.max(Number(argomento("concorrenza") ?? 3), 1), 6);

// Una scrittura alla volta per capo: attende che l'ancoraggio in background della precedente sia concluso,
// così due aggiornamenti dello stesso documento non si sovrappongono mai.
const attendiCapo = async (id) => {
  while (inLavorazione(id)) await attendi(5);
};

async function elabora({ capo, eventi, passaggi }) {
  try {
    if ((await api("GET", `/items/tag/${capo.tagId}`)).status === 200) {
      await Item.updateOne({ tagId: capo.tagId }, { $set: { dimostrativo: true } });
      contatori.saltati++;
      return;
    }
    const { dati } = await api("POST", "/items", capo);
    await attendiCapo(dati._id);
    // prima i passaggi e gli interventi in ordine cronologico: l'ancoraggio segue l'ordine di invio
    const voci = [
      ...passaggi.map((p) => ({ p, data: p.data })),
      ...eventi.map((e) => ({ e, data: e.data })),
    ].sort((a, b) => Date.parse(a.data) - Date.parse(b.data));
    for (const voce of voci) {
      if (voce.p) await api("POST", `/items/${dati._id}/proprieta`, voce.p);
      else await api("POST", `/items/${dati._id}/eventi`, voce.e);
      await attendiCapo(dati._id);
    }
    await Item.updateOne({ _id: dati._id }, { $set: { dimostrativo: true } });
    contatori.creati++;
  } catch (err) {
    contatori.errori++;
    console.error(colore.rosso(`  ✗ ${capo.tagId}: ${err.message}`));
  } finally {
    contatori.fatti++;
    if (contatori.fatti % 10 === 0 || contatori.fatti === archivio.length) {
      const secondi = Math.round((Date.now() - inizio) / 1000);
      console.log(`  ${contatori.fatti}/${archivio.length} capi elaborati (${secondi}s)`);
    }
  }
}

console.log(`Creo i capi (${parallelismo} alla volta)…`);
await Promise.all(Array.from({ length: parallelismo }, async () => {
  while (coda.length) await elabora(coda.shift());
}));

console.log("Attendo le conferme della blockchain…");
await attendiAncoraggi();

// Verifica di integrità: un campione (o tutti con --verifica-tutti) deve risultare "verificato"
const tag = archivio.map((c) => c.capo.tagId);
const campione = opzione("verifica-tutti") ? tag : tag.filter((_, i) => i % Math.ceil(tag.length / 25) === 0);
const esiti = {};
for (const t of campione) {
  const v = await api("GET", `/verify/${t}`);
  const stato = v.dati?.certificatoAutenticita?.integrita?.stato ?? `HTTP ${v.status}`;
  esiti[stato] = (esiti[stato] ?? 0) + 1;
}
const statistiche = (await api("GET", "/catalogo/statistiche")).dati;

console.log(`\nCapi creati: ${contatori.creati} · già presenti: ${contatori.saltati} · errori: ${contatori.errori}`);
console.log(`Verifica su ${campione.length} capi: ${Object.entries(esiti).map(([s, n]) => `${n} ${s}`).join(", ")}`);
console.log(`Catalogo pubblico: ${statistiche.capi} capi · ${statistiche.passaggi} passaggi · ${statistiche.interventi} interventi · ${statistiche.paesi.length} paesi`);
console.log(`Durata: ${Math.round((Date.now() - inizio) / 1000)} secondi`);
console.log(colore.verde("Fatto. Apri la web app → Catalogo per vederli."));

server.close();
await mongoose.disconnect();
process.exit(contatori.errori || Object.keys(esiti).some((s) => s !== "verificato") ? 1 : 0);
