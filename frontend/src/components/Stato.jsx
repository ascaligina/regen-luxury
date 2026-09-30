export function Caricamento({ testo = "Caricamento…" }) {
  return (
    <div className="stato" role="status">
      <span className="rotella" aria-hidden="true" />
      {testo}
    </div>
  );
}

export function Errore({ errore, titolo = "Qualcosa non ha funzionato" }) {
  if (!errore) return null;
  const dettagli = errore.dati?.dettagli;
  return (
    <div className="avviso avviso-errore" role="alert">
      <strong>{titolo}</strong>
      <p>{errore.message}</p>
      {dettagli?.length > 0 && (
        <ul>
          {dettagli.map((d) => (
            <li key={d.campo + d.messaggio}>
              {d.campo}: {d.messaggio}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
