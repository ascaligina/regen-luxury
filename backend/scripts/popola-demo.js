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
