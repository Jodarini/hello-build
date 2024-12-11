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
  console.log(favRepos);

  return (
    <div>
      Your repos
      <div className="flex w-full justify-between">
        <div>
          {repositories
            ? repositories.map((repo) => (
                <Repository
                  key={repo.id}
                  name={repo.name}
                  setFavRepos={setFavRepos}
                />
              ))
            : "This user has no repos"}
        </div>
        <div>
          {favRepos.length > 0
            ? favRepos.map((repo) => (
                <div key={repo.name + "fav"} className="flex gap-2">
                  <p>{repo.name}</p>
                </div>
              ))
            : "No favorites yet 😢"}
        </div>
      </div>
    </div>
  );
};

const Repository = ({
  name,
  setFavRepos,
}: {
  name: string;
  setFavRepos: React.Dispatch<React.SetStateAction<never[]>>;
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleChange = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      setFavRepos((repos) => [...repos, { name: name }]);
    } else {
      setFavRepos((repos) => repos.filter((repo) => repo.name !== name));
    }
  };
  return (
    <div>
      <div className="flex gap-2">
        <p>{name}</p>
        <input type="checkbox" checked={isFavorite} onChange={handleChange} />
      </div>
    </div>
  );
};
