// Registro simulato salvato su MongoDB (demo online su Render)
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import request from "supertest";
import mongoose from "mongoose";
import { avviaAmbiente, creaUtenti, auth, capoDiProva, attendiAncoraggi } from "./helpers.js";
import { improntaTag } from "../services/hashService.js";

describe("Registro simulato su MongoDB", () => {
  let env, app, token;
  before(async () => {
    env = await avviaAmbiente({ MOCK_LEDGER_STORE: "mongo" });
    // vecchio registro su file con un capo già registrato: deve essere importato nel database
    await fs.writeFile(
      process.env.MOCK_LEDGER_FILE,
      JSON.stringify({ blocco: 1_000_010, prossimoToken: 2, capi: { [improntaTag("NFC-FILE")]: { tokenId: 1, dataHash: "0xabc", storico: [] } } })
    );
    app = env.app;
    token = await creaUtenti(app);
  });
  after(() => env.chiudi());

  it("importa il registro su file, registra i nuovi capi nel database e la verifica risulta integra", async () => {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-900"));
    assert.equal(r.status, 201);
    await request(app).post(`/api/items/${r.body._id}/eventi`).set(auth(token.artigiano)).send({ tipo: "riparazione", descrizione: "Cuciture" });
    await attendiAncoraggi();

    const v = await request(app).get("/api/verify/NFC-900");
    assert.equal(v.status, 200);
    assert.equal(v.body.certificatoAutenticita.integrita.stato, "verificato");

    const doc = await mongoose.connection.db.collection("registro_simulato").findOne({ _id: "stato" });
    assert.ok(doc.versione >= 3, "ogni transazione aumenta la versione");
    assert.ok(doc.capi[improntaTag("NFC-900")], "il nuovo capo è nel registro su database");
    assert.equal(doc.capi[improntaTag("NFC-FILE")].tokenId, 1, "il capo del file è stato importato");
    assert.equal(doc.capi[improntaTag("NFC-900")].tokenId, 2, "i token non si sovrappongono");
  });

  it("un tag già registrato nel registro importato non si può riusare", async () => {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-FILE"));
    assert.equal(r.status, 409);
  });

  it("modifiche concorrenti di due server non si perdono (controllo di versione)", async () => {
    const { default: registro } = await import("../services/blockchain/mockLedger.js");
    const col = mongoose.connection.db.collection("registro_simulato");
    const prima = await col.findOne({ _id: "stato" });
    // un "altro server" aggiunge un capo mentre questo registra il suo
    const altro = col.updateOne({ _id: "stato" }, { $set: { [`capi.${improntaTag("NFC-ALTRO")}`]: { tokenId: 99, dataHash: "0x1", storico: [] } }, $inc: { versione: 1 } });
    const mio = registro.registraCapo({ tagId: "NFC-MIO", dataHash: "0x2" });
    await Promise.all([altro, mio]);
    const dopo = await col.findOne({ _id: "stato" });
    assert.ok(dopo.capi[improntaTag("NFC-ALTRO")] && dopo.capi[improntaTag("NFC-MIO")]);
    assert.ok(dopo.versione >= prima.versione + 2);
  });
});
