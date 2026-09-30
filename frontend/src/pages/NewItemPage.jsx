import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import ModuloCapo from "../components/ModuloCapo.jsx";
import { Errore } from "../components/Stato.jsx";

export default function NewItemPage() {
  const naviga = useNavigate();
  const [errore, setErrore] = useState(null);
  const [inCorso, setInCorso] = useState(false);

  const crea = async (dati) => {
    setInCorso(true);
    setErrore(null);
    try {
      const capo = await api("/items", { metodo: "POST", corpo: dati });
      naviga(`/gestione/capi/${capo._id}`, { state: { creato: true } });
    } catch (err) {
      setErrore(err);
      setInCorso(false);
    }
  };

  return (
    <section className="scheda">
      <h1>Nuovo capo</h1>
      <p className="nota">Crea l’identità digitale del capo e collegala al codice del tag fisico. La registrazione sulla blockchain avviene in background.</p>
      <Errore errore={errore} titolo="Capo non creato" />
      <ModuloCapo nuovo onInvia={crea} inCorso={inCorso} etichettaInvio="Crea il capo" />
    </section>
  );
}
