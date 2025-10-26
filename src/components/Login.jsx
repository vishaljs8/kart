import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signin = () => {
    navigate("/Signin");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });
      console.log("Login successful:", res.data);

      localStorage.setItem("token", res.data.token);

      navigate("/Public");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <div style={{ marginLeft: 650, marginTop: 300 }}>
        <h2>Login</h2>
      </div>
      <div style={{ marginLeft: 620, marginTop: 20 }}>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br></br>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br></br>
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?
          <button type="button" onClick={signin}>
            Sign Up
          </button>
        </p>
      </div>
    </>
  );
}

export default Login;
