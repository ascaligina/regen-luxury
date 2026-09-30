/*
 * Misura il gas di ogni operazione della piattaforma (dati per il Capitolo 6).
 * Esegue: deploy, registrazione di un capo, aggiornamento dati, evento di
 * rigenerazione, passaggio di proprietà e lettura pubblica.
 * Uso (con la chain locale avviata in un altro terminale: npm run chain):
 *   npm run misura-gas
 *   npm run misura-gas -- --gwei 30 --prezzo-pol 0.20      (stima dei costi in euro)
 * Il gas usato è lo stesso su Amoy e sulla rete principale Polygon (stessa EVM);
 * il COSTO dipende da prezzo del gas (gwei) e prezzo di POL: indicare valori con data e fonte.
 */
import { ethers } from "ethers";
import { readFileSync, writeFileSync } from "node:fs";

const argomento = (nome, predefinito) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > -1 ? process.argv[i + 1] : predefinito;
};
const rpc = argomento("rpc", "http://127.0.0.1:8545");
const gwei = argomento("gwei");
const prezzoPol = argomento("prezzo-pol");

const { abi, bytecode } = JSON.parse(readFileSync(new URL("./RegenLuxuryPassport.json", import.meta.url)));
const provider = new ethers.JsonRpcProvider(rpc);
const firmatario = await provider.getSigner(0);
const indirizzo = await firmatario.getAddress();
const h = (s) => ethers.id(s);

const misure = [];
const registra = async (operazione, promessaTx) => {
  const tx = await promessaTx;
  const r = await tx.wait();
  misure.push({ operazione, gas: Number(r.gasUsed) });
  return r;
};

const factory = new ethers.ContractFactory(abi, bytecode, firmatario);
const c = await factory.deploy(ethers.ZeroAddress, indirizzo);
const ricevutaDeploy = await c.deploymentTransaction().wait();
misure.push({ operazione: "Deploy del contratto (una tantum)", gas: Number(ricevutaDeploy.gasUsed) });

await registra("Registrazione di un capo (mint)", c.registerItem(indirizzo, h("NFC-GAS-1"), h("dati-v1")));
await registra("Registrazione di un secondo capo", c.registerItem(indirizzo, h("NFC-GAS-2"), h("dati-v1")));
await registra("Aggiornamento dati / archiviazione", c.updateDataHash(1, h("dati-v2")));
await registra("Evento di rigenerazione (primo)", c.recordRegeneration(1, h("evento-1")));
await registra("Evento di rigenerazione (successivo)", c.recordRegeneration(1, h("evento-2")));
await registra("Passaggio di proprietà", c.recordTransfer(1, h("passaggio-1")));

// Controlli di sicurezza del contratto
const [registrato, , dataHash, storico] = await c.recordByTag(h("NFC-GAS-1"));
console.assert(registrato && dataHash === h("dati-v2") && storico.length === 3, "lettura pubblica non coerente");
let duplicato = false;
try {
  await c.registerItem.staticCall(indirizzo, h("NFC-GAS-1"), h("x"));
} catch (err) {
  duplicato = err.revert?.name === "TagAlreadyRegistered";
}
console.assert(duplicato, "il tag duplicato doveva essere rifiutato");
const estraneo = ethers.Wallet.createRandom().connect(provider);
let negato = false;
try {
  await c.connect(estraneo).recordRegeneration.staticCall(1, h("x"));
} catch (err) {
  negato = err.revert?.name === "AccessControlUnauthorizedAccount";
}
console.assert(negato, "un account senza ruolo doveva essere rifiutato");

const righe = misure.map((m) => {
  const riga = { ...m };
  if (gwei && prezzoPol) {
    const costoPol = (m.gas * Number(gwei)) / 1e9;
    riga.costoPol = costoPol;
    riga.costoEuro = costoPol * Number(prezzoPol);
  }
  return riga;
});

console.log("\nGas per operazione (RegenLuxuryPassport, solc 0.8.24, optimizer 200 runs)\n");
for (const r of righe) {
  const costo = r.costoEuro !== undefined ? ` | ${r.costoPol.toFixed(6)} POL | ${r.costoEuro.toFixed(5)} EUR` : "";
  console.log(`${r.operazione.padEnd(40)} ${String(r.gas).padStart(9)} gas${costo}`);
}
console.log(`\nLettura pubblica recordByTag: 0 gas (chiamata di sola lettura)`);
console.log(`Controlli: tag duplicato rifiutato = ${duplicato}; account senza ruolo rifiutato = ${negato}`);
if (!gwei) console.log("Per stimare i costi: npm run misura-gas -- --gwei <prezzo gas> --prezzo-pol <euro per POL>");

const letturaCoerente = registrato && dataHash === h("dati-v2") && storico.length === 3;
writeFileSync(
  new URL("../docs/costi/misure-gas.json", import.meta.url),
  JSON.stringify({ data: new Date().toISOString(), rpc, gwei, prezzoPol, controlli: { letturaCoerente, duplicato, negato }, misure: righe }, null, 2)
);
console.log("Risultati salvati in docs/costi/misure-gas.json");

// Un controllo di sicurezza non superato deve far fallire lo script (codice di uscita 1)
if (!letturaCoerente || !duplicato || !negato) {
  console.error("CONTROLLI DI SICUREZZA NON SUPERATI");
  process.exitCode = 1;
}
