/*
 * SERVIZIO BLOCKCHAIN — punto di accesso unico.
 * Il resto del backend usa solo queste funzioni, qualunque sia la rete:
 *   registraCapo, aggiornaDatiCapo, registraEvento, registraPassaggio, leggiRegistro
 * BLOCKCHAIN_MODE=mock    -> registro simulato su file (nessun costo, nessun wallet)
 * BLOCKCHAIN_MODE=polygon -> smart contract RegenLuxuryPassport via ethers.js
 * Sostituire la rete non richiede di toccare i controller (requisito S).
 */
let implementazione;

export async function blockchain() {
  if (!implementazione) {
    const modo = process.env.BLOCKCHAIN_MODE ?? "mock";
    const modulo = modo === "polygon" ? await import("./polygon.js") : await import("./mockLedger.js");
    implementazione = modulo.default;
  }
  return implementazione;
}

// Solo per i test: forza una nuova selezione dell'implementazione
export function reimpostaBlockchain() {
  implementazione = undefined;
}
