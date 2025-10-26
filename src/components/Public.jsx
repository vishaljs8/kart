import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Public() {
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleProduct = async () => {
      const res = await axios.get("http://localhost:8080/public/product");
      setProduct(res.data);
      console.log(res.data);
    };
    handleProduct();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null); 
  };

  const handleitem = (product) => {
    navigate(`/Product/${product.id}`, { state: { product } });
  };

  const handleLogin = () => {
    navigate("/Login");
  };

  return (
    <div>
      {token ? (
        <>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={()=>navigate("/Myorder")}>My Order</button>
        <button onClick={()=>navigate("/Request")}>Requests</button>
        <button onClick={()=>navigate("/OwnProduct")}>OwnProduct</button>
        </>
      ) : (
        <>
        <button onClick={handleLogin}>Login</button>
       </>
      )}

      <h2>Products</h2>
      <div style={styles.container}>
        {product.map((item) => (
          <div key={item.id} style={styles.card} onClick={()=>handleitem(item)}>
            {/* <img src={item.image} alt={item.title} style={styles.image} /> */}
            <div style={styles.info}>
              <h3 style={styles.title}>{item.productName}</h3>
              <p style={styles.price}>{item.description}</p>
              <p style={styles.price}>{item.status}</p>
            </div>
          </div>
        ))}
      </div>
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
  },
  image: {
    width: "100px",
    height: "100px",
    objectFit: "contain",
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
