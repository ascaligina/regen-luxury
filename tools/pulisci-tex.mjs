// pulisci-tex.mjs - Ripulisce un file .tex dagli artefatti Unicode del copia-incolla
// dalla chat (spazi invisibili, pedici/apici Unicode, % non escapati, ecc.).
//
// Uso (serve solo Node.js, già installato per il backend):
//   node tools/pulisci-tex.mjs capitolo2.tex
// -> crea "capitolo2.pulito.tex" accanto all'originale e stampa un report.
//    L'originale NON viene modificato: controlla il risultato e poi sostituiscilo.
import { readFileSync, writeFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Uso: node tools/pulisci-tex.mjs <file.tex>');
  process.exit(1);
}

let text = readFileSync(file, 'utf8');
const report = [];
const count = (re) => (text.match(re) || []).length;

function sostituisci(descrizione, re, replacement) {
  const n = count(re);
  if (n > 0) {
    text = text.replace(re, replacement);
    report.push(`${String(n).padStart(4)}  ${descrizione}`);
  }
}

// 1) caratteri invisibili (zero-width, BOM, soft hyphen, word joiner)
sostituisci('caratteri invisibili rimossi (U+200B/C/D, U+2060, U+FEFF, U+00AD)', /[\u200B\u200C\u200D\u2060\uFEFF\u00AD]/g, '');
// 2) spazi non standard -> spazio normale
sostituisci('spazi speciali convertiti (NBSP, narrow NBSP, thin space...)', /[\u00A0\u202F\u2007\u2009\u200A]/g, ' ');
// 3) pedici e apici Unicode -> comandi LaTeX
const pedici = '₀₁₂₃₄₅₆₇₈₉';
const apici = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
sostituisci('pedici Unicode -> \\textsubscript{} (es. CO₂)', /[₀-₉]+/g, (m) =>
  `\\textsubscript{${[...m].map((c) => pedici.indexOf(c)).join('')}}`);
sostituisci('apici Unicode -> \\textsuperscript{} (es. m²)', /[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) =>
  `\\textsuperscript{${[...m].map((c) => apici[c]).join('')}}`);
// 4) percentuali non escapate dopo un numero ("99,95%" commenterebbe il resto della riga!)
sostituisci('simboli % dopo un numero escapati in \\%', /(\d)\s?(?<!\\)%/g, '$1\\%');
// 5) spazi multipli e spazi a fine riga
sostituisci('spazi a fine riga rimossi', /[ \t]+$/gm, '');

// --- solo segnalazioni (da correggere a mano) ---
const warnings = [];
text.split('\n').forEach((riga, i) => {
  const n = i + 1;
  if (/^\s*[●•▪◦]/.test(riga)) warnings.push(`riga ${n}: elenco puntato "●" -> usare \\begin{itemize} \\item ...`);
  if (/(?<!\\)&/.test(riga) && !/tabular|align|\\\\\s*$/.test(riga)) warnings.push(`riga ${n}: "&" non escapato (fuori da tabelle usare \\&)`);
  if (/(?<!\\)[#](?!\d)/.test(riga)) warnings.push(`riga ${n}: "#" non escapato (usare \\#)`);
  const strani = riga.match(/[^\x00-\x7F\u00C0-\u017F“”‘’–—…«»°€]/gu);
  if (strani) warnings.push(`riga ${n}: caratteri da verificare: ${[...new Set(strani)].join(' ')}`);
});

const out = file.replace(/\.tex$/i, '') + '.pulito.tex';
writeFileSync(out, text, 'utf8');

console.log(`File pulito: ${out}\n`);
console.log(report.length ? 'Correzioni automatiche:\n' + report.join('\n') : 'Nessuna correzione automatica necessaria.');
console.log(warnings.length ? `\nDa controllare a mano (${warnings.length}):\n` + warnings.map((w) => '  - ' + w).join('\n') : '\nNessuna segnalazione.');
