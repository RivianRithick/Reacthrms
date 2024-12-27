import axios from "axios";
import { getUserRole } from './utils/rbac';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// URLs that don't require authentication
const skipAuthUrls = [
  '/api/admin-login',
  '/api/admin-registration/renew-token',
  '/api/admin-registration/create',
  '/api/OnboardingManager/login',
  '/api/OnboardingManager/renew-token'
];

// Helper function to delay retry attempts
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Skip token for auth URLs
    if (skipAuthUrls.some(url => config.url.includes(url))) {
      return config;
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // If no token is found, redirect to login
      handleLogout();
      return Promise.reject(new Error('No authentication token found'));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle connection refused errors with retry logic
    if (error.code === 'ERR_NETWORK' && !originalRequest._retryCount) {
      originalRequest._retryCount = 0;
      
      while (originalRequest._retryCount < MAX_RETRIES) {
        try {
          originalRequest._retryCount++;
          await delay(RETRY_DELAY * originalRequest._retryCount);
          return await axiosInstance(originalRequest);
        } catch (retryError) {
          if (originalRequest._retryCount === MAX_RETRIES) {
            return Promise.reject(retryError);
          }
        }
      }
    }

    // Handle 401 Unauthorized or 403 Forbidden errors
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!refreshToken || !token) {
          handleLogout();
          return Promise.reject(error);
        }

        // Determine the correct renewal endpoint based on role
        let renewalEndpoint = '/api/admin-registration/renew-token';

        if (role === '4') { // Onboarding Manager
          renewalEndpoint = '/api/OnboardingManager/renew-token';
        }

        const response = await axiosInstance.post(renewalEndpoint, {
          token: token,
          refreshToken: refreshToken
        });

        if (response.data?.data) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('token', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Update the failed request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } else {
          handleLogout();
          return Promise.reject(new Error('Token renewal failed'));
        }
      } catch (refreshError) {
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  window.location.href = '/login';
};

export default axiosInstance;
