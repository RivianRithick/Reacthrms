import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Fixed import (default export not used anymore)

const baseUrl = "https://hrmsasp.runasp.net"; // Replace with your actual base URL

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to check if the token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded || !decoded.exp) {
      console.warn("Invalid token structure.");
      return true; // Treat invalid tokens as expired
    }
    const now = Date.now() / 1000; // Current time in seconds
    return decoded.exp < now; // Check if token expiration time has passed
  } catch (error) {
    console.warn("Error decoding token:", error.message);
    return true; // Treat decoding errors as expired
  }
};

// Function to renew the token
const renewToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const token = localStorage.getItem("token");

  if (!refreshToken || !token) {
    console.error("No token or refresh token found.");
    handleLogout(); // Trigger logout if either token is missing
    throw new Error("Token or refresh token missing.");
  }

  try {
    const response = await axios.post(`${baseUrl}/api/renew-token`, { token, refreshToken });
    if (response.status === 200 && response.data?.accessToken) {
      const { accessToken } = response.data;
      localStorage.setItem("token", accessToken); // Save the new token
      return accessToken;
    }
    throw new Error("Failed to renew token.");
  } catch (error) {
    console.error("Token renewal failed:", error.message);
    handleLogout();
    throw error;
  }
};

// Logout function with improved handling
let isLoggingOut = false; // Prevent multiple logout triggers
const handleLogout = () => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  localStorage.clear();
  alert("Session expired. Please log in again."); // Replace with a toast for better UX
  window.location.href = "/login";

  setTimeout(() => {
    isLoggingOut = false; // Reset the flag
  }, 1000);
};

// Axios request interceptor to handle token validation
axiosInstance.interceptors.request.use(
  async (config) => {
    if (
      !config.url.includes("/api/admin-login") &&
      !config.url.includes("/api/renew-token") &&
      !config.url.includes("/api/admin-registration/create")
    ) {
      const token = localStorage.getItem("token");

      if (token && isTokenExpired(token)) {
        console.info("Token expired. Attempting renewal...");
        try {
          const newToken = await renewToken();
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (error) {
          console.error("Token renewal failed:", error.message);
          handleLogout();
          throw error;
        }
      } else if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error.message);
    return Promise.reject(error);
  }
);

// Axios response interceptor for retrying failed requests
let retryCount = 0; // Global retry limit
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && retryCount < 3) {
      retryCount++;
      originalRequest._retry = true;
      try {
        const newToken = await renewToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // Retry the request
      } catch (renewError) {
        console.error("Retry after token renewal failed:", renewError.message);
        handleLogout();
        return Promise.reject(renewError);
      }
    }
    retryCount = 0; // Reset retry count on other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
