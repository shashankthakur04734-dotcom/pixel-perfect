import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, type ComponentProps } from "react";

const MapView = lazy(() => import("./MapView"));
type P = ComponentProps<typeof MapView>;

export function LazyMap(props: P) {
  const fb = <div style={{ height: props.height ?? "500px" }} className="w-full animate-pulse rounded-lg bg-muted" />;
  return (
    <ClientOnly fallback={fb}>
      <Suspense fallback={fb}><MapView {...props} /></Suspense>
    </ClientOnly>
  );
}

export function Legend() {
  const c: [string, string][] = [["pending", "#d99a1f"], ["verified", "#3a6fb5"], ["in progress", "#2a7f8a"], ["resolved", "#2f9466"], ["rejected", "#c43d32"]];
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
      {c.map(([s, col]) => (
        <span key={s} className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: col }} />{s}</span>
      ))}
    </div>
  );
}
