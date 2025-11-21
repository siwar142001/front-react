// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return JSON.parse(window.atob(str));
}

function isTokenExpired(token) {
  try {
    const payload = base64UrlDecode(token.split(".")[1]);
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;     // true if expired
  } catch (e) {
    return true; // invalid token => treat as expired
  }
}

export default function ProtectedRoute({ children }) {
  const access_token = localStorage.getItem("jwtToken");

  // If no token, redirect
  if (!access_token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists but is expired
  if (isTokenExpired(access_token)) {
    localStorage.removeItem("jwtToken"); // clean it
    return <Navigate to="/login" replace />;
  }

  // Token valid
  return children;
}
