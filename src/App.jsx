import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Transfer from "./pages/Transfer.jsx";
import History from "./pages/History.jsx";

export default function App(){
    return(
        <BrowserRouter>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/history" element={<History/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/transfer" element={<Transfer/>}/>
        </BrowserRouter>
    )
};