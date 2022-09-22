// una volta che l'utente ha fatto il login , se ricarica la pagina i suoi dati vengono persi e quindi
// dovra' nuovamente effetuare il login. Con localStorage memorizzo i dati dell'utente
// nel proprio dispositivo quando fa il login e li rimuovo quando effettua il logout
// questo mi permette di aggirare il problema con il refresh della pagina dopo il login

export const addUserToLocalStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");
};

export const getUserFromLocalStorage = () => {
  const result = localStorage.getItem("user");
  // se user e' presente in memoria
  const user = result ? JSON.parse(result) : null;
  return user;
};
