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
    const handleAuth = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3000/getToken/${code}`);
        const data = await response.json();
        if (data.accessToken) {
          localStorage.setItem("access_token", data.accessToken);
          auth.setIsAuthenticated(true);
        }
        navigate({ to: "/dashboard" });
      } catch (err) {
        throw new Error(err);
      }
    };
    handleAuth();
  }, [auth, code, navigate, proxyUrl]);
  return <div>Hello "/_auth"!</div>;
}
