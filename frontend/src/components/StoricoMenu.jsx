import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useStorico, svuotaStorico } from "../utils/archivio.js";
import { ESITO_BREVE, tempoFa } from "../utils/formato.js";
import { IconaOrologio } from "./Icone.jsx";

// Voce "Storico" della testata: si apre a tendina con le ultime verifiche
export default function StoricoMenu() {
  const storico = useStorico();
  const [aperto, setAperto] = useState(false);
  const contenitore = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => setAperto(false), [pathname]);
  useEffect(() => {
    if (!aperto) return undefined;
    const fuori = (e) => !contenitore.current?.contains(e.target) && setAperto(false);
    const esc = (e) => e.key === "Escape" && setAperto(false);
    document.addEventListener("pointerdown", fuori);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", fuori);
      document.removeEventListener("keydown", esc);
    };
  }, [aperto]);

  return (
    <div className="menu-tendina" ref={contenitore}>
      <button
        type="button"
        className={`menu-voce${aperto ? " active" : ""}`}
        aria-expanded={aperto}
        aria-controls="tendina-storico"
        onClick={() => setAperto((a) => !a)}
      >
        <IconaOrologio dimensione={18} />
        <span>Storico</span>
        {storico.length > 0 && <span className="contatore">{storico.length}</span>}
        <span className="freccina" aria-hidden="true">▾</span>
      </button>

      {aperto && (
        <div className="tendina" id="tendina-storico" role="region" aria-label="Storico delle verifiche">
          <div className="tendina-testa">
            <strong>Le tue verifiche</strong>
            <span>salvate solo su questo dispositivo</span>
          </div>
          {storico.length === 0 ? (
            <p className="tendina-vuota">Nessuna verifica per ora. Scansiona il QR code o il tag NFC di un capo: lo ritroverai qui.</p>
          ) : (
            <ul className="tendina-elenco">
              {storico.slice(0, 8).map((v) => {
                const esito = ESITO_BREVE[v.esito] ?? ESITO_BREVE.non_registrato;
                return (
                  <li key={v.tagId}>
                    <Link to={`/v/${encodeURIComponent(v.tagId)}`} className="voce-storico">
                      <span className="voce-testo">
                        <strong>{v.brand ?? "Codice sconosciuto"}</strong>
                        <span>
                          {v.codiceModello ?? v.tagId} · {tempoFa(v.data)}
                          {v.volte > 1 && ` · ${v.volte} verifiche`}
                        </span>
                      </span>
                      <span className={`bollino bollino-${esito.classe}`}>{esito.testo}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="tendina-piede">
            <Link to="/scan">Nuova verifica</Link>
            {storico.length > 0 && (
              <button type="button" className="link" onClick={svuotaStorico}>
                Cancella storico
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
