// Impronte crittografiche (keccak256, la stessa funzione di hash di Ethereum/Polygon).
// Sulla blockchain si salvano SOLO queste impronte: se qualcuno modifica i dati
// nel database, l'impronta ricalcolata non coincide più con quella ancorata
// e la manomissione diventa rilevabile.
import { keccak256, toUtf8Bytes } from "ethers";

// JSON canonico: chiavi ordinate, date in ISO, id come stringhe, niente "undefined".
// Serve perché lo stesso dato produca SEMPRE la stessa impronta.
function normalizza(valore) {
  if (valore === undefined || valore === null) return null;
  if (valore instanceof Date) return valore.toISOString();
  if (typeof valore === "object" && typeof valore.toHexString === "function") return valore.toHexString(); // ObjectId
  if (Array.isArray(valore)) return valore.map(normalizza);
  if (typeof valore === "object") {
    return Object.keys(valore)
      .sort()
      .reduce((acc, chiave) => {
        const v = normalizza(valore[chiave]);
        if (v !== null) acc[chiave] = v;
        return acc;
      }, {});
  }
  return valore;
}

export const jsonCanonico = (valore) => JSON.stringify(normalizza(valore));

export const impronta = (valore) => keccak256(toUtf8Bytes(jsonCanonico(valore)));

// Impronta del codice del tag (chiave del capo sullo smart contract)
export const improntaTag = (tagId) => keccak256(toUtf8Bytes(String(tagId)));

// Dati identificativi del capo (non include lo storico, che ha impronte proprie)
export function improntaCapo(item) {
  return impronta({
    v: 1,
    tagId: item.tagId,
    brand: item.brand,
    codiceModello: item.codiceModello,
    materialiOriginari: item.materialiOriginari,
    filieraProvenienza: item.filieraProvenienza,
    categoria: item.categoria,
    materialePrincipale: item.materialePrincipale,
    annoProduzione: item.annoProduzione,
    stato: item.stato ?? "attivo",
  });
}

export function improntaEvento(evento) {
  return impronta({
    v: 1,
    tipo: "evento",
    id: String(evento._id),
    tipoEvento: evento.tipo,
    descrizione: evento.descrizione,
    materialiNuovi: evento.materialiNuovi,
    operatore: evento.operatore,
    data: evento.data ? new Date(evento.data) : null,
  });
}

// L'id del passaggio (casuale) fa da "sale": il nome del proprietario non è
// ricavabile dall'impronta per tentativi.
export function improntaPassaggio(passaggio) {
  return impronta({
    v: 1,
    tipo: "passaggio",
    id: String(passaggio._id),
    proprietario: passaggio.proprietario,
    data: passaggio.data ? new Date(passaggio.data) : null,
  });
}
