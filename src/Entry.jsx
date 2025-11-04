import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; 

export default function Entry() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          
          await axios.get(`${API_URL}/auth/check-token`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          navigate("/Public");
        } catch (error) {
          localStorage.removeItem("token");
          navigate("/Public");
        }
      } else {
        navigate("/Public");
      }
    };
    const timer = setTimeout(checkToken, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.body}>
      <div
        style={styles.container}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <h1 style={styles.heading}>CampusKart 🛒</h1>
      </div>
    </div>
  );
}

const styles = {
  body: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "black",
    color: "white",
  },
  container: {
    transition: "transform 0.3s ease",
    textAlign: "center",
  },
  heading: {
    fontSize: "3rem",
  },
};
