// Limite al numero di richieste per indirizzo IP (protezione da abusi e scansioni automatiche).
import rateLimit from "express-rate-limit";

const risposta = (messaggio) => ({ errore: messaggio });

export const limiteVerifica = () =>
  rateLimit({
    windowMs: 60_000,
    limit: Number(process.env.RATE_LIMIT_VERIFY_PER_MIN ?? 120),
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: risposta("Troppe verifiche in poco tempo: riprova tra un minuto."),
  });

export const limiteLogin = () =>
  rateLimit({
    windowMs: 15 * 60_000,
    limit: Number(process.env.RATE_LIMIT_LOGIN_PER_15MIN ?? 10),
    skipSuccessfulRequests: true,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: risposta("Troppi tentativi di accesso: riprova tra 15 minuti."),
  });
