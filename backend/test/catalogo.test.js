import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { avviaAmbiente, creaUtenti, auth, capoDiProva, attendiAncoraggi } from "./helpers.js";

describe("Passaggi con data e luogo, catalogo pubblico dell'archivio dimostrativo", () => {
  let env, app, token, Item;
  before(async () => {
    env = await avviaAmbiente();
    app = env.app;
    token = await creaUtenti(app);
    ({ default: Item } = await import("../models/Item.js"));
  });
  after(() => env.chiudi());

  it("un passaggio può avere data passata e luogo, e il capo resta 'verificato'", async () => {
    const c = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva("CAT-001", { annoProduzione: 1985 }));
    assert.equal(c.status, 201);
    const p = await request(app)
      .post(`/api/items/${c.body._id}/proprieta`)
      .set(auth(token.commerciante))
      .send({ proprietario: "Anna Rossi", luogo: "Tokyo, Giappone", data: "1990-05-12" });
    assert.equal(p.status, 200);
    await attendiAncoraggi();
    const v = await request(app).get("/api/verify/CAT-001");
    assert.equal(v.status, 200);
    assert.equal(v.body.certificatoAutenticita.integrita.stato, "verificato");
    assert.equal(v.body.capo.passaggiProprieta[0].luogo, "Tokyo, Giappone");
    assert.equal(new Date(v.body.capo.passaggiProprieta[0].data).getUTCFullYear(), 1990);
    assert.equal(v.body.capo.passaggiProprieta[0].proprietario, "A. R."); // il nome non è pubblico
  });

  it("data del passaggio nel futuro o anteriore al 1900 -> 400", async () => {
    const c = await Item.findOne({ tagId: "CAT-001" });
    const url = `/api/items/${c._id}/proprieta`;
    assert.equal((await request(app).post(url).set(auth(token.commerciante)).send({ proprietario: "X", data: "2999-01-01" })).status, 400);
    assert.equal((await request(app).post(url).set(auth(token.commerciante)).send({ proprietario: "X", data: "1850-01-01" })).status, 400);
  });

  it("la modifica del luogo nel database viene rilevata come manomissione", async () => {
    await Item.updateOne({ tagId: "CAT-001" }, { $set: { "passaggiProprieta.0.luogo": "Atlantide" } });
    const v = await request(app).get("/api/verify/CAT-001");
    assert.equal(v.body.certificatoAutenticita.integrita.stato, "manomesso");
  });

  it("il catalogo pubblico mostra solo i capi dimostrativi e nessun nome di proprietario", async () => {
    for (const [tag, brand, anno] of [["CAT-D1", "Hermès", 1988], ["CAT-D2", "Chanel", 1994], ["CAT-D3", "Hermès", 2003]]) {
      const c = await request(app).post("/api/items").set(auth(token.commerciante)).send(capoDiProva(tag, { brand, annoProduzione: anno, categoria: "borsa", materialePrincipale: "pelle" }));
      await request(app).post(`/api/items/${c.body._id}/proprieta`).set(auth(token.commerciante)).send({ proprietario: "Mario Verdi", luogo: "Parigi, Francia", data: `${anno + 2}-03-01` });
      await attendiAncoraggi(); // il flag si imposta a scritture concluse, come fa lo script di popolamento
      await Item.updateOne({ _id: c.body._id }, { $set: { dimostrativo: true } });
    }

    const r = await request(app).get("/api/catalogo");
    assert.equal(r.status, 200);
    assert.equal(r.body.totale, 3);
    assert.ok(!r.body.dati.some((d) => d.tagId === "CAT-001"), "il capo non dimostrativo non deve comparire");
    assert.ok(!JSON.stringify(r.body).includes("Mario"), "nessun nome di proprietario");
    assert.equal(r.body.dati[0].passaggi, 1);
    assert.equal(r.body.dati[0].ultimoLuogo, "Parigi, Francia");

    const filtrato = await request(app).get("/api/catalogo?brand=Hermès&decennio=1980");
    assert.equal(filtrato.body.totale, 1);
    assert.equal(filtrato.body.dati[0].tagId, "CAT-D1");
    assert.equal((await request(app).get("/api/catalogo?q=chanel")).body.totale, 1);
    assert.equal((await request(app).get("/api/catalogo?categoria=inesistente")).status, 400);
  });

  it("le statistiche riassumono l'archivio dimostrativo", async () => {
    const r = await request(app).get("/api/catalogo/statistiche");
    assert.equal(r.status, 200);
    assert.equal(r.body.capi, 3);
    assert.equal(r.body.passaggi, 3);
    assert.equal(r.body.annoMin, 1988);
    assert.equal(r.body.annoMax, 2003);
    assert.deepEqual(r.body.brand[0], { brand: "Hermès", capi: 2 });
    assert.deepEqual(r.body.paesi, [{ paese: "Francia", passaggi: 3 }]);
    assert.deepEqual(r.body.decenni.map((d) => d.decennio), [1980, 1990, 2000]);
  });

  it("il certificato segnala che il capo è dimostrativo", async () => {
    const v = await request(app).get("/api/verify/CAT-D1");
    assert.equal(v.body.capo.dimostrativo, true);
    assert.equal((await request(app).get("/api/verify/CAT-001")).body.capo.dimostrativo, false);
  });
});
