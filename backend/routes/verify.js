import express from "express";
import { z } from "zod";
import { verificaCapo, verificaSun } from "../controllers/verifyController.js";
import { valida } from "../middleware/valida.js";
import { limiteVerifica } from "../middleware/limiti.js";
import * as schemi from "../validators/schemi.js";

/*
 * Rotte pubbliche lato CONSUMATORE (RU: Access Public, nessun login),
 * con limite di richieste per IP contro abusi e scansioni automatiche.
 */
export default function verifyRouter() {
  const router = express.Router();
  router.use(limiteVerifica());

  // Chip NTAG 424 DNA: URL dinamico con messaggio cifrato (prima di "/:tagId")
  router.get("/sun", valida({ query: schemi.messaggioSun }), verificaSun);

  // Scansione del QR o tag statico: si passa il tagId nell'URL
  router.get("/:tagId", valida({ params: z.object({ tagId: schemi.tagId }) }), verificaCapo);

  return router;
}
