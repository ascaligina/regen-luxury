import mongoose from "mongoose";
import { RUOLI } from "./costanti.js";

/*
 * Utenti dell'area gestionale: Brand Manager, commercianti, artigiani
 * (e un amministratore che crea gli account). I consumatori NON hanno un
 * account: la verifica è pubblica (requisito U, "Access Public").
 * La password non viene mai salvata in chiaro: si conserva solo l'hash bcrypt.
 */
const userSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    ruolo: { type: String, enum: RUOLI, default: "commerciante" },
    organizzazione: { type: String, trim: true }, // boutique, laboratorio, cooperativa
    passwordHash: { type: String, required: true, select: false },
    attivo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
