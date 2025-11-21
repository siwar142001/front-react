import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return JSON.parse(window.atob(str));
}

function isTokenExpired(token) {
  try {
    const payload = base64UrlDecode(token.split(".")[1]);
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
}

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("jwtToken");
  const [valid, setValid] = useState(null);

  // no token OR expired → logout
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("jwtToken");
    return <Navigate to="/login" replace />;
  }

  // ask backend if token is valid (user still exists)
  useEffect(() => {
    fetch("http://127.0.0.1:8000/validate", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setValid(data.valid))
      .catch(() => setValid(false));
  }, [token]);

  // waiting for backend check
  if (valid === null) return <>Loading...</>;

  // Backend says token invalid → logout
  if (!valid) {
    localStorage.removeItem("jwtToken");
    return <Navigate to="/login" replace />;
  }

  // all good
  return children;
}
