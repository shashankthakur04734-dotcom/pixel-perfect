import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register — RoadGuard" }, { name: "description", content: "Create a RoadGuard account to report damaged roads." }, { property: "og:title", content: "Register — RoadGuard" }, { property: "og:description", content: "Create a RoadGuard account to report damaged roads." }] }),
  component: () => <AuthForm mode="register" />,
});
