import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import Ancoraggio from "../components/Ancoraggio.jsx";
import ModuloCapo from "../components/ModuloCapo.jsx";
import { Caricamento, Errore } from "../components/Stato.jsx";
import { TIPI_EVENTO, data, dataOra, maiuscola } from "../utils/formato.js";
import { nfcDisponibile, leggiTagNfc } from "../utils/nfc.js";
import { interpretaCodice } from "../utils/formato.js";

const inAttesa = (capo) =>
  capo.registrazione?.stato === "in_attesa" ||
  capo.storicoRigenerazione.some((e) => e.ancoraggio?.stato === "in_attesa") ||
  capo.passaggiProprieta.some((p) => p.ancoraggio?.stato === "in_attesa");

function ModuloEvento({ onInvia, inCorso }) {
  const [v, setV] = useState({ tipo: "riparazione", descrizione: "", materialiNuovi: "", operatore: "" });
  const cambia = (k) => (e) => setV((x) => ({ ...x, [k]: e.target.value }));
  return (
    <form
      className="modulo"
      onSubmit={(e) => {
        e.preventDefault();
        const dati = Object.fromEntries(Object.entries(v).filter(([, x]) => x.trim() !== ""));
        onInvia(dati).then((ok) => ok && setV({ tipo: "riparazione", descrizione: "", materialiNuovi: "", operatore: "" }));
      }}
    >
      <label>
        Tipo di intervento
        <select value={v.tipo} onChange={cambia("tipo")}>
          {Object.entries(TIPI_EVENTO).map(([k, t]) => (
            <option key={k} value={k}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label>
        Descrizione *
        <textarea value={v.descrizione} onChange={cambia("descrizione")} required maxLength={1000} rows={3} placeholder="es. Rifoderatura interna e sostituzione bottoni" />
      </label>
      <div className="riga">
        <label>
          Nuovi materiali e origine
          <input value={v.materialiNuovi} onChange={cambia("materialiNuovi")} maxLength={300} placeholder="es. Cotone riciclato certificato" />
        </label>
        <label>
          Laboratorio / operatore
          <input value={v.operatore} onChange={cambia("operatore")} maxLength={100} placeholder="es. Laboratorio Bari" />
        </label>
      </div>
      <button className="pulsante" disabled={inCorso}>
        Registra l’intervento
      </button>
    </form>
  );
}

function ModuloPassaggio({ onInvia, inCorso }) {
  const [nome, setNome] = useState("");
  return (
    <form
      className="modulo modulo-in-linea"
      onSubmit={(e) => {
        e.preventDefault();
        onInvia({ proprietario: nome.trim() }).then((ok) => ok && setNome(""));
      }}
    >
      <input value={nome} onChange={(e) => setNome(e.target.value)} required maxLength={100} placeholder="Nome del nuovo proprietario" aria-label="Nuovo proprietario" />
      <button className="pulsante" disabled={inCorso || !nome.trim()}>
        Registra
      </button>
    </form>
  );
}

function ModuloNfc({ onInvia, inCorso }) {
  const [uid, setUid] = useState("");
  const [messaggio, setMessaggio] = useState("");
  const leggi = async () => {
    setMessaggio("Avvicina il telefono al chip…");
    try {
      const letto = await leggiTagNfc();
      const d = interpretaCodice(letto.url);
      if (d?.tipo === "sun") {
        const ok = await onInvia({ e: d.e, c: d.c });
        setMessaggio(ok ? "Chip associato e verificato con le chiavi SDM." : "");
      } else if (letto.uid) {
        setUid(letto.uid);
        setMessaggio("UID letto: controlla e conferma.");
      }
    } catch (err) {
      setMessaggio(err.message);
    }
  };
  return (
    <div>
      {nfcDisponibile() && (
        <button className="pulsante pulsante-secondario" onClick={leggi} disabled={inCorso}>
          Leggi il chip con il telefono
        </button>
      )}
      <form
        className="modulo modulo-in-linea"
        onSubmit={(e) => {
          e.preventDefault();
          onInvia({ uid: uid.trim() });
        }}
      >
        <input value={uid} onChange={(e) => setUid(e.target.value.toUpperCase())} pattern="[0-9A-Fa-f]{14}" placeholder="UID del chip (14 caratteri esadecimali)" aria-label="UID del chip" />
        <button className="pulsante" disabled={inCorso || uid.length !== 14}>
          Associa
        </button>
      </form>
      {messaggio && <p className="nota">{messaggio}</p>}
    </div>
  );
}

export default function ItemDetailPage() {
  const { id } = useParams();
  const posizione = useLocation();
  const { puo } = useAuth();
  const [capo, setCapo] = useState(null);
  const [errore, setErrore] = useState(null);
  const [azione, setAzione] = useState(null);
  const [modifica, setModifica] = useState(false);

  const carica = useCallback(() => api(`/items/${id}`).then(setCapo).catch(setErrore), [id]);
  useEffect(() => {
    carica();
  }, [carica]);

  // Le scritture sulla blockchain sono asincrone: si aggiorna finché ci sono conferme in attesa
  // (al massimo 60 controlli di fila, circa 2 minuti: oltre, basta ricaricare la pagina)
  const controlli = useRef(0);
  useEffect(() => {
    if (!capo || !inAttesa(capo)) {
      controlli.current = 0;
      return undefined;
    }
    if (controlli.current >= 60) return undefined;
    controlli.current += 1;
    const timer = setTimeout(carica, 2000);
    return () => clearTimeout(timer);
  }, [capo, carica]);

  const esegui = async (nome, percorso, metodo, corpo) => {
    setAzione(nome);
    setErrore(null);
    controlli.current = 0;
    try {
      const r = await api(percorso, { metodo, corpo });
      if (r?._id) setCapo(r);
      else await carica();
      return true;
    } catch (err) {
      setErrore(err);
      return false;
    } finally {
      setAzione(null);
    }
  };

  if (!capo && !errore) return <Caricamento />;
  if (!capo) return <Errore errore={errore} />;
  const archiviato = capo.stato === "archiviato";

  return (
    <section>
      {posizione.state?.creato && <div className="avviso avviso-ok">Capo creato. La registrazione sulla blockchain è in corso.</div>}
      <div className="intestazione-sezione">
        <div>
          <p className="sopratitolo">Tag {capo.tagId}</p>
          <h1>
            {capo.brand} <span className="leggero">{capo.codiceModello}</span>
          </h1>
          <Ancoraggio ancoraggio={capo.registrazione} />
          {archiviato && <span className="etichetta">Archiviato</span>}
        </div>
        <div className="azioni">
          <Link className="pulsante pulsante-secondario" to={`/v/${encodeURIComponent(capo.tagId)}`}>
            Pagina pubblica
          </Link>
          <Link className="pulsante pulsante-secondario" to={`/gestione/capi/${capo._id}/etichetta`}>
            Etichetta QR
          </Link>
        </div>
      </div>

      <Errore errore={errore} titolo="Operazione non riuscita" />

      <div className="scheda">
        <h2>Dati del capo</h2>
        {modifica ? (
          <ModuloCapo
            iniziale={Object.fromEntries(["brand", "codiceModello", "materialiOriginari", "filieraProvenienza", "categoria", "materialePrincipale", "annoProduzione"].map((k) => [k, capo[k] ?? ""]))}
            inCorso={azione === "modifica"}
            etichettaInvio="Salva le modifiche"
            onInvia={async (dati) => {
              if (await esegui("modifica", `/items/${capo._id}`, "PATCH", dati)) setModifica(false);
            }}
          />
        ) : (
          <>
            <dl className="scheda-dati">
              <dt>Materiali originari</dt>
              <dd>{capo.materialiOriginari}</dd>
              <dt>Categoria</dt>
              <dd>{capo.categoria ? maiuscola(capo.categoria) : "—"}</dd>
              <dt>Materiale principale</dt>
              <dd>{capo.materialePrincipale ? maiuscola(capo.materialePrincipale) : "—"}</dd>
              <dt>Filiera</dt>
              <dd>{capo.filieraProvenienza || "—"}</dd>
              <dt>Anno</dt>
              <dd>{capo.annoProduzione || "—"}</dd>
              <dt>Chip NFC</dt>
              <dd>{capo.nfc?.uid ? `${capo.nfc.uid} (associato il ${data(capo.nfc.associatoIl)})` : "non associato"}</dd>
              <dt>Creato</dt>
              <dd>{dataOra(capo.createdAt)}</dd>
            </dl>
            {!archiviato && puo("brand_manager", "commerciante") && (
              <button className="link" onClick={() => setModifica(true)}>
                Modifica i dati
              </button>
            )}
          </>
        )}
      </div>

      <div className="scheda">
        <h2>Interventi di rigenerazione</h2>
        {capo.storicoRigenerazione.length === 0 && <p className="nota">Nessun intervento registrato.</p>}
        <ol className="linea-tempo">
          {capo.storicoRigenerazione.map((e) => (
            <li key={e._id}>
              <span className="linea-data">{data(e.data)}</span>
              <strong>{TIPI_EVENTO[e.tipo] ?? e.tipo}</strong>
              <p>{e.descrizione}</p>
              {(e.materialiNuovi || e.operatore) && <p className="nota">{[e.materialiNuovi, e.operatore].filter(Boolean).join(" · ")}</p>}
              <Ancoraggio ancoraggio={e.ancoraggio} />
            </li>
          ))}
        </ol>
        {!archiviato && puo("artigiano", "commerciante") && (
          <details className="apribile">
            <summary>Registra un nuovo intervento</summary>
            <ModuloEvento inCorso={azione === "evento"} onInvia={(dati) => esegui("evento", `/items/${capo._id}/eventi`, "POST", dati)} />
          </details>
        )}
      </div>

      <div className="scheda">
        <h2>Passaggi di proprietà</h2>
        {capo.passaggiProprieta.length === 0 && <p className="nota">Nessun passaggio registrato.</p>}
        <ol className="catena">
          {capo.passaggiProprieta.map((p, i) => (
            <li key={p._id}>
              <span className="passo">{i + 1}</span>
              <span>
                <strong>{p.proprietario}</strong>
                <span className="nota"> · {data(p.data)}</span>
              </span>
              <Ancoraggio ancoraggio={p.ancoraggio} />
            </li>
          ))}
        </ol>
        {!archiviato && puo("commerciante", "brand_manager") && (
          <ModuloPassaggio inCorso={azione === "passaggio"} onInvia={(dati) => esegui("passaggio", `/items/${capo._id}/proprieta`, "POST", dati)} />
        )}
      </div>

      {puo("brand_manager", "commerciante") && (
        <div className="scheda">
          <h2>Chip NFC</h2>
          <p className="nota">Associa un chip NTAG 424 DNA: con il messaggio dinamico il server verifica che il chip sia autentico.</p>
          <ModuloNfc inCorso={azione === "nfc"} onInvia={(dati) => esegui("nfc", `/items/${capo._id}/nfc`, "POST", dati)} />
        </div>
      )}

      {!archiviato && puo("brand_manager") && (
        <div className="scheda zona-rischio">
          <h2>Archiviazione</h2>
          <p className="nota">Il capo non sarà più modificabile, ma la sua storia resterà verificabile.</p>
          <button
            className="pulsante pulsante-pericolo"
            disabled={azione === "archivia"}
            onClick={() => {
              if (window.confirm("Archiviare definitivamente questo capo?")) esegui("archivia", `/items/${capo._id}/archivia`, "POST");
            }}
          >
            Archivia il capo
          </button>
        </div>
      )}
    </section>
  );
}
