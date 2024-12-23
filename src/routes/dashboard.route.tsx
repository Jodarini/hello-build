import { createFileRoute, redirect } from "@tanstack/react-router";
import { Repositories } from "../components/Repositories";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Repositories />
    </div>
  );
}
