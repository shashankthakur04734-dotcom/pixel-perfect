import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { errMsg } from "@/lib/api";
import { ErrorBox, Shell } from "./Shell";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setErr(null); setBusy(true);
    try {
      const u = mode === "login" ? await login(f.email, f.password) : await register(f.name, f.email, f.password);
      navigate({ to: u.role === "admin" ? "/admin" : "/dashboard", replace: true });
    } catch (e) { setErr(errMsg(e)); } finally { setBusy(false); }
  };
  return (
    <Shell>
      <form onSubmit={submit} className="card mx-auto max-w-md space-y-4 p-8">
        <h1 className="text-2xl font-bold">{mode === "login" ? "Sign in" : "Create an account"}</h1>
        {err && <ErrorBox msg={err} />}
        {mode === "register" && (
          <div><label className="label" htmlFor="name">Full name</label>
            <input id="name" className="input" required minLength={2} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        )}
        <div><label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" required autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div><label className="label" htmlFor="pw">Password</label>
          <input id="pw" type="password" className="input" required minLength={mode === "register" ? 8 : 1} autoComplete={mode === "login" ? "current-password" : "new-password"} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
          {mode === "register" && <p className="mt-1 text-xs text-muted-foreground">At least 8 characters.</p>}</div>
        <button className="btn-primary w-full" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Register"}</button>
        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? <>No account? <Link to="/register" className="text-primary underline">Register</Link></> : <>Have an account? <Link to="/login" className="text-primary underline">Sign in</Link></>}
        </p>
      </form>
    </Shell>
  );
}
