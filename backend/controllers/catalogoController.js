import Item from "../models/Item.js";

/*
 * Catalogo PUBBLICO dell'archivio dimostrativo.
 * Espone solo i capi marcati "dimostrativo" (dati inventati per la demo): i capi
 * reali non compaiono mai in un elenco pubblico, altrimenti chiunque potrebbe
 * raccogliere i codici dei tag e provare a clonarli. Nessun dato personale:
 * i nomi dei proprietari non sono inclusi.
 */
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const SOLO_DEMO = { dimostrativo: true };

export async function elencoCatalogo(req, res, next) {
  try {
    const { q, brand, categoria, materiale, decennio, pagina, perPagina } = req.dati.query;
    const filtro = { ...SOLO_DEMO, stato: { $ne: "archiviato" } };
    if (brand) filtro.brand = brand;
    if (categoria) filtro.categoria = categoria;
    if (materiale) filtro.materialePrincipale = materiale;
    if (decennio) filtro.annoProduzione = { $gte: decennio, $lte: decennio + 9 };
    if (q) {
      const re = new RegExp(escapeRegex(q), "i");
      filtro.$or = [{ brand: re }, { codiceModello: re }, { tagId: re }, { filieraProvenienza: re }];
    }

    const [capi, totale] = await Promise.all([
      Item.find(filtro)
        .select("tagId brand codiceModello categoria materialePrincipale annoProduzione filieraProvenienza storicoRigenerazione._id passaggiProprieta.luogo")
        .sort({ annoProduzione: -1, brand: 1, tagId: 1 })
        .skip((pagina - 1) * perPagina)
        .limit(perPagina)
        .lean(),
      Item.countDocuments(filtro),
    ]);
    const dati = capi.map((c) => ({
      tagId: c.tagId,
      brand: c.brand,
      codiceModello: c.codiceModello,
      categoria: c.categoria,
      materialePrincipale: c.materialePrincipale,
      annoProduzione: c.annoProduzione,
      filieraProvenienza: c.filieraProvenienza,
      interventi: c.storicoRigenerazione?.length ?? 0,
      passaggi: c.passaggiProprieta?.length ?? 0,
      ultimoLuogo: c.passaggiProprieta?.at(-1)?.luogo ?? null,
    }));
    res.json({ dati, pagina, perPagina, totale, pagine: Math.max(1, Math.ceil(totale / perPagina)) });
  } catch (err) {
    next(err);
  }
}

// Conta le occorrenze di un valore, dal più frequente (a parità, in ordine alfabetico)
function contaPer(valori) {
  const mappa = new Map();
  for (const v of valori) if (v !== undefined && v !== null && v !== "") mappa.set(v, (mappa.get(v) ?? 0) + 1);
  return [...mappa.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]), "it"));
}

/**
 * Statistiche dell'archivio dimostrativo. I conteggi sono calcolati in Node su un
 * sottoinsieme minimo di campi: l'archivio dimostrativo conta poche centinaia di capi
 * e il calcolo resta identico su qualsiasi versione di MongoDB.
 */
export async function statisticheCatalogo(req, res, next) {
  try {
    const capi = await Item.find(SOLO_DEMO)
      .select("brand categoria materialePrincipale annoProduzione storicoRigenerazione._id passaggiProprieta.luogo")
      .lean();

    const anni = capi.map((c) => c.annoProduzione).filter(Number.isFinite);
    // il paese è l'ultima parte di "Città, Paese" dei luoghi dei passaggi
    const paesi = capi.flatMap((c) => (c.passaggiProprieta ?? []).map((p) => p.luogo?.split(",").at(-1).trim()));

    res.json({
      capi: capi.length,
      interventi: capi.reduce((n, c) => n + (c.storicoRigenerazione?.length ?? 0), 0),
      passaggi: capi.reduce((n, c) => n + (c.passaggiProprieta?.length ?? 0), 0),
      annoMin: anni.length ? Math.min(...anni) : null,
      annoMax: anni.length ? Math.max(...anni) : null,
      brand: contaPer(capi.map((c) => c.brand)).map(([brand, n]) => ({ brand, capi: n })),
      categorie: contaPer(capi.map((c) => c.categoria)).map(([categoria, n]) => ({ categoria, capi: n })),
      materiali: contaPer(capi.map((c) => c.materialePrincipale)).map(([materiale, n]) => ({ materiale, capi: n })),
      decenni: contaPer(anni.map((a) => a - (a % 10)))
        .map(([decennio, n]) => ({ decennio, capi: n }))
        .sort((a, b) => a.decennio - b.decennio),
      paesi: contaPer(paesi).map(([paese, n]) => ({ paese, passaggi: n })),
    });
  } catch (err) {
    next(err);
  }
}
