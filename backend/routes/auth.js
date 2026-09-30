import express from "express";
import { z } from "zod";
import { login, me, cambiaPassword, creaUtente, elencaUtenti, impostaAttivo } from "../controllers/authController.js";
import { autentica, richiediRuolo } from "../middleware/auth.js";
import { valida } from "../middleware/valida.js";
import { limiteLogin } from "../middleware/limiti.js";
import * as schemi from "../validators/schemi.js";

export default function authRouter() {
  const router = express.Router();

  router.post("/login", limiteLogin(), valida({ body: schemi.login }), login);
  router.get("/me", autentica, me);
  router.post("/password", autentica, valida({ body: schemi.cambioPassword }), cambiaPassword);

  // Gestione account (solo amministratore)
  router.get("/utenti", autentica, richiediRuolo("admin"), elencaUtenti);
  router.post("/utenti", autentica, richiediRuolo("admin"), valida({ body: schemi.nuovoUtente }), creaUtente);
  router.patch(
    "/utenti/:id",
    autentica,
    richiediRuolo("admin"),
    valida({ params: z.object({ id: schemi.objectId }), body: z.object({ attivo: z.boolean() }).strict() }),
    impostaAttivo
  );

  return router;
}
