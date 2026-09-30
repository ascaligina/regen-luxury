import { hashBreve } from "../utils/formato.js";

const ETICHETTE = {
  confermato: "Registrato sulla blockchain",
  in_attesa: "In registrazione…",
  fallito: "Registrazione non riuscita",
  non_ancorato: "Non registrato sulla blockchain",
};

// Piccolo indicatore dello stato di registrazione on-chain di un dato
export default function Ancoraggio({ ancoraggio }) {
  const stato = ancoraggio?.stato ?? "non_ancorato";
  return (
    <span className={`ancoraggio ancoraggio-${stato}`} title={ancoraggio?.txHash ?? ""}>
      <span className="puntino" aria-hidden="true" />
      {ETICHETTE[stato] ?? stato}
      {ancoraggio?.txHash && <code>{hashBreve(ancoraggio.txHash)}</code>}
    </span>
  );
}
