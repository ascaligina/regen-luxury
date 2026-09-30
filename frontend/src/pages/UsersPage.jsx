import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { Caricamento, Errore } from "../components/Stato.jsx";
import { RUOLI } from "../utils/formato.js";

export default function UsersPage() {
  const { utente } = useAuth();
  const [utenti, setUtenti] = useState(null);
  const [errore, setErrore] = useState(null);
  const [nuovo, setNuovo] = useState({ nome: "", email: "", ruolo: "commerciante", organizzazione: "", password: "" });
  const [creato, setCreato] = useState(null);

  const carica = () => api("/auth/utenti").then((d) => setUtenti(d.dati)).catch(setErrore);
  useEffect(() => {
    carica();
  }, []);

  const cambia = (k) => (e) => setNuovo((v) => ({ ...v, [k]: e.target.value }));

  const crea = async (e) => {
    e.preventDefault();
    setErrore(null);
    try {
      const corpo = Object.fromEntries(Object.entries(nuovo).filter(([, v]) => v !== ""));
      const r = await api("/auth/utenti", { metodo: "POST", corpo });
      setCreato(r.utente);
      setNuovo({ nome: "", email: "", ruolo: "commerciante", organizzazione: "", password: "" });
      carica();
    } catch (err) {
      setErrore(err);
    }
  };

  const impostaAttivo = async (u) => {
    try {
      await api(`/auth/utenti/${u.id}`, { metodo: "PATCH", corpo: { attivo: !u.attivo } });
      carica();
    } catch (err) {
      setErrore(err);
    }
  };

  return (
    <section>
      <h1>Utenti</h1>
      <Errore errore={errore} />
      <div className="scheda">
        <h2>Nuovo account</h2>
        {creato && (
          <div className="avviso avviso-ok">
            Account creato per {creato.email}. Comunica la password in modo sicuro: potrà cambiarla dalla pagina Account.
          </div>
        )}
        <form className="modulo" onSubmit={crea}>
          <div className="riga">
            <label>
              Nome *
              <input value={nuovo.nome} onChange={cambia("nome")} required maxLength={100} />
            </label>
            <label>
              Email *
              <input type="email" value={nuovo.email} onChange={cambia("email")} required />
            </label>
          </div>
          <div className="riga">
            <label>
              Ruolo *
              <select value={nuovo.ruolo} onChange={cambia("ruolo")}>
                {Object.entries(RUOLI).map(([k, t]) => (
                  <option key={k} value={k}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Organizzazione
              <input value={nuovo.organizzazione} onChange={cambia("organizzazione")} maxLength={150} placeholder="es. Boutique Vintage Bari" />
            </label>
          </div>
          <label>
            Password iniziale * (almeno 10 caratteri)
            <input type="text" value={nuovo.password} onChange={cambia("password")} required minLength={10} autoComplete="new-password" />
          </label>
          <button className="pulsante">Crea l’account</button>
        </form>
      </div>
      {!utenti ? (
        <Caricamento />
      ) : (
        <ul className="elenco-capi">
          {utenti.map((u) => (
            <li key={u.id} className="riga-capo">
              <span>
                <strong>{u.nome}</strong> <span className="nota">{u.email}</span>
              </span>
              <span className="nota">
                {RUOLI[u.ruolo]}
                {u.organizzazione && ` · ${u.organizzazione}`}
                {!u.attivo && " · disattivato"}
              </span>
              {u.id !== utente.id && (
                <button className="link" onClick={() => impostaAttivo(u)}>
                  {u.attivo ? "Disattiva" : "Riattiva"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
