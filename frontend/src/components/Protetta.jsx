import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { Caricamento } from "./Stato.jsx";

// Protegge le pagine dell'area gestionale: login obbligatorio ed eventuale ruolo
export default function Protetta({ ruoli }) {
  const { utente, pronto, puo } = useAuth();
  const posizione = useLocation();
  if (!pronto) return <Caricamento />;
  if (!utente) return <Navigate to="/login" replace state={{ da: posizione.pathname }} />;
  if (ruoli && !puo(...ruoli)) {
    return (
      <section className="scheda">
        <h1>Accesso non consentito</h1>
        <p>Il tuo ruolo non permette di aprire questa pagina.</p>
      </section>
    );
  }
  return <Outlet />;
}
