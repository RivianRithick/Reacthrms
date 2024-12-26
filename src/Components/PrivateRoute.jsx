import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { hasAccess } from "../utils/rbac";

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
  const location = useLocation();

  // Check for token presence and validity
  if (!token || isTokenExpired(token)) {
    localStorage.clear(); // Clear invalid session data
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Allow access to the unauthorized page without checking permissions
  if (location.pathname === "/unauthorized") {
    return <Outlet />;
  }

  // Check for route access based on user role
  if (!hasAccess(location.pathname)) {
    // If user doesn't have access to this route, redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // Render protected content if the token is valid and user has access
  return <Outlet />;
};

export default PrivateRoute;
