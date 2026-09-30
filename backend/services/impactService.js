/*
 * STIMA DELL'IMPATTO AMBIENTALE EVITATO (dashboard di sostenibilità)
 * ------------------------------------------------------------------
 * Un capo rigenerato evita (in parte) l'acquisto di un capo nuovo equivalente.
 * Impatto evitato = impatto di produzione del capo nuovo x fattore di sostituzione.
 * I coefficienti e le fonti sono nel file data/coefficienti-lca.json: ogni
 * numero mostrato all'utente è tracciabile a una fonte citabile in tesi.
 * Per le categorie senza dati affidabili NON si inventano valori: la stima
 * risulta "non disponibile".
 */
import { readFileSync } from "node:fs";

const tabella = JSON.parse(readFileSync(new URL("../data/coefficienti-lca.json", import.meta.url), "utf8"));

const arrotonda = (n, cifre = 1) => Math.round(n * 10 ** cifre) / 10 ** cifre;

export function calcolaImpattoAmbientale(item) {
  const coeff = item.categoria ? tabella.categorie[item.categoria] : undefined;
  if (!coeff) {
    return {
      disponibile: false,
      nota: item.categoria
        ? `Stima non disponibile per la categoria "${item.categoria}": mancano coefficienti LCA da fonte citabile.`
        : "Stima non disponibile: categoria del capo non indicata.",
    };
  }
  const { valore, intervallo } = tabella.fattoreSostituzione;
  return {
    disponibile: true,
    co2RisparmiataKg: arrotonda(coeff.co2Kg * valore),
    acquaPreservataLitri: Math.round(coeff.acquaL * valore),
    intervallo: {
      co2Kg: intervallo.map((f) => arrotonda(coeff.co2Kg * f)),
      acquaL: intervallo.map((f) => Math.round(coeff.acquaL * f)),
    },
    categoria: item.categoria,
    metodo: `Impatto di produzione di un capo nuovo equivalente x fattore di sostituzione ${valore}`,
    unitaFunzionale: coeff.unitaFunzionale,
    fonti: [coeff.fonte, tabella.fattoreSostituzione.fonte],
    verificato: coeff.verificato,
    nota: "Valori stimati da letteratura LCA (ISO 14040/14044): sono stime, non misure sul singolo capo.",
  };
}

export const categorieConStima = () => Object.keys(tabella.categorie);
