/*
 * Copia negli appunti la stringa di connessione MONGO_URI del file .env,
 * senza mostrarla sullo schermo (serve per incollarla nel pannello di Render).
 * Uso:  npm run copia-db
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { colore } from "./_cli.js";

const fileEnv = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env");
const uri = fs.existsSync(fileEnv) ? dotenv.parse(fs.readFileSync(fileEnv)).MONGO_URI : undefined;
if (!uri || uri.includes("<") || uri.includes("xxxxx")) {
  console.error(colore.rosso("MONGO_URI mancante nel file .env: esegui prima npm run imposta-db"));
  process.exit(1);
}

const comando = { darwin: ["pbcopy", []], win32: ["clip", []] }[process.platform] ?? ["xclip", ["-selection", "clipboard"]];
const figlio = spawn(comando[0], comando[1], { stdio: ["pipe", "ignore", "ignore"] });
figlio.on("error", () => {
  console.error(colore.rosso("Non riesco a usare gli appunti: apri backend/.env e copia a mano il valore dopo MONGO_URI="));
  process.exit(1);
});
figlio.on("close", (codice) => {
  if (codice !== 0) return;
  console.log(colore.verde("✓ Stringa di connessione copiata negli appunti (non viene mostrata)."));
  console.log("Incollala con Cmd+V nel campo MONGO_URI di Render. Non incollarla in chat.");
});
figlio.stdin.end(uri);
