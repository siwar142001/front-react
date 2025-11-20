import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Transfer from "./pages/Transfer.jsx";
import History from "./pages/History.jsx";
import Deposit from "./pages/Deposit";

export default function App(){
    return(
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/history" element={<History/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/transfer" element={<Transfer/>}/>
            <Route path="/depot" element={<Deposit />} /> 
            <Route path="/transfert" element={<Transfer/>}/>
        </Routes>
    )
};