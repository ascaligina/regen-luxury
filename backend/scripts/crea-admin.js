/*
 * Crea un account (di solito l'amministratore) oppure, se l'email esiste già,
 * ne reimposta la password. La password la scegli tu e non viene mai mostrata.
 * Uso:
 *   npm run crea-admin
 *   npm run crea-admin -- --email mario@boutique.it --nome "Mario Rossi" --ruolo commerciante
 *   npm run crea-admin -- --genera     # genera una password casuale e la mostra UNA volta
 */
import "dotenv/config";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB, spiegaErroreMongo } from "../config/db.js";
import User from "../models/User.js";
import { RUOLI } from "../models/costanti.js";
import { colore, chiedi } from "./_cli.js";

const LUNGHEZZA_MINIMA = 10; // stessa regola della web app
const argomento = (nome) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const esci = async (codice, messaggio) => {
  if (messaggio) console.error(colore.rosso(messaggio));
  await mongoose.disconnect().catch(() => {});
  process.exit(codice);
};

const ruolo = argomento("ruolo") ?? "admin";
if (!RUOLI.includes(ruolo)) await esci(1, `Ruolo non valido. Ruoli ammessi: ${RUOLI.join(", ")}`);

try {
  await connectDB();
} catch (err) {
  await esci(1, `Database non raggiungibile: ${spiegaErroreMongo(err)}`);
}

const email = (argomento("email") ?? (await chiedi("Email: "))).trim().toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) await esci(1, "Email non valida.");

const esistente = await User.findOne({ email });
if (esistente) {
  const risposta = await chiedi(`Esiste già l'account ${email} (${esistente.ruolo}). Vuoi reimpostarne la password? (s/n) `);
  if (!/^s/i.test(risposta)) await esci(0);
}
const nome = esistente ? esistente.nome : (argomento("nome") ?? (await chiedi("Nome e cognome: "))).trim();
if (!nome) await esci(1, "Il nome è obbligatorio.");

let password = argomento("password");
const generata = !password && process.argv.includes("--genera");
if (generata) password = crypto.randomBytes(12).toString("base64url");
for (let tentativo = 0; !password && tentativo < 3; tentativo++) {
  const prima = await chiedi(`Scegli la password dell'account (almeno ${LUNGHEZZA_MINIMA} caratteri, non verrà mostrata): `, { nascosto: true });
  if (prima.length < LUNGHEZZA_MINIMA) {
    console.log(colore.giallo(`Troppo corta: servono almeno ${LUNGHEZZA_MINIMA} caratteri.`));
    continue;
  }
  const seconda = await chiedi("Ripetila: ", { nascosto: true });
  if (prima !== seconda) {
    console.log(colore.giallo("Le due password non coincidono, riprova."));
    continue;
  }
  password = prima;
}
if (!password || password.length < LUNGHEZZA_MINIMA) await esci(1, "Nessuna password valida: account non modificato.");

const passwordHash = await bcrypt.hash(password, 12);
if (esistente) {
  esistente.passwordHash = passwordHash;
  await esistente.save();
  console.log(colore.verde(`\n✓ Password reimpostata per ${email} (ruolo: ${esistente.ruolo})`));
  if (!esistente.attivo) console.log(colore.giallo("Attenzione: l'account è disattivato (riattivalo dalla pagina Utenti)."));
} else {
  await User.create({ nome, email, ruolo, passwordHash });
  console.log(colore.verde(`\n✓ Account creato: ${email} (ruolo: ${ruolo})`));
}
if (generata) console.log(`Password generata: ${password}\nConservala ora: non verrà mostrata di nuovo.`);
console.log("Usa questa email e questa password per accedere alla web app e per npm run passaggi.\n");
await mongoose.disconnect();
