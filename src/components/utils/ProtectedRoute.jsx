import { Navigate } from "react-router-dom";

function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return JSON.parse(window.atob(str));
}

function isTokenExpired(token) {
  try {
    const payload = base64UrlDecode(token.split(".")[1]);
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("jwtToken");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("jwtToken");
    return <Navigate to="/login" replace />;
  }

  return children;
}
