import { useEffect, useRef } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { useArmadio } from "../utils/archivio.js";
import StoricoMenu from "./StoricoMenu.jsx";
import { IconaGruccia, IconaScansione, IconaUtente } from "./Icone.jsx";

export default function Layout() {
  const { utente, logout } = useAuth();
  const armadio = useArmadio();
  const naviga = useNavigate();
  const { pathname } = useLocation();
  const testata = useRef(null);

  // Altezza reale della testata in una variabile CSS (serve alle fasce fisse della home)
  useEffect(() => {
    const el = testata.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const aggiorna = () => document.documentElement.style.setProperty("--h-testata", `${el.offsetHeight}px`);
    aggiorna();
    const osservatore = new ResizeObserver(aggiorna);
    osservatore.observe(el);
    return () => osservatore.disconnect();
  }, []);

  return (
    <div className="pagina">
      <header ref={testata} className={`testata${utente ? " testata-operatore" : ""}`}>
        <div className="testata-vuoto" aria-hidden="true" />
        <Link to="/" className="marchio" aria-label="Regen Luxury, torna alla home">
          <span className="marchio-nome">
            Regen <em>Luxury</em>
          </span>
          <span className="marchio-motto">Passaporto digitale · moda rigenerata</span>
        </Link>
        <nav className="menu" aria-label="Menu principale">
          <NavLink to="/scan" className="menu-voce">
            <IconaScansione dimensione={18} />
            <span>Verifica</span>
          </NavLink>
          <NavLink to="/armadio" className="menu-voce">
            <IconaGruccia dimensione={18} />
            <span className="testo-lungo">Il tuo armadio</span>
            <span className="testo-corto">Armadio</span>
            {armadio.length > 0 && <span className="contatore">{armadio.length}</span>}
          </NavLink>
          <StoricoMenu />
          {utente ? (
            <>
              <NavLink to="/gestione" className="menu-voce">
                <IconaUtente dimensione={18} />
                <span>Gestione</span>
              </NavLink>
              <button
                type="button"
                className="menu-voce menu-esci"
                onClick={() => {
                  logout();
                  naviga("/");
                }}
              >
                Esci
              </button>
            </>
          ) : (
            <NavLink to="/login" className="menu-voce">
              <IconaUtente dimensione={18} />
              <span>Accedi</span>
            </NavLink>
          )}
        </nav>
      </header>
      <main className={pathname === "/" ? "contenuto contenuto-home" : "contenuto"}>
        <Outlet />
      </main>
      <footer className="piede">
        <p className="piede-marchio">
          Regen <em>Luxury</em>
        </p>
        <p>Passaporto digitale dei capi rigenerati · prototipo di tesi, Politecnico di Bari</p>
        <p className="piede-crediti">Foto decorative: Unsplash (licenza Unsplash) · I marchi citati appartengono ai rispettivi titolari</p>
      </footer>
    </div>
  );
}
