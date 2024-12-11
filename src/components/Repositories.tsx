import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface Repository {
  id: string;
  name: string;
}
export const Repositories = ({ username }: { username: string }) => {
  const [repositories, setRepositories] = useState<Repository[] | undefined>(
    [],
  );
  const [favRepos, setFavRepos] = useState<Repository[] | undefined>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  useEffect(() => {
    const checkAccessToken = () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        setAccessToken(token);
      }
    };

    checkAccessToken();
    const intervalId = setInterval(checkAccessToken, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchUserData();
    }
  }, [accessToken, username]);

  const fetchUserData = async () => {
    try {
      const userData = await getUser();
      if (userData) {
        const repos = await getUsersRepositories(userData.login);
        setRepositories(repos);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getUser = async () => {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    return response.json();
  };

  const getUsersRepositories = async (login: string) => {
    const GITHUB_ENDPOINT = "https://api.github.com/graphql";

    const query = `{
      user(login: "${login}") {
        repositories(last: 10) {
          nodes {
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
        Authorization: `bearer ${accessToken}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data.user.repositories.nodes;
  };

  return (
    <div>
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
          {favRepos && favRepos.length > 0
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
  setFavRepos: Dispatch<SetStateAction<Repository[]>>;
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleChange = () => {
    setIsFavorite(!isFavorite);
    setFavRepos((prevRepos) => {
      if (isFavorite) {
        return prevRepos?.filter((repo) => repo.name === name);
      } else {
        return [...prevRepos, { name: name }];
      }
    });
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
