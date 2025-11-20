import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import Notification from "../utils/Notification";
import { useNavigate } from "react-router-dom";


export default function LoginForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordValidate, setPasswordValidate] = useState("");
    const [registered, setRegistered] = useState(false);
    const [failedRegister, setFailedRegister] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const registered = localStorage.getItem("jwtToken");
        if (token) {
            navigate("/");
        }
    }, [navigate]); // redirect to dashboard if logged in 

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await apiClient.post("/user/create", {
            name,
            email,
            password,
            birthdate,
            });

            const token = response.data.access_token;
            localStorage.setItem("jwtToken", token);

            setLoggedIn(true); // 👈 triggers redirect effect
        } catch (error) {
            setFailedLogIn(true);
        }
    };

    useEffect(() => {
    if (registered) {
        const timer = setTimeout(() => {
        navigate("/");
        }, 2000);

        return () => clearTimeout(timer);
    }
    }, [registered]);

    return (
        <>
        <form
        onSubmit={handleRegister}
        className="flex flex-col items-center w-fit border-2 rounded p-5 bg-slate-900"
        >
            <input
                className="border-2 rounded m-2 p-1 w-60"
                type="text"
                placeholder="Name..."
                value={email}
                onChange={(e) => setName(e.target.value)}
            />

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

            <input
                className="border-2 rounded m-2 p-1 w-60"
                type="password"
                placeholder="Validate password..."
                value={passwordValidate}
                onChange={(e) => setPasswordValidate(e.target.value)}
            />

            <button type="submit" className="border-2 rounded w-30 m-4 px-4 py-1">Login</button>

            <a className="underline" href="/register">No account ? Create one here</a>
        </form>

        {loggedIn ? <Notification text="Connection successful" active={loggedIn} setActive={setLoggedIn}/> 
        : failedLogIn ? <Notification text="Connection Failed" active={failedLogIn} setActive={setFailedLogIn}/> : <></>}
        
        </>
    );
}
