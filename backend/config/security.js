import crypto from "node:crypto";

// Segreto per firmare i token di accesso (JWT).
// In produzione è obbligatorio; in sviluppo, se manca, se ne genera uno
// temporaneo (i login andranno ripetuti a ogni riavvio del server).
let segretoTemporaneo;

export function jwtSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET obbligatorio in produzione (file .env)");
  }
  if (!segretoTemporaneo) {
    segretoTemporaneo = crypto.randomBytes(48).toString("base64url");
    console.warn("[auth] JWT_SECRET assente: uso un segreto temporaneo (solo sviluppo)");
  }
  return segretoTemporaneo;
}

export const jwtExpires = () => process.env.JWT_EXPIRES ?? "8h";
