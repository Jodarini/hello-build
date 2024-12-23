import { useEffect, useState } from "react";
import { getUsersRepositories } from "../services/api/github";

const useRepositories = () => {
  const [repositories, setRepositories] = useState<Repository[] | undefined>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setIsLoading(true);
        const data = await getUsersRepositories();
        const reposWithFavorites = data.map((repo) => ({
          ...repo,
          favorite: false,
        }));
        setRepositories(reposWithFavorites);
      } catch (err) {
        setError(err.message || "Something went wrong fetching repositories");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRepositories();
  }, []);
  const toggleFavorite = (id: string) => {
    setRepositories((prevRepos) =>
      prevRepos!.map((repo) =>
        repo.id === id ? { ...repo, favorite: !repo.favorite } : repo,
      ),
    );
  };

  return { repositories, isLoading, error, toggleFavorite };
};

export default useRepositories;
