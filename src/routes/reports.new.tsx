import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ErrorBox, PageHeader, Shell } from "@/components/Shell";
import { LazyMap } from "@/components/LazyMap";
import { RequireAuth } from "@/lib/auth";
import { api, DAMAGE_TYPES, errMsg, label, SEVERITIES } from "@/lib/api";

export const Route = createFileRoute("/reports/new")({
  head: () => ({ meta: [{ title: "New report — RoadGuard" }, { name: "description", content: "Report a pothole or damaged road with a photo and location." }, { property: "og:title", content: "New report — RoadGuard" }, { property: "og:description", content: "Report a pothole or damaged road with a photo and location." }] }),
  component: () => <Shell><RequireAuth><NewReport /></RequireAuth></Shell>,
});

function NewReport() {
  const navigate = useNavigate();
  const [f, setF] = useState({ title: "", description: "", damage_type: "pothole", severity: "medium", address: "", latitude: "", longitude: "" });
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [geo, setGeo] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const pick = (lat: number, lng: number) => setF((p) => ({ ...p, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));

  const locate = () => {
    if (!navigator.geolocation) return setGeo("Geolocation is not supported by this browser.");
    setGeo("Locating…");
    navigator.geolocation.getCurrentPosition(
      (p) => { pick(p.coords.latitude, p.coords.longitude); setGeo(null); },
      (e) => setGeo(e.code === 1 ? "Location permission denied. Click the map instead." : "Could not get your location."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setErr(null);
    if (!f.latitude || !f.longitude) return setErr("Please pick a location on the map or use your location.");
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(f).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("image", file);
      const { data } = await api.post("/reports", fd);
      navigate({ to: "/reports/$id", params: { id: String(data.id) } });
    } catch (e) { setErr(errMsg(e)); } finally { setBusy(false); }
  };

  return (
    <>
      <PageHeader title="Report road damage" sub="Fields marked * are required." />
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4 p-6">
          {err && <ErrorBox msg={err} />}
          <div><label className="label" htmlFor="t">Title *</label><input id="t" className="input" required maxLength={150} value={f.title} onChange={set("title")} placeholder="Deep pothole near bus stop" /></div>
          <div><label className="label" htmlFor="d">Description *</label><textarea id="d" className="input min-h-28" required maxLength={2000} value={f.description} onChange={set("description")} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label" htmlFor="dt">Damage type *</label><select id="dt" className="input" value={f.damage_type} onChange={set("damage_type")}>{DAMAGE_TYPES.map((d) => <option key={d} value={d}>{label(d)}</option>)}</select></div>
            <div><label className="label" htmlFor="sv">Severity *</label><select id="sv" className="input" value={f.severity} onChange={set("severity")}>{SEVERITIES.map((d) => <option key={d} value={d}>{label(d)}</option>)}</select></div>
          </div>
          <div><label className="label" htmlFor="ph">Photo</label><input id="ph" type="file" accept="image/jpeg,image/png,image/webp" className="input" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /><p className="mt-1 text-xs text-muted-foreground">JPG, PNG or WebP, up to 5 MB.</p></div>
          <div><label className="label" htmlFor="ad">Address *</label><input id="ad" className="input" required maxLength={255} value={f.address} onChange={set("address")} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label" htmlFor="la">Latitude *</label><input id="la" type="number" step="any" min={-90} max={90} className="input font-mono" required value={f.latitude} onChange={set("latitude")} /></div>
            <div><label className="label" htmlFor="lo">Longitude *</label><input id="lo" type="number" step="any" min={-180} max={180} className="input font-mono" required value={f.longitude} onChange={set("longitude")} /></div>
          </div>
          <button className="btn-primary w-full" disabled={busy}>{busy ? "Submitting…" : "Submit report"}</button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Click the map to set the location.</p>
            <button type="button" className="btn-ghost" onClick={locate}>📍 Use my location</button>
          </div>
          {geo && <p className="text-sm text-muted-foreground" role="status">{geo}</p>}
          <LazyMap height="520px" pick={{ lat: f.latitude ? Number(f.latitude) : null, lng: f.longitude ? Number(f.longitude) : null, onPick: pick }} />
        </div>
      </form>
    </>
  );
}
