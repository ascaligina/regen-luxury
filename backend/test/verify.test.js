import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";
import { avviaAmbiente, creaUtenti, auth, capoDiProva, attendiAncoraggi } from "./helpers.js";

describe("Verifica pubblica, integrità e limiti (punti 8, 10, 13)", () => {
  let env, app, token, Item;
  before(async () => {
    env = await avviaAmbiente();
    app = env.app;
    token = await creaUtenti(app);
    ({ default: Item } = await import("../models/Item.js"));
  });
  after(() => env.chiudi());

  async function capoCompleto(tagId) {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva(tagId, { proprietarioIniziale: "Boutique Vintage" }));
    await request(app).post(`/api/items/${r.body._id}/eventi`).set(auth(token.artigiano)).send({ tipo: "riparazione", descrizione: "Nuova fodera", operatore: "Lab Bari" });
    await request(app).post(`/api/items/${r.body._id}/proprieta`).set(auth(token.commerciante)).send({ proprietario: "Maria Rossi" });
    await attendiAncoraggi();
    return r.body._id;
  }

  it("certificato pubblico senza login: autentico, integrità verificata, nomi minimizzati, impatto con fonti", async () => {
    await capoCompleto("NFC-100");
    const r = await request(app).get("/api/verify/NFC-100");
    assert.equal(r.status, 200);
    const c = r.body.certificatoAutenticita;
    assert.equal(c.autentico, true);
    assert.equal(c.integrita.stato, "verificato");
    assert.equal(c.integrita.voci.verificate, 3);
    assert.deepEqual(r.body.capo.passaggiProprieta.map((p) => p.proprietario), ["B. V.", "M. R."]);
    assert.ok(!JSON.stringify(r.body).includes("Rossi"));
    const imp = r.body.impattoAmbientale;
    assert.equal(imp.disponibile, true);
    assert.equal(imp.co2RisparmiataKg, 12); // 20,0 kg CO2e x 0,6
    assert.equal(imp.acquaPreservataLitri, 1753); // 2922 L x 0,6
    assert.equal(imp.fonti.length, 2);
  });

  it("tag mai registrato -> 404 con autentico = false", async () => {
    const r = await request(app).get("/api/verify/NFC-FALSO");
    assert.equal(r.status, 404);
    assert.equal(r.body.autentico, false);
  });

  it("categoria senza coefficienti: impatto 'non disponibile' invece di numeri inventati", async () => {
    await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-BORSA", { categoria: "borsa" }));
    await attendiAncoraggi();
    const r = await request(app).get("/api/verify/NFC-BORSA");
    assert.equal(r.body.impattoAmbientale.disponibile, false);
  });

  it("manomissione di un evento direttamente nel database -> 'manomesso'", async () => {
    const id = await capoCompleto("NFC-200");
    await Item.updateOne({ _id: id }, { $set: { "storicoRigenerazione.0.descrizione": "Riparazione mai avvenuta" } });
    const r = await request(app).get("/api/verify/NFC-200");
    assert.equal(r.body.certificatoAutenticita.integrita.stato, "manomesso");
    assert.equal(r.body.certificatoAutenticita.autentico, false);
    assert.equal(r.body.certificatoAutenticita.integrita.voci.alterate.length, 1);
  });

  it("manomissione dei dati del capo (brand) -> 'manomesso'", async () => {
    const id = await capoCompleto("NFC-300");
    await Item.updateOne({ _id: id }, { $set: { brand: "Hermès" } });
    const r = await request(app).get("/api/verify/NFC-300");
    assert.equal(r.body.certificatoAutenticita.integrita.datiCapo, "diversi");
    assert.equal(r.body.certificatoAutenticita.integrita.stato, "manomesso");
  });

  it("cancellazione di un passaggio di proprietà dal database -> 'manomesso' (voce presente solo on-chain)", async () => {
    const id = await capoCompleto("NFC-400");
    await Item.updateOne({ _id: id }, { $pop: { passaggiProprieta: 1 } });
    const r = await request(app).get("/api/verify/NFC-400");
    assert.equal(r.body.certificatoAutenticita.integrita.voci.soloOnChain, 1);
    assert.equal(r.body.certificatoAutenticita.integrita.stato, "manomesso");
  });

  it("dati della versione precedente (mai ancorati) -> 'non_registrato', poi 'verificato' dopo la migrazione", async () => {
    const legacy = await Item.collection.insertOne({
      brand: "Gucci", codiceModello: "GG-2024", materialiOriginari: "Pelle e cotone", filieraProvenienza: "Italia",
      tagId: "NFC-V1", blockchainTxHash: "0xabc",
      storicoRigenerazione: [{ _id: new mongoose.Types.ObjectId(), tipo: "upcycling", descrizione: "Rifoderatura interna", data: new Date() }],
      passaggiProprieta: [{ _id: new mongoose.Types.ObjectId(), proprietario: "Maria Rossi", data: new Date() }],
      createdAt: new Date(), updatedAt: new Date(),
    });
    let r = await request(app).get("/api/verify/NFC-V1");
    assert.equal(r.body.certificatoAutenticita.integrita.stato, "non_registrato");
    const { ancoraArretrati } = await import("../services/anchorService.js");
    const item = await Item.findById(legacy.insertedId);
    assert.equal(await ancoraArretrati(item), 3);
    await attendiAncoraggi();
    r = await request(app).get("/api/verify/NFC-V1");
    assert.equal(r.body.certificatoAutenticita.integrita.stato, "verificato");
  });

  it("limite di richieste sulla verifica pubblica -> 429", async () => {
    process.env.RATE_LIMIT_VERIFY_PER_MIN = "3";
    const appLimitata = env.creaApp();
    process.env.RATE_LIMIT_VERIFY_PER_MIN = "10000";
    const codici = [];
    for (let i = 0; i < 5; i++) codici.push((await request(appLimitata).get("/api/verify/NFC-100")).status);
    assert.deepEqual(codici, [200, 200, 200, 429, 429]);
  });
});
