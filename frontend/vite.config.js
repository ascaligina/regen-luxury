import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// In sviluppo le chiamate a /api vengono inoltrate al backend: frontend e API
// risultano sullo stesso indirizzo, come in produzione. La porta del backend
// viene letta da backend/.env (PORT), così si cambia in un solo punto.
export default defineConfig(({ mode }) => {
  const cartellaBackend = fileURLToPath(new URL("../backend", import.meta.url));
  const { PORT } = loadEnv(mode, cartellaBackend, "PORT");
  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true, // raggiungibile anche dal telefono sulla stessa rete Wi-Fi
      proxy: { "/api": `http://localhost:${PORT || 5001}` },
    },
    build: { outDir: "dist", sourcemap: false },
  };
});
