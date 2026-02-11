import axios from "axios";

const api = axios.create({
  baseURL: "https://api.lojasnalin.com.br:4000/estagionalin",
});

export default api;
