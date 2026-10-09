import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { Shell } from "@/components/Shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RoadGuard — Report potholes, track repairs" },
      { name: "description", content: "Citizens report road damage with photos and locations. Authorities track every repair." },
      { property: "og:title", content: "RoadGuard — Report potholes, track repairs" },
      { property: "og:description", content: "Citizens report road damage with photos and locations. Authorities track every repair." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <Shell>
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary">Civic road maintenance</p>
          <h1 className="text-5xl font-extrabold leading-[1.05] md:text-6xl">Spot it. Pin it. <span className="text-primary">Get it fixed.</span></h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">Report potholes and damaged roads with a photo and a map pin. Follow every report from pending to resolved.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/reports/new" className="btn-accent px-6 py-3">Report damage</Link>
            <Link to="/map" className="btn-ghost px-6 py-3">View live map</Link>
          </div>
        </div>
        <div className="relative">
          <img src={hero} alt="A pothole marked with yellow paint on a city street" width={1600} height={912} className="aspect-[4/3] w-full rounded-xl object-cover shadow-lg" />
          <div className="stripe absolute -bottom-3 left-6 right-6 h-3 rounded-full" aria-hidden />
        </div>
      </section>
      <section className="mt-20 grid gap-4 md:grid-cols-3">
        {[
          ["01", "Report", "Snap a photo, pick the spot on the map or use your location."],
          ["02", "Review", "Administrators verify the report and schedule the repair."],
          ["03", "Track", "Get notified at every status change until it's resolved."],
        ].map(([n, t, d]) => (
          <div key={n} className="card p-6">
            <span className="font-mono text-sm text-primary">{n}</span>
            <h3 className="mt-2 text-xl font-bold">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>
    </Shell>
  );
}
