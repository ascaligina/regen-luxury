// Controllo di integrità: gli stati salvati nel database non possono "coprire" una manomissione
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { avviaAmbiente, creaUtenti, auth, capoDiProva, attendiAncoraggi } from "./helpers.js";

describe("Integrità: stati di attesa falsificati, campi svuotabili, date (revisione)", () => {
  let env, app, token, Item;
  const vecchio = new Date(Date.now() - 60 * 60_000); // un'ora fa: fuori dalla finestra di attesa

  before(async () => {
    env = await avviaAmbiente();
    app = env.app;
    token = await creaUtenti(app);
    ({ default: Item } = await import("../models/Item.js"));
  });
  after(() => env.chiudi());

  async function capoConfermato(tagId) {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva(tagId));
    await request(app).post(`/api/items/${r.body._id}/eventi`).set(auth(token.artigiano)).send({ tipo: "riparazione", descrizione: "Cuciture" });
    await attendiAncoraggi();
    return r.body._id;
  }
  const verifica = async (tagId) => (await request(app).get(`/api/verify/${tagId}`)).body.certificatoAutenticita;

  it("dati modificati + registrazione rimessa 'in_attesa' nel database: mai 'autentico'", async () => {
    const id = await capoConfermato("INT-001");
    await Item.collection.updateOne(
      { _id: Item.castObject({ _id: id })._id },
      { $set: { brand: "Marchio Falso", "registrazione.stato": "in_attesa", "registrazione.aggiornatoIl": vecchio, updatedAt: vecchio } }
    );
    const c = await verifica("INT-001");
    assert.equal(c.autentico, false);
    assert.notEqual(c.integrita.stato, "verificato");
  });

  it("evento falso aggiunto con ancoraggio 'fallito': verifica non conclusiva, non autentico", async () => {
    const id = await capoConfermato("INT-002");
    const item = await Item.findById(id);
    item.storicoRigenerazione.push({ tipo: "upcycling", descrizione: "Intervento inventato", ancoraggio: { stato: "fallito", aggiornatoIl: vecchio } });
    await item.save();
    const c = await verifica("INT-002");
    assert.equal(c.integrita.stato, "incompleto");
    assert.equal(c.autentico, false);
  });

  it("capo contraffatto inserito direttamente nel database 'in_attesa' da tempo: non registrato", async () => {
    await Item.collection.insertOne({
      ...capoDiProva("INT-FALSO"),
      stato: "attivo",
      registrazione: { stato: "in_attesa", aggiornatoIl: vecchio },
      storicoRigenerazione: [],
      passaggiProprieta: [],
      createdAt: vecchio,
      updatedAt: vecchio,
    });
    const c = await verifica("INT-FALSO");
    assert.equal(c.integrita.stato, "non_registrato");
    assert.equal(c.autentico, false);
  });

  it("un capo appena creato è 'in registrazione' (non ancora autentico) e poi 'verificato'", async () => {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("INT-003"));
    const subito = await verifica("INT-003");
    assert.equal(subito.integrita.stato, "in_attesa");
    assert.equal(subito.autentico, false);
    await attendiAncoraggi();
    const dopo = await verifica("INT-003");
    assert.equal(dopo.integrita.stato, "verificato");
    assert.equal(dopo.autentico, true);
    assert.ok(r.body._id);
  });

  it("modifica: un campo facoltativo svuotato (null) viene rimosso e il capo resta verificato", async () => {
    const r = await request(app)
      .post("/api/items")
      .set(auth(token.commerciante))
      .send(capoDiProva("INT-004", { annoProduzione: 2010 }));
    await attendiAncoraggi();
    const m = await request(app).patch(`/api/items/${r.body._id}`).set(auth(token.commerciante)).send({ filieraProvenienza: null, annoProduzione: null });
    assert.equal(m.status, 200);
    assert.equal(m.body.filieraProvenienza, undefined);
    assert.equal(m.body.annoProduzione, undefined);
    await attendiAncoraggi();
    assert.equal((await verifica("INT-004")).integrita.stato, "verificato");
    // brand e codice restano obbligatori
    const vuoto = await request(app).patch(`/api/items/${r.body._id}`).set(auth(token.commerciante)).send({ brand: null });
    assert.equal(vuoto.status, 400);
  });

  it("evento con la data di adesso: accettato; data nel futuro: rifiutata", async () => {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("INT-005"));
    const ora = await request(app).post(`/api/items/${r.body._id}/eventi`).set(auth(token.artigiano)).send({ tipo: "riparazione", descrizione: "Oggi", data: new Date().toISOString() });
    assert.equal(ora.status, 200);
    const futuro = await request(app)
      .post(`/api/items/${r.body._id}/eventi`)
      .set(auth(token.artigiano))
      .send({ tipo: "riparazione", descrizione: "Domani", data: new Date(Date.now() + 86_400_000).toISOString() });
    assert.equal(futuro.status, 400);
  });

  it("email duplicata: messaggio sull'account, non sul tag", async () => {
    const primo = await request(app).post("/api/auth/utenti").set(auth(token.admin)).send({ nome: "A", email: "doppio@test.it", ruolo: "artigiano", password: "Password-lunga-1" });
    assert.equal(primo.status, 201);
    const secondo = await request(app).post("/api/auth/utenti").set(auth(token.admin)).send({ nome: "B", email: "doppio@test.it", ruolo: "artigiano", password: "Password-lunga-1" });
    assert.equal(secondo.status, 409);
    assert.match(secondo.body.errore, /account|email/i);
  });
});
