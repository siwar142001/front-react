import { useState } from "react";
import apiClient from "../../api/apiClient";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.post("/login/", {
        email,
        password,
      }, { withCredentials: true }
    );

      // extract token
      const token = response.data.access || response.data.token;

      // store token
      localStorage.setItem("jwtToken", token);

      alert("Logged in successfully!");
      console.log("Token:", token);

    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
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

      <button
        type="submit"
        className="border-2 rounded w-30 m-4 px-4 py-1"
      >
        Login
      </button>

      <div>Create an account</div>
    </form>
  );
}
