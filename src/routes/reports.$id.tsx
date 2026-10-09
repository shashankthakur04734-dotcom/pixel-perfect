import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ErrorBox, PageHeader, SeverityTag, Shell, StatusBadge } from "@/components/Shell";
import { LazyMap } from "@/components/LazyMap";
import { Loading, RequireAuth, useAuth } from "@/lib/auth";
import { useApi } from "@/lib/useApi";
import { api, errMsg, label, STATUSES, type Report } from "@/lib/api";

export const Route = createFileRoute("/reports/$id")({
  head: () => ({ meta: [{ title: "Report details — RoadGuard" }, { name: "description", content: "Road damage report details and repair history." }, { property: "og:title", content: "Report details — RoadGuard" }, { property: "og:description", content: "Road damage report details and repair history." }] }),
  component: () => <Shell><RequireAuth><Detail /></RequireAuth></Shell>,
});

function Detail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const { data: r, loading, error, reload } = useApi<Report>(`/reports/${id}`);
  if (loading) return <Loading />;
  if (error || !r) return <ErrorBox msg={error ?? "Not found"} />;
  return (
    <>
      <PageHeader title={r.title} sub={`#${r.id} · ${r.address}`} action={<StatusBadge status={r.status} />} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {r.image_url ? <img src={r.image_url} alt={`Photo of ${r.title}`} className="max-h-[420px] w-full rounded-lg object-cover" /> : <div className="card p-10 text-center text-muted-foreground">No photo attached</div>}
          <div className="card space-y-3 p-6">
            <div className="flex flex-wrap gap-6 text-sm">
              <div><div className="text-xs uppercase text-muted-foreground">Type</div>{label(r.damage_type)}</div>
              <div><div className="text-xs uppercase text-muted-foreground">Severity</div><SeverityTag severity={r.severity} /></div>
              <div><div className="text-xs uppercase text-muted-foreground">Reported</div>{new Date(r.created_at).toLocaleString()}</div>
              {r.reporter_name && <div><div className="text-xs uppercase text-muted-foreground">By</div>{r.reporter_name}</div>}
              <div><div className="text-xs uppercase text-muted-foreground">Coordinates</div><span className="font-mono">{Number(r.latitude).toFixed(5)}, {Number(r.longitude).toFixed(5)}</span></div>
            </div>
            <p className="whitespace-pre-wrap">{r.description}</p>
          </div>
          <LazyMap reports={[r]} height="300px" />
        </div>
        <div className="space-y-6">
          {user?.role === "admin" && <StatusForm r={r} onDone={reload} />}
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-bold">Status history</h2>
            <ol className="space-y-4 border-l-2 border-border pl-4">
              {(r.history ?? []).map((h) => (
                <li key={h.id}>
                  <div className="flex items-center gap-2"><StatusBadge status={h.new_status} /><span className="font-mono text-xs text-muted-foreground">{new Date(h.created_at).toLocaleString()}</span></div>
                  {h.note && <p className="mt-1 text-sm">{h.note}</p>}
                  {h.changed_by_name && <p className="text-xs text-muted-foreground">by {h.changed_by_name}</p>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}

function StatusForm({ r, onDone }: { r: Report; onDone: () => void }) {
  const [status, setStatus] = useState(r.status);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg(null);
    try { await api.patch(`/reports/${r.id}/status`, { status, note }); setMsg({ ok: true, t: "Status updated." }); setNote(""); onDone(); }
    catch (e) { setMsg({ ok: false, t: errMsg(e) }); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="card space-y-3 border-primary/40 p-6">
      <h2 className="text-lg font-bold">Update status</h2>
      {msg && (msg.ok ? <p className="text-sm text-success" role="status">{msg.t}</p> : <ErrorBox msg={msg.t} />)}
      <select aria-label="New status" className="input" value={status} onChange={(e) => setStatus(e.target.value)}>{STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}</select>
      <textarea aria-label="Note" className="input" placeholder="Note (optional)" maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} />
      <button className="btn-primary w-full" disabled={busy || status === r.status}>{busy ? "Saving…" : "Save"}</button>
    </form>
  );
}
