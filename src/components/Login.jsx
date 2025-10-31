import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔹 Local Sign In (username + password)
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

  // 🔹 Google Sign-In Redirect
  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${API_URL}/auth/google/callback`;
    const scope = encodeURIComponent("openid email profile");
    const responseType = "code";

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

    // Redirect user to Google OAuth2 login
    window.location.href = authUrl;
  };

  // 🔹 Navigate to Sign Up Page
  const signin = () => {
    navigate("/Signin");
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
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account?
          <button type="button" onClick={signin}>
            Sign Up
          </button>
        </p>

        <hr style={{ width: "200px", marginLeft: "50px" }} />
        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            backgroundColor: "#4285F4",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Login with Google
        </button>
      </div>
    </>
  );
}

export default Login;
