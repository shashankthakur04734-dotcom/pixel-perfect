import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { ErrorBox, PageHeader, Shell } from "@/components/Shell";
import { Filters, qs } from "@/components/ReportTable";
import { LazyMap, Legend } from "@/components/LazyMap";
import { useApi } from "@/lib/useApi";
import { useAuth } from "@/lib/auth";
import { SEVERITIES, STATUSES, type Report } from "@/lib/api";

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [{ title: "Road damage map — RoadGuard" }, { name: "description", content: "Live map of reported potholes and road damage." }, { property: "og:title", content: "Road damage map — RoadGuard" }, { property: "og:description", content: "Live map of reported potholes and road damage." }] }),
  component: MapPage,
});

function MapPage() {
  const [f, setF] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error } = useApi<Report[]>(`/reports${qs(f)}`);
  const open = useCallback((id: number) => navigate({ to: "/reports/$id", params: { id: String(id) } }), [navigate]);
  return (
    <Shell>
      <PageHeader title="Road damage map" sub={loading ? "Loading reports…" : `${data?.length ?? 0} reports shown`} action={<Legend />} />
      <Filters value={f} onChange={setF} opts={{ status: STATUSES, severity: SEVERITIES }} />
      {error && <div className="mb-4"><ErrorBox msg={error} /></div>}
      <LazyMap reports={data ?? []} height="600px" {...(user ? { onOpen: open } : {})} />
    </Shell>
  );
}
