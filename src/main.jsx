import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import Dashboard from "./pages/Dashboard.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <App />
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/" element={<Login/>}/>
        <Route path="/" element={<Register/>}/>
        <Route path="/" element={<Transfer/>}/>
    </BrowserRouter>
);