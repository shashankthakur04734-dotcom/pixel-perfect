import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Empty, ErrorBox, PageHeader, Shell } from "@/components/Shell";
import { Filters, qs, ReportTable } from "@/components/ReportTable";
import { Loading, RequireAuth } from "@/lib/auth";
import { useApi } from "@/lib/useApi";
import { DAMAGE_TYPES, SEVERITIES, STATUSES, type Report } from "@/lib/api";

export const Route = createFileRoute("/reports/mine")({
  head: () => ({ meta: [{ title: "My reports — RoadGuard" }, { name: "description", content: "Track the repair status of your reports." }, { property: "og:title", content: "My reports — RoadGuard" }, { property: "og:description", content: "Track the repair status of your reports." }] }),
  component: () => <Shell><RequireAuth><Mine /></RequireAuth></Shell>,
});

function Mine() {
  const [f, setF] = useState<Record<string, string>>({});
  const { data, loading, error } = useApi<Report[]>(`/reports/mine${qs(f)}`);
  return (
    <>
      <PageHeader title="My reports" action={<Link to="/reports/new" className="btn-accent">+ New report</Link>} />
      <Filters value={f} onChange={setF} opts={{ status: STATUSES, severity: SEVERITIES, damage_type: DAMAGE_TYPES }} />
      {error && <ErrorBox msg={error} />}
      {loading ? <Loading /> : data && (data.length ? <ReportTable reports={data} /> : <Empty text="No reports match these filters." />)}
    </>
  );
}
