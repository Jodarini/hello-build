import { useEffect, useState } from "react";

export const Repositories = ({ username }: { username: string }) => {
  const [repositories, setRepositories] = useState([]);
  const [favRepos, setFavRepos] = useState([]);

  useEffect(() => {
    const getUsersRepositories = async () => {
      const GITHUB_ENDPOINT = "https://api.github.com/graphql";
      const TOKEN = "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";

      const query = `{
        user(login: "${username}") {
          name
            repositories(last: 100) {
              nodes {
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
      setRepositories(data.data.user.repositories.nodes);
    };
    getUsersRepositories().catch((error) => console.error("Error:", error));
  }, [username]);

  return (
    <div>
      Your repos
      {repositories
        ? repositories.map((repo) => (
            <Repository key={repo.id} name={repo.name} />
          ))
        : "This user has no repos"}
      {favRepos.length > 0
        ? favRepos.map((repo) => (
            <div key={repo.id + repo.name} className="flex gap-2">
              <p>{repo.name}</p>
            </div>
          ))
        : "No favorites yet 😢"}
    </div>
  );
};

const Repository = ({ name }: { name: string }) => {
  return (
    <div>
      <div className="flex gap-2">
        <p>{name}</p>
        <input type="checkbox" />
      </div>
    </div>
  );
};
