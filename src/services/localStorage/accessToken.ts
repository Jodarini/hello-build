export const getAccessToken = () => {
  const token = localStorage.getItem("access_token");
  return token;
};
