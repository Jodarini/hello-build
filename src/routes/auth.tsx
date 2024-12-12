import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../auth";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useAuth();
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const url = `https://github.com/login/oauth/access_token?client_id=${import.meta.env.VITE_APP_CLIENT_ID}&client_secret=${import.meta.env.VITE_APP_GITHUB_SECRET}&code=${code}`;
  const proxyUrl = `https://thingproxy.freeboard.io/fetch/${url}`;

  useEffect(() => {
    const getAccessToken = async () => {
      const response = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();
      const access_token = await data.access_token;
      localStorage.setItem("access_token", access_token);

      auth.isAuthenticated = true;
      navigate({ to: "/dashboard" });
    };
    getAccessToken();
  }, [auth, navigate, proxyUrl]);
  return <div>Hello "/_auth"!</div>;
}
