import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { label } from "@/lib/api";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
      <span className="stripe inline-block h-6 w-6 rounded-sm" aria-hidden />
      RoadGuard
    </Link>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const links: [string, string][] = user
    ? user.role === "admin"
      ? [["/admin", "Overview"], ["/admin/reports", "Manage reports"], ["/map", "Map"], ["/notifications", "Notifications"]]
      : [["/dashboard", "Dashboard"], ["/reports/new", "New report"], ["/reports/mine", "My reports"], ["/map", "Map"], ["/notifications", "Notifications"]]
    : [["/map", "Map"], ["/login", "Sign in"], ["/register", "Register"]];
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-[1000] border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <button className="btn-ghost md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
          <nav className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-full flex-col gap-1 border-b border-border bg-card p-4 md:static md:flex md:flex-row md:items-center md:border-0 md:p-0`}>
            {links.map(([to, text]) => (
              <Link key={to} to={to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground" activeProps={{ className: "bg-muted text-foreground font-medium" }} activeOptions={{ exact: true }}>
                {text}
              </Link>
            ))}
            {user && (
              <button className="btn-ghost ml-0 md:ml-2" onClick={() => { logout(); navigate({ to: "/login", replace: true }); }}>
                Sign out
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

const statusTone: Record<string, string> = {
  pending: "bg-warning/20 text-accent-foreground border-warning",
  verified: "bg-info/15 text-info border-info/40",
  in_progress: "bg-primary/15 text-primary border-primary/40",
  resolved: "bg-success/15 text-success border-success/40",
  rejected: "bg-destructive/10 text-destructive border-destructive/40",
};
const sevTone: Record<string, string> = {
  low: "text-success", medium: "text-info", high: "text-warning", critical: "text-destructive",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusTone[status] ?? ""}`}>{label(status)}</span>;
}
export function SeverityTag({ severity }: { severity: string }) {
  return <span className={`font-mono text-xs font-semibold uppercase ${sevTone[severity] ?? ""}`}>● {severity}</span>;
}

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {sub && <p className="mt-1 text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function ErrorBox({ msg }: { msg: string }) {
  return <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{msg}</div>;
}
export function Empty({ text, action }: { text: string; action?: ReactNode }) {
  return <div className="card flex flex-col items-center gap-3 p-10 text-center text-muted-foreground">{text}{action}</div>;
}
