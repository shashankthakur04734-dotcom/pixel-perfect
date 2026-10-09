import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — RoadGuard" }, { name: "description", content: "Sign in to report and track road damage." }, { property: "og:title", content: "Sign in — RoadGuard" }, { property: "og:description", content: "Sign in to report and track road damage." }] }),
  component: () => <AuthForm mode="login" />,
});
