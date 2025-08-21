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

// Debug logging
console.log('🔧 Axios Instance Configuration:');
console.log('baseURL:', BASE_URL);
console.log('withCredentials:', true);

// request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["x-auth-token"] = accessToken; // Backend expects x-auth-token, not Bearer
    }

    // Debug logging for requests
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      withCredentials: config.withCredentials
    });

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase()
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      message: error.message,
      response: error.response?.data
    });

    if (error.response) {
      if (error.response.status === 401) {
        console.log('🔐 Unauthorized - redirecting to login');
        window.location.href = "/"; // redirect to login
      } else if (error.response.status === 500) {
        console.error("Server error:", error.response.data);
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timed out:", error.message);
    } else if (error.message === 'Network Error') {
      console.error("Network error - check if backend is running");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
