import "dotenv/config"; // carica le variabili d'ambiente dal file .env (deve restare il primo import)
import { connectDB, spiegaErroreMongo } from "./config/db.js";
import { creaApp } from "./app.js";
import { attendiAncoraggi } from "./services/anchorService.js";

const PORT = process.env.PORT || 5001;

// --- Avvio del server dopo la connessione al DB ---
try {
  await connectDB();
  const server = creaApp().listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT} (blockchain: ${process.env.BLOCKCHAIN_MODE ?? "mock"})`);
  });
  server.on("error", (err) => {
    console.error(
      err.code === "EADDRINUSE"
        ? `La porta ${PORT} è già occupata: il server è forse già acceso in un altro terminale (chiudilo), oppure cambia PORT nel file .env.`
        : `Errore del server: ${err.message}`
    );
    process.exit(1);
  });

  // Spegnimento ordinato (Render lo chiede a ogni nuovo deploy o sospensione): si attendono
  // le scritture blockchain in corso, così nessun capo resta "in attesa" per sempre.
  const spegni = async (segnale) => {
    console.log(`${segnale}: chiusura del server, attendo le scritture blockchain in corso…`);
    server.close();
    await Promise.race([attendiAncoraggi(), new Promise((r) => setTimeout(r, 20_000))]);
    process.exit(0);
  };
  process.once("SIGTERM", () => spegni("SIGTERM"));
  process.once("SIGINT", () => spegni("SIGINT"));
} catch (err) {
  console.error("Errore di avvio:", err.message);
  const consiglio = spiegaErroreMongo(err);
  if (consiglio !== err.message) console.error(`→ ${consiglio}`);
  process.exit(1); // interrompe l'avvio se il DB non è raggiungibile
}
