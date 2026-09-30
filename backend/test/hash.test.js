import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { jsonCanonico, impronta, improntaCapo } from "../services/hashService.js";

describe("Impronte crittografiche", () => {
  it("JSON canonico: l'ordine delle chiavi non cambia l'impronta", () => {
    assert.equal(jsonCanonico({ b: 1, a: { d: 2, c: 3 } }), jsonCanonico({ a: { c: 3, d: 2 }, b: 1 }));
    assert.equal(impronta({ b: 1, a: 2 }), impronta({ a: 2, b: 1 }));
  });

  it("date e campi assenti sono normalizzati", () => {
    assert.equal(jsonCanonico({ d: new Date("2026-01-01T00:00:00Z"), x: undefined, y: null }), '{"d":"2026-01-01T00:00:00.000Z"}');
  });

  it("l'impronta del capo cambia se cambia un dato", () => {
    const capo = { tagId: "NFC-1", brand: "Gucci", codiceModello: "A", materialiOriginari: "Pelle" };
    assert.notEqual(improntaCapo(capo), improntaCapo({ ...capo, brand: "Prada" }));
    assert.match(improntaCapo(capo), /^0x[0-9a-f]{64}$/);
  });
});
