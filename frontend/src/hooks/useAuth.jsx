import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, token } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utente, setUtente] = useState(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (!token.leggi()) {
      setPronto(true);
      return;
    }
    api("/auth/me")
      .then((d) => setUtente(d.utente))
      // solo un 401 significa sessione non valida; rete assente o server in avvio no
      .catch((err) => err.status === 401 && token.cancella())
      .finally(() => setPronto(true));
  }, []);

  useEffect(() => {
    const scaduta = () => setUtente(null);
    window.addEventListener("regen:sessione-scaduta", scaduta);
    return () => window.removeEventListener("regen:sessione-scaduta", scaduta);
  }, []);

  const login = useCallback(async (email, password) => {
    const d = await api("/auth/login", { metodo: "POST", corpo: { email, password } });
    token.salva(d.token);
    setUtente(d.utente);
    return d.utente;
  }, []);

  const logout = useCallback(() => {
    token.cancella();
    setUtente(null);
  }, []);

  // L'amministratore può tutto; gli altri solo i ruoli indicati
  const puo = useCallback((...ruoli) => !!utente && (utente.ruolo === "admin" || ruoli.includes(utente.ruolo)), [utente]);

  return <AuthContext.Provider value={{ utente, pronto, login, logout, puo }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
