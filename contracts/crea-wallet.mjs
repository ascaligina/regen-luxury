// Crea un wallet DI TEST per la piattaforma e salva la chiave privata nel file .env
// (la chiave non viene mai stampata a schermo). Mostra solo l'indirizzo pubblico,
// da incollare nel faucet di Polygon Amoy per ricevere POL di prova.
// Uso: npm run crea-wallet
import fs from "node:fs";
import { Wallet } from "ethers";

const file = new URL("./.env", import.meta.url);
let contenuto = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : fs.readFileSync(new URL("./.env.example", import.meta.url), "utf8");

const esistente = contenuto.match(/^PLATFORM_PRIVATE_KEY=(0x[0-9a-fA-F]{64})\s*$/m);
if (esistente) {
  console.log("Wallet già presente nel file .env. Indirizzo:", new Wallet(esistente[1]).address);
  process.exit(0);
}

const wallet = Wallet.createRandom();
contenuto = /^PLATFORM_PRIVATE_KEY=.*$/m.test(contenuto)
  ? contenuto.replace(/^PLATFORM_PRIVATE_KEY=.*$/m, `PLATFORM_PRIVATE_KEY=${wallet.privateKey}`)
  : `${contenuto.trimEnd()}\nPLATFORM_PRIVATE_KEY=${wallet.privateKey}\n`;
fs.writeFileSync(file, contenuto, { mode: 0o600 });

console.log("Wallet di test creato. Chiave privata salvata in contracts/.env (non condividerla).");
console.log("Indirizzo pubblico:", wallet.address);
console.log("Prossimo passo: chiedi POL di prova per questo indirizzo al faucet di Polygon Amoy.");
