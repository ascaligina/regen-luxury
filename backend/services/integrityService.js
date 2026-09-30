/*
 * CONTROLLO DI INTEGRITÀ (database <-> blockchain)
 * ------------------------------------------------
 * Ricalcola le impronte dei dati presenti nel database e le confronta con
 * quelle lette dal registro on-chain. Se qualcuno modifica o cancella un dato
 * nel database, l'impronta ricalcolata non coincide e il capo risulta
 * "manomesso": la blockchain non impedisce la modifica del database, ma la
 * rende RILEVABILE.
 *
 * Solo lo stato "verificato" certifica l'autenticità. Gli stati di attesa o di
 * scrittura fallita sono scritti nel database, quindi potrebbero essere falsificati
 * insieme ai dati: per questo non producono mai "autentico" e un'attesa è
 * considerata credibile solo se la scrittura è in corso su questo server oppure
 * è iniziata da poco (FINESTRA_ATTESA_MS). Altrimenti la verifica è "non conclusiva".
 */
import { blockchain } from "./blockchain/index.js";
import { inLavorazione } from "./anchorService.js";
import { improntaCapo, improntaEvento, improntaPassaggio } from "./hashService.js";

const finestraAttesa = () => Number(process.env.FINESTRA_ATTESA_MS ?? 10 * 60_000);

export const ESITI = {
  verificato: "Tutti i dati coincidono con quelli ancorati sulla blockchain",
  in_attesa: "Registrazione sulla blockchain in corso: la verifica sarà completa tra pochi istanti",
  incompleto: "Verifica non conclusiva: alcuni dati non risultano ancorati sulla blockchain",
  manomesso: "I dati non coincidono con quelli ancorati: possibile manomissione",
  non_registrato: "Il capo non risulta registrato sulla blockchain",
};

function attesaCredibile(item, ancoraggio) {
  if (ancoraggio?.stato !== "in_attesa") return false;
  if (inLavorazione(item._id)) return true;
  const riferimento = ancoraggio.aggiornatoIl ?? item.updatedAt;
  return riferimento ? Date.now() - new Date(riferimento).getTime() < finestraAttesa() : false;
}

export async function verificaIntegrita(item) {
  const chain = await blockchain();
  const registro = await chain.leggiRegistro(item.tagId);
  const registrazione = item.registrazione;

  if (!registro.registrato) {
    const stato = attesaCredibile(item, registrazione) ? "in_attesa" : "non_registrato";
    return { stato, messaggio: ESITI[stato], rete: chain.nome, datiCapo: stato, voci: null };
  }

  // 1) Dati identificativi del capo
  let datiCapo = "verificati";
  if (registro.dataHash !== improntaCapo(item)) {
    if (attesaCredibile(item, registrazione)) datiCapo = "in_attesa";
    else if (["in_attesa", "fallito"].includes(registrazione?.stato)) datiCapo = "non_ancorati";
    else datiCapo = "diversi"; // registrazione confermata ma dati diversi: manomissione
  }

  // 2) Storico: ogni voce del database deve comparire on-chain (e viceversa)
  const disponibili = new Map();
  for (const h of registro.storico) disponibili.set(h, (disponibili.get(h) ?? 0) + 1);

  const voci = { verificate: 0, inAttesa: 0, nonAncorate: 0, alterate: [], soloOnChain: 0 };
  const controlla = (tipo, voce, hash) => {
    const n = disponibili.get(hash) ?? 0;
    if (n > 0) {
      disponibili.set(hash, n - 1);
      voci.verificate += 1;
    } else if (attesaCredibile(item, voce.ancoraggio)) {
      voci.inAttesa += 1;
    } else if (voce.ancoraggio?.stato === "confermato") {
      voci.alterate.push({ tipo, id: String(voce._id) }); // confermata ma impronta diversa
    } else {
      voci.nonAncorate += 1; // mai ancorata, scrittura fallita o attesa scaduta
    }
  };
  item.storicoRigenerazione.forEach((e) => controlla("evento", e, improntaEvento(e)));
  item.passaggiProprieta.forEach((p) => controlla("passaggio", p, improntaPassaggio(p)));
  voci.soloOnChain = [...disponibili.values()].reduce((a, b) => a + b, 0); // voci cancellate dal DB

  let stato = "verificato";
  if (datiCapo === "diversi" || voci.alterate.length > 0 || voci.soloOnChain > 0) stato = "manomesso";
  else if (datiCapo === "in_attesa" || voci.inAttesa > 0) stato = "in_attesa";
  else if (datiCapo === "non_ancorati" || voci.nonAncorate > 0) stato = "incompleto";

  return { stato, messaggio: ESITI[stato], rete: chain.nome, tokenId: registro.tokenId, datiCapo, voci };
}
