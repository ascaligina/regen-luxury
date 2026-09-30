/*
 * SERVIZIO BLOCKCHAIN REALE — smart contract RegenLuxuryPassport via ethers.js
 * Stessa interfaccia del registro simulato. Reti supportate: Polygon Amoy
 * (testnet) o una chain locale Hardhat (npm run chain nella cartella contracts).
 * La piattaforma firma e paga le transazioni: commercianti e acquirenti non
 * hanno bisogno di wallet né di criptovaluta (vincolo RC-5).
 */
import { ethers } from "ethers";
import { readFileSync } from "node:fs";
import { improntaTag } from "../hashService.js";

const { abi } = JSON.parse(readFileSync(new URL("./RegenLuxuryPassport.abi.json", import.meta.url)));

const RETE = process.env.CHAIN_NAME ?? "polygon-amoy";
const rpc = process.env.POLYGON_RPC_URL ?? "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(rpc);

async function creaFirmatario() {
  if (process.env.PLATFORM_PRIVATE_KEY) {
    return new ethers.NonceManager(new ethers.Wallet(process.env.PLATFORM_PRIVATE_KEY, provider));
  }
  // Chain locale Hardhat: gli account di test sono già sbloccati sul nodo
  if (/127\.0\.0\.1|localhost/.test(rpc)) return new ethers.NonceManager(await provider.getSigner(0));
  throw new Error("PLATFORM_PRIVATE_KEY mancante nel file .env");
}

let contrattoPromise;
let firmatario;
function contratto() {
  if (!contrattoPromise) {
    if (!process.env.CONTRACT_ADDRESS) throw new Error("CONTRACT_ADDRESS mancante nel file .env");
    contrattoPromise = creaFirmatario()
      .then((f) => {
        firmatario = f;
        return new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, f);
      })
      .catch((err) => {
        contrattoPromise = undefined; // es. nodo non ancora avviato: si riprova alla prossima richiesta
        throw err;
      });
  }
  return contrattoPromise;
}

// Le transazioni partono una alla volta: con un solo firmatario i nonce restano in
// sequenza. Se un invio fallisce (revert, errore della rete) il NonceManager viene
// riallineato con la rete, altrimenti resterebbe un "buco" e le transazioni
// successive non verrebbero mai confermate. Un solo server deve usare la stessa chiave.
const ATTESA_MAX_MS = Number(process.env.TX_TIMEOUT_MS ?? 120_000);
let codaInvii = Promise.resolve();

function invia(prepara) {
  const esegui = async () => {
    try {
      const tx = await prepara();
      const ricevuta = await tx.wait(1, ATTESA_MAX_MS);
      return { txHash: ricevuta.hash, blocco: ricevuta.blockNumber, rete: RETE, gasUsato: Number(ricevuta.gasUsed) };
    } catch (err) {
      firmatario?.reset?.();
      throw err;
    }
  };
  const risultato = codaInvii.then(esegui, esegui);
  codaInvii = risultato.catch(() => {});
  return risultato;
}

async function tokenDi(c, tagId) {
  const tokenId = await c.tokenByTag(improntaTag(tagId));
  if (tokenId === 0n) {
    throw Object.assign(new Error(`Tag ${tagId} non registrato on-chain`), { codice: "TAG_NON_REGISTRATO" });
  }
  return tokenId;
}

export default {
  nome: RETE,

  async registraCapo({ tagId, dataHash }) {
    const c = await contratto();
    return invia(async () => c.registerItem(await c.runner.getAddress(), improntaTag(tagId), dataHash));
  },

  async aggiornaDatiCapo({ tagId, dataHash }) {
    const c = await contratto();
    return invia(async () => c.updateDataHash(await tokenDi(c, tagId), dataHash));
  },

  async registraEvento({ tagId, hash }) {
    const c = await contratto();
    return invia(async () => c.recordRegeneration(await tokenDi(c, tagId), hash));
  },

  async registraPassaggio({ tagId, hash }) {
    const c = await contratto();
    return invia(async () => c.recordTransfer(await tokenDi(c, tagId), hash));
  },

  async leggiRegistro(tagId) {
    const c = await contratto();
    const [registrato, tokenId, dataHash, storico] = await c.recordByTag(improntaTag(tagId));
    return {
      registrato,
      tokenId: registrato ? Number(tokenId) : null,
      dataHash: registrato ? dataHash : null,
      storico: registrato ? [...storico] : [],
    };
  },
};
