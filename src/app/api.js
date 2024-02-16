import axios from "axios";

const mainAxios = axios.create({
  baseURL: "http://localhost:5000",
});

export { mainAxios };
