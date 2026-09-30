// Compila RegenLuxuryPassport.sol con solc-js.
// Produce: RegenLuxuryPassport.json (abi + bytecode) e copia l'ABI nel backend.
// Uso: npm run compile
const solc = require("solc");
const fs = require("fs");
const path = require("path");

const source = fs.readFileSync(path.join(__dirname, "RegenLuxuryPassport.sol"), "utf8");
const input = {
  language: "Solidity",
  sources: { "RegenLuxuryPassport.sol": { content: source } },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    evmVersion: "cancun", // richiesto da OpenZeppelin 5.x (opcode mcopy); supportato da Polygon PoS
    outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
  },
};

function findImports(importPath) {
  try {
    return { contents: fs.readFileSync(path.join(__dirname, "node_modules", importPath), "utf8") };
  } catch {
    return { error: `Import non trovato: ${importPath}` };
  }
}

const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
for (const e of output.errors ?? []) console.log(e.severity.toUpperCase(), e.formattedMessage);
const c = output.contracts?.["RegenLuxuryPassport.sol"]?.RegenLuxuryPassport;
if (!c) process.exit(1);

fs.writeFileSync(
  path.join(__dirname, "RegenLuxuryPassport.json"),
  JSON.stringify({ abi: c.abi, bytecode: "0x" + c.evm.bytecode.object }, null, 2)
);
const abiBackend = path.join(__dirname, "..", "backend", "services", "blockchain", "RegenLuxuryPassport.abi.json");
if (fs.existsSync(path.dirname(abiBackend))) fs.writeFileSync(abiBackend, JSON.stringify({ abi: c.abi }, null, 2));
console.log("Compilazione OK -> RegenLuxuryPassport.json (ABI copiata anche nel backend)");
