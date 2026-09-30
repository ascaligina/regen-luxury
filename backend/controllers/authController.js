import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { jwtSecret, jwtExpires } from "../config/security.js";

const pubblico = (u) => ({ id: String(u._id), nome: u.nome, email: u.email, ruolo: u.ruolo, organizzazione: u.organizzazione, attivo: u.attivo });

/** Login dell'area gestionale: restituisce un token valido per JWT_EXPIRES (default 8 ore). */
export async function login(req, res, next) {
  try {
    const { email, password } = req.dati.body;
    const utente = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
    const ok = utente && utente.attivo && (await bcrypt.compare(password, utente.passwordHash));
    if (!ok) return res.status(401).json({ errore: "Email o password non corretti." });
    const token = jwt.sign({ sub: String(utente._id), ruolo: utente.ruolo }, jwtSecret(), { expiresIn: jwtExpires() });
    res.json({ token, utente: pubblico(utente) });
  } catch (err) {
    next(err);
  }
}

export function me(req, res) {
  res.json({ utente: req.utente });
}

export async function cambiaPassword(req, res, next) {
  try {
    const { vecchia, nuova } = req.dati.body;
    const utente = await User.findById(req.utente.id).select("+passwordHash");
    if (!(await bcrypt.compare(vecchia, utente.passwordHash))) {
      return res.status(400).json({ errore: "La password attuale non è corretta." });
    }
    utente.passwordHash = await bcrypt.hash(nuova, 12);
    await utente.save();
    res.json({ messaggio: "Password aggiornata." });
  } catch (err) {
    next(err);
  }
}

/** Solo admin: crea l'account di un Brand Manager, commerciante o artigiano. */
export async function creaUtente(req, res, next) {
  try {
    const { password, email, ...resto } = req.dati.body;
    if (await User.exists({ email: email.toLowerCase() })) {
      return res.status(409).json({ errore: "Esiste già un utente con questa email." });
    }
    const utente = await User.create({ ...resto, email, passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json({ utente: pubblico(utente) });
  } catch (err) {
    next(err);
  }
}

export async function elencaUtenti(req, res, next) {
  try {
    const utenti = await User.find().sort({ createdAt: -1 }).lean();
    res.json({ dati: utenti.map(pubblico) });
  } catch (err) {
    next(err);
  }
}

/** Solo admin: attiva o disattiva un account (i dati storici restano). */
export async function impostaAttivo(req, res, next) {
  try {
    const { id } = req.dati.params;
    if (id === req.utente.id) return res.status(400).json({ errore: "Non puoi disattivare il tuo stesso account." });
    const utente = await User.findById(id);
    if (!utente) return res.status(404).json({ errore: "Utente non trovato." });
    utente.attivo = req.dati.body.attivo;
    await utente.save();
    res.json({ utente: pubblico(utente) });
  } catch (err) {
    next(err);
  }
}
