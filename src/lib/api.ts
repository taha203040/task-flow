import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.API_BASE_URL_VRSN || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;   
