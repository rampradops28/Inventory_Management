import axios from "axios";
import { getToken, removeToken } from "./auth"; // utility to get/remove token from localStorage
import { useNavigate } from "react-router-dom";

// Create an axios instance
const API = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add token to each request
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Global response interceptor for invalid/expired token
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.data?.message === "Invalid token")) {
      // Token is invalid or expired
      removeToken(); // remove token from localStorage
      window.location.href = "/login"; // redirect to login
      alert("Session expired. Please log in again.");
    }
    return Promise.reject(error);
  }
);

export default API;
