import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Report } from "@/lib/api";

const colors: Record<string, string> = {
  pending: "#d99a1f", verified: "#3a6fb5", in_progress: "#2a7f8a", resolved: "#2f9466", rejected: "#c43d32",
};

type Props = {
  reports?: Report[];
  pick?: { lat: number | null; lng: number | null; onPick: (lat: number, lng: number) => void };
  height?: string;
  onOpen?: (id: number) => void;
};

export default function MapView({ reports = [], pick, height = "500px", onOpen }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const pickMarker = useRef<L.CircleMarker | null>(null);
  const pickRef = useRef(pick);
  pickRef.current = pick;

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current).setView([20.5937, 78.9629], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors", maxZoom: 19,
    }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    m.on("click", (e) => pickRef.current?.onPick(e.latlng.lat, e.latlng.lng));
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    const g = layer.current; const m = map.current;
    if (!g || !m) return;
    g.clearLayers();
    const pts: L.LatLngExpression[] = [];
    reports.forEach((r) => {
      const ll: L.LatLngExpression = [Number(r.latitude), Number(r.longitude)];
      pts.push(ll);
      const c = colors[r.status] ?? "#555";
      const mk = L.circleMarker(ll, { radius: 9, color: "#fff", weight: 2, fillColor: c, fillOpacity: 0.95 }).addTo(g);
      const div = document.createElement("div");
      div.innerHTML = `<strong></strong><br/><small></small><br/>`;
      (div.querySelector("strong") as HTMLElement).textContent = r.title;
      (div.querySelector("small") as HTMLElement).textContent = `${r.status.replace("_", " ")} · ${r.severity}`;
      if (onOpen) {
        const a = document.createElement("button");
        a.textContent = "View details →"; a.style.color = c; a.style.fontWeight = "600";
        a.onclick = () => onOpen(r.id);
        div.appendChild(a);
      }
      mk.bindPopup(div);
    });
    if (pts.length) m.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 15 });
  }, [reports, onOpen]);

  useEffect(() => {
    const m = map.current;
    if (!m || !pick || pick.lat == null || pick.lng == null) return;
    const ll: L.LatLngExpression = [pick.lat, pick.lng];
    if (!pickMarker.current) pickMarker.current = L.circleMarker(ll, { radius: 10, color: "#fff", weight: 3, fillColor: "#e0a21b", fillOpacity: 1 }).addTo(m);
    else pickMarker.current.setLatLng(ll);
    m.setView(ll, Math.max(m.getZoom(), 14));
  }, [pick?.lat, pick?.lng]);

  return <div ref={el} style={{ height }} className="w-full overflow-hidden rounded-lg border border-border" />;
}

export function Legend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
      {Object.entries(colors).map(([s, c]) => (
        <span key={s} className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ background: c }} />{s.replace("_", " ")}
        </span>
      ))}
    </div>
  );
}
