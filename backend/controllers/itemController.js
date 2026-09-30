import Item from "../models/Item.js";
import { blockchain } from "../services/blockchain/index.js";
import { ancoraDatiCapo, ancoraEvento, ancoraPassaggio } from "../services/anchorService.js";
import { verificaMessaggioSun } from "../services/sunService.js";
import { urlVerifica, qrSvg, qrPng } from "../services/qrService.js";

/*
 * Controller lato COMMERCIANTE / ARTIGIANO (area gestionale, richiede login).
 * Contiene la business logic per creare capi, registrare eventi di
 * rigenerazione e passaggi di proprietà. Ogni scrittura viene poi ancorata
 * sulla blockchain in modo asincrono (services/anchorService.js).
 */

const TAG_DUPLICATO = "Questo tag risulta già associato a un altro capo.";
const nonTrovato = (res) => res.status(404).json({ errore: "Capo non trovato." });
const archiviato = (res) => res.status(409).json({ errore: "Il capo è archiviato: non può essere modificato." });
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * RF: Creazione dell'identità digitale + Associazione smart tag.
 * Crea un nuovo capo, lo salva su MongoDB e ne ancora l'impronta sulla blockchain.
 */
export async function creaItem(req, res, next) {
  try {
    const { proprietarioIniziale, ...dati } = req.dati.body;

    // Anti-duplicazione (requisito R): il tag non deve essere già in uso,
    // né nel database né sulla blockchain (un tag "bruciato" resta tale).
    if (await Item.exists({ tagId: dati.tagId })) {
      return res.status(409).json({ errore: TAG_DUPLICATO });
    }
    const chain = await blockchain();
    if ((await chain.leggiRegistro(dati.tagId)).registrato) {
      return res.status(409).json({ errore: "Questo tag risulta già registrato sulla blockchain." });
    }

    const item = await Item.create({
      ...dati,
      creatoDa: req.utente.id,
      registrazione: { stato: "in_attesa", aggiornatoIl: new Date() },
      passaggiProprieta: proprietarioIniziale
        ? [{ proprietario: proprietarioIniziale, registratoDa: req.utente.id, ancoraggio: { stato: "in_attesa", aggiornatoIl: new Date() } }]
        : [],
    });

    // Scritture blockchain asincrone: la risposta non attende la conferma (requisito P)
    ancoraDatiCapo(item._id, { nuovo: true });
    if (proprietarioIniziale) ancoraPassaggio(item._id, item.passaggiProprieta[0]._id);

    res.status(201).json(item);
  } catch (err) {
    // Gestione tag duplicato (indice unique) — coerente con RR anti-replay
    if (err.code === 11000) return res.status(409).json({ errore: TAG_DUPLICATO });
    next(err);
  }
}

/**
 * Elenco dei capi con ricerca e paginazione (dashboard del commerciante).
 * GET /api/items?q=gucci&stato=attivo&pagina=1&perPagina=20
 */
export async function elencaItems(req, res, next) {
  try {
    const { q, stato, pagina, perPagina } = req.dati.query;
    const filtro = {};
    if (stato) filtro.stato = stato === "attivo" ? { $ne: "archiviato" } : stato;
    if (q) {
      const re = new RegExp(escapeRegex(q), "i");
      filtro.$or = [{ brand: re }, { codiceModello: re }, { tagId: re }];
    }
    const [dati, totale] = await Promise.all([
      Item.find(filtro).sort({ createdAt: -1 }).skip((pagina - 1) * perPagina).limit(perPagina).lean(),
      Item.countDocuments(filtro),
    ]);
    res.json({ dati, pagina, perPagina, totale, pagine: Math.max(1, Math.ceil(totale / perPagina)) });
  } catch (err) {
    next(err);
  }
}

/** Recupera un singolo capo tramite il suo ID. */
export async function getItemById(req, res, next) {
  try {
    const item = await Item.findById(req.dati.params.id);
    if (!item) return nonTrovato(res);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

/** Ricerca per codice del tag (es. dopo aver letto un QR in negozio). */
export async function getItemByTag(req, res, next) {
  try {
    const item = await Item.findOne({ tagId: req.dati.params.tagId });
    if (!item) return nonTrovato(res);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

/**
 * Modifica i dati descrittivi del capo (il tagId non è modificabile).
 * La nuova impronta dei dati viene ancorata sulla blockchain: la versione
 * precedente resta nello storico degli eventi del contratto.
 */
export async function modificaItem(req, res, next) {
  try {
    const item = await Item.findById(req.dati.params.id);
    if (!item) return nonTrovato(res);
    if (item.stato === "archiviato") return archiviato(res);
    // null = campo svuotato dall'utente: viene rimosso
    for (const [campo, valore] of Object.entries(req.dati.body)) item.set(campo, valore === null ? undefined : valore);
    item.registrazione = { ...(item.registrazione?.toObject?.() ?? {}), stato: "in_attesa", errore: undefined, aggiornatoIl: new Date() };
    await item.save();
    ancoraDatiCapo(item._id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

/** Archivia il capo (non lo cancella: la sua storia resta verificabile). */
export async function archiviaItem(req, res, next) {
  try {
    const item = await Item.findById(req.dati.params.id);
    if (!item) return nonTrovato(res);
    if (item.stato === "archiviato") return res.status(409).json({ errore: "Il capo è già archiviato." });
    item.stato = "archiviato";
    item.registrazione = { ...(item.registrazione?.toObject?.() ?? {}), stato: "in_attesa", errore: undefined, aggiornatoIl: new Date() };
    await item.save();
    ancoraDatiCapo(item._id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

/**
 * RF: Registrazione dell'evento di rigenerazione sartoriale.
 * Aggiunge un evento all'array embedded storicoRigenerazione.
 */
export async function aggiungiEvento(req, res, next) {
  try {
    const item = await Item.findById(req.dati.params.id);
    if (!item) return nonTrovato(res);
    if (item.stato === "archiviato") return archiviato(res);

    item.storicoRigenerazione.push({
      ...req.dati.body,
      registratoDa: req.utente.id,
      ancoraggio: { stato: "in_attesa", aggiornatoIl: new Date() },
    });
    await item.save();
    ancoraEvento(item._id, item.storicoRigenerazione.at(-1)._id);

    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
}

/**
 * Registra un nuovo passaggio di proprietà.
 * RF (anti-contraffazione): il sistema deve convalidare "l'intera catena dei
 * passaggi di proprietà storici". Questo endpoint permette di costruire quella catena.
 */
export async function aggiungiPassaggioProprieta(req, res, next) {
  try {
    const item = await Item.findById(req.dati.params.id);
    if (!item) return nonTrovato(res);
    if (item.stato === "archiviato") return archiviato(res);

    item.passaggiProprieta.push({
      proprietario: req.dati.body.proprietario,
      registratoDa: req.utente.id,
      ancoraggio: { stato: "in_attesa", aggiornatoIl: new Date() },
    });
    await item.save();
    ancoraPassaggio(item._id, item.passaggiProprieta.at(-1)._id);

    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
}

/**
 * Elimina un capo (solo amministratore).
 * NOTA: utile solo per ripulire il database durante le prove della demo.
 * Non corrisponde a un requisito funzionale: sulla blockchain il tag resta
 * registrato (i record on-chain sono immutabili), quindi non potrà essere
 * riusato per un nuovo capo.
 */
export async function eliminaItem(req, res, next) {
  try {
    const item = await Item.findByIdAndDelete(req.dati.params.id);
    if (!item) return nonTrovato(res);
    res.status(200).json({ messaggio: "Capo eliminato.", id: req.dati.params.id });
  } catch (err) {
    next(err);
  }
}

/** QR code stampabile con l'URL pubblico di verifica (?formato=svg|png). */
export async function qrItem(req, res, next) {
  try {
    const item = await Item.findById(req.dati.params.id).lean();
    if (!item) return nonTrovato(res);
    const url = urlVerifica(item.tagId);
    res.set("X-Url-Verifica", url);
    if (req.query.formato === "png") {
      res.type("png").send(await qrPng(url));
    } else {
      res.type("image/svg+xml").send(await qrSvg(url));
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Associa un chip NTAG 424 DNA al capo.
 * Si invia il messaggio letto dal chip ({ e, c }): il server lo verifica con le
 * chiavi SDM e salva UID e contatore. In alternativa si può indicare l'UID.
 */
export async function associaNfc(req, res, next) {
  try {
    const item = await Item.findById(req.dati.params.id);
    if (!item) return nonTrovato(res);
    if (item.stato === "archiviato") return archiviato(res);

    let uid;
    let contatore = null;
    if (req.dati.body.e) {
      const esito = verificaMessaggioSun(req.dati.body);
      if (!esito.macValido) {
        return res.status(400).json({ errore: "Messaggio del chip non autentico: controlla le chiavi SDM." });
      }
      ({ uid, contatore } = esito);
    } else {
      uid = req.dati.body.uid.toUpperCase();
    }

    const altro = await Item.findOne({ "nfc.uid": uid, _id: { $ne: item._id } }).lean();
    if (altro) return res.status(409).json({ errore: `Questo chip è già associato al capo ${altro.tagId}.` });

    item.nfc = { uid, ultimoContatore: contatore, associatoIl: new Date() };
    await item.save();
    res.json({ tagId: item.tagId, nfc: item.nfc });
  } catch (err) {
    next(err);
  }
}
