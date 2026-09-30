import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from "qr-scanner";
import { interpretaCodice } from "../utils/formato.js";
import { nfcDisponibile, leggiTagNfc } from "../utils/nfc.js";

export default function ScanPage() {
  const video = useRef(null);
  const naviga = useNavigate();
  const [messaggio, setMessaggio] = useState("Inquadra il QR code del capo");
  const [nfcAttivo, setNfcAttivo] = useState(false);

  const vai = (testo) => {
    const destinazione = interpretaCodice(testo);
    if (!destinazione) {
      setMessaggio("Codice non riconosciuto: non appartiene a un capo della piattaforma.");
      return false;
    }
    if (destinazione.tipo === "sun") naviga(`/s?e=${destinazione.e}&c=${destinazione.c}`);
    else naviga(`/v/${encodeURIComponent(destinazione.tagId)}`);
    return true;
  };

  useEffect(() => {
    if (!video.current) return;
    const lettore = new QrScanner(video.current, (risultato) => {
      if (vai(risultato.data)) lettore.stop();
    }, { returnDetailedScanResult: true, highlightScanRegion: true, preferredCamera: "environment" });
    lettore.start().catch(() => setMessaggio("Fotocamera non disponibile: consenti l’accesso oppure inserisci il codice a mano."));
    return () => lettore.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leggiNfc = async () => {
    setNfcAttivo(true);
    setMessaggio("Avvicina il telefono al tag NFC…");
    try {
      const { url } = await leggiTagNfc();
      if (!url || !vai(url)) setMessaggio("Il tag non contiene un indirizzo di verifica valido.");
    } catch (err) {
      setMessaggio(err.message);
    } finally {
      setNfcAttivo(false);
    }
  };

  return (
    <section className="scansione">
      <h1>Verifica un capo</h1>
      <div className="cornice-video">
        <video ref={video} muted playsInline />
      </div>
      <p className="nota" aria-live="polite">
        {messaggio}
      </p>
      {nfcDisponibile() && (
        <button className="pulsante pulsante-secondario" onClick={leggiNfc} disabled={nfcAttivo}>
          Leggi il tag NFC
        </button>
      )}
      <p className="nota">Su iPhone basta avvicinare il telefono al tag: la verifica si apre da sola.</p>
    </section>
  );
}
