import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Carosello from "../components/Carosello.jsx";
import { FOTO_CAPI, FOTO_RIGENERAZIONE } from "../data/foto.js";
import { IconaAgo, IconaChip, IconaFoglia, IconaFreccia, IconaGruccia, IconaScansione, IconaScudo } from "../components/Icone.jsx";

const PASSI = [
  { titolo: "Scansiona", testo: "Avvicina il telefono al tag NFC cucito nel capo oppure inquadra il QR code dell’etichetta." },
  { titolo: "Scopri la storia", testo: "Autenticità, interventi di rigenerazione, proprietari precedenti e impatto ambientale evitato." },
  { titolo: "Conservalo", testo: "Se lo acquisti, aggiungilo al tuo armadio: il suo passaporto resta a portata di mano." },
];

const CARATTERISTICHE = [
  {
    Icona: IconaScudo,
    titolo: "Autenticità",
    testo: "I dati del capo sono confrontati con le impronte registrate sulla blockchain Polygon: ogni modifica non autorizzata viene rilevata.",
  },
  {
    Icona: IconaAgo,
    titolo: "Rigenerazione",
    testo: "Riparazioni, upcycling e sostituzioni di parti, con i materiali impiegati e il laboratorio artigiano che li ha eseguiti.",
  },
  {
    Icona: IconaFoglia,
    titolo: "Sostenibilità",
    testo: "Stima della CO₂ e dell’acqua risparmiate rispetto a un capo nuovo, con le fonti scientifiche utilizzate.",
  },
];

export default function HomePage() {
  const [codice, setCodice] = useState("");
  const naviga = useNavigate();
  const valido = /^[A-Za-z0-9_-]{3,64}$/.test(codice.trim());

  return (
    <div className="home">
      <aside className="home-fascia">
        <Carosello foto={FOTO_CAPI} verso="avanti" etichetta="I capi" />
      </aside>

      <div className="home-centro">
        <section className="eroe">
          <p className="sopratitolo">Moda di lusso rigenerata</p>
          <h1>
            La storia di ogni capo, <em>verificabile in un tocco.</em>
          </h1>
          <p className="eroe-testo">
            Avvicina il telefono al tag NFC cucito nel capo oppure inquadra il QR code: vedrai autenticità, interventi di
            rigenerazione, passaggi di proprietà e impatto ambientale evitato. Senza app e senza registrazione.
          </p>
          <div className="eroe-azioni">
            <Link to="/scan" className="pulsante pulsante-grande">
              <IconaScansione dimensione={20} /> Verifica un capo
            </Link>
            <Link to="/armadio" className="pulsante pulsante-grande pulsante-secondario">
              <IconaGruccia dimensione={20} /> Il tuo armadio
            </Link>
          </div>
          <ul className="garanzie">
            <li>
              <IconaScudo dimensione={18} /> Registro su blockchain
            </li>
            <li>
              <IconaChip dimensione={18} /> Chip NFC anticlonazione
            </li>
            <li>
              <IconaFoglia dimensione={18} /> Impatto ambientale con fonti
            </li>
          </ul>
        </section>

        <Carosello foto={[...FOTO_CAPI, ...FOTO_RIGENERAZIONE]} orientamento="orizzontale" />

        <section className="scheda scheda-codice">
          <div>
            <h2>Hai il codice del tag?</h2>
            <p className="nota">Lo trovi sull’etichetta del capo, sotto il QR code.</p>
          </div>
          <form
            className="modulo modulo-in-linea"
            onSubmit={(e) => {
              e.preventDefault();
              if (valido) naviga(`/v/${encodeURIComponent(codice.trim())}`);
            }}
          >
            <input value={codice} onChange={(e) => setCodice(e.target.value)} placeholder="es. NFC-001" aria-label="Codice del tag" />
            <button className="pulsante" disabled={!valido}>
              Verifica <IconaFreccia dimensione={18} />
            </button>
          </form>
        </section>

        <section className="come-funziona">
          <p className="sopratitolo">Come funziona</p>
          <h2>Tre gesti, nessuna app da installare</h2>
          <ol className="passi">
            {PASSI.map((p, i) => (
              <li key={p.titolo}>
                <span className="passi-numero">{i + 1}</span>
                <h3>{p.titolo}</h3>
                <p>{p.testo}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="caratteristiche">
          {CARATTERISTICHE.map(({ Icona, titolo, testo }) => (
            <article key={titolo}>
              <span className="caratteristica-icona">
                <Icona dimensione={26} />
              </span>
              <h3>{titolo}</h3>
              <p>{testo}</p>
            </article>
          ))}
        </section>
      </div>

      <aside className="home-fascia">
        <Carosello foto={FOTO_RIGENERAZIONE} verso="indietro" etichetta="La rigenerazione" />
      </aside>
    </div>
  );
}
