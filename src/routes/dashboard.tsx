import { createFileRoute, Link } from "@tanstack/react-router";
import { Empty, ErrorBox, PageHeader, Shell } from "@/components/Shell";
import { ReportTable } from "@/components/ReportTable";
import { Loading, RequireAuth, useAuth } from "@/lib/auth";
import { useApi } from "@/lib/useApi";
import type { Report } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — RoadGuard" }, { name: "description", content: "Your road damage reports at a glance." }, { property: "og:title", content: "Dashboard — RoadGuard" }, { property: "og:description", content: "Your road damage reports at a glance." }] }),
  component: () => <Shell><RequireAuth><Dash /></RequireAuth></Shell>,
});

function Dash() {
  const { user } = useAuth();
  const { data, loading, error } = useApi<Report[]>("/reports/mine");
  const count = (s?: string) => (data ?? []).filter((r) => !s || r.status === s).length;
  return (
    <>
      <PageHeader title={`Hello, ${user?.name.split(" ")[0] ?? ""}`} sub="Here's how your reports are doing." action={<Link to="/reports/new" className="btn-accent">+ New report</Link>} />
      {error && <ErrorBox msg={error} />}
      {loading ? <Loading /> : data && (
        <>
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[["Total", count()], ["Pending", count("pending")], ["In progress", count("in_progress")], ["Resolved", count("resolved")]].map(([l, n]) => (
              <div key={l} className="card p-5"><div className="text-xs uppercase text-muted-foreground">{l}</div><div className="mt-1 font-display text-3xl font-bold">{n}</div></div>
            ))}
          </div>
          <h2 className="mb-3 text-xl font-bold">Recent reports</h2>
          {data.length ? <ReportTable reports={data.slice(0, 5)} /> : <Empty text="You haven't reported anything yet." action={<Link to="/reports/new" className="btn-primary">Submit your first report</Link>} />}
        </>
      )}
    </>
  );
}
