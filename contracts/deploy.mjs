// Deploy di RegenLuxuryPassport.
//  - Chain locale (npm run chain):  POLYGON_RPC_URL=http://127.0.0.1:8545  (nessuna chiave necessaria)
//  - Polygon Amoy (testnet):         POLYGON_RPC_URL + PLATFORM_PRIVATE_KEY nel file .env
// Uso: npm run deploy
import "dotenv/config";
import { ethers } from "ethers";
import { readFileSync } from "node:fs";

const { abi, bytecode } = JSON.parse(readFileSync(new URL("./RegenLuxuryPassport.json", import.meta.url)));
const rpc = process.env.POLYGON_RPC_URL ?? "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(rpc);

const locale = /127\.0\.0\.1|localhost/.test(rpc);
const firmatario = process.env.PLATFORM_PRIVATE_KEY
  ? new ethers.Wallet(process.env.PLATFORM_PRIVATE_KEY, provider)
  : locale
    ? await provider.getSigner(0)
    : null;
if (!firmatario) {
  console.error("PLATFORM_PRIVATE_KEY mancante: esegui prima 'npm run crea-wallet'.");
  process.exit(1);
}

const indirizzo = await firmatario.getAddress();
const saldo = await provider.getBalance(indirizzo);
const rete = await provider.getNetwork();
console.log(`Rete: chainId ${rete.chainId} | account: ${indirizzo} | saldo: ${ethers.formatEther(saldo)} POL`);
if (saldo === 0n) {
  console.error("Saldo zero: richiedi POL di prova al faucet di Amoy e riprova.");
  process.exit(1);
}

const forwarder = process.env.TRUSTED_FORWARDER || ethers.ZeroAddress; // nessun forwarder = solo tx dirette
const contratto = await new ethers.ContractFactory(abi, bytecode, firmatario).deploy(forwarder, indirizzo);
const ricevuta = await contratto.deploymentTransaction().wait();

console.log("Contratto deployato a:", await contratto.getAddress());
console.log(`Gas usato per il deploy: ${ricevuta.gasUsed}`);
console.log("Copia l'indirizzo in CONTRACT_ADDRESS nel file backend/.env e imposta BLOCKCHAIN_MODE=polygon");
