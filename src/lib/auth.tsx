import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { api } from "./api";

export type User = { id: number; name: string; email: string; role: "citizen" | "admin" };
type Ctx = {
  user: User | null; ready: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
};
const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const raw = localStorage.getItem("rg_user");
    if (raw) setUser(JSON.parse(raw) as User);
    setReady(true);
  }, []);
  const save = (token: string, u: User) => {
    localStorage.setItem("rg_token", token);
    localStorage.setItem("rg_user", JSON.stringify(u));
    setUser(u);
    return u;
  };
  const value: Ctx = {
    user, ready,
    login: async (email, password) => {
      const { data } = await api.post("/auth/login", { email, password });
      return save(data.token, data.user);
    },
    register: async (name, email, password) => {
      const { data } = await api.post("/auth/register", { name, email, password });
      return save(data.token, data.user);
    },
    logout: () => {
      localStorage.removeItem("rg_token");
      localStorage.removeItem("rg_user");
      setUser(null);
    },
  };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth outside provider");
  return c;
}

export function RequireAuth({ admin, children }: { admin?: boolean; children: ReactNode }) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!ready) return;
    if (!user) navigate({ to: "/login", replace: true });
    else if (admin && user.role !== "admin") navigate({ to: "/dashboard", replace: true });
  }, [ready, user, admin, navigate]);
  if (!ready || !user || (admin && user.role !== "admin")) return <Loading />;
  return <>{children}</>;
}

export function Loading({ text = "Loading…" }: { text?: string }) {
  return (
    <div className="flex items-center gap-3 p-8 text-sm text-muted-foreground" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      {text}
    </div>
  );
}
