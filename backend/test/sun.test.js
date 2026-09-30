import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { aesCmac, verificaMessaggioSun } from "../services/sunService.js";
import { avviaAmbiente, creaUtenti, auth, capoDiProva, attendiAncoraggi } from "./helpers.js";

// Vettore ufficiale NXP AN12196 (chiavi di fabbrica tutte a zero)
const VETTORE = { e: "EF963FF7828658A599F3041510671E88", c: "94EED9EE65337086" };

describe("NFC NTAG 424 DNA: crittografia SUN e anti-replay (punto 16)", () => {
  it("AES-CMAC: vettori di prova RFC 4493", () => {
    const K = Buffer.from("2b7e151628aed2a6abf7158809cf4f3c", "hex");
    const M = Buffer.from(
      "6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710",
      "hex"
    );
    const attesi = { 0: "bb1d6929e95937287fa37d129b756746", 16: "070a16b46b4d4144f79bdd9dd04a287c", 40: "dfa66747de9ae63030ca32611497c827", 64: "51f0bebf7e3b9d92fc49741779363cfe" };
    for (const [n, mac] of Object.entries(attesi)) assert.equal(aesCmac(K, M.subarray(0, Number(n))).toString("hex"), mac);
  });

  it("messaggio SUN del vettore AN12196: UID 04DE5F1EACC040, contatore 61, CMAC valido", () => {
    const r = verificaMessaggioSun(VETTORE, { metaRead: Buffer.alloc(16), fileRead: Buffer.alloc(16) });
    assert.deepEqual(r, { uid: "04DE5F1EACC040", contatore: 61, macValido: true });
  });

  it("CMAC alterato o chiave sbagliata -> non valido", () => {
    const zero = { metaRead: Buffer.alloc(16), fileRead: Buffer.alloc(16) };
    assert.equal(verificaMessaggioSun({ ...VETTORE, c: "94EED9EE65337087" }, zero).macValido, false);
    assert.equal(verificaMessaggioSun(VETTORE, { ...zero, fileRead: Buffer.alloc(16, 1) }).macValido, false);
  });

  describe("endpoint", () => {
    let env, app, token, idCapo;
    before(async () => {
      env = await avviaAmbiente({ SDM_META_READ_KEY: "0".repeat(32), SDM_FILE_READ_KEY: "0".repeat(32) });
      app = env.app;
      token = await creaUtenti(app);
      const r = await request(app).post("/api/items").set(auth(token.brand_manager)).send(capoDiProva("NFC-424"));
      idCapo = r.body._id;
      await attendiAncoraggi();
    });
    after(() => env.chiudi());

    it("chip non ancora associato -> 404", async () => {
      const r = await request(app).get(`/api/verify/sun?e=${VETTORE.e}&c=${VETTORE.c}`);
      assert.equal(r.status, 404);
    });

    it("associazione del chip al capo tramite messaggio SUN", async () => {
      const r = await request(app).post(`/api/items/${idCapo}/nfc`).set(auth(token.brand_manager)).send({ uid: "04DE5F1EACC040" });
      assert.equal(r.status, 200);
      assert.equal(r.body.nfc.uid, "04DE5F1EACC040");
    });

    it("prima lettura -> certificato; stesso URL riusato -> 409 replay", async () => {
      const prima = await request(app).get(`/api/verify/sun?e=${VETTORE.e}&c=${VETTORE.c}`);
      assert.equal(prima.status, 200);
      assert.equal(prima.body.capo.tagId, "NFC-424");
      assert.equal(prima.body.nfc.antiReplay, "superato");
      assert.equal(prima.body.nfc.contatoreLetture, 61);
      const seconda = await request(app).get(`/api/verify/sun?e=${VETTORE.e}&c=${VETTORE.c}`);
      assert.equal(seconda.status, 409);
      assert.equal(seconda.body.replay, true);
    });

    it("messaggio alterato -> 400; parametri malformati -> 400", async () => {
      assert.equal((await request(app).get(`/api/verify/sun?e=${VETTORE.e}&c=94EED9EE65337087`)).status, 400);
      assert.equal((await request(app).get("/api/verify/sun?e=123&c=xyz")).status, 400);
    });

    it("associazione con messaggio non autentico -> 400", async () => {
      const r = await request(app).post(`/api/items/${idCapo}/nfc`).set(auth(token.brand_manager)).send({ e: VETTORE.e, c: "0000000000000000" });
      assert.equal(r.status, 400);
    });
  });
});
