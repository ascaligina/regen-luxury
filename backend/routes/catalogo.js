import express from "express";
import { elencoCatalogo, statisticheCatalogo } from "../controllers/catalogoController.js";
import { valida } from "../middleware/valida.js";
import { limiteVerifica } from "../middleware/limiti.js";
import * as schemi from "../validators/schemi.js";

// Catalogo pubblico dell'archivio dimostrativo (nessun login, con limite di richieste per IP)
export default function catalogoRouter() {
  const router = express.Router();
  router.use(limiteVerifica());
  router.get("/statistiche", statisticheCatalogo);
  router.get("/", valida({ query: schemi.filtriCatalogo }), elencoCatalogo);
  return router;
}
