import { Link } from "react-router-dom";
import { useArmadio, rimuoviDallArmadio } from "../utils/archivio.js";
import { ESITO_BREVE, data, iniziali, maiuscola, numero } from "../utils/formato.js";
import { IconaFoglia, IconaGruccia, IconaScansione } from "../components/Icone.jsx";

export default function ArmadioPage() {
  const armadio = useArmadio();
  const co2 = armadio.reduce((s, c) => s + (c.co2Kg ?? 0), 0);
  const acqua = armadio.reduce((s, c) => s + (c.acquaL ?? 0), 0);

  return (
    <section className="armadio">
      <header className="pagina-testa">
        <p className="sopratitolo">Il tuo armadio</p>
        <h1>I capi che hai scelto, con la loro storia.</h1>
        <p className="pagina-intro">
          Aggiungi qui i capi verificati che hai acquistato: ritrovi in un tocco il loro passaporto digitale. L’elenco resta
          solo su questo dispositivo, senza account e senza inviare dati.
        </p>
      </header>

      {armadio.length === 0 ? (
        <div className="armadio-vuoto">
          <span className="armadio-vuoto-icona">
            <IconaGruccia dimensione={40} />
          </span>
          <h2>Il tuo armadio è ancora vuoto</h2>
          <p>Verifica un capo e, nel suo certificato, premi «Aggiungi al mio armadio».</p>
          <Link to="/scan" className="pulsante pulsante-grande">
            <IconaScansione dimensione={20} /> Verifica un capo
          </Link>
        </div>
      ) : (
        <>
          <dl className="riepilogo">
            <div>
              <dt>Capi</dt>
              <dd>{armadio.length}</dd>
            </div>
            <div>
              <dt>CO₂ evitata</dt>
              <dd>
                {numero(co2)} <small>kg</small>
              </dd>
            </div>
            <div>
              <dt>Acqua preservata</dt>
              <dd>
                {numero(acqua, 0)} <small>L</small>
              </dd>
            </div>
          </dl>
          {armadio.some((c) => c.co2Kg == null) && (
            <p className="nota">Per alcune categorie di capi la stima ambientale non è ancora disponibile.</p>
          )}

          <ul className="armadio-griglia">
            {armadio.map((c) => {
              const esito = ESITO_BREVE[c.esito] ?? ESITO_BREVE.non_registrato;
              return (
                <li key={c.tagId} className="capo-carta">
                  <div className="capo-monogramma" aria-hidden="true">
                    {iniziali(c.brand)}
                  </div>
                  <div className="capo-info">
                    <p className="sopratitolo">
                      {maiuscola(c.categoria ?? "capo")}
                      {c.materialePrincipale && ` · ${c.materialePrincipale}`}
                    </p>
                    <h2>{c.brand}</h2>
                    <p>
                      {c.codiceModello}
                      {c.annoProduzione && ` · ${c.annoProduzione}`}
                    </p>
                    <p className="capo-dettagli">
                      <span className={`bollino bollino-${esito.classe}`}>{esito.testo}</span>
                      {c.co2Kg != null && (
                        <span className="capo-impatto">
                          <IconaFoglia dimensione={16} /> {numero(c.co2Kg)} kg CO₂e evitati
                        </span>
                      )}
                    </p>
                    <p className="nota">
                      Tag {c.tagId} · nel tuo armadio dal {data(c.aggiuntoIl)}
                    </p>
                  </div>
                  <div className="capo-azioni">
                    <Link className="pulsante" to={`/v/${encodeURIComponent(c.tagId)}`}>
                      Rivedi il certificato
                    </Link>
                    <button type="button" className="link link-pericolo" onClick={() => rimuoviDallArmadio(c.tagId)}>
                      Rimuovi
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
