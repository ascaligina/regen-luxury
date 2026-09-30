// Accesso alle API del backend. Il token di accesso resta nel browser di chi usa l'area gestionale.
const BASE = (import.meta.env.VITE_API_URL || "") + "/api";
const CHIAVE_TOKEN = "regen.token";

export const token = {
  leggi: () => {
    try {
      return localStorage.getItem(CHIAVE_TOKEN);
    } catch {
      return null;
    }
  },
  salva: (t) => {
    try {
      localStorage.setItem(CHIAVE_TOKEN, t);
    } catch {
      /* navigazione privata: il login dura fino alla chiusura della pagina */
    }
  },
  cancella: () => {
    try {
      localStorage.removeItem(CHIAVE_TOKEN);
    } catch {
      /* niente da fare */
    }
  },
};

export class ErroreApi extends Error {
  constructor(status, dati) {
    super(dati?.errore ?? `Errore ${status}`);
    this.status = status;
    this.dati = dati;
  }
}

export async function api(percorso, { metodo = "GET", corpo, formato = "json" } = {}) {
  const t = token.leggi();
  let risposta;
  try {
    risposta = await fetch(BASE + percorso, {
      method: metodo,
      headers: {
        ...(corpo ? { "Content-Type": "application/json" } : {}),
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
      },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new ErroreApi(0, { errore: "Server non raggiungibile. Controlla la connessione." });
  }

  if (risposta.status === 401 && t) {
    token.cancella();
    window.dispatchEvent(new Event("regen:sessione-scaduta"));
  }
  if (formato === "blob" && risposta.ok) {
    const blob = await risposta.blob();
    // il QR code riporta nell'intestazione l'indirizzo che contiene
    return Object.assign(blob, { urlVerifica: risposta.headers.get("X-Url-Verifica") });
  }

  const testo = await risposta.text();
  let dati = null;
  try {
    dati = testo ? JSON.parse(testo) : null;
  } catch {
    dati = { errore: testo };
  }
  if (!risposta.ok) throw new ErroreApi(risposta.status, dati);
  return dati;
}

// Servizio AI opzionale: suggerisce il materiale principale da una foto del capo
export const AI_URL = import.meta.env.VITE_AI_URL || "";

export async function classificaFoto(file) {
  const dati = new FormData();
  dati.append("immagine", file);
  const r = await fetch(`${AI_URL}/classify`, { method: "POST", body: dati });
  if (!r.ok) throw new Error("Servizio AI non disponibile");
  return r.json();
}
