import Item from "../models/Item.js";
import { verificaIntegrita } from "../services/integrityService.js";
import { calcolaImpattoAmbientale } from "../services/impactService.js";
import { verificaMessaggioSun } from "../services/sunService.js";

/*
 * Controller lato CONSUMATORE (accesso pubblico).
 * Gestisce la scansione del tag: nessun login richiesto (requisito RU: Access Public).
 */

// Minimizzazione dei dati personali (GDPR): "Maria Rossi" -> "M. R."
const iniziali = (nome = "") =>
  nome
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => `${p[0].toUpperCase()}.`)
    .join(" ") || "—";

const ancoraggioPubblico = (a) => (a ? { stato: a.stato, txHash: a.txHash ?? null, rete: a.rete ?? null } : { stato: "non_ancorato" });

async function certificato(item) {
  const integrita = await verificaIntegrita(item);
  // Autentico solo se TUTTO coincide con la blockchain (gli stati di attesa non bastano)
  const autentico = integrita.stato === "verificato";
  return {
    capo: {
      tagId: item.tagId,
      brand: item.brand,
      codiceModello: item.codiceModello,
      materialiOriginari: item.materialiOriginari,
      filieraProvenienza: item.filieraProvenienza,
      categoria: item.categoria,
      materialePrincipale: item.materialePrincipale,
      annoProduzione: item.annoProduzione,
      stato: item.stato ?? "attivo",
      storicoRigenerazione: item.storicoRigenerazione.map((e) => ({
        tipo: e.tipo,
        descrizione: e.descrizione,
        materialiNuovi: e.materialiNuovi,
        operatore: e.operatore,
        data: e.data,
        ancoraggio: ancoraggioPubblico(e.ancoraggio),
      })),
      passaggiProprieta: item.passaggiProprieta.map((p, i) => ({
        passo: i + 1,
        proprietario: iniziali(p.proprietario),
        data: p.data,
        ancoraggio: ancoraggioPubblico(p.ancoraggio),
      })),
    },
    certificatoAutenticita: {
      autentico,
      txHash: item.registrazione?.txHash ?? item.blockchainTxHash ?? null,
      rete: integrita.rete,
      tokenId: integrita.tokenId ?? null,
      passaggiVerificati: item.passaggiProprieta.length,
      integrita,
    },
    impattoAmbientale: calcolaImpattoAmbientale(item),
    verificatoIl: new Date().toISOString(),
  };
}

/**
 * RF: Tracciamento ed emissione del certificato di autenticità.
 * RF: Dashboard della sostenibilità e calcolo dell'impatto.
 *
 * Dato il codice del tag fisico, recupera il capo, confronta i dati con quelli
 * ancorati sulla blockchain e calcola l'impatto ambientale evitato.
 */
export async function verificaCapo(req, res, next) {
  try {
    // Il requisito di performance (<2s) è supportato dall'indice su tagId (unique).
    const item = await Item.findOne({ tagId: req.dati.params.tagId }).lean();
    if (!item) {
      return res.status(404).json({
        autentico: false,
        errore: "Nessun capo associato a questo tag. Possibile contraffazione.",
      });
    }
    res.json(await certificato(item));
  } catch (err) {
    next(err);
  }
}

/**
 * Verifica tramite chip NTAG 424 DNA (URL dinamico /s?e=...&c=...).
 * 1) il messaggio deve essere autentico (CMAC corretto: il chip conosce la chiave);
 * 2) il contatore deve essere più alto dell'ultimo visto (anti-replay):
 *    l'aggiornamento è atomico, due richieste con lo stesso URL non passano entrambe.
 */
export async function verificaSun(req, res, next) {
  try {
    const esito = verificaMessaggioSun(req.dati.query);
    if (!esito.macValido) {
      return res.status(400).json({
        autentico: false,
        errore: "Il messaggio del tag non è autentico: possibile chip clonato o URL alterato.",
      });
    }

    const item = await Item.findOneAndUpdate(
      {
        "nfc.uid": esito.uid,
        $or: [{ "nfc.ultimoContatore": null }, { "nfc.ultimoContatore": { $lt: esito.contatore } }],
      },
      { $set: { "nfc.ultimoContatore": esito.contatore, "nfc.ultimaLettura": new Date() } },
      { new: true }
    ).lean();

    if (!item) {
      const associato = await Item.exists({ "nfc.uid": esito.uid });
      if (!associato) {
        return res.status(404).json({ autentico: false, errore: "Chip autentico ma non associato a nessun capo." });
      }
      return res.status(409).json({
        autentico: false,
        replay: true,
        errore: "Questo link di verifica è già stato usato. Avvicina di nuovo il telefono al tag.",
      });
    }

    const risposta = await certificato(item);
    risposta.nfc = { messaggioAutentico: true, antiReplay: "superato", contatoreLetture: esito.contatore };
    res.json(risposta);
  } catch (err) {
    next(err);
  }
}
