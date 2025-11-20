import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import Notification from "../utils/Notification";
import { useNavigate } from "react-router-dom";


export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [failedLogIn, setFailedLogIn] = useState(false);
    const navigate = useNavigate();

    if(localStorage.getItem("jwtToken")){
        navigate("/")
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await apiClient.post("/login", {
            email,
            password,
            });

            const token = response.data.access_token;
            localStorage.setItem("jwtToken", token);

            setLoggedIn(true); // 👈 triggers redirect effect
        } catch (error) {
            setFailedLogIn(true);
        }
    };

    useEffect(() => {
    if (loggedIn) {
        const timer = setTimeout(() => {
        navigate("/");
        }, 2000);

        return () => clearTimeout(timer);
    }
    }, [loggedIn]);

    return (
        <>
        <form
        onSubmit={handleLogin}
        className="flex flex-col items-center w-fit border-2 rounded p-5 bg-slate-900"
        >
            <input
                className="border-2 rounded m-2 p-1 w-60"
                type="text"
                placeholder="E-mail..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="border-2 rounded m-2 p-1 w-60"
                type="password"
                placeholder="Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="border-2 rounded w-30 m-4 px-4 py-1">Login</button>

            <a className="underline" href="/register">No account ? Create one here</a>
        </form>

        {loggedIn ? <Notification text="Connection successful" active={loggedIn} setActive={setLoggedIn}/> 
        : failedLogIn ? <Notification text="Connection Failed" active={failedLogIn} setActive={setFailedLogIn}/> : <></>}
        
        </>
    );
}
