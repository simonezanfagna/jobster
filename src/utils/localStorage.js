export const addTokenToLocalStorage = (token) => {
  localStorage.setItem("token", token);
};

export const removeTokenFromLocalStorage = () => {
  localStorage.removeItem("token");
};

export const getTokenFromLocalStorage = () => {
  const result = localStorage.getItem("token");
  // if the token is present in memory:
  const token = result ? result : null;
  return token;
};
