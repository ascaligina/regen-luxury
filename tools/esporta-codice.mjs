// Esporta tutto il codice del progetto in un unico file Markdown (da allegare all'HandOff o a una chat).
// Funziona su Mac, Windows e Linux:   node tools/esporta-codice.mjs [cartella] [file-di-uscita]
// Esclude dipendenze, build, credenziali (.env), file binari e lockfile.
import fs from "node:fs";
import path from "node:path";

const radice = path.resolve(process.argv[2] ?? ".");
const uscita = path.resolve(process.argv[3] ?? "docs/codice-completo.md");
const escluseCartelle = new Set(["node_modules", ".git", "dist", "build", "cache", "artifacts", ".venv", "__pycache__", "schermate", ".pytest_cache"]);
const escluso = (completo) => /ai-module[\\/](data|models)([\\/]|$)/.test(completo);
const esclusiFile = new Set([".env", "package-lock.json", "misure-gas.json", "RegenLuxuryPassport.json", "RegenLuxuryPassport.abi.json", "Handoff.md", path.basename(uscita)]);
const linguaggi = { ".js": "javascript", ".mjs": "javascript", ".cjs": "javascript", ".jsx": "jsx", ".json": "json", ".sol": "solidity", ".py": "python", ".ps1": "powershell", ".md": "markdown", ".css": "css", ".html": "html", ".yaml": "yaml", ".yml": "yaml", ".puml": "plantuml", ".bib": "bibtex", ".jsonc": "jsonc", ".txt": "text", ".example": "bash", ".ipynb": "json", ".svg": "xml" };

function* file(dir) {
  for (const voce of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const completo = path.join(dir, voce.name);
    if (voce.isDirectory()) {
      if (!escluseCartelle.has(voce.name) && !escluso(completo)) yield* file(completo);
    } else if (!esclusiFile.has(voce.name) && (linguaggi[path.extname(voce.name)] || voce.name === ".gitignore")) {
      yield completo;
    }
  }
}

const elenco = [...file(radice)].filter((f) => path.resolve(f) !== uscita);
const parti = [`# Codice completo del progetto\n\nEsportato il ${new Date().toLocaleString("it-IT")} da \`${path.basename(radice)}\` — ${elenco.length} file.\n\n## Indice\n`];
for (const f of elenco) parti.push(`- \`${path.relative(radice, f)}\``);
for (const f of elenco) {
  const contenuto = fs.readFileSync(f, "utf8").trimEnd();
  const recinto = "`".repeat(Math.max(3, ...[...contenuto.matchAll(/`+/g)].map((m) => m[0].length + 1)));
  parti.push(`\n## \`${path.relative(radice, f)}\`\n\n${recinto}${linguaggi[path.extname(f)] ?? ""}\n${contenuto}\n${recinto}`);
}
fs.mkdirSync(path.dirname(uscita), { recursive: true });
fs.writeFileSync(uscita, parti.join("\n") + "\n");
console.log(`Esportati ${elenco.length} file in ${path.relative(process.cwd(), uscita)}`);
