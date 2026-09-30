import { Link } from "react-router-dom";
import Ancoraggio from "./Ancoraggio.jsx";
import { IconaGruccia } from "./Icone.jsx";
import { aggiungiAllArmadio, riassuntoCapo, rimuoviDallArmadio, useArmadio } from "../utils/archivio.js";
import { TIPI_EVENTO, data, hashBreve, numero, maiuscola } from "../utils/formato.js";

const ESITI = {
  verificato: { classe: "ok", titolo: "Capo autentico", icona: "✓" },
  // "Autentico" solo quando tutto coincide con la blockchain
  in_attesa: { classe: "attesa", titolo: "Registrazione in corso", icona: "…" },
  incompleto: { classe: "attesa", titolo: "Verifica non conclusiva", icona: "!" },
  manomesso: { classe: "ko", titolo: "Attenzione: dati non coincidenti", icona: "✕" },
  non_registrato: { classe: "ko", titolo: "Capo non registrato sulla blockchain", icona: "✕" },
};

function Esito({ certificato, nfc }) {
  const integrita = certificato.integrita;
  const esito = ESITI[integrita.stato] ?? ESITI.non_registrato;
  return (
    <div className={`esito esito-${esito.classe}`}>
      <span className="esito-icona" aria-hidden="true">
        {esito.icona}
      </span>
      <div>
        <h2>{esito.titolo}</h2>
        <p>{integrita.messaggio}</p>
        {nfc && (
          <p className="esito-nfc">
            Chip NFC autentico · lettura n. {nfc.contatoreLetture} · link monouso verificato
          </p>
        )}
      </div>
    </div>
  );
}

// "Aggiungi al mio armadio": solo per capi verificati; l'elenco resta sul dispositivo
function AzioniArmadio({ dati }) {
  const armadio = useArmadio();
  const { tagId } = dati.capo;
  const presente = armadio.some((c) => c.tagId === tagId);
  if (!presente && !dati.certificatoAutenticita.autentico) return null;
  return (
    <div className="azioni-armadio">
      {presente ? (
        <>
          <span className="nel-armadio">
            <IconaGruccia dimensione={20} /> Nel tuo armadio
          </span>
          <Link to="/armadio">Apri l’armadio</Link>
          <button type="button" className="link" onClick={() => rimuoviDallArmadio(tagId)}>
            Rimuovi
          </button>
        </>
      ) : (
        <>
          <button type="button" className="pulsante" onClick={() => aggiungiAllArmadio(riassuntoCapo(dati))}>
            <IconaGruccia dimensione={20} /> Aggiungi al mio armadio
          </button>
          <span className="nota">Hai acquistato questo capo? Conservane il passaporto su questo dispositivo.</span>
        </>
      )}
    </div>
  );
}

function Impatto({ impatto }) {
  if (!impatto?.disponibile) {
    return (
      <section className="sezione">
        <h3>Impatto ambientale</h3>
        <p className="nota">{impatto?.nota ?? "Stima non disponibile."}</p>
      </section>
    );
  }
  return (
    <section className="sezione">
      <h3>Impatto ambientale evitato</h3>
      <div className="indicatori">
        <div className="indicatore">
          <span className="valore">{numero(impatto.co2RisparmiataKg)}</span>
          <span className="unita">kg di CO₂e</span>
          <span className="intervallo">
            stima {numero(impatto.intervallo.co2Kg[0])}–{numero(impatto.intervallo.co2Kg[1])} kg
          </span>
        </div>
        <div className="indicatore">
          <span className="valore">{numero(impatto.acquaPreservataLitri, 0)}</span>
          <span className="unita">litri d’acqua</span>
          <span className="intervallo">
            stima {numero(impatto.intervallo.acquaL[0], 0)}–{numero(impatto.intervallo.acquaL[1], 0)} L
          </span>
        </div>
      </div>
      {impatto.verificato === false && (
        <p className="nota">Valori di letteratura ancora da verificare sulla fonte originale: considerali indicativi.</p>
      )}
      <details className="fonti">
        <summary>Come è calcolato</summary>
        <p>{impatto.metodo}.</p>
        <p>Unità di riferimento: {impatto.unitaFunzionale}.</p>
        <ul>
          {impatto.fonti.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="nota">{impatto.nota}</p>
      </details>
    </section>
  );
}

export default function Certificato({ dati }) {
  const { capo, certificatoAutenticita: cert, impattoAmbientale, nfc } = dati;
  return (
    <article className="certificato">
      <header className="certificato-testata">
        <p className="sopratitolo">Passaporto digitale · {capo.tagId}</p>
        <h1>{capo.brand}</h1>
        <p className="sottotitolo">
          {capo.codiceModello}
          {capo.categoria && ` · ${maiuscola(capo.categoria)}`}
          {capo.stato === "archiviato" && <span className="etichetta">Archiviato</span>}
        </p>
      </header>

      <Esito certificato={cert} nfc={nfc} />
      <AzioniArmadio dati={dati} />

      <section className="sezione">
        <h3>Scheda del capo</h3>
        <dl className="scheda-dati">
          <dt>Materiali originari</dt>
          <dd>{capo.materialiOriginari}</dd>
          {capo.materialePrincipale && (
            <>
              <dt>Materiale principale</dt>
              <dd>{maiuscola(capo.materialePrincipale)}</dd>
            </>
          )}
          {capo.filieraProvenienza && (
            <>
              <dt>Filiera</dt>
              <dd>{capo.filieraProvenienza}</dd>
            </>
          )}
          {capo.annoProduzione && (
            <>
              <dt>Anno di produzione</dt>
              <dd>{capo.annoProduzione}</dd>
            </>
          )}
        </dl>
      </section>

      <section className="sezione">
        <h3>Storia della rigenerazione</h3>
        {capo.storicoRigenerazione.length === 0 ? (
          <p className="nota">Nessun intervento registrato.</p>
        ) : (
          <ol className="linea-tempo">
            {capo.storicoRigenerazione.map((e, i) => (
              <li key={i}>
                <span className="linea-data">{data(e.data)}</span>
                <strong>{TIPI_EVENTO[e.tipo] ?? e.tipo}</strong>
                <p>{e.descrizione}</p>
                {e.materialiNuovi && <p className="nota">Materiali: {e.materialiNuovi}</p>}
                {e.operatore && <p className="nota">Laboratorio: {e.operatore}</p>}
                <Ancoraggio ancoraggio={e.ancoraggio} />
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="sezione">
        <h3>Catena dei proprietari</h3>
        {capo.passaggiProprieta.length === 0 ? (
          <p className="nota">Nessun passaggio di proprietà registrato.</p>
        ) : (
          <ol className="catena">
            {capo.passaggiProprieta.map((p) => (
              <li key={p.passo}>
                <span className="passo">{p.passo}</span>
                <span>
                  <strong>{p.proprietario}</strong>
                  <span className="nota"> · {data(p.data)}</span>
                </span>
                <Ancoraggio ancoraggio={p.ancoraggio} />
              </li>
            ))}
          </ol>
        )}
        <p className="nota">Per la privacy dei proprietari sono mostrate solo le iniziali.</p>
      </section>

      <Impatto impatto={impattoAmbientale} />

      <section className="sezione">
        <h3>Registro blockchain</h3>
        <dl className="scheda-dati">
          <dt>Rete</dt>
          <dd>{cert.rete}</dd>
          {cert.tokenId && (
            <>
              <dt>Token</dt>
              <dd>#{cert.tokenId}</dd>
            </>
          )}
          <dt>Ultima transazione sui dati</dt>
          <dd>
            <code>{hashBreve(cert.txHash)}</code>
          </dd>
          {cert.integrita.voci && (
            <>
              <dt>Voci verificate</dt>
              <dd>
                {cert.integrita.voci.verificate} su {capo.storicoRigenerazione.length + capo.passaggiProprieta.length}
              </dd>
            </>
          )}
        </dl>
        <p className="nota">Verificato il {new Date(dati.verificatoIl).toLocaleString("it-IT")}</p>
      </section>
    </article>
  );
}
