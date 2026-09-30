import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { avviaAmbiente, auth, capoDiProva, attendiAncoraggi } from "./helpers.js";

const nuova = (extra = {}) => ({
  nome: "Sartoria Nuova",
  email: "nuova@sartoria.it",
  password: "una-password-lunga-1",
  ruolo: "artigiano",
  organizzazione: "Sartoria Nuova Srl",
  ...extra,
});

describe("Iscrizione autonoma dalla web app", () => {
  let env, app;
  before(async () => {
    env = await avviaAmbiente();
    app = env.app;
  });
  after(() => env.chiudi());

  it("si iscrive, riceve subito il token e può usare l'area gestionale", async () => {
    const r = await request(app).post("/api/auth/registrazione").send(nuova());
    assert.equal(r.status, 201);
    assert.ok(r.body.token);
    assert.equal(r.body.utente.ruolo, "artigiano");
    assert.equal(r.body.utente.passwordHash, undefined);
    assert.equal((await request(app).get("/api/auth/me").set(auth(r.body.token))).status, 200);
    const login = await request(app).post("/api/auth/login").send({ email: "nuova@sartoria.it", password: "una-password-lunga-1" });
    assert.equal(login.status, 200);
  });

  it("non si può diventare admin o brand manager da soli (niente escalation di privilegi)", async () => {
    for (const ruolo of ["admin", "brand_manager"]) {
      const r = await request(app).post("/api/auth/registrazione").send(nuova({ email: `${ruolo}@x.it`, ruolo }));
      assert.equal(r.status, 400, ruolo);
    }
    const extra = await request(app).post("/api/auth/registrazione").send(nuova({ email: "extra@x.it", attivo: true }));
    assert.equal(extra.status, 400); // campi non previsti rifiutati
  });

  it("email già usata -> 409; password debole o email non valida -> 400", async () => {
    assert.equal((await request(app).post("/api/auth/registrazione").send(nuova())).status, 409);
    assert.equal((await request(app).post("/api/auth/registrazione").send(nuova({ email: "a@b.it", password: "corta1" }))).status, 400);
    assert.equal((await request(app).post("/api/auth/registrazione").send(nuova({ email: "b@b.it", password: "solo-lettere-lunghe" }))).status, 400);
    assert.equal((await request(app).post("/api/auth/registrazione").send(nuova({ email: "non-una-email" }))).status, 400);
  });

  it("il nuovo commerciante può creare un capo; l'artigiano no", async () => {
    const com = await request(app).post("/api/auth/registrazione").send(nuova({ email: "com@x.it", ruolo: "commerciante" }));
    assert.equal(com.status, 201);
    const ok = await request(app).post("/api/items").set(auth(com.body.token)).send(capoDiProva("REG-001"));
    assert.equal(ok.status, 201);
    const art = await request(app).post("/api/auth/login").send({ email: "nuova@sartoria.it", password: "una-password-lunga-1" });
    assert.equal((await request(app).post("/api/items").set(auth(art.body.token)).send(capoDiProva("REG-002"))).status, 403);
    await attendiAncoraggi();
  });

  it("con REGISTRAZIONE_APPROVAZIONE=1 l'account resta disattivato finché non lo attiva un admin", async () => {
    process.env.REGISTRAZIONE_APPROVAZIONE = "1";
    try {
      const r = await request(app).post("/api/auth/registrazione").send(nuova({ email: "attesa@x.it" }));
      assert.equal(r.status, 202);
      assert.equal(r.body.token, undefined);
      const login = await request(app).post("/api/auth/login").send({ email: "attesa@x.it", password: "una-password-lunga-1" });
      assert.equal(login.status, 401);
    } finally {
      delete process.env.REGISTRAZIONE_APPROVAZIONE;
    }
  });

  it("con REGISTRAZIONE_CHIUSA=1 le iscrizioni sono rifiutate (403)", async () => {
    process.env.REGISTRAZIONE_CHIUSA = "1";
    try {
      assert.equal((await request(app).post("/api/auth/registrazione").send(nuova({ email: "chiusa@x.it" }))).status, 403);
    } finally {
      delete process.env.REGISTRAZIONE_CHIUSA;
    }
  });

  it("le iscrizioni sono limitate per indirizzo IP (429)", async () => {
    process.env.RATE_LIMIT_REGISTER_PER_HOUR = "2";
    try {
      const limitata = env.creaApp();
      const codici = [];
      for (let i = 0; i < 3; i++) {
        codici.push((await request(limitata).post("/api/auth/registrazione").send(nuova({ email: `lim${i}@x.it` }))).status);
      }
      assert.deepEqual(codici, [201, 201, 429]);
    } finally {
      process.env.RATE_LIMIT_REGISTER_PER_HOUR = "10000";
    }
  });
});
