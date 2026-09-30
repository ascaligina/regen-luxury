// Fascia di foto che scorre all'infinito: l'elenco è ripetuto due volte e
// l'animazione CSS lo sposta di metà lunghezza, così il giro non ha salti.
// Decorativa: nascosta ai lettori di schermo; ferma con "riduci movimento".
function Foto({ foto }) {
  return (
    <figure className="carosello-foto">
      <img
        src={foto.src}
        alt=""
        loading="eager"
        decoding="async"
        onError={(e) => e.currentTarget.parentElement.classList.add("foto-assente")}
      />
      <figcaption>{foto.didascalia}</figcaption>
    </figure>
  );
}

export default function Carosello({ foto, verso = "avanti", orientamento = "verticale", etichetta }) {
  return (
    <div className={`carosello carosello-${orientamento} carosello-${verso}`} aria-hidden="true">
      {etichetta && <p className="carosello-etichetta">{etichetta}</p>}
      <div className="carosello-finestra">
        <div className="carosello-traccia">
          {[...foto, ...foto].map((f, i) => (
            <Foto key={`${f.id}-${i}`} foto={f} />
          ))}
        </div>
      </div>
    </div>
  );
}
