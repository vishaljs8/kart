import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Public() {
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // ✅ Capture token from Google OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      localStorage.setItem("token", urlToken);
      setToken(urlToken);

      // remove ?token= from URL
      window.history.replaceState({}, document.title, "/Public");
    }
  }, [location]);

  // ✅ Fetch products
  useEffect(() => {
    const handleProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/public/product`);
        setProduct(res.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    handleProduct();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const handleItem = (product) => {
    navigate(`/Product/${product.id}`, { state: { product } });
  };

  const handleLogin = () => {
    navigate("/Login");
  };

  if (loading) return <h2>Loading products...</h2>;
  if (error) return <h2 style={{ color: "red" }}>Error: {error}</h2>;

  return (
    <div>
      {token ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={() => navigate("/Myorder")}>My Order</button>
          <button onClick={() => navigate("/Request")}>Requests</button>
          <button onClick={() => navigate("/OwnProduct")}>Own Product</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}

      <h2>Products</h2>

      {product.length > 0 ? (
        <div style={styles.container}>
          {product.map((item) => (
            <div
              key={item.id}
              style={styles.card}
              onClick={() => handleItem(item)}
            >
              <div style={styles.info}>
                <h3 style={styles.title}>{item.productName}</h3>
                <p style={styles.price}>{item.description}</p>
                <p style={styles.price}>{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h3>No products available right now.</h3>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    margin: "10px",
    padding: "10px",
    width: "200px",
    textAlign: "center",
    cursor: "pointer",
  },
  info: {
    marginTop: "10px",
  },
  title: {
    fontSize: "14px",
  },
  price: {
    fontWeight: "bold",
  },
};

export default Public;
