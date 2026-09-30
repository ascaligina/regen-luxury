import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { Errore } from "../components/Stato.jsx";

export default function LoginPage() {
  const { login, utente } = useAuth();
  const naviga = useNavigate();
  const posizione = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState(null);
  const [inCorso, setInCorso] = useState(false);

  if (utente) return <Navigate to="/gestione" replace />;

  const invia = async (e) => {
    e.preventDefault();
    setInCorso(true);
    setErrore(null);
    try {
      await login(email, password);
      naviga(posizione.state?.da ?? "/gestione", { replace: true });
    } catch (err) {
      setErrore(err);
    } finally {
      setInCorso(false);
    }
  };

  return (
    <section className="scheda scheda-stretta">
      <h1>Area gestionale</h1>
      <p className="nota">Per boutique, laboratori artigiani e brand manager. I clienti non hanno bisogno di accedere.</p>
      <form className="modulo" onSubmit={invia}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
        <Errore errore={errore} titolo="Accesso non riuscito" />
        <button className="pulsante" disabled={inCorso}>
          {inCorso ? "Accesso…" : "Accedi"}
        </button>
      </form>
    </section>
  );
}
