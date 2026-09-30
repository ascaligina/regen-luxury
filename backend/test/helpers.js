// Ambiente di test: database in memoria (o MONGO_URI_TEST), blockchain simulata su file temporaneo.
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import request from "supertest";

export const PASSWORD = "Password-di-test-1";

export async function avviaAmbiente(env = {}) {
  const id = crypto.randomBytes(4).toString("hex");
  Object.assign(process.env, {
    NODE_ENV: "test",
    JWT_SECRET: "segreto-di-test",
    BLOCKCHAIN_MODE: "mock",
    MOCK_LEDGER_STORE: "file",
    MOCK_LEDGER_FILE: path.join(os.tmpdir(), `ledger-${id}.json`),
    MOCK_CHAIN_LATENCY_MS: "5",
    RATE_LIMIT_VERIFY_PER_MIN: "10000",
    RATE_LIMIT_LOGIN_PER_15MIN: "10000",
    PUBLIC_BASE_URL: "https://regen.example",
    ...env,
  });

  let server;
  let uri = process.env.MONGO_URI_TEST;
  if (!uri) {
    const { MongoMemoryServer } = await import("mongodb-memory-server-core");
    server = await MongoMemoryServer.create();
    uri = server.getUri();
  }
  await mongoose.connect(uri, { dbName: `test_${id}` });

  const { creaApp } = await import("../app.js");
  const app = creaApp();

  return {
    app,
    creaApp,
    async chiudi() {
      const { attendiAncoraggi } = await import("../services/anchorService.js");
      await attendiAncoraggi();
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
      await server?.stop();
      await fs.rm(process.env.MOCK_LEDGER_FILE, { force: true });
    },
  };
}

// Crea un utente per ruolo e restituisce i token di accesso
export async function creaUtenti(app) {
  const { default: User } = await import("../models/User.js");
  const hash = await bcrypt.hash(PASSWORD, 4);
  const token = {};
  for (const ruolo of ["admin", "brand_manager", "commerciante", "artigiano"]) {
    const email = `${ruolo}@test.it`;
    await User.create({ nome: `Utente ${ruolo}`, email, ruolo, passwordHash: hash });
    const r = await request(app).post("/api/auth/login").send({ email, password: PASSWORD });
    token[ruolo] = r.body.token;
  }
  return token;
}

export const auth = (t) => ({ Authorization: `Bearer ${t}` });

export const capoDiProva = (tagId = "NFC-001", extra = {}) => ({
  brand: "Gucci",
  codiceModello: "GG-2024",
  materialiOriginari: "Pelle e cotone",
  filieraProvenienza: "Italia",
  categoria: "jeans",
  tagId,
  ...extra,
});

export async function attendiAncoraggi() {
  const { attendiAncoraggi: attendi } = await import("../services/anchorService.js");
  await attendi();
}
