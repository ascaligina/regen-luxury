/*
 * Requisito P: il recupero dei dati del capo alla scansione deve richiedere meno di 2 secondi.
 * Misura il tempo di risposta della verifica pubblica su N richieste.
 * Uso: npm run misura-tempi -- --tag NFC-001 --n 50
 * (il limite predefinito è 120 verifiche al minuto per IP: non superare --n 100)
 */
import "dotenv/config";
import { colore } from "./_cli.js";

const argomento = (nome, predefinito) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > -1 ? process.argv[i + 1] : predefinito;
};
const BASE = argomento("base", `http://localhost:${process.env.PORT ?? 5001}/api`);
const TAG = argomento("tag", "NFC-001");
const N = Number(argomento("n", 50));

const tempi = [];
for (let i = 0; i < N; i++) {
  const inizio = performance.now();
  const r = await fetch(`${BASE}/verify/${TAG}`);
  await r.arrayBuffer();
  if (!r.ok) {
    console.error(colore.rosso(`Richiesta ${i + 1}: HTTP ${r.status}`));
    process.exit(1);
  }
  tempi.push(performance.now() - inizio);
}
tempi.sort((a, b) => a - b);
const media = tempi.reduce((a, b) => a + b, 0) / tempi.length;
const p95 = tempi[Math.ceil(0.95 * tempi.length) - 1];
console.log(`Richieste: ${N} su ${BASE}/verify/${TAG}`);
console.log(`Media: ${media.toFixed(1)} ms | Min: ${tempi[0].toFixed(1)} ms | Max: ${tempi.at(-1).toFixed(1)} ms | 95° percentile: ${p95.toFixed(1)} ms`);
console.log(tempi.at(-1) < 2000 ? colore.verde("Requisito P rispettato (tutte le risposte < 2000 ms)") : colore.rosso("Almeno una risposta ha superato i 2000 ms"));
