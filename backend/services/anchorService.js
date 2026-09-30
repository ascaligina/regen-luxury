/*
 * ANCORAGGIO SU BLOCKCHAIN (asincrono, requisito P)
 * -------------------------------------------------
 * Le API rispondono subito con stato "in_attesa"; la transazione viene inviata
 * in background e, alla conferma, il documento viene aggiornato a "confermato".
 * Le operazioni di uno stesso capo sono messe in coda e eseguite in ordine:
 * la registrazione precede sempre gli eventi, e l'ultima modifica dei dati è
 * sempre l'ultima impronta scritta on-chain.
 */
import Item from "../models/Item.js";
import { blockchain } from "./blockchain/index.js";
import { improntaCapo, improntaEvento, improntaPassaggio } from "./hashService.js";

const code = new Map(); // itemId -> Promise dell'ultima operazione in coda

function inCoda(itemId, operazione) {
  const chiave = String(itemId);
  const precedente = code.get(chiave) ?? Promise.resolve();
  const prossima = precedente.then(operazione, operazione).catch((err) => {
    console.error(`[ancoraggio] ${chiave}:`, err.message);
  });
  code.set(chiave, prossima);
  prossima.finally(() => {
    if (code.get(chiave) === prossima) code.delete(chiave);
  });
  return prossima;
}

// true se questo server ha una scrittura in corso per il capo (dato in memoria, non falsificabile dal database)
export const inLavorazione = (itemId) => code.has(String(itemId));

// Attende che tutte le operazioni in coda siano concluse (usato da test, script e spegnimento del server)
export async function attendiAncoraggi() {
  while (code.size > 0) await Promise.allSettled([...code.values()]);
}

const confermato = (hash, esito) => ({ stato: "confermato", hash, ...esito, aggiornatoIl: new Date() });
const fallito = (hash, err) => ({ stato: "fallito", hash, errore: err.message, aggiornatoIl: new Date() });

/**
 * Registra (nuovo = true) o aggiorna l'impronta dei dati del capo.
 * L'impronta è calcolata al momento dell'invio, sui dati più recenti.
 */
export function ancoraDatiCapo(itemId, { nuovo = false } = {}) {
  return inCoda(itemId, async () => {
    const chain = await blockchain();
    const item = await Item.findById(itemId);
    if (!item) return;
    const hash = improntaCapo(item);
    let esito;
    try {
      const registro = await chain.leggiRegistro(item.tagId);
      if (nuovo || !registro.registrato) {
        esito = confermato(hash, await chain.registraCapo({ tagId: item.tagId, dataHash: hash }));
      } else if (registro.dataHash !== hash) {
        esito = confermato(hash, await chain.aggiornaDatiCapo({ tagId: item.tagId, dataHash: hash }));
      } else {
        esito = { ...(item.registrazione?.toObject?.() ?? {}), stato: "confermato", hash, aggiornatoIl: new Date() };
      }
    } catch (err) {
      esito = fallito(hash, err);
    }
    const aggiornato = await Item.findById(itemId);
    if (!aggiornato) return;
    // Nel frattempo i dati sono stati modificati di nuovo: la loro scrittura è già in coda,
    // quindi non si segna "confermato" un'impronta ormai superata.
    if (improntaCapo(aggiornato) !== hash && aggiornato.registrazione?.stato === "in_attesa") return;
    aggiornato.registrazione = esito;
    if (esito.stato === "confermato" && !aggiornato.blockchainTxHash) aggiornato.blockchainTxHash = esito.txHash;
    await aggiornato.save();
  });
}

function ancoraVoce(itemId, voceId, { campo, improntaDi, invia }) {
  return inCoda(itemId, async () => {
    const chain = await blockchain();
    const item = await Item.findById(itemId);
    const voce = item?.[campo].id(voceId);
    if (!voce) return;
    const hash = improntaDi(voce);
    let esito;
    try {
      // Già presente on-chain (es. conferma persa per un riavvio): non si scrive due volte,
      // altrimenti il controllo di integrità troverebbe una voce in più sulla blockchain.
      const registro = await chain.leggiRegistro(item.tagId);
      if (registro.storico.includes(hash)) {
        esito = { ...(voce.ancoraggio?.toObject?.() ?? {}), stato: "confermato", hash, errore: undefined, aggiornatoIl: new Date() };
      } else {
        esito = confermato(hash, await invia(chain, { tagId: item.tagId, hash }));
      }
    } catch (err) {
      esito = fallito(hash, err);
    }
    const aggiornato = await Item.findById(itemId);
    const daAggiornare = aggiornato?.[campo].id(voceId);
    if (!daAggiornare) return;
    daAggiornare.ancoraggio = esito;
    await aggiornato.save();
  });
}

export const ancoraEvento = (itemId, eventoId) =>
  ancoraVoce(itemId, eventoId, {
    campo: "storicoRigenerazione",
    improntaDi: improntaEvento,
    invia: (chain, dati) => chain.registraEvento(dati),
  });

export const ancoraPassaggio = (itemId, passaggioId) =>
  ancoraVoce(itemId, passaggioId, {
    campo: "passaggiProprieta",
    improntaDi: improntaPassaggio,
    invia: (chain, dati) => chain.registraPassaggio(dati),
  });

/**
 * Ancora tutto ciò che non è ancora confermato (dati creati con la v1 del
 * backend, oppure transazioni fallite). Usato da "npm run migra".
 */
export async function ancoraArretrati(item) {
  const operazioni = [];
  if (item.registrazione?.stato !== "confermato") operazioni.push(ancoraDatiCapo(item._id));
  for (const e of item.storicoRigenerazione) {
    if (e.ancoraggio?.stato !== "confermato") operazioni.push(ancoraEvento(item._id, e._id));
  }
  for (const p of item.passaggiProprieta) {
    if (p.ancoraggio?.stato !== "confermato") operazioni.push(ancoraPassaggio(item._id, p._id));
  }
  await Promise.all(operazioni);
  return operazioni.length;
}
