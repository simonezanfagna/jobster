// custom instance to use in all API calls

import axios from "axios";

const customFetch = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

export default customFetch;
