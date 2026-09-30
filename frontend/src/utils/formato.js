export const TIPI_EVENTO = {
  riparazione: "Riparazione",
  upcycling: "Upcycling",
  sostituzione_parti: "Sostituzione di parti",
};

export const RUOLI = {
  admin: "Amministratore",
  brand_manager: "Brand manager",
  commerciante: "Commerciante",
  artigiano: "Artigiano",
};

export const CATEGORIE = ["giacca", "cappotto", "abito", "camicia", "t-shirt", "maglione", "pantaloni", "jeans", "gonna", "borsa", "scarpe", "accessorio", "altro"];
export const MATERIALI = ["cotone", "lana", "seta", "lino", "cashmere", "pelle", "denim", "poliestere", "nylon", "viscosa", "misto", "altro"];

export const data = (d) =>
  d ? new Date(d).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }) : "—";

export const dataOra = (d) =>
  d ? new Date(d).toLocaleString("it-IT", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

export const hashBreve = (h) => (h ? `${h.slice(0, 10)}…${h.slice(-6)}` : "—");

export const numero = (n, cifre = 1) => Number(n).toLocaleString("it-IT", { maximumFractionDigits: cifre });

export const maiuscola = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

// Estrae la destinazione da un QR o da un tag NFC letto
export function interpretaCodice(testo) {
  const valore = String(testo ?? "").trim();
  try {
    const url = new URL(valore);
    const v = url.pathname.match(/\/v\/([A-Za-z0-9_-]{3,64})\/?$/);
    if (v) return { tipo: "tag", tagId: decodeURIComponent(v[1]) };
    const e = url.searchParams.get("e");
    const c = url.searchParams.get("c");
    if (e && c) return { tipo: "sun", e, c };
  } catch {
    /* non è un URL */
  }
  if (/^[A-Za-z0-9_-]{3,64}$/.test(valore)) return { tipo: "tag", tagId: valore };
  return null;
}

// "3 minuti fa", "ieri", "2 settimane fa"
export function tempoFa(d) {
  if (!d) return "";
  const secondi = (new Date(d).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("it", { numeric: "auto" });
  const unita = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [nome, durata] of unita) {
    if (Math.abs(secondi) >= durata) return rtf.format(Math.round(secondi / durata), nome);
  }
  return "adesso";
}

// Iniziali del brand per il monogramma delle schede dell'armadio
export const iniziali = (testo = "") =>
  testo.trim().split(/\s+/).slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join("") || "?";

// Esito di una verifica → etichetta breve e colore
export const ESITO_BREVE = {
  verificato: { testo: "Autentico", classe: "ok" },
  in_attesa: { testo: "In registrazione", classe: "attesa" },
  incompleto: { testo: "Non conclusiva", classe: "attesa" },
  manomesso: { testo: "Dati alterati", classe: "ko" },
  non_registrato: { testo: "Non registrato", classe: "ko" },
  non_trovato: { testo: "Non trovato", classe: "ko" },
};
