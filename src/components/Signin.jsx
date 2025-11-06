import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/Login");
  };

  const handleSignin = async (e) => {
    e.preventDefault(); 
    setError(""); 

    
    if (!email || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/auth/create-us`, {
        email,
        password,
      });
      console.log("Signup successful:", res.data);
      navigate("/Login"); 
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      console.error("Signup failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignin} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={goToLogin}
            className="text-green-500 hover:underline font-medium"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signin;
