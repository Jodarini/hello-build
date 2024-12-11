import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "../auth";
import { useEffect, useState } from "react";

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
  const [repos, setRepos] = useState([]);
  const { username } = useAuth();
  const getUsersRepositories = async () => {
    const GITHUB_ENDPOINT = "https://api.github.com/graphql";
    const TOKEN = "";

    const query = `{
      viewer{
        login
        name
        repositories(last: 5){
          nodes{
            id
            name
          }
        }
      }
    }`;

    const response = await fetch(GITHUB_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.data.viewer.repositories);
    setRepos(data.data.viewer.repositories.nodes);
  };

  useEffect(() => {
    getUsersRepositories().catch((error) => console.error("Error:", error));
  }, []);
  return (
    <div>
      Hello {username}!
      {repos.map((repo) => (
        <div key={repo.id}>{repo.name}</div>
      ))}
    </div>
  );
}
