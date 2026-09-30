/*
 * "Il tuo armadio" e "Storico delle verifiche" del consumatore.
 * Restano SOLO nel browser di questo dispositivo (localStorage): nessun account,
 * nessun dato inviato al server — coerente con il requisito U (accesso pubblico
 * senza registrazione) e con la minimizzazione dei dati personali (GDPR).
 */
import { useSyncExternalStore } from "react";

const CHIAVI = { armadio: "regen.armadio", storico: "regen.storico" };
const MAX_STORICO = 30;
const ascoltatori = new Set();
const cache = {};

function leggi(nome) {
  if (!(nome in cache)) {
    try {
      const valore = JSON.parse(localStorage.getItem(CHIAVI[nome]) ?? "[]");
      cache[nome] = Array.isArray(valore) ? valore : [];
    } catch {
      cache[nome] = [];
    }
  }
  return cache[nome];
}

function scrivi(nome, elenco) {
  cache[nome] = elenco;
  try {
    localStorage.setItem(CHIAVI[nome], JSON.stringify(elenco));
  } catch {
    /* navigazione privata o spazio pieno: resta in memoria per questa sessione */
  }
  ascoltatori.forEach((f) => f());
}

// Aggiornamento anche se l'armadio cambia in un'altra scheda del browser
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    const nome = Object.keys(CHIAVI).find((k) => CHIAVI[k] === e.key);
    if (nome) {
      delete cache[nome];
      ascoltatori.forEach((f) => f());
    }
  });
}

const iscriviti = (f) => {
  ascoltatori.add(f);
  return () => ascoltatori.delete(f);
};

// Riassunto del capo dai dati del certificato (solo ciò che serve a riconoscerlo)
export function riassuntoCapo(dati) {
  const { capo, certificatoAutenticita: cert, impattoAmbientale: imp } = dati;
  return {
    tagId: capo.tagId,
    brand: capo.brand,
    codiceModello: capo.codiceModello,
    categoria: capo.categoria ?? null,
    materialePrincipale: capo.materialePrincipale ?? null,
    annoProduzione: capo.annoProduzione ?? null,
    esito: cert?.integrita?.stato ?? "non_registrato",
    co2Kg: imp?.disponibile ? imp.co2RisparmiataKg : null,
    acquaL: imp?.disponibile ? imp.acquaPreservataLitri : null,
  };
}

// --- Storico delle verifiche ---
export function registraVerifica(voce) {
  const precedente = leggi("storico").find((v) => v.tagId === voce.tagId);
  const nuova = { ...precedente, ...voce, volte: (precedente?.volte ?? 0) + 1, data: new Date().toISOString() };
  scrivi("storico", [nuova, ...leggi("storico").filter((v) => v.tagId !== voce.tagId)].slice(0, MAX_STORICO));
}
export const svuotaStorico = () => scrivi("storico", []);
export const useStorico = () => useSyncExternalStore(iscriviti, () => leggi("storico"), () => []);

// --- Armadio ---
export function aggiungiAllArmadio(capo) {
  const altri = leggi("armadio").filter((c) => c.tagId !== capo.tagId);
  scrivi("armadio", [{ ...capo, aggiuntoIl: new Date().toISOString() }, ...altri]);
}
export const rimuoviDallArmadio = (tagId) => scrivi("armadio", leggi("armadio").filter((c) => c.tagId !== tagId));
export const useArmadio = () => useSyncExternalStore(iscriviti, () => leggi("armadio"), () => []);
// Dopo una nuova verifica aggiorna esito e impatto del capo, se è nell'armadio
export function aggiornaNellArmadio(capo) {
  const elenco = leggi("armadio");
  if (!elenco.some((c) => c.tagId === capo.tagId)) return;
  scrivi("armadio", elenco.map((c) => (c.tagId === capo.tagId ? { ...c, ...capo, aggiuntoIl: c.aggiuntoIl } : c)));
}
