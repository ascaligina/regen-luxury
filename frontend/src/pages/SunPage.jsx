import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../services/api.js";
import Certificato from "../components/Certificato.jsx";
import { Caricamento, Errore } from "../components/Stato.jsx";
import { aggiornaNellArmadio, registraVerifica, riassuntoCapo } from "../utils/archivio.js";

// Una sola richiesta per link: il link del chip vale una volta (anti-replay) e in
// sviluppo React esegue gli effetti due volte, quindi la richiesta viene condivisa.
const richieste = new Map();
function verificaLink(e, c) {
  const chiave = `${e}|${c}`;
  if (!richieste.has(chiave)) {
    const richiesta = api(`/verify/sun?e=${encodeURIComponent(e)}&c=${encodeURIComponent(c)}`);
    // errore di rete: si può riprovare (il link non è stato consumato dal server)
    richiesta.catch((err) => err.status === 0 && richieste.delete(chiave));
    richieste.set(chiave, richiesta);
  }
  return richieste.get(chiave);
}

// Pagina aperta dal chip NTAG 424 DNA: /s?e=<dati cifrati>&c=<codice di autenticazione>
export default function SunPage() {
  const [parametri] = useSearchParams();
  const e = parametri.get("e") ?? "";
  const c = parametri.get("c") ?? "";
  const [stato, setStato] = useState({ caricamento: true });

  useEffect(() => {
    let attivo = true;
    verificaLink(e, c)
      .then((dati) => {
        if (!attivo) return;
        setStato({ dati });
        const riassunto = riassuntoCapo(dati);
        registraVerifica(riassunto);
        aggiornaNellArmadio(riassunto);
      })
      .catch((errore) => attivo && setStato({ errore }));
    return () => {
      attivo = false;
    };
  }, [e, c]);

  if (stato.caricamento) return <Caricamento testo="Verifica del chip in corso…" />;

  const messaggi = {
    409: {
      titolo: "Link già utilizzato",
      testo: "Per sicurezza ogni lettura del chip genera un link valido una sola volta. Avvicina di nuovo il telefono al tag per una nuova verifica.",
    },
    400: {
      titolo: "Tag non autentico",
      testo: "Il codice letto non è stato generato da un chip registrato: possibile clonazione o link alterato.",
    },
    404: {
      titolo: "Chip non associato",
      testo: "Il chip è autentico ma non è ancora associato a nessun capo della piattaforma.",
    },
  };
  const m = messaggi[stato.errore?.status];
  if (m) {
    return (
      <section className={`scheda esito ${stato.errore.status === 409 ? "esito-attesa" : "esito-ko"}`}>
        <span className="esito-icona" aria-hidden="true">
          {stato.errore.status === 409 ? "↻" : "✕"}
        </span>
        <div>
          <h1>{m.titolo}</h1>
          <p>{m.testo}</p>
          <Link to="/scan">Torna alla verifica</Link>
        </div>
      </section>
    );
  }
  if (stato.errore) return <Errore errore={stato.errore} />;
  return <Certificato dati={stato.dati} />;
}
