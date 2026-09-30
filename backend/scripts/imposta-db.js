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
