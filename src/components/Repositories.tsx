import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface Repository {
  id: string;
  name: string;
}

interface User {
  login: string;
  avatarUrl: string;
}

export const Repositories = ({ username }: { username: string }) => {
  const [repositories, setRepositories] = useState<Repository[] | undefined>(
    [],
  );
  const [favRepos, setFavRepos] = useState<Repository[] | undefined>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [user, setUser] = useState<User>();

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
        console.log(userData.data.viewer.login);
        const repos = await getUsersRepositories(userData.data.viewer.login);
        setRepositories(repos);
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
  };

  const getUsersRepositories = async (login: string) => {
    const GITHUB_ENDPOINT = "https://api.github.com/graphql";

    const query = `{
      user(login: "${login}") {
        repositories(last: 50) {
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

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const filteredRepos = repositories?.filter((repo) =>
    repo.name.toLowerCase().includes(searchInput.toLowerCase()),
  );

  return (
    <div className="py-4">
      <div className="flex gap-2">
        {user && (
          <>
            <img src={user.avatarUrl} alt="" className="size-5 rounded-full" />
            <span>Hello {user.login}!</span>
          </>
        )}
      </div>
      <div className="flex flex-col md:flex-row w-full md:justify-between">
        <div>
          <h2 className="font-bold text-[#172c45] text-2xl sm:text-1xl lg:text-3xl">
            Your repos
          </h2>
          <input
            type="text"
            placeholder="Search repositories"
            className="w-full appearance-none border-2 rounded py-2 px-3 font-normal text-primary text-sm "
            value={searchInput}
            onChange={(e) => handleFilterChange(e)}
          />
          {filteredRepos
            ? filteredRepos.map((repo) => (
                <Repository
                  key={repo.id}
                  name={repo.name}
                  setFavRepos={setFavRepos}
                />
              ))
            : "This user has no repos"}
        </div>
        <div>
          <h2 className="font-bold text-[#172c45] text-2xl sm:text-1xl lg:text-3xl">
            Favorites
          </h2>
          {favRepos && favRepos.length > 0
            ? favRepos.map((repo) => (
                <div key={repo.id + "fav"} className="flex gap-2">
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
        return prevRepos?.filter((repo) => repo.name !== name);
      } else {
        return [...(prevRepos || []), { name: name }];
      }
    });
  };
  return (
    <div className="py-4 px-2 bg-slate-50 shadow mb-2">
      <div className="flex gap-2 justify-between">
        <p>{name}</p>
        <input type="checkbox" checked={isFavorite} onChange={handleChange} />
      </div>
    </div>
  );
};
