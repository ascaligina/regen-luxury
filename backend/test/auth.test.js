import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { avviaAmbiente, creaUtenti, auth, capoDiProva, PASSWORD } from "./helpers.js";

describe("Autenticazione e ruoli (punto 7)", () => {
  let env, app, token;
  before(async () => {
    env = await avviaAmbiente();
    app = env.app;
    token = await creaUtenti(app);
  });
  after(() => env.chiudi());

  it("login corretto restituisce token e dati utente senza hash della password", async () => {
    const r = await request(app).post("/api/auth/login").send({ email: "commerciante@test.it", password: PASSWORD });
    assert.equal(r.status, 200);
    assert.ok(r.body.token);
    assert.equal(r.body.utente.ruolo, "commerciante");
    assert.equal(r.body.utente.passwordHash, undefined);
  });

  it("password errata -> 401", async () => {
    const r = await request(app).post("/api/auth/login").send({ email: "commerciante@test.it", password: "sbagliata" });
    assert.equal(r.status, 401);
  });

  it("area gestionale senza token -> 401, token falso -> 401", async () => {
    assert.equal((await request(app).get("/api/items")).status, 401);
    assert.equal((await request(app).get("/api/items").set(auth("abc.def.ghi"))).status, 401);
  });

  it("GET /api/auth/me restituisce l'utente del token", async () => {
    const r = await request(app).get("/api/auth/me").set(auth(token.artigiano));
    assert.equal(r.status, 200);
    assert.equal(r.body.utente.ruolo, "artigiano");
  });

  it("l'artigiano non può creare capi (403), il commerciante sì (201)", async () => {
    const vietato = await request(app).post("/api/items").set(auth(token.artigiano)).send(capoDiProva("NFC-A01"));
    assert.equal(vietato.status, 403);
    const ok = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("NFC-A01"));
    assert.equal(ok.status, 201);
  });

  it("solo l'admin crea account; l'account disattivato non può più accedere", async () => {
    const nuovo = { nome: "Laboratorio Bari", email: "lab@test.it", password: "una-password-lunga", ruolo: "artigiano" };
    assert.equal((await request(app).post("/api/auth/utenti").set(auth(token.commerciante)).send(nuovo)).status, 403);
    const creato = await request(app).post("/api/auth/utenti").set(auth(token.admin)).send(nuovo);
    assert.equal(creato.status, 201);
    assert.equal((await request(app).post("/api/auth/utenti").set(auth(token.admin)).send(nuovo)).status, 409);

    const login = await request(app).post("/api/auth/login").send({ email: "lab@test.it", password: "una-password-lunga" });
    assert.equal(login.status, 200);
    const disattiva = await request(app).patch(`/api/auth/utenti/${creato.body.utente.id}`).set(auth(token.admin)).send({ attivo: false });
    assert.equal(disattiva.status, 200);
    assert.equal((await request(app).get("/api/auth/me").set(auth(login.body.token))).status, 401);
    assert.equal((await request(app).post("/api/auth/login").send({ email: "lab@test.it", password: "una-password-lunga" })).status, 401);
  });

  it("cambio password", async () => {
    const r = await request(app).post("/api/auth/password").set(auth(token.brand_manager)).send({ vecchia: PASSWORD, nuova: "nuova-password-sicura" });
    assert.equal(r.status, 200);
    const login = await request(app).post("/api/auth/login").send({ email: "brand_manager@test.it", password: "nuova-password-sicura" });
    assert.equal(login.status, 200);
  });
});
