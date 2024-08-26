export const addTokenToLocalStorage = (token) => {
  localStorage.setItem("token", token);
};

export const removeTokenFromLocalStorage = () => {
  localStorage.removeItem("token");
};

export const getTokenFromLocalStorage = () => {
  const result = localStorage.getItem("token");
  // se il token e' presente in memoria
  const token = result ? result : null;
  return token;
};
