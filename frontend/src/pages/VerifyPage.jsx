import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api.js";
import Certificato from "../components/Certificato.jsx";
import { Caricamento, Errore } from "../components/Stato.jsx";
import { aggiornaNellArmadio, registraVerifica, riassuntoCapo } from "../utils/archivio.js";

export default function VerifyPage() {
  const { tagId } = useParams();
  const [stato, setStato] = useState({ caricamento: true });

  useEffect(() => {
    let attivo = true;
    setStato({ caricamento: true });
    api(`/verify/${encodeURIComponent(tagId)}`)
      .then((dati) => {
        if (!attivo) return;
        setStato({ dati });
        const riassunto = riassuntoCapo(dati);
        registraVerifica(riassunto); // storico sul dispositivo
        aggiornaNellArmadio(riassunto);
      })
      .catch((errore) => {
        if (!attivo) return;
        setStato({ errore });
        if (errore.status === 404) registraVerifica({ tagId, brand: null, codiceModello: null, esito: "non_trovato" });
      });
    return () => {
      attivo = false;
    };
  }, [tagId]);

  if (stato.caricamento) return <Caricamento testo="Verifica del capo in corso…" />;
  if (stato.errore?.status === 404) {
    return (
      <section className="scheda esito esito-ko">
        <span className="esito-icona" aria-hidden="true">
          ✕
        </span>
        <div>
          <h1>Capo non trovato</h1>
          <p>Nessun capo è associato al codice «{tagId}». Potrebbe trattarsi di una contraffazione: non procedere all’acquisto senza ulteriori verifiche.</p>
          <Link to="/scan">Prova un’altra scansione</Link>
        </div>
      </section>
    );
  }
  if (stato.errore) return <Errore errore={stato.errore} />;
  return <Certificato dati={stato.dati} />;
}
