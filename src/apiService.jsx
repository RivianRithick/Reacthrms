import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Fixed import for jwt-decode
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseUrl = process.env.REACT_APP_BASE_URL || 'https://hrmsasp.runasp.net';

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Add timeout
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

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
    return null;
  }

  try {
    const response = await axios.post(`${baseUrl}/api/renew-token`, {
      token,
      refreshToken,
    });
    
    if (response.status === 200) {
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken); // Store new refresh token
      return accessToken;
    }
    return null;
  } catch (error) {
    console.error("Token renewal failed:", error.message);
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
    // Skip token check for these endpoints
    const skipAuthUrls = [
      '/api/admin-login',
      '/api/renew-token',
      '/api/admin-registration/create'
    ];
    
    if (skipAuthUrls.some(url => config.url.includes(url))) {
      return config;
    }

    let token = localStorage.getItem("token");

    // If token exists but is expired, try to renew it
    if (token && isTokenExpired(token)) {
      const newToken = await renewToken();
      if (newToken) {
        token = newToken;
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Axios response interceptor for retrying failed requests
let retryCount = 0; // Global retry count
const MAX_RETRIES = 3;

// Helper for exponential backoff
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If there's no response or the error isn't 401, reject immediately
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Don't retry if this is already a retry or a token renewal request
    if (originalRequest._retry || originalRequest.url.includes('/api/renew-token')) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue the request if we're already refreshing
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newToken = await renewToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return axiosInstance(originalRequest);
      } else {
        processQueue(new Error('Failed to refresh token'));
        handleLogout();
        return Promise.reject(error);
      }
    } catch (refreshError) {
      processQueue(refreshError);
      handleLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
