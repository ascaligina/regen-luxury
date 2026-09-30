import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api.js";
import { Caricamento, Errore } from "../components/Stato.jsx";

// Etichetta stampabile con il QR code (fallback universale del tag NFC)
export default function LabelPage() {
  const { id } = useParams();
  const [capo, setCapo] = useState(null);
  const [qr, setQr] = useState(null);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    let url;
    Promise.all([api(`/items/${id}`), api(`/items/${id}/qr`, { formato: "blob" })])
      .then(([c, immagine]) => {
        setCapo(c);
        url = URL.createObjectURL(immagine);
        setQr({ src: url, indirizzo: immagine.urlVerifica });
      })
      .catch(setErrore);
    return () => url && URL.revokeObjectURL(url);
  }, [id]);

  if (errore) return <Errore errore={errore} />;
  if (!capo || !qr) return <Caricamento />;
  // l'indirizzo stampato è lo stesso contenuto nel QR (PUBLIC_BASE_URL del backend)
  const indirizzo = qr.indirizzo ?? `${window.location.origin}/v/${encodeURIComponent(capo.tagId)}`;

  return (
    <section>
      <div className="azioni non-stampare">
        <Link to={`/gestione/capi/${id}`} className="link">
          ← Torna al capo
        </Link>
        <button className="pulsante" onClick={() => window.print()}>
          Stampa l’etichetta
        </button>
      </div>
      <div className="etichetta-stampa">
        <img src={qr.src} alt={`QR code di verifica del capo ${capo.tagId}`} />
        <div>
          <p className="sopratitolo">Passaporto digitale</p>
          <h2>{capo.brand}</h2>
          <p>{capo.codiceModello}</p>
          <p className="codice">{capo.tagId}</p>
          <p className="nota">Inquadra per verificare autenticità e storia del capo</p>
          <p className="nota url">{indirizzo}</p>
        </div>
      </div>
    </section>
  );
}
