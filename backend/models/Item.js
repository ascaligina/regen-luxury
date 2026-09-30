import mongoose from "mongoose";
import { TIPI_EVENTO, CATEGORIE, MATERIALI, STATI_CAPO, STATI_ANCORAGGIO } from "./costanti.js";

/*
 * Stato dell'ancoraggio su blockchain di un dato (capo, evento, passaggio).
 * "hash" è l'impronta keccak256 dei dati: è l'unica cosa che va on-chain
 * (nessun dato personale sulla blockchain, per il GDPR).
 * La scrittura è asincrona (requisito P): prima "in_attesa", poi "confermato".
 */
const ancoraggioSchema = new mongoose.Schema(
  {
    stato: { type: String, enum: STATI_ANCORAGGIO, default: "in_attesa" },
    hash: { type: String },
    txHash: { type: String },
    blocco: { type: Number },
    rete: { type: String },
    errore: { type: String },
    aggiornatoIl: { type: Date },
  },
  { _id: false }
);

/*
 * Sotto-schema per un singolo evento di rigenerazione sartoriale.
 * Modellato come documento EMBEDDED all'interno dell'Item (scelta di progetto):
 * un capo = un documento che contiene l'intera sua storia.
 * Questo giustifica l'uso di MongoDB (database documentale non relazionale)
 * e soddisfa il requisito di performance (recupero in <2s con una sola query).
 * Copre RF: "Registrazione dell'evento di rigenerazione sartoriale".
 */
const regenerationEventSchema = new mongoose.Schema(
  {
    tipo: { type: String, enum: TIPI_EVENTO, required: true },
    descrizione: { type: String, required: true },
    // Origine dei nuovi materiali ecologici impiegati (RF)
    materialiNuovi: { type: String },
    operatore: { type: String }, // Artigiano / Operatore di Laboratorio
    data: { type: Date, default: Date.now },
    registratoDa: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ancoraggio: { type: ancoraggioSchema }, // assente sui dati creati prima della v2
  },
  { _id: true }
);

// Catena dei passaggi di proprietà (per la verifica anti-contraffazione)
const passaggioSchema = new mongoose.Schema(
  {
    proprietario: { type: String, required: true },
    data: { type: Date, default: Date.now },
    registratoDa: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ancoraggio: { type: ancoraggioSchema },
  },
  { _id: true }
);

/*
 * Schema principale del capo d'alta gamma.
 * Copre RF: "Creazione dell'identità digitale" e "Associazione smart hardware-software".
 */
const itemSchema = new mongoose.Schema(
  {
    // --- Metadati di fabbricazione (RF: creazione identità digitale) ---
    brand: { type: String, required: true, trim: true },
    codiceModello: { type: String, required: true, trim: true },
    materialiOriginari: { type: String, required: true, trim: true },
    filieraProvenienza: { type: String, trim: true },
    categoria: { type: String, enum: CATEGORIE },
    materialePrincipale: { type: String, enum: MATERIALI },
    annoProduzione: { type: Number },
    stato: { type: String, enum: STATI_CAPO, default: "attivo" },

    // --- Accoppiamento hardware-software (RF: associazione smart tag) ---
    // Codice univoco del tag NFC/QR fisico. L'indice UNIQUE impedisce che lo
    // stesso tag identifichi due capi (requisito R: anti-duplicazione/replay).
    tagId: { type: String, required: true, unique: true, trim: true },

    // Chip NTAG 424 DNA associato (autenticazione dinamica SUN)
    nfc: {
      uid: { type: String, index: true },
      ultimoContatore: { type: Number },
      associatoIl: { type: Date },
      ultimaLettura: { type: Date },
    },

    // --- Storico rigenerazione (array embedded) ---
    storicoRigenerazione: [regenerationEventSchema],

    // --- Blockchain ---
    // tx hash della registrazione (campo della v1, mantenuto per compatibilità)
    blockchainTxHash: { type: String },
    // stato dell'impronta dei dati del capo ancorata on-chain
    registrazione: { type: ancoraggioSchema },

    passaggiProprieta: [passaggioSchema],

    creatoDa: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true } // aggiunge createdAt / updatedAt automaticamente
);

itemSchema.index({ brand: 1, codiceModello: 1 });

export default mongoose.model("Item", itemSchema);
