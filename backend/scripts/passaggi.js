/*
 * PASSAGGI 1-8 — test delle API in Node (funziona su Mac, Windows e Linux).
 * Il server deve essere avviato (npm run dev) in un altro terminale.
 *
 * Uso:
 *   npm run passaggi                    # tutti i passaggi
 *   npm run passaggi -- --passaggio 7   # solo il passaggio 7
 * Credenziali: chieste all'avvio, oppure variabili PASSAGGI_EMAIL e PASSAGGI_PASSWORD.
 * Altre opzioni: --base http://localhost:5001/api  --tag NFC-001
 */
import "dotenv/config";
import { colore, chiedi, chiamata, attendi } from "./_cli.js";

const argomento = (nome, predefinito) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > -1 ? process.argv[i + 1] : predefinito;
};
const BASE = argomento("base", `http://localhost:${process.env.PORT ?? 5001}/api`);
const TAG = argomento("tag", "NFC-001");
const SOLO = Number(argomento("passaggio", 0));

let falliti = 0;
let token;
const titolo = (n, t) => console.log(colore.ciano(`\n=== PASSAGGIO ${n} - ${t} ===`));
const verifica = (ok, messaggio) => {
  console.log(ok ? colore.verde(`  [OK]   ${messaggio}`) : colore.rosso(`  [FAIL] ${messaggio}`));
  if (!ok) falliti++;
};
const api = (metodo, percorso, corpo) => chiamata(BASE, metodo, percorso, { corpo, token });

async function idDelCapo() {
  const r = await api("GET", `/items/tag/${TAG}`);
  if (r.status !== 200) throw new Error(`Nessun capo con tagId ${TAG}: esegui prima il passaggio 2`);
  return r.dati._id;
}

async function attendiConferme(tentativi = 20) {
  for (let i = 0; i < tentativi; i++) {
    const r = await api("GET", `/verify/${TAG}`);
    if (r.status === 200 && r.dati.certificatoAutenticita.integrita.stato !== "in_attesa") return r;
    await attendi(500);
  }
  return api("GET", `/verify/${TAG}`);
}

const passaggi = {
  async 1() {
    titolo(1, "Health check del server");
    const r = await api("GET", "/health");
    verifica(r.status === 200 && r.dati.stato === "online", `Server attivo (blockchain: ${r.dati?.blockchain})`);
  },

  async 2() {
    titolo(2, `Creazione identità digitale del capo + associazione tag ${TAG}`);
    const esistente = await api("GET", `/items/tag/${TAG}`);
    if (esistente.status === 200) {
      console.log(colore.giallo(`  [INFO] Il capo con ${TAG} esiste già (id ${esistente.dati._id}): creazione saltata`));
      return;
    }
    const r = await api("POST", "/items", {
      brand: "Gucci",
      codiceModello: "GG-2024",
      materialiOriginari: "Pelle e cotone",
      filieraProvenienza: "Italia",
      categoria: "giacca",
      tagId: TAG,
    });
    verifica(r.status === 201, `Capo creato (HTTP ${r.status}) id ${r.dati?._id}`);
    verifica(r.dati?.registrazione?.stato === "in_attesa", "Registrazione sulla blockchain avviata in modo asincrono");
  },

  async 3() {
    titolo(3, "Registrazione evento di rigenerazione");
    const id = await idDelCapo();
    const r = await api("POST", `/items/${id}/eventi`, {
      tipo: "upcycling",
      descrizione: "Rifoderatura interna e sostituzione bottoni",
      materialiNuovi: "Cotone riciclato certificato",
      operatore: "Laboratorio Bari",
    });
    verifica(r.status === 200, `Evento registrato (HTTP ${r.status}), eventi totali: ${r.dati?.storicoRigenerazione?.length}`);
  },

  async 4() {
    titolo(4, "Lettura del singolo capo per ID");
    const id = await idDelCapo();
    const r = await api("GET", `/items/${id}`);
    verifica(r.status === 200 && r.dati.tagId === TAG, `Dettaglio letto: ${r.dati?.brand} ${r.dati?.codiceModello}`);
  },

  async 5() {
    titolo(5, "Passaggio di proprietà (catena di possesso)");
    const id = await idDelCapo();
    const r = await api("POST", `/items/${id}/proprieta`, { proprietario: "Maria Rossi" });
    verifica(r.status === 200, `Passaggio registrato, catena di ${r.dati?.passaggiProprieta?.length} proprietari`);
  },

  async 6() {
    titolo(6, "Verifica pubblica (scansione del consumatore, senza login)");
    const r = await chiamata(BASE, "GET", `/verify/${TAG}`);
    verifica(r.status === 200, `Certificato ricevuto (HTTP ${r.status})`);
    const nomi = (r.dati?.capo?.passaggiProprieta ?? []).map((p) => p.proprietario).join(" -> ");
    verifica(!/Rossi/.test(JSON.stringify(r.dati)), `Nomi dei proprietari minimizzati (GDPR): ${nomi || "nessuno"}`);
  },

  async 7() {
    titolo(7, `Anti-replay: rifiuto di un secondo capo con lo stesso tag ${TAG}`);
    const r = await api("POST", "/items", { brand: "Prada", codiceModello: "PR-999", materialiOriginari: "Nylon", tagId: TAG });
    verifica(r.status === 409, `Tag duplicato rifiutato: HTTP ${r.status} (atteso 409) - ${r.dati?.errore}`);
    const falso = await chiamata(BASE, "GET", "/verify/TAG-INESISTENTE-999");
    verifica(falso.status === 404 && falso.dati.autentico === false, `Tag mai registrato: HTTP ${falso.status}, autentico = ${falso.dati?.autentico}`);
    const senzaLogin = await chiamata(BASE, "POST", "/items", { corpo: { brand: "X", codiceModello: "Y", materialiOriginari: "Z", tagId: "NFC-XYZ" } });
    verifica(senzaLogin.status === 401, `Creazione senza login rifiutata: HTTP ${senzaLogin.status} (atteso 401)`);
  },

  async 8() {
    titolo(8, "Verifica finale completa dei dati (dopo gli ancoraggi asincroni)");
    const r = await attendiConferme();
    const c = r.dati?.certificatoAutenticita;
    const integrita = c?.integrita;
    verifica(r.status === 200 && c?.autentico === true, `autentico = ${c?.autentico}`);
    verifica(integrita?.stato === "verificato", `integrità = ${integrita?.stato} (${integrita?.messaggio})`);
    if (["incompleto", "non_registrato"].includes(integrita?.stato)) {
      console.log(colore.giallo("  [INFO] Dati creati con la versione precedente: esegui 'npm run migra' e ripeti il passaggio 8"));
    }
    verifica((r.dati?.capo?.storicoRigenerazione?.length ?? 0) >= 1, `Eventi di rigenerazione: ${r.dati?.capo?.storicoRigenerazione?.length}`);
    verifica((r.dati?.capo?.passaggiProprieta?.length ?? 0) >= 1, `Passaggi di proprietà: ${r.dati?.capo?.passaggiProprieta?.length}`);
    const voci = integrita?.voci;
    if (voci) console.log(`  Voci verificate on-chain: ${voci.verificate}, in attesa: ${voci.inAttesa}, non ancorate: ${voci.nonAncorate}`);
    const imp = r.dati?.impattoAmbientale;
    console.log(`  Impatto ambientale: ${imp?.disponibile ? `${imp.co2RisparmiataKg} kg CO2e, ${imp.acquaPreservataLitri} L` : imp?.nota}`);
  },
};

try {
  const email = process.env.PASSAGGI_EMAIL ?? (await chiedi("Email (account del backend): "));
  const password = process.env.PASSAGGI_PASSWORD ?? (await chiedi("Password: ", { nascosto: true }));
  const accesso = await chiamata(BASE, "POST", "/auth/login", { corpo: { email, password } });
  if (accesso.status !== 200) throw new Error(`Login fallito (HTTP ${accesso.status}): ${accesso.dati?.errore}`);
  token = accesso.dati.token;
  console.log(colore.verde(`Accesso effettuato come ${accesso.dati.utente.nome} (${accesso.dati.utente.ruolo})`));

  for (const n of SOLO ? [SOLO] : [1, 2, 3, 4, 5, 6, 7, 8]) {
    try {
      await passaggi[n]();
    } catch (err) {
      verifica(false, err.message);
    }
  }
} catch (err) {
  console.error(colore.rosso(err.cause?.code === "ECONNREFUSED" ? `Server non raggiungibile su ${BASE}: hai avviato "npm run dev"?` : err.message));
  process.exit(1);
}
console.log(falliti === 0 ? colore.verde("\nTUTTI I CONTROLLI SUPERATI") : colore.rosso(`\nCONTROLLI FALLITI: ${falliti}`));
process.exit(falliti === 0 ? 0 : 1);
