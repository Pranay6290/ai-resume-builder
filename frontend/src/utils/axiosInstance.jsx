import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Increased timeout for Render cold starts
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});



// request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["x-auth-token"] = accessToken; // Backend expects x-auth-token, not Bearer
    }



    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Only redirect to login if we're not already on login/signup pages
        const currentPath = window.location.pathname;
        if (currentPath !== '/' && currentPath !== '/signup' && currentPath !== '/login') {
          // Clear stored auth data
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
