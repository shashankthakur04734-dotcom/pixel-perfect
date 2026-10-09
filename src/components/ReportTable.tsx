import { Link } from "@tanstack/react-router";
import { label, type Report } from "@/lib/api";
import { SeverityTag, StatusBadge } from "./Shell";

export function ReportTable({ reports, showReporter }: { reports: Report[]; showReporter?: boolean }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/60 text-left text-xs uppercase text-muted-foreground">
          <tr><th className="p-3">Report</th><th className="p-3">Type</th><th className="p-3">Severity</th><th className="p-3">Status</th>{showReporter && <th className="p-3">Reporter</th>}<th className="p-3">Date</th></tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/40">
              <td className="p-3"><Link to="/reports/$id" params={{ id: String(r.id) }} className="font-medium text-primary hover:underline">{r.title}</Link><div className="text-xs text-muted-foreground">{r.address}</div></td>
              <td className="p-3">{label(r.damage_type)}</td>
              <td className="p-3"><SeverityTag severity={r.severity} /></td>
              <td className="p-3"><StatusBadge status={r.status} /></td>
              {showReporter && <td className="p-3">{r.reporter_name}</td>}
              <td className="p-3 font-mono text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Filters({ value, onChange, opts }: { value: Record<string, string>; onChange: (v: Record<string, string>) => void; opts: Record<string, readonly string[]> }) {
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      {Object.entries(opts).map(([k, list]) => (
        <select key={k} aria-label={`Filter by ${k}`} className="input w-auto" value={value[k] ?? ""} onChange={(e) => onChange({ ...value, [k]: e.target.value })}>
          <option value="">All {label(k)}</option>
          {list.map((o) => <option key={o} value={o}>{label(o)}</option>)}
        </select>
      ))}
    </div>
  );
}

export function qs(f: Record<string, string>) {
  const p = new URLSearchParams();
  Object.entries(f).forEach(([k, v]) => v && p.set(k, v));
  const s = p.toString();
  return s ? `?${s}` : "";
}
