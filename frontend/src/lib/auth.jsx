import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function boot() {
      if (!token) {
        setReady(true);
        return;
      }
      try {
        const { user: u } = await api.me();
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      } finally {
        setReady(true);
      }
    }
    boot();
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      ready,
      isAdmin: user?.role === "admin",
      async login(email, password) {
        const data = await api.login(email, password);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      },
      async register(name, email, password) {
        const data = await api.register(name, email, password);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      },
      async logout() {
        await api.logout();
        setToken(null);
        setUser(null);
      },
    }),
    [user, token, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx) return ctx;
  // In rare cases (e.g. during HMR or misconfiguration) avoid crashing the whole app.
  return {
    user: null,
    token: null,
    ready: true,
    isAdmin: false,
    async login() {
      throw new Error("AuthProvider is missing");
    },
    async register() {
      throw new Error("AuthProvider is missing");
    },
    async logout() {
      // no-op
    },
  };
}

