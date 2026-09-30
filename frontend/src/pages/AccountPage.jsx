import { useState } from "react";
import { api } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { Errore } from "../components/Stato.jsx";
import { RUOLI } from "../utils/formato.js";

export default function AccountPage() {
  const { utente } = useAuth();
  const [vecchia, setVecchia] = useState("");
  const [nuova, setNuova] = useState("");
  const [esito, setEsito] = useState(null);
  const [errore, setErrore] = useState(null);

  const invia = async (e) => {
    e.preventDefault();
    setErrore(null);
    setEsito(null);
    try {
      await api("/auth/password", { metodo: "POST", corpo: { vecchia, nuova } });
      setEsito("Password aggiornata.");
      setVecchia("");
      setNuova("");
    } catch (err) {
      setErrore(err);
    }
  };

  return (
    <section className="scheda scheda-stretta">
      <h1>Il tuo account</h1>
      <p>
        {utente.nome} · {utente.email} · {RUOLI[utente.ruolo]}
      </p>
      <h2>Cambia password</h2>
      <form className="modulo" onSubmit={invia}>
        <label>
          Password attuale
          <input type="password" value={vecchia} onChange={(e) => setVecchia(e.target.value)} required autoComplete="current-password" />
        </label>
        <label>
          Nuova password (almeno 10 caratteri)
          <input type="password" value={nuova} onChange={(e) => setNuova(e.target.value)} required minLength={10} autoComplete="new-password" />
        </label>
        <Errore errore={errore} />
        {esito && <div className="avviso avviso-ok">{esito}</div>}
        <button className="pulsante">Aggiorna la password</button>
      </form>
    </section>
  );
}
