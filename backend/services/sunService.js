/*
 * NFC NTAG 424 DNA — verifica del messaggio dinamico SUN (Secure Unique NFC)
 * --------------------------------------------------------------------------
 * A ogni avvicinamento del telefono il chip genera un URL diverso, per esempio
 *   https://<dominio>/s?e=<PICCData cifrato, 32 hex>&c=<SDMMAC, 16 hex>
 * dove:
 *  - e = UID del chip + contatore di letture, cifrati con AES-128 (chiave SDMMetaRead)
 *  - c = codice di autenticazione (CMAC AES-128) calcolato con una chiave di
 *        sessione derivata da UID e contatore (chiave SDMFileRead)
 * Il server decifra, ricalcola il CMAC e controlla che il contatore sia
 * maggiore dell'ultimo visto: un URL copiato o registrato non vale una
 * seconda volta (anti-replay) e un chip clonato non conosce le chiavi.
 * Riferimento: NXP AN12196 "NTAG 424 DNA and NTAG 424 DNA TagTamper features and hints".
 */
import crypto from "node:crypto";

const ZERO16 = Buffer.alloc(16);

function aesEcb(chiave, blocco) {
  const cifrario = crypto.createCipheriv("aes-128-ecb", chiave, null);
  cifrario.setAutoPadding(false);
  return Buffer.concat([cifrario.update(blocco), cifrario.final()]);
}

function xor(a, b) {
  const out = Buffer.alloc(a.length);
  for (let i = 0; i < a.length; i++) out[i] = a[i] ^ b[i];
  return out;
}

function shiftSinistra(buf) {
  const out = Buffer.alloc(buf.length);
  let riporto = 0;
  for (let i = buf.length - 1; i >= 0; i--) {
    out[i] = ((buf[i] << 1) & 0xff) | riporto;
    riporto = (buf[i] & 0x80) >> 7;
  }
  return out;
}

function sottochiavi(chiave) {
  const L = aesEcb(chiave, ZERO16);
  const K1 = shiftSinistra(L);
  if (L[0] & 0x80) K1[15] ^= 0x87;
  const K2 = shiftSinistra(K1);
  if (K1[0] & 0x80) K2[15] ^= 0x87;
  return [K1, K2];
}

/** AES-CMAC (RFC 4493). */
export function aesCmac(chiave, messaggio = Buffer.alloc(0)) {
  const [K1, K2] = sottochiavi(chiave);
  const n = Math.max(1, Math.ceil(messaggio.length / 16));
  const ultimoCompleto = messaggio.length > 0 && messaggio.length % 16 === 0;
  let ultimo = messaggio.subarray((n - 1) * 16);
  if (ultimoCompleto) {
    ultimo = xor(ultimo, K1);
  } else {
    const riempito = Buffer.alloc(16);
    ultimo.copy(riempito);
    riempito[ultimo.length] = 0x80;
    ultimo = xor(riempito, K2);
  }
  let X = ZERO16;
  for (let i = 0; i < n - 1; i++) X = aesEcb(chiave, xor(X, messaggio.subarray(i * 16, i * 16 + 16)));
  return aesEcb(chiave, xor(X, ultimo));
}

/** MAC troncato NXP: gli 8 byte in posizione dispari (1, 3, ..., 15). */
const troncaMac = (mac) => Buffer.from([1, 3, 5, 7, 9, 11, 13, 15].map((i) => mac[i]));

const chiaveDaEnv = (nome) => {
  const hex = process.env[nome] ?? "00000000000000000000000000000000";
  if (!/^[0-9a-fA-F]{32}$/.test(hex)) throw new Error(`${nome} deve essere di 32 caratteri esadecimali`);
  return Buffer.from(hex, "hex");
};

/**
 * Decifra PICCData e verifica il CMAC.
 * @returns {{ uid: string, contatore: number, macValido: boolean }}
 */
export function verificaMessaggioSun({ e, c }, chiavi = {}) {
  const kMeta = chiavi.metaRead ?? chiaveDaEnv("SDM_META_READ_KEY");
  const kFile = chiavi.fileRead ?? chiaveDaEnv("SDM_FILE_READ_KEY");

  // 1) PICCData = AES-128-CBC^-1(K_SDMMetaRead, e), IV = 0
  const decifratore = crypto.createDecipheriv("aes-128-cbc", kMeta, ZERO16);
  decifratore.setAutoPadding(false);
  const picc = Buffer.concat([decifratore.update(Buffer.from(e, "hex")), decifratore.final()]);

  const tagDati = picc[0];
  const haUid = (tagDati & 0x80) !== 0;
  const haContatore = (tagDati & 0x40) !== 0;
  const lunghezzaUid = tagDati & 0x0f;
  if (!haUid || !haContatore || lunghezzaUid !== 7) {
    return { uid: null, contatore: null, macValido: false, errore: "PICCData non valido (chiave SDMMetaRead errata?)" };
  }
  const uid = picc.subarray(1, 8);
  const contatoreLE = picc.subarray(8, 11);
  const contatore = contatoreLE[0] | (contatoreLE[1] << 8) | (contatoreLE[2] << 16);

  // 2) Chiave di sessione: CMAC(K_SDMFileRead, SV2), SV2 = 3CC3 0001 0080 || UID || contatore
  const sv2 = Buffer.concat([Buffer.from("3CC300010080", "hex"), uid, contatoreLE]);
  const kSessione = aesCmac(kFile, sv2);

  // 3) SDMMAC su input vuoto (URL con solo e= e c=), troncato a 8 byte
  const atteso = troncaMac(aesCmac(kSessione, Buffer.alloc(0)));
  const ricevuto = Buffer.from(c, "hex");
  const macValido = ricevuto.length === 8 && crypto.timingSafeEqual(atteso, ricevuto);

  return { uid: uid.toString("hex").toUpperCase(), contatore, macValido };
}
