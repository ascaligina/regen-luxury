import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { avviaAmbiente, creaUtenti, auth, capoDiProva, attendiAncoraggi } from "./helpers.js";

describe("Gestione capi: creazione, validazione, endpoint (punti 8-9)", () => {
  let env, app, token, idCapo;
  before(async () => {
    env = await avviaAmbiente();
    app = env.app;
    token = await creaUtenti(app);
  });
  after(() => env.chiudi());

  it("crea un capo: 201, registrazione in attesa e poi confermata", async () => {
    const r = await request(app).post("/api/items").set(auth(token.brand_manager)).send(capoDiProva("NFC-001", { proprietarioIniziale: "Boutique Vintage Bari" }));
    assert.equal(r.status, 201);
    assert.equal(r.body.registrazione.stato, "in_attesa");
    idCapo = r.body._id;
    await attendiAncoraggi();
    const d = await request(app).get(`/api/items/${idCapo}`).set(auth(token.commerciante));
    assert.equal(d.body.registrazione.stato, "confermato");
    assert.match(d.body.blockchainTxHash, /^0x[0-9a-f]{64}$/);
    assert.equal(d.body.passaggiProprieta[0].ancoraggio.stato, "confermato");
  });

  it("anti-replay: stesso tag -> 409, anche con richieste simultanee", async () => {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-001"));
    assert.equal(r.status, 409);
    const risposte = await Promise.all(
      [1, 2, 3].map(() => request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-RACE")))
    );
    const codici = risposte.map((x) => x.status).sort();
    assert.deepEqual(codici, [201, 409, 409]);
  });

  it("validazione: campi mancanti, tagId non valido, campi sconosciuti -> 400 con dettagli", async () => {
    const mancanti = await request(app).post("/api/items").set(auth(token.commerciante)).send({ tagId: "NFC-X" });
    assert.equal(mancanti.status, 400);
    assert.ok(mancanti.body.dettagli.some((d) => d.campo === "brand"));
    const tagErrato = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC 001 con spazi"));
    assert.equal(tagErrato.status, 400);
    const extra = await request(app).post("/api/items").set(auth(token.commerciante)).send({ ...capoDiProva("NFC-Y"), prezzo: 10 });
    assert.equal(extra.status, 400);
    const anno = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-Z", { annoProduzione: 3000 }));
    assert.equal(anno.status, 400);
    const json = await request(app).post("/api/items").set(auth(token.commerciante)).set("Content-Type", "application/json").send("{non json");
    assert.equal(json.status, 400);
  });

  it("eventi: tipo non ammesso -> 400; artigiano registra -> 200 e ancoraggio confermato", async () => {
    const errato = await request(app).post(`/api/items/${idCapo}/eventi`).set(auth(token.artigiano)).send({ tipo: "lavaggio", descrizione: "x" });
    assert.equal(errato.status, 400);
    const r = await request(app).post(`/api/items/${idCapo}/eventi`).set(auth(token.artigiano)).send({ tipo: "upcycling", descrizione: "Rifoderatura interna", materialiNuovi: "Cotone riciclato", operatore: "Laboratorio Bari" });
    assert.equal(r.status, 200);
    assert.equal(r.body.storicoRigenerazione.length, 1);
    await attendiAncoraggi();
    const d = await request(app).get(`/api/items/${idCapo}`).set(auth(token.artigiano));
    assert.equal(d.body.storicoRigenerazione[0].ancoraggio.stato, "confermato");
  });

  it("passaggi di proprietà: l'artigiano non può (403), il commerciante sì", async () => {
    assert.equal((await request(app).post(`/api/items/${idCapo}/proprieta`).set(auth(token.artigiano)).send({ proprietario: "Luca" })).status, 403);
    const r = await request(app).post(`/api/items/${idCapo}/proprieta`).set(auth(token.commerciante)).send({ proprietario: "Maria Rossi" });
    assert.equal(r.status, 200);
    assert.equal(r.body.passaggiProprieta.length, 2);
  });

  it("elenco paginato, ricerca e ricerca per tag", async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva(`PRADA-${i}`, { brand: "Prada" }));
    }
    const pag = await request(app).get("/api/items?perPagina=2&pagina=2").set(auth(token.artigiano));
    assert.equal(pag.status, 200);
    assert.equal(pag.body.dati.length, 2);
    assert.equal(pag.body.pagina, 2);
    assert.ok(pag.body.totale >= 7);
    const cerca = await request(app).get("/api/items?q=prada").set(auth(token.artigiano));
    assert.equal(cerca.body.totale, 5);
    const perTag = await request(app).get("/api/items/tag/NFC-001").set(auth(token.artigiano));
    assert.equal(perTag.status, 200);
    assert.equal(perTag.body._id, idCapo);
    assert.equal((await request(app).get("/api/items/tag/NON-ESISTE").set(auth(token.artigiano))).status, 404);
    assert.equal((await request(app).get("/api/items?perPagina=500").set(auth(token.artigiano))).status, 400);
  });

  it("modifica: il tagId non è modificabile; la nuova impronta viene ancorata", async () => {
    const tag = await request(app).patch(`/api/items/${idCapo}`).set(auth(token.commerciante)).send({ tagId: "ALTRO" });
    assert.equal(tag.status, 400);
    const r = await request(app).patch(`/api/items/${idCapo}`).set(auth(token.commerciante)).send({ codiceModello: "GG-2024-R" });
    assert.equal(r.status, 200);
    assert.equal(r.body.codiceModello, "GG-2024-R");
    await attendiAncoraggi();
    const v = await request(app).get("/api/verify/NFC-001");
    assert.equal(v.body.certificatoAutenticita.integrita.stato, "verificato");
  });

  it("archiviazione: solo brand manager; poi il capo non è più modificabile ma resta verificabile", async () => {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-ARC"));
    assert.equal((await request(app).post(`/api/items/${r.body._id}/archivia`).set(auth(token.commerciante))).status, 403);
    const a = await request(app).post(`/api/items/${r.body._id}/archivia`).set(auth(token.brand_manager));
    assert.equal(a.status, 200);
    assert.equal(a.body.stato, "archiviato");
    assert.equal((await request(app).post(`/api/items/${r.body._id}/eventi`).set(auth(token.artigiano)).send({ tipo: "riparazione", descrizione: "x" })).status, 409);
    await attendiAncoraggi();
    const v = await request(app).get("/api/verify/NFC-ARC");
    assert.equal(v.status, 200);
    assert.equal(v.body.capo.stato, "archiviato");
    assert.equal(v.body.certificatoAutenticita.integrita.stato, "verificato");
    const attivi = await request(app).get("/api/items?stato=attivo&q=NFC-ARC").set(auth(token.admin));
    assert.equal(attivi.body.totale, 0);
  });

  it("QR code: SVG con l'URL pubblico di verifica", async () => {
    const r = await request(app).get(`/api/items/${idCapo}/qr`).set(auth(token.commerciante));
    assert.equal(r.status, 200);
    assert.match(r.headers["content-type"], /image\/svg\+xml/);
    assert.equal(r.headers["x-url-verifica"], "https://regen.example/v/NFC-001");
    const png = await request(app).get(`/api/items/${idCapo}/qr?formato=png`).set(auth(token.commerciante));
    assert.equal(png.headers["content-type"], "image/png");
  });

  it("eliminazione: solo admin; il tag resta 'bruciato' sulla blockchain", async () => {
    const r = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-DEL"));
    await attendiAncoraggi();
    assert.equal((await request(app).delete(`/api/items/${r.body._id}`).set(auth(token.brand_manager))).status, 403);
    assert.equal((await request(app).delete(`/api/items/${r.body._id}`).set(auth(token.admin))).status, 200);
    const riuso = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-DEL"));
    assert.equal(riuso.status, 409);
  });

  it("ID non valido -> 400; endpoint inesistente -> 404", async () => {
    assert.equal((await request(app).get("/api/items/abc").set(auth(token.admin))).status, 400);
    assert.equal((await request(app).get("/api/nulla")).status, 404);
  });
});
