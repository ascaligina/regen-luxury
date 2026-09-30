import express from "express";
import { z } from "zod";
import {
  creaItem,
  elencaItems,
  getItemById,
  getItemByTag,
  modificaItem,
  archiviaItem,
  aggiungiEvento,
  aggiungiPassaggioProprieta,
  eliminaItem,
  qrItem,
  associaNfc,
} from "../controllers/itemController.js";
import { autentica, richiediRuolo } from "../middleware/auth.js";
import { valida } from "../middleware/valida.js";
import * as schemi from "../validators/schemi.js";

const router = express.Router();
const conId = valida({ params: z.object({ id: schemi.objectId }) });

/*
 * Rotte lato COMMERCIANTE / ARTIGIANO: tutte richiedono il login.
 * Permessi per ruolo (l'amministratore può sempre tutto):
 *  - creare, modificare, associare il chip: brand_manager, commerciante
 *  - archiviare: brand_manager
 *  - eventi di rigenerazione: artigiano, commerciante
 *  - passaggi di proprietà: commerciante, brand_manager
 *  - eliminare: solo admin (strumento per la demo)
 */
router.use(autentica);

// Crea un nuovo capo (identità digitale + tag)
router.post("/", richiediRuolo("brand_manager", "commerciante"), valida({ body: schemi.nuovoCapo }), creaItem);

// Elenco con ricerca e paginazione
router.get("/", valida({ query: schemi.filtriElenco }), elencaItems);

// Ricerca per codice del tag (prima di "/:id")
router.get("/tag/:tagId", valida({ params: z.object({ tagId: schemi.tagId }) }), getItemByTag);

// Recupera un singolo capo per ID
router.get("/:id", conId, getItemById);

// Modifica dati descrittivi / archiviazione
router.patch("/:id", richiediRuolo("brand_manager", "commerciante"), valida({ params: z.object({ id: schemi.objectId }), body: schemi.modificaCapo }), modificaItem);
router.post("/:id/archivia", richiediRuolo("brand_manager"), conId, archiviaItem);

// Aggiungi un evento di rigenerazione a un capo esistente
router.post("/:id/eventi", richiediRuolo("artigiano", "commerciante"), valida({ params: z.object({ id: schemi.objectId }), body: schemi.nuovoEvento }), aggiungiEvento);

// Registra un passaggio di proprietà (anti-contraffazione)
router.post("/:id/proprieta", richiediRuolo("commerciante", "brand_manager"), valida({ params: z.object({ id: schemi.objectId }), body: schemi.nuovoPassaggio }), aggiungiPassaggioProprieta);

// QR code stampabile e associazione del chip NFC
router.get("/:id/qr", conId, qrItem);
router.post("/:id/nfc", richiediRuolo("brand_manager", "commerciante"), valida({ params: z.object({ id: schemi.objectId }), body: schemi.associaNfc }), associaNfc);

// Elimina un capo (solo admin, per pulizia in fase di demo)
router.delete("/:id", richiediRuolo("admin"), conId, eliminaItem);

export default router;
