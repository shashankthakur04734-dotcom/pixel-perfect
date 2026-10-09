import { createFileRoute, Link } from "@tanstack/react-router";
import { Empty, ErrorBox, PageHeader, Shell } from "@/components/Shell";
import { Loading, RequireAuth } from "@/lib/auth";
import { useApi } from "@/lib/useApi";

type N = { id: number; report_id: number | null; message: string; is_read: number | boolean; created_at: string };

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — RoadGuard" }, { name: "description", content: "Updates on your road damage reports." }, { property: "og:title", content: "Notifications — RoadGuard" }, { property: "og:description", content: "Updates on your road damage reports." }] }),
  component: () => <Shell><RequireAuth><Notes /></RequireAuth></Shell>,
});

function Notes() {
  const { data, loading, error } = useApi<N[]>("/notifications");
  return (
    <>
      <PageHeader title="Notifications" />
      {error && <ErrorBox msg={error} />}
      {loading ? <Loading /> : data && (data.length ? (
        <ul className="card divide-y divide-border">
          {data.map((n) => (
            <li key={n.id} className="flex items-start gap-3 p-4">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.is_read ? "bg-border" : "bg-accent"}`} aria-label={n.is_read ? "Read" : "Unread"} />
              <div className="flex-1">
                <p>{n.message}</p>
                <p className="font-mono text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              {n.report_id && <Link to="/reports/$id" params={{ id: String(n.report_id) }} className="text-sm text-primary hover:underline">View</Link>}
            </li>
          ))}
        </ul>
      ) : <Empty text="No notifications yet." />)}
    </>
  );
}
