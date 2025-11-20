import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import Notification from "../utils/Notification";
import { useNavigate } from "react-router-dom";


export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordValidate, setPasswordValidate] = useState("");
    const [registered, setRegistered] = useState(false);
    const [failedRegister, setFailedRegister] = useState(false);
    const [birthdate, setBirthdate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            navigate("/");
        }
    }, [navigate]); // redirect to dashboard if logged in 

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await apiClient.post("/user/create/", {
            name,
            email,
            password,
            birthdate,
            });

            setRegistered(true);

        } catch (error) {
            setFailedRegister(true);
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
                value={name}
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
                type="date"
                placeholder="Password..."
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
            />

            <button type="submit" className="border-2 rounded w-30 m-4 px-4 py-1">Register</button>

            <a className="underline" href="/login">Back to login</a>
        </form>

        {registered ? <Notification text="Account created successfully" active={registered} setActive={setRegistered}/> 
        : failedRegister ? <Notification text="Account creation failed" active={failedRegister} setActive={setFailedRegister}/> : <></>}
        
        </>
    );
}
