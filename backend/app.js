import express from "express";
import cors from "cors";
import helmet from "helmet";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import itemsRouter from "./routes/items.js";
import verifyRouter from "./routes/verify.js";
import authRouter from "./routes/auth.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const cartellaFrontend = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../frontend/dist");

// L'app viene creata da una funzione: i test possono istanziarla con impostazioni diverse
export function creaApp() {
  const app = express();

  if (Number(process.env.TRUST_PROXY)) app.set("trust proxy", Number(process.env.TRUST_PROXY));

  // --- Middleware globali ---
  // Intestazioni di sicurezza HTTP. La CSP ammette i worker "blob:" usati dal
  // lettore di QR della web app; l'upgrade a HTTPS è attivo solo in produzione.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "worker-src": ["'self'", "blob:"],
          // foto decorative della home (Unsplash, licenza Unsplash)
          "img-src": ["'self'", "data:", "blob:", "https://images.unsplash.com"],
          // servizio AI opzionale (ai-module) su un altro dominio: AI_ORIGIN=https://…
          "connect-src": ["'self'", ...(process.env.AI_ORIGIN ? [process.env.AI_ORIGIN] : [])],
          "upgrade-insecure-requests": process.env.NODE_ENV === "production" ? [] : null,
        },
      },
    })
  );
  const origini = process.env.CORS_ORIGIN ?? "*";
  app.use(cors({ origin: origini === "*" ? true : origini.split(",").map((o) => o.trim()) }));
  app.use(express.json({ limit: "100kb" }));                    // parsing del body JSON

  // --- Rotte ---
  app.get("/api/health", (req, res) => {
    res.json({ stato: "online", blockchain: process.env.BLOCKCHAIN_MODE ?? "mock", ora: new Date().toISOString() });
  });
  app.use("/api/auth", authRouter());       // login e gestione account
  app.use("/api/items", itemsRouter);       // gestione capi (lato commerciante)
  app.use("/api/verify", verifyRouter());   // verifica pubblica (lato consumatore)
  app.use("/api", notFound);

  // --- Web app React (se compilata): stesso dominio e stesso HTTPS delle API ---
  if (fs.existsSync(path.join(cartellaFrontend, "index.html"))) {
    app.use(express.static(cartellaFrontend, { index: false, maxAge: "1h" }));
    // un file di build inesistente (es. versione precedente in cache) deve dare 404, non la pagina HTML
    app.use("/assets", (req, res) => res.status(404).end());
    app.get("*", (req, res) => res.sendFile(path.join(cartellaFrontend, "index.html")));
  } else {
    // Rotta di health-check per verificare che il server sia attivo
    app.get("/", (req, res) => {
      res.json({ stato: "online", messaggio: "Backend tracciabilità capi rigenerati" });
    });
  }

  // Middleware di gestione errori (deve stare per ultimo)
  app.use(errorHandler);
  return app;
}
