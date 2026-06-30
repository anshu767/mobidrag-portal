import axios from "axios";

const api = axios.create({
  baseURL: "https://mobidrag-portal.onrender.com/api",
});

export default api;