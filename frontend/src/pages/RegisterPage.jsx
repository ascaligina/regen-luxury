import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { Errore } from "../components/Stato.jsx";

const RUOLI_SCELTA = [
  { valore: "commerciante", titolo: "Boutique o rivendita", testo: "Crei i capi, registri i passaggi di proprietà e associ i chip NFC." },
  { valore: "artigiano", titolo: "Laboratorio artigiano", testo: "Registri gli interventi di riparazione, upcycling e sostituzione di parti." },
];

// Stesse regole del server (almeno 10 caratteri, una lettera e un numero) più qualche spunto in più
function valutaPassword(p) {
  const requisiti = [
    { ok: p.length >= 10, testo: "Almeno 10 caratteri" },
    { ok: /[A-Za-z]/.test(p), testo: "Una lettera" },
    { ok: /\d/.test(p), testo: "Un numero" },
  ];
  const extra = [p.length >= 14, /[a-z]/.test(p) && /[A-Z]/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
  const base = requisiti.every((r) => r.ok);
  const livello = !p ? 0 : !base ? 1 : 2 + Math.min(extra, 2);
  return { requisiti, livello, valida: base, etichetta: ["", "Troppo corta o semplice", "Sufficiente", "Buona", "Ottima"][livello] };
}

export default function RegisterPage() {
  const { utente, registra } = useAuth();
  const naviga = useNavigate();
  const [v, setV] = useState({ nome: "", organizzazione: "", email: "", ruolo: "commerciante", password: "", conferma: "" });
  const [errore, setErrore] = useState(null);
  const [inCorso, setInCorso] = useState(false);
  const [inAttesa, setInAttesa] = useState(false);
  const forza = useMemo(() => valutaPassword(v.password), [v.password]);
  const cambia = (k) => (e) => setV((x) => ({ ...x, [k]: e.target.value }));
  const coincide = v.conferma === v.password;

  if (utente && !inAttesa) return <Navigate to="/gestione" replace />;

  const invia = async (e) => {
    e.preventDefault();
    setErrore(null);
    if (!forza.valida) return setErrore({ message: "La password non rispetta i requisiti indicati." });
    if (!coincide) return setErrore({ message: "Le due password non coincidono." });
    setInCorso(true);
    try {
      const { conferma, organizzazione, ...campi } = v;
      const risposta = await registra({ ...campi, ...(organizzazione.trim() ? { organizzazione: organizzazione.trim() } : {}) });
      if (risposta.inAttesaDiApprovazione) setInAttesa(true);
      else naviga("/gestione", { replace: true });
    } catch (err) {
      setErrore(err);
    } finally {
      setInCorso(false);
    }
  };

  if (inAttesa) {
    return (
      <section className="scheda scheda-stretta">
        <p className="sopratitolo">Iscrizione ricevuta</p>
        <h1>Quasi fatto</h1>
        <p>Un amministratore deve attivare il tuo account prima del primo accesso. Riceverai l’abilitazione appena sarà pronta.</p>
        <Link to="/" className="pulsante pulsante-secondario">
          Torna alla home
        </Link>
      </section>
    );
  }

  return (
    <section className="scheda scheda-stretta scheda-iscrizione">
      <p className="sopratitolo">Area gestionale</p>
      <h1>Crea il tuo account</h1>
      <p className="nota">Per boutique, rivendite e laboratori artigiani. I clienti non hanno bisogno di iscriversi: verificano i capi senza account.</p>

      <form className="modulo" onSubmit={invia} noValidate>
        <fieldset className="scelta-ruolo">
          <legend>Come lavori</legend>
          {RUOLI_SCELTA.map((r) => (
            <label key={r.valore} className={`scelta-ruolo-voce${v.ruolo === r.valore ? " scelta-ruolo-attiva" : ""}`}>
              <input type="radio" name="ruolo" value={r.valore} checked={v.ruolo === r.valore} onChange={cambia("ruolo")} />
              <span className="scelta-ruolo-titolo">{r.titolo}</span>
              <span className="scelta-ruolo-testo">{r.testo}</span>
            </label>
          ))}
        </fieldset>

        <div className="riga">
          <label>
            Nome e cognome
            <input value={v.nome} onChange={cambia("nome")} autoComplete="name" required maxLength={100} />
          </label>
          <label>
            Attività <small>(facoltativo)</small>
            <input value={v.organizzazione} onChange={cambia("organizzazione")} autoComplete="organization" maxLength={150} placeholder="es. Sartoria Bari Vecchia" />
          </label>
        </div>
        <label>
          Email
          <input type="email" value={v.email} onChange={cambia("email")} autoComplete="username" required maxLength={150} />
        </label>
        <label>
          Password
          <input type="password" value={v.password} onChange={cambia("password")} autoComplete="new-password" required aria-describedby="forza-password" />
        </label>

        <div id="forza-password" className="forza-password" aria-live="polite">
          <div className={`forza-barre forza-${forza.livello}`} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <p className="forza-etichetta">{forza.etichetta || "Scegli una password di almeno 10 caratteri"}</p>
          <ul className="forza-requisiti">
            {forza.requisiti.map((r) => (
              <li key={r.testo} className={r.ok ? "requisito-ok" : ""}>
                {r.testo}
              </li>
            ))}
          </ul>
        </div>

        <label>
          Ripeti la password
          <input type="password" value={v.conferma} onChange={cambia("conferma")} autoComplete="new-password" required aria-invalid={v.conferma !== "" && !coincide} />
          {v.conferma !== "" && !coincide && <small className="campo-errore">Le due password non coincidono.</small>}
        </label>

        <Errore errore={errore} titolo="Iscrizione non riuscita" />
        <button className="pulsante pulsante-grande" disabled={inCorso || !v.nome.trim() || !v.email.trim() || !forza.valida || !coincide}>
          {inCorso ? "Creo l’account…" : "Crea l’account"}
        </button>
      </form>
      <p className="nota nota-centrata">
        Hai già un account? <Link to="/login">Accedi</Link>
      </p>
    </section>
  );
}
