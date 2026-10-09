import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ErrorBox, PageHeader, Shell } from "@/components/Shell";
import { Loading, RequireAuth } from "@/lib/auth";
import { useApi } from "@/lib/useApi";
import { label } from "@/lib/api";

type Stats = {
  total: number;
  byStatus: { status: string; count: number }[];
  bySeverity: { severity: string; count: number }[];
  byType: { damage_type: string; count: number }[];
  trend: { day: string; count: number }[];
};

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin overview — RoadGuard" }, { name: "description", content: "Road damage statistics and trends." }, { property: "og:title", content: "Admin overview — RoadGuard" }, { property: "og:description", content: "Road damage statistics and trends." }] }),
  component: () => <Shell><RequireAuth admin><Admin /></RequireAuth></Shell>,
});

function Admin() {
  const { data, loading, error } = useApi<Stats>("/admin/stats");
  if (loading) return <Loading />;
  if (error || !data) return <ErrorBox msg={error ?? "No data"} />;
  const st = (s: string) => data.byStatus.find((x) => x.status === s)?.count ?? 0;
  return (
    <>
      <PageHeader title="Admin overview" action={<Link to="/admin/reports" className="btn-primary">Manage reports</Link>} />
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        {[["Total", data.total], ["Pending", st("pending")], ["Verified", st("verified")], ["In progress", st("in_progress")], ["Resolved", st("resolved")]].map(([l, n]) => (
          <div key={l} className="card p-5"><div className="text-xs uppercase text-muted-foreground">{l}</div><div className="mt-1 font-display text-3xl font-bold">{n}</div></div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Chart title="Reports in the last 30 days">
          <LineChart data={data.trend}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" /><XAxis dataKey="day" fontSize={11} /><YAxis allowDecimals={false} fontSize={11} /><Tooltip /><Line type="monotone" dataKey="count" stroke="var(--color-primary)" strokeWidth={2} /></LineChart>
        </Chart>
        <Chart title="By severity">
          <BarChart data={data.bySeverity.map((x) => ({ ...x, severity: label(x.severity) }))}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" /><XAxis dataKey="severity" fontSize={11} /><YAxis allowDecimals={false} fontSize={11} /><Tooltip /><Bar dataKey="count" fill="var(--color-accent)" radius={[4, 4, 0, 0]} /></BarChart>
        </Chart>
        <Chart title="By damage type">
          <BarChart data={data.byType.map((x) => ({ ...x, damage_type: label(x.damage_type) }))}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" /><XAxis dataKey="damage_type" fontSize={11} /><YAxis allowDecimals={false} fontSize={11} /><Tooltip /><Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} /></BarChart>
        </Chart>
        <Chart title="By status">
          <BarChart data={data.byStatus.map((x) => ({ ...x, status: label(x.status) }))}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" /><XAxis dataKey="status" fontSize={11} /><YAxis allowDecimals={false} fontSize={11} /><Tooltip /><Bar dataKey="count" fill="var(--color-info)" radius={[4, 4, 0, 0]} /></BarChart>
        </Chart>
      </div>
    </>
  );
}

function Chart({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="card p-5">
      <h2 className="mb-4 font-bold">{title}</h2>
      <div className="h-64"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>
    </div>
  );
}
