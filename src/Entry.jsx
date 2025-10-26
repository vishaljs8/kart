import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function Entry() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
        navigate("/Public");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div style={{ marginLeft: 600, marginTop: 300 }}>
      <h1>Welcome to kart...</h1>
    </div>
  );
}
