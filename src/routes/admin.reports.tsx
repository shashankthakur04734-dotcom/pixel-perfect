import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Empty, ErrorBox, PageHeader, Shell } from "@/components/Shell";
import { Filters, qs, ReportTable } from "@/components/ReportTable";
import { Loading, RequireAuth } from "@/lib/auth";
import { useApi } from "@/lib/useApi";
import { DAMAGE_TYPES, SEVERITIES, STATUSES, type Report } from "@/lib/api";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Manage reports — RoadGuard" }, { name: "description", content: "Review and update all road damage reports." }, { property: "og:title", content: "Manage reports — RoadGuard" }, { property: "og:description", content: "Review and update all road damage reports." }] }),
  component: () => <Shell><RequireAuth admin><Manage /></RequireAuth></Shell>,
});

function Manage() {
  const [f, setF] = useState<Record<string, string>>({});
  const { data, loading, error } = useApi<Report[]>(`/reports${qs(f)}`);
  return (
    <>
      <PageHeader title="Manage reports" sub="Open a report to review its photo, location and update its status." />
      <Filters value={f} onChange={setF} opts={{ status: STATUSES, severity: SEVERITIES, damage_type: DAMAGE_TYPES }} />
      {error && <ErrorBox msg={error} />}
      {loading ? <Loading /> : data && (data.length ? <ReportTable reports={data} showReporter /> : <Empty text="No reports match these filters." />)}
    </>
  );
}
