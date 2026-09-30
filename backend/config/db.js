import mongoose from "mongoose";

// Connessione a MongoDB Atlas.
// La connection string viene letta dalla variabile d'ambiente MONGO_URI (file .env).
export async function connectDB(uri = process.env.MONGO_URI ?? process.env.MONGODB_URI) {
  if (!uri) {
    throw new Error("MONGO_URI non definita: controlla il file .env");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log("MongoDB Atlas: connesso");
}

// Traduce gli errori di connessione più comuni in un'indicazione pratica.
export function spiegaErroreMongo(err) {
  const m = String(err?.message ?? err);
  if (/bad auth|authentication failed/i.test(m)) {
    return "Atlas ha rifiutato utente o password del database. Su Atlas (Security → Database Access → Edit) salva la password con \"Update User\", poi inseriscila con: npm run imposta-db";
  }
  if (/whitelist|IP address|isn't allowed/i.test(m)) {
    return "il tuo indirizzo IP non è autorizzato. Su Atlas: Security → Network Access → Add IP Address → Add Current IP Address.";
  }
  if (/ENOTFOUND|querySrv|EBADNAME/i.test(m)) {
    return "indirizzo del cluster non trovato: controlla la parte dopo la @ in MONGO_URI e la connessione a Internet.";
  }
  if (/timed out|ETIMEDOUT|ECONNREFUSED/i.test(m)) {
    return "il database non risponde: controlla la connessione a Internet e che il tuo IP sia in Network Access su Atlas.";
  }
  return m;
}
