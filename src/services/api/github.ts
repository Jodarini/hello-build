import { getAccessToken } from "../localStorage/accessToken";

export const fetchUserData = async () => {
  try {
    const userData = await getUser();
    if (userData) {
      const repos = (await getUsersRepositories()) as Repository[];
      return repos;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getUser = async (): Promise<User> => {
  const GITHUB_ENDPOINT = "https://api.github.com/graphql";
  const accessToken = getAccessToken();

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
    const data = (await response.json()) as ViewerResponse;
    const user = data.data.viewer;
    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const getUsersRepositories = async (): Promise<Repository[]> => {
  // setLoading(true);
  const GITHUB_ENDPOINT = "https://api.github.com/graphql";
  const accessToken = getAccessToken();

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
    return [];
  }
};
