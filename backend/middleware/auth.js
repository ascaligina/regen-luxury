// Autenticazione (token JWT) e autorizzazione per ruolo dell'area gestionale.
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { jwtSecret } from "../config/security.js";

export async function autentica(req, res, next) {
  const intestazione = req.headers.authorization ?? "";
  if (!intestazione.startsWith("Bearer ")) {
    return res.status(401).json({ errore: "Accesso richiesto: effettua il login." });
  }
  let payload;
  try {
    payload = jwt.verify(intestazione.slice(7), jwtSecret());
  } catch {
    return res.status(401).json({ errore: "Sessione scaduta o non valida: effettua di nuovo il login." });
  }
  try {
    const utente = await User.findById(payload.sub).lean();
    if (!utente || !utente.attivo) {
      return res.status(401).json({ errore: "Account non valido o disattivato." });
    }
    req.utente = { id: String(utente._id), nome: utente.nome, email: utente.email, ruolo: utente.ruolo };
    next();
  } catch (err) {
    next(err); // database non raggiungibile: errore del server, non login scaduto
  }
}

// L'amministratore può sempre tutto; gli altri solo i ruoli indicati
export const richiediRuolo = (...ruoli) => (req, res, next) => {
  if (req.utente?.ruolo === "admin" || ruoli.includes(req.utente?.ruolo)) return next();
  return res.status(403).json({ errore: "Operazione non consentita per il tuo ruolo." });
};
