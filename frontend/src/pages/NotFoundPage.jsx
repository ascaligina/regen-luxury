import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="scheda">
      <h1>Pagina non trovata</h1>
      <p>
        L’indirizzo non esiste. <Link to="/">Torna alla home</Link>.
      </p>
    </section>
  );
}
