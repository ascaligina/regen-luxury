/*
 * Ancora sulla blockchain i dati non ancora confermati: i capi creati con la
 * prima versione del backend (es. il capo Gucci NFC-001) e le eventuali
 * transazioni fallite. Si può rilanciare senza rischi: salta ciò che è già confermato.
 * Uso: npm run migra
 */
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Item from "../models/Item.js";
import { ancoraArretrati, attendiAncoraggi } from "../services/anchorService.js";
import { verificaIntegrita } from "../services/integrityService.js";

await connectDB();
const capi = await Item.find();
console.log(`Capi nel database: ${capi.length}`);

let operazioni = 0;
for (const item of capi) operazioni += await ancoraArretrati(item);
await attendiAncoraggi();
console.log(`Operazioni di ancoraggio eseguite: ${operazioni}\n`);

for (const item of await Item.find()) {
  const esito = await verificaIntegrita(item);
  console.log(`${item.tagId.padEnd(16)} ${esito.stato.padEnd(14)} ${esito.messaggio}`);
}
await mongoose.disconnect();
