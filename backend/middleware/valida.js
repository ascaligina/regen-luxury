// Applica gli schemi di validazione a body, query e parametri della richiesta.
// I dati validati (e normalizzati) finiscono in req.dati.
export function valida({ body, query, params } = {}) {
  return (req, res, next) => {
    const dati = {};
    for (const [parte, schema] of Object.entries({ body, query, params })) {
      if (!schema) continue;
      const esito = schema.safeParse(req[parte] ?? {});
      if (!esito.success) {
        return res.status(400).json({
          errore: "Dati non validi",
          dettagli: esito.error.issues.map((i) => ({
            campo: i.path.join(".") || parte,
            messaggio: i.code === "unrecognized_keys" ? `Campo non ammesso: ${i.keys.join(", ")}` : i.message,
          })),
        });
      }
      dati[parte] = esito.data;
    }
    req.dati = dati;
    next();
  };
}
