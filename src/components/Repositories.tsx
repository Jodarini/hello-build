import { ChangeEvent, useEffect, useState } from "react";
import { FavoriteStar } from "./FavoriteStar";

interface Repository {
  id: string;
  name: string;
  createdAt: string;
  favorite: boolean;
  languages: {
    nodes: [
      {
        id: string;
        name: string;
      },
    ];
  };
}

interface User {
  login: string;
  avatarUrl: string;
}

type ViewMode = "all" | "favorites";

export const Repositories = ({ username }: { username: string }) => {
  const [repositories, setRepositories] = useState<Repository[] | undefined>(
    [],
  );

  const [filteredRepositories, setFilteredRepositories] = useState<
    Repository[] | undefined
  >([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("all");

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
    const fetchUserData = async () => {
      try {
        const userData = await getUser();
        if (userData) {
          const repos = (await getUsersRepositories()) as Repository[];
          setRepositories(repos.map((repo) => ({ ...repo, favorite: false })));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const getUser = async () => {
      const GITHUB_ENDPOINT = "https://api.github.com/graphql";

      const query = `{
      viewer {
        login
        avatarUrl
      }
    }`;

      try {
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
        setUser(data.data.viewer);
        return data;
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };

    const getUsersRepositories = async () => {
      setLoading(true);
      const GITHUB_ENDPOINT = "https://api.github.com/graphql";

      const query = `{
      viewer {
        login
        repositories(last: 30){
          nodes{
            id
            name
            createdAt
            languages(first: 5) {
              nodes{
                id
                name
              }
            }
          }
        }
      }
    }`;

      try {
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
        return data.data.viewer.repositories.nodes;
      } catch (error) {
        console.error("Error fetching repositories: ", error);
      } finally {
        setLoading(false);
      }
    };
    if (accessToken) {
      fetchUserData();
    }
  }, [accessToken, username]);

  useEffect(() => {
    setFilteredRepositories(
      repositories?.filter((repo) =>
        repo.name.toLowerCase().includes(searchInput.toLowerCase()),
      ),
    );
  }, [repositories, searchInput]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleViewMode = () => {
    if (viewMode == "all") {
      setViewMode("favorites");
    } else {
      setViewMode("all");
    }
  };

  const toggleFavorite = (repository: Repository) => {
    setFilteredRepositories((prevRepos) =>
      prevRepos?.map((repo) =>
        repo.id === repository.id
          ? { ...repo, favorite: !repo.favorite }
          : repo,
      ),
    );

    setRepositories((prevRepos) =>
      prevRepos?.map((repo) =>
        repo.id === repository.id
          ? { ...repo, favorite: !repo.favorite }
          : repo,
      ),
    );
  };

  const favorites = filteredRepositories?.filter((repo) => repo.favorite);

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex gap-2">
        {user && (
          <>
            <img
              src={user.avatarUrl}
              alt={user.login}
              className="size-5 rounded-full"
            />
            <span>Hello {user.login}!</span>
          </>
        )}
      </div>
      <div className="flex flex-col md:flex-row w-full md:justify-around">
        <div className="w-full md:w-2/3">
          <div className="flex gap-4 justify-center">
            <button onClick={handleViewMode}>
              <h2
                className={
                  ` text-[#172c45] text-2xl sm:text-1xl lg:text-2xl mb-2 ` +
                  (viewMode === "all" ? "underline" : "")
                }
              >
                Your repos
              </h2>
            </button>

            <button onClick={handleViewMode}>
              <h2
                className={
                  ` text-[#172c45] text-2xl sm:text-1xl lg:text-2xl mb-2 ` +
                  (viewMode === "favorites" ? "underline" : "")
                }
              >
                Your favorites
              </h2>
            </button>
          </div>
          <input
            type="text"
            placeholder="Search repositories"
            className="w-full rounded-full appearance-none border-2 py-2 px-3 font-normal text-primary text-sm "
            value={searchInput}
            onChange={(e) => handleFilterChange(e)}
          />
          {viewMode === "all" ? (
            <>
              {loading ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : filteredRepositories ? (
                filteredRepositories.map((repo) => (
                  <Repository
                    key={repo.id}
                    repository={repo}
                    toggleFavorite={toggleFavorite}
                    checkbox
                  />
                ))
              ) : (
                "This user has no repos"
              )}
            </>
          ) : (
            <div className="min-w-full md:min-w-72">
              {favorites && favorites.length > 0
                ? favorites.map((repo) => (
                    <Repository key={repo.id + "fav"} repository={repo} />
                  ))
                : "No favorites yet 😢"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Repository = ({
  repository,
  toggleFavorite,
  checkbox,
}: {
  repository: Repository;
  toggleFavorite?: (repository: Repository) => void;
  checkbox?: boolean;
}) => {
  return (
    <div className="py-4 px-2 mb-2 border-b border-b-slate-300">
      <div className="flex justify-between">
        <div className="flex flex-col justify-between text-left gap-4">
          <p>{repository.name}</p>
          <div className="flex gap-1 text-xs">
            {repository.languages.nodes.map((language) => (
              <span
                key={language.id + repository.name}
                className="rounded-full bg-cyan-700 text-white px-2"
              >
                {language.name}
              </span>
            ))}
          </div>
        </div>
        {checkbox && toggleFavorite && (
          <button onClick={() => toggleFavorite(repository)}>
            <FavoriteStar favorite={repository.favorite} />
          </button>
        )}
      </div>
    </div>
  );
};
