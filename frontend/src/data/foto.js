/*
 * Foto decorative dei caroselli della home: Unsplash, licenza Unsplash
 * (uso gratuito, anche commerciale; https://unsplash.com/license).
 * Scelte senza loghi in evidenza: i marchi restano dei rispettivi titolari.
 * Crediti completi in docs/crediti-foto.md.
 */
const unsplash = (id, larghezza = 360, altezza = 480) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${larghezza}&h=${altezza}&q=70`;

// Fascia sinistra: i capi e gli accessori
export const FOTO_CAPI = [
  { id: "1551028719-00167b16eac5", didascalia: "Giacca in pelle", pagina: "nsRBbE6-YLs" },
  { id: "1584917865442-de89df76afd3", didascalia: "Borsa in pelle", pagina: "oCXVxwTFwqE" },
  { id: "1623854156816-4c4fc355ffc7", didascalia: "Pelle vissuta", pagina: "3OFBcQQTN64" },
  { id: "1589363358751-ab05797e5629", didascalia: "Trench e accessori", pagina: "W-7k72ThEr0" },
  { id: "1559563458-527698bf5295", didascalia: "Tracolla in pelle", pagina: "ZB4eQcNqVUs" },
  { id: "1559551409-dadc959f76b8", didascalia: "Montoni vintage", pagina: "eTCogYz7kQE" },
].map((f) => ({ ...f, src: unsplash(f.id) }));

// Fascia destra: rigenerazione, laboratori e boutique
export const FOTO_RIGENERAZIONE = [
  { id: "1606501126768-b78d4569d3f9", didascalia: "Laboratorio sartoriale", pagina: "TAZUc51iPUM" },
  { id: "1621261027519-a71ac66d5a68", didascalia: "Boutique vintage", pagina: "vFcfeKAKGlg" },
  { id: "1621785847991-884bae1f95f1", didascalia: "La vetrina", pagina: "bUg7Fdq6nXo" },
  { id: "1497997092403-f091fcf5b6c4", didascalia: "Cucitura di precisione", pagina: "jNKv4QohAk0" },
  { id: "1596484552993-aec4311d3381", didascalia: "Seconda vita", pagina: "UdQt3FT6rxM" },
  { id: "1641320197434-6ae0ca235048", didascalia: "Riparazione", pagina: "F14VKsS0iL8" },
  { id: "1760533091973-1262bf57d244", didascalia: "Pelle rigenerata", pagina: "KgjNOmuTlNw" },
  { id: "1578353022142-09264fd64295", didascalia: "Filati e forbici", pagina: "tX62O5F3AfU" },
].map((f) => ({ ...f, src: unsplash(f.id) }));
