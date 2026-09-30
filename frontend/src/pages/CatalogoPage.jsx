import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../services/api.js";
import { Caricamento, Errore } from "../components/Stato.jsx";
import { CATEGORIE, MATERIALI, maiuscola, numero } from "../utils/formato.js";

const DECENNI = [1980, 1990, 2000, 2010, 2020];

// Barre orizzontali: un solo colore, valore scritto accanto (nessuna legenda da decifrare)
function Barre({ titolo, righe, nota }) {
  const massimo = Math.max(1, ...righe.map((r) => r.valore));
  return (
    <figure className="barre">
      <figcaption>{titolo}</figcaption>
      <ol>
        {righe.map((r) => (
          <li key={r.etichetta}>
            <span className="barre-etichetta">{r.etichetta}</span>
            <span className="barre-pista" aria-hidden="true">
              <span className="barre-riempimento" style={{ width: `${(r.valore / massimo) * 100}%` }} />
            </span>
            <span className="barre-valore">{numero(r.valore, 0)}</span>
          </li>
        ))}
      </ol>
      {nota && <p className="nota">{nota}</p>}
    </figure>
  );
}

function Statistiche({ s }) {
  const decenni = DECENNI.map((d) => ({ etichetta: `Anni ${d}`, valore: s.decenni.find((x) => x.decennio === d)?.capi ?? 0 }));
  const paesi = s.paesi.slice(0, 8).map((p) => ({ etichetta: p.paese, valore: p.passaggi }));
  return (
    <section className="statistiche" aria-label="Numeri dell’archivio">
      <dl className="numeri">
        <div>
          <dt>Capi</dt>
          <dd>{numero(s.capi, 0)}</dd>
        </div>
        <div>
          <dt>Maison</dt>
          <dd>{numero(s.brand.length, 0)}</dd>
        </div>
        <div>
          <dt>Passaggi di proprietà</dt>
          <dd>{numero(s.passaggi, 0)}</dd>
        </div>
        <div>
          <dt>Paesi</dt>
          <dd>{numero(s.paesi.length, 0)}</dd>
        </div>
      </dl>
      <div className="grafici">
        <Barre titolo="Capi per decennio di produzione" righe={decenni} />
        <Barre titolo="Dove sono passati di mano" righe={paesi} nota={s.paesi.length > 8 ? `Primi 8 paesi su ${s.paesi.length}.` : undefined} />
      </div>
    </section>
  );
}

export default function CatalogoPage() {
  const [parametri, setParametri] = useSearchParams();
  const f = useMemo(
    () => ({
      q: parametri.get("q") ?? "",
      brand: parametri.get("brand") ?? "",
      categoria: parametri.get("categoria") ?? "",
      materiale: parametri.get("materiale") ?? "",
      decennio: parametri.get("decennio") ?? "",
      pagina: Number(parametri.get("pagina") ?? 1),
    }),
    [parametri]
  );
  const [ricerca, setRicerca] = useState(f.q);
  const [stat, setStat] = useState(null);
  const [risultato, setRisultato] = useState({ caricamento: true });

  useEffect(() => {
    api("/catalogo/statistiche").then(setStat).catch(() => setStat(null));
  }, []);

  useEffect(() => {
    const query = new URLSearchParams({ pagina: String(f.pagina), perPagina: "24" });
    for (const k of ["q", "brand", "categoria", "materiale", "decennio"]) if (f[k]) query.set(k, f[k]);
    setRisultato((r) => ({ ...r, caricamento: true }));
    api(`/catalogo?${query}`)
      .then((dati) => setRisultato({ dati }))
      .catch((errore) => setRisultato({ errore }));
  }, [f]);

  const aggiorna = (nuovi) => {
    const p = new URLSearchParams(parametri);
    for (const [k, v] of Object.entries({ pagina: "", ...nuovi })) v ? p.set(k, v) : p.delete(k);
    setParametri(p);
  };
  const filtriAttivi = ["q", "brand", "categoria", "materiale", "decennio"].some((k) => f[k]);

  return (
    <section className="catalogo">
      <header className="pagina-testa">
        <p className="sopratitolo">Archivio dimostrativo</p>
        <h1>Catalogo dei capi</h1>
        <p className="pagina-intro">
          Capi di lusso dal 1980 a oggi, con interventi di rigenerazione e passaggi di proprietà in tutto il mondo. Sono dati inventati per provare la
          piattaforma: ogni scheda si apre come un vero certificato, verificato sulla blockchain.
        </p>
      </header>

      {stat && stat.capi > 0 && <Statistiche s={stat} />}

      <form
        className="modulo filtri-catalogo"
        onSubmit={(e) => {
          e.preventDefault();
          aggiorna({ q: ricerca.trim() });
        }}
      >
        <label className="filtro-ricerca">
          Cerca
          <input value={ricerca} onChange={(e) => setRicerca(e.target.value)} placeholder="Maison, modello, codice o filiera" />
        </label>
        <label>
          Maison
          <select value={f.brand} onChange={(e) => aggiorna({ brand: e.target.value })}>
            <option value="">Tutte</option>
            {(stat?.brand ?? []).map((b) => (
              <option key={b.brand} value={b.brand}>
                {b.brand} ({b.capi})
              </option>
            ))}
          </select>
        </label>
        <label>
          Categoria
          <select value={f.categoria} onChange={(e) => aggiorna({ categoria: e.target.value })}>
            <option value="">Tutte</option>
            {CATEGORIE.map((c) => (
              <option key={c} value={c}>
                {maiuscola(c)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Materiale
          <select value={f.materiale} onChange={(e) => aggiorna({ materiale: e.target.value })}>
            <option value="">Tutti</option>
            {MATERIALI.map((m) => (
              <option key={m} value={m}>
                {maiuscola(m)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Decennio
          <select value={f.decennio} onChange={(e) => aggiorna({ decennio: e.target.value })}>
            <option value="">Tutti</option>
            {DECENNI.map((d) => (
              <option key={d} value={d}>
                Anni {d}
              </option>
            ))}
          </select>
        </label>
        <button className="pulsante">Cerca</button>
      </form>

      {risultato.errore && <Errore errore={risultato.errore} />}
      {risultato.caricamento && !risultato.dati && <Caricamento testo="Apro l’archivio…" />}
      {risultato.dati && (
        <>
          <p className="nota conteggio-catalogo">
            {risultato.dati.totale === 1 ? "1 capo" : `${numero(risultato.dati.totale, 0)} capi`}
            {filtriAttivi && (
              <>
                {" · "}
                <button
                  type="button"
                  className="link"
                  onClick={() => {
                    setRicerca("");
                    setParametri(new URLSearchParams());
                  }}
                >
                  Azzera i filtri
                </button>
              </>
            )}
          </p>

          {risultato.dati.totale === 0 ? (
            <div className="armadio-vuoto">
              <h2>Nessun capo corrisponde</h2>
              <p>Prova con meno filtri o con un’altra maison.</p>
            </div>
          ) : (
            <ul className="griglia-catalogo">
              {risultato.dati.dati.map((c) => (
                <li key={c.tagId}>
                  <Link to={`/v/${encodeURIComponent(c.tagId)}`} className="carta-catalogo">
                    <span className="carta-anno">{c.annoProduzione ?? "—"}</span>
                    <span className="carta-brand">{c.brand}</span>
                    <span className="carta-modello">{c.codiceModello}</span>
                    <span className="carta-dettagli">
                      {[c.categoria && maiuscola(c.categoria), c.materialePrincipale && maiuscola(c.materialePrincipale)].filter(Boolean).join(" · ")}
                    </span>
                    <span className="carta-storia">
                      {c.passaggi} {c.passaggi === 1 ? "proprietario" : "proprietari"} · {c.interventi} {c.interventi === 1 ? "intervento" : "interventi"}
                    </span>
                    {c.ultimoLuogo && <span className="carta-luogo">Ora a {c.ultimoLuogo}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {risultato.dati.pagine > 1 && (
            <nav className="paginazione" aria-label="Pagine">
              <button className="link" disabled={f.pagina <= 1} onClick={() => aggiorna({ pagina: String(f.pagina - 1) })}>
                ← Precedente
              </button>
              <span>
                Pagina {f.pagina} di {risultato.dati.pagine}
              </span>
              <button className="link" disabled={f.pagina >= risultato.dati.pagine} onClick={() => aggiorna({ pagina: String(f.pagina + 1) })}>
                Successiva →
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
