import { useState } from "react";

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        
        try {    
            const response = await apiClient.post('/register', {
                email,
                password
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
       
        <form 
        onSubmit={handleRegister}
         className="flex flex-col items-center w-120 border-2 rounded p-5 bg-slate-900 text-slate-300 h-120"
        
        >

        <h1 className="text-6xl font-bold mb-7">
            Register
        </h1>

            <input
                className="border-2 rounded m-2 p-3 w-100 mb-6"
                type="text"
                name="username"
                placeholder="Username"
                value={email}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                className="border-2 rounded m-2 p-3 w-100 mb-6"
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="border-2 rounded m-2 p-3 w-100 mb-6"
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit"
                className="border-2 rounded w-100 px-4 py-3 m-4 mt-3 mb-10 bg-slate-700 hover:bg-slate-600">
                Create an account
            </button>
        </form>
    );
}
