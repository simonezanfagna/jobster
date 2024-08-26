// creo una custom instance per avere come bese di tutte le chiamate API i seguenti valori

import axios from "axios";

const customFetch = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

export default customFetch;
