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
