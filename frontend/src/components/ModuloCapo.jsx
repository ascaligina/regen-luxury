import { useState } from "react";
import { CATEGORIE, MATERIALI, maiuscola } from "../utils/formato.js";
import { AI_URL, classificaFoto } from "../services/api.js";

const VUOTO = { brand: "", codiceModello: "", materialiOriginari: "", filieraProvenienza: "", categoria: "", materialePrincipale: "", annoProduzione: "", tagId: "", proprietarioIniziale: "" };

// Modulo per creare (nuovo = true) o modificare i dati di un capo
export default function ModuloCapo({ iniziale = {}, nuovo = false, onInvia, inCorso, etichettaInvio }) {
  const [valori, setValori] = useState({ ...VUOTO, ...iniziale });
  const [suggerimento, setSuggerimento] = useState(null);
  const cambia = (campo) => (e) => setValori((v) => ({ ...v, [campo]: e.target.value }));

  const invia = (e) => {
    e.preventDefault();
    const dati = {};
    for (const [chiave, valore] of Object.entries(valori)) {
      if (!nuovo && (chiave === "tagId" || chiave === "proprietarioIniziale")) continue;
      if (valore === "" || valore === undefined || valore === null) {
        // in modifica, un campo facoltativo svuotato viene cancellato (null)
        if (!nuovo && iniziale[chiave] != null && iniziale[chiave] !== "") dati[chiave] = null;
        continue;
      }
      dati[chiave] = chiave === "annoProduzione" ? Number(valore) : typeof valore === "string" ? valore.trim() : valore;
    }
    onInvia(dati);
  };

  const suggerisciMateriale = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSuggerimento({ stato: "in_corso" });
    try {
      const r = await classificaFoto(file);
      setSuggerimento({ stato: "ok", ...r });
      if (r.materiale && MATERIALI.includes(r.materiale)) setValori((v) => ({ ...v, materialePrincipale: r.materiale }));
    } catch (err) {
      setSuggerimento({ stato: "errore", messaggio: err.message });
    }
  };

  return (
    <form className="modulo" onSubmit={invia}>
      {nuovo && (
        <label>
          Codice del tag (NFC/QR) *
          <input value={valori.tagId} onChange={cambia("tagId")} required pattern="[A-Za-z0-9_\-]{3,64}" placeholder="es. NFC-002" autoCapitalize="characters" />
          <small>Lettere, numeri, trattino. Non sarà più modificabile.</small>
        </label>
      )}
      <label>
        Brand *
        <input value={valori.brand} onChange={cambia("brand")} required maxLength={100} placeholder="es. Gucci" />
      </label>
      <label>
        Codice modello *
        <input value={valori.codiceModello} onChange={cambia("codiceModello")} required maxLength={100} placeholder="es. GG-2024" />
      </label>
      <label>
        Materiali originari *
        <input value={valori.materialiOriginari} onChange={cambia("materialiOriginari")} required maxLength={300} placeholder="es. Pelle e cotone" />
      </label>
      <div className="riga">
        <label>
          Categoria
          <select value={valori.categoria} onChange={cambia("categoria")}>
            <option value="">—</option>
            {CATEGORIE.map((c) => (
              <option key={c} value={c}>
                {maiuscola(c)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Materiale principale
          <select value={valori.materialePrincipale} onChange={cambia("materialePrincipale")}>
            <option value="">—</option>
            {MATERIALI.map((m) => (
              <option key={m} value={m}>
                {maiuscola(m)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {AI_URL && (
        <label className="riquadro-ai">
          Suggerisci il materiale da una foto (modulo AI)
          <input type="file" accept="image/*" capture="environment" onChange={suggerisciMateriale} />
          {suggerimento?.stato === "in_corso" && <small>Analisi della foto…</small>}
          {suggerimento?.stato === "ok" && (
            <small>
              Suggerito: <strong>{maiuscola(suggerimento.materiale)}</strong> (affidabilità {Math.round(suggerimento.confidenza * 100)}%). Controlla sempre l’etichetta del capo.
            </small>
          )}
          {suggerimento?.stato === "errore" && <small>{suggerimento.messaggio}</small>}
        </label>
      )}
      <div className="riga">
        <label>
          Filiera di provenienza
          <input value={valori.filieraProvenienza} onChange={cambia("filieraProvenienza")} maxLength={200} placeholder="es. Italia" />
        </label>
        <label>
          Anno di produzione
          <input type="number" value={valori.annoProduzione} onChange={cambia("annoProduzione")} min={1900} max={new Date().getFullYear()} />
        </label>
      </div>
      {nuovo && (
        <label>
          Primo proprietario (facoltativo)
          <input value={valori.proprietarioIniziale} onChange={cambia("proprietarioIniziale")} maxLength={100} placeholder="es. Boutique Vintage Bari" />
        </label>
      )}
      <button className="pulsante" disabled={inCorso}>
        {inCorso ? "Salvataggio…" : etichettaInvio}
      </button>
    </form>
  );
}
