/*
 * Middleware centralizzato per la gestione degli errori.
 * Cattura le eccezioni non gestite e restituisce una risposta JSON coerente,
 * evitando che l'applicazione si blocchi (contribuisce al requisito RR: affidabilità).
 */
export function notFound(req, res) {
  res.status(404).json({ errore: `Endpoint non trovato: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Indice UNIQUE violato (es. due richieste simultanee con lo stesso tagId)
  if (err.code === 11000) {
    const campo = Object.keys(err.keyPattern ?? err.keyValue ?? {})[0];
    const messaggi = {
      tagId: "Questo tag risulta già associato a un altro capo.",
      email: "Esiste già un account con questa email.",
    };
    return res.status(409).json({ errore: messaggi[campo] ?? (campo ? "Valore già presente." : messaggi.tagId) });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ errore: "ID del capo non valido." });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ errore: "Dati non validi", dettagli: Object.values(err.errors).map((e) => ({ campo: e.path, messaggio: e.message })) });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ errore: "JSON non valido nel corpo della richiesta." });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ errore: "Richiesta troppo grande." });
  }
  const status = err.status || 500;
  if (status >= 500) console.error("Errore interno:", err);
  res.status(status).json({ errore: status >= 500 ? "Errore interno del server." : err.message });
}
