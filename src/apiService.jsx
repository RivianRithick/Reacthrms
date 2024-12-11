import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Fixed import for jwt-decode
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseUrl = process.env.REACT_APP_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to check if the token is expired
const isTokenExpired = (token) => {
  if (!token) return true; // Treat missing tokens as expired

  try {
    const decoded = jwtDecode(token);
    if (!decoded || !decoded.exp) {
      console.warn("Invalid token structure.");
      return true;
    }

    const now = Date.now() / 1000; // Current time in seconds
    return decoded.exp < now;
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
    handleLogout();
    return null;
  }

  try {
    const response = await axios.post(`${baseUrl}/api/renew-token`, {
      token,
      refreshToken,
    });
    if (response.status === 200 && response.data?.accessToken) {
      const { accessToken } = response.data;
      localStorage.setItem("token", accessToken); // Save the new token
      return accessToken;
    } else {
      console.warn("Failed to renew token. Refresh token may be expired.");
      toast.error("Session expired. Please log in again.");
      handleLogout();
      return null;
    }
  } catch (error) {
    console.error("Token renewal failed:", error.message);
    toast.error("Unable to refresh session. Please log in again.");
    handleLogout();
    return null;
  }
};

// Logout function with improved handling
let isLoggingOut = false; // Prevent multiple logout triggers
const handleLogout = () => {
  if (isLoggingOut) return; // Avoid duplicate logouts
  isLoggingOut = true;

  localStorage.clear();
  toast.error("Your session has expired. Please log in again.");
  setTimeout(() => {
    window.location.href = "/login"; // Redirect to login
    isLoggingOut = false; // Reset the flag
  }, 1000);
};

// Axios request interceptor to handle token validation
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (
      !config.url.includes("/api/admin-login") &&
      !config.url.includes("/api/renew-token") &&
      !config.url.includes("/api/admin-registration/create")
    ) {
      if (token && isTokenExpired(token)) {
        console.info("Token expired. Attempting renewal...");
        const newToken = await renewToken();
        if (newToken) {
          config.headers.Authorization = `Bearer ${newToken}`;
        } else {
          handleLogout();
          throw new Error("Token renewal failed. User logged out.");
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
let retryCount = 0; // Global retry count
const MAX_RETRIES = 3;

// Helper for exponential backoff
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      // Handle network error (no response from server)
      toast.error("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && retryCount < MAX_RETRIES) {
      retryCount++;
      originalRequest._retry = true;

      try {
        const newToken = await renewToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          await sleep(retryCount * 1000); // Exponential backoff
          return axiosInstance(originalRequest); // Retry the request
        } else {
          console.warn("Retry failed. Logging out.");
          handleLogout();
        }
      } catch (retryError) {
        console.warn("Token renewal and retry failed:", retryError.message);
        handleLogout();
      }
    }

    retryCount = 0; // Reset retry count for other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
