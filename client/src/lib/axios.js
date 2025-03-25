import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.mode === "development"
      ? "http://localhost:5050/api"
      : "https://api.example.com",
  withCredentials: true,
});

export default axiosInstance;
