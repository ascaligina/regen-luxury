import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import Ancoraggio from "../components/Ancoraggio.jsx";
import { Caricamento, Errore } from "../components/Stato.jsx";
import { RUOLI, data } from "../utils/formato.js";

export default function DashboardPage() {
  const { utente, puo } = useAuth();
  const [parametri, setParametri] = useSearchParams();
  const q = parametri.get("q") ?? "";
  const stato = parametri.get("stato") ?? "";
  const pagina = Number(parametri.get("pagina") ?? 1);
  const [ricerca, setRicerca] = useState(q);
  const [risultato, setRisultato] = useState({ caricamento: true });

  useEffect(() => {
    const query = new URLSearchParams({ pagina: String(pagina), perPagina: "10" });
    if (q) query.set("q", q);
    if (stato) query.set("stato", stato);
    setRisultato((r) => ({ ...r, caricamento: true }));
    api(`/items?${query}`)
      .then((dati) => setRisultato({ dati }))
      .catch((errore) => setRisultato({ errore }));
  }, [q, stato, pagina]);

  const aggiorna = (nuovi) => {
    const p = new URLSearchParams(parametri);
    for (const [k, v] of Object.entries(nuovi)) v ? p.set(k, v) : p.delete(k);
    setParametri(p);
  };

  return (
    <section>
      <div className="intestazione-sezione">
        <div>
          <p className="sopratitolo">
            {utente.nome} · {RUOLI[utente.ruolo]}
          </p>
          <h1>Capi registrati</h1>
        </div>
        <div className="azioni">
          {puo("brand_manager", "commerciante") && (
            <Link to="/gestione/nuovo" className="pulsante">
              Nuovo capo
            </Link>
          )}
          {puo("admin") && (
            <Link to="/gestione/utenti" className="pulsante pulsante-secondario">
              Utenti
            </Link>
          )}
          <Link to="/gestione/account" className="pulsante pulsante-secondario">
            Account
          </Link>
        </div>
      </div>

      <form
        className="modulo modulo-in-linea"
        onSubmit={(e) => {
          e.preventDefault();
          aggiorna({ q: ricerca.trim(), pagina: "" });
        }}
      >
        <input value={ricerca} onChange={(e) => setRicerca(e.target.value)} placeholder="Cerca per brand, modello o tag" aria-label="Cerca" />
        <select value={stato} onChange={(e) => aggiorna({ stato: e.target.value, pagina: "" })} aria-label="Stato">
          <option value="">Tutti</option>
          <option value="attivo">Attivi</option>
          <option value="archiviato">Archiviati</option>
        </select>
        <button className="pulsante">Cerca</button>
      </form>

      {risultato.errore && <Errore errore={risultato.errore} />}
      {risultato.caricamento && !risultato.dati && <Caricamento />}
      {risultato.dati && (
        <>
          <p className="nota">{risultato.dati.totale === 1 ? "1 capo trovato" : `${risultato.dati.totale} capi trovati`}</p>
          <ul className="elenco-capi">
            {risultato.dati.dati.map((capo) => (
              <li key={capo._id}>
                <Link to={`/gestione/capi/${capo._id}`} className="riga-capo">
                  <span>
                    <strong>{capo.brand}</strong> {capo.codiceModello}
                    <span className="nota"> · {capo.tagId}</span>
                    {capo.stato === "archiviato" && <span className="etichetta">Archiviato</span>}
                  </span>
                  <span className="nota">
                    {capo.storicoRigenerazione?.length ?? 0} {(capo.storicoRigenerazione?.length ?? 0) === 1 ? "intervento" : "interventi"} · creato il {data(capo.createdAt)}
                  </span>
                  <Ancoraggio ancoraggio={capo.registrazione} />
                </Link>
              </li>
            ))}
          </ul>
          {risultato.dati.pagine > 1 && (
            <nav className="paginazione" aria-label="Pagine">
              <button className="link" disabled={pagina <= 1} onClick={() => aggiorna({ pagina: String(pagina - 1) })}>
                ← Precedente
              </button>
              <span>
                Pagina {pagina} di {risultato.dati.pagine}
              </span>
              <button className="link" disabled={pagina >= risultato.dati.pagine} onClick={() => aggiorna({ pagina: String(pagina + 1) })}>
                Successiva →
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
