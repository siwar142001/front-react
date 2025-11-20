// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const access_token = localStorage.getItem("access_token");

    if (!access_token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}