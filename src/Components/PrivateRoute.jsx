import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Ensure jwt-decode is installed: npm install jwt-decode

// Helper to check if the token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded || !decoded.exp) {
      console.warn("Invalid token structure.");
      return true; // Treat invalid tokens as expired
    }
    const now = Date.now() / 1000; // Current time in seconds
    return decoded.exp < now; // Check if the token has expired
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return true; // Treat decoding errors as expired
  }
};

const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  // Check for token presence and validity
  if (!token || isTokenExpired(token)) {
    localStorage.clear(); // Clear invalid session data
    return <Navigate to="/login" replace />;
  }

  // Render protected content if the token is valid
  return <Outlet />;
};

export default PrivateRoute;
