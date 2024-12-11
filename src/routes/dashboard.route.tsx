import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "../auth";
import { useEffect, useState } from "react";
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
  const { username } = useAuth();
  return (
    <div>
      Hello {username}!
      <Repositories username={username!} />
    </div>
  );
}
