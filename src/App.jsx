import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Transfer from "./pages/Transfer.jsx";
import History from "./pages/History.jsx";
import Beneficiaries from "./pages/Beneficiaries.jsx";
import ProtectedRoute from "./components/utils/ProtectedRoute.jsx";

export default function App(){
    return(
        <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
            <Route path="/history" element={<ProtectedRoute><History/></ProtectedRoute>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/transfer" element={<ProtectedRoute><Transfer/></ProtectedRoute>}/>
            <Route path="/beneficiaries" element={<ProtectedRoute><Beneficiaries/></ProtectedRoute>}/>
        </Routes>
    )
};