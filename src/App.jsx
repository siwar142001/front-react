import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Transfer from "./pages/Transfer.jsx";
import Deposit from "./pages/Deposit.jsx";
import History from "./pages/History.jsx";
import "./style.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="transfer" element={<Transfer />} />
      <Route path="depot" element={<Deposit />} />
      <Route path="transactions/history/:accountId" element={<History />} />
  {/* Fallback - helpful during development when a route isn't matched */}
      <Route path="*" element={<div style={{padding:20}}>Aucune route correspondante — vérifie l'URL ou retourne à <a href="/">dashboard</a></div>} />
    </Routes>
  );
}
