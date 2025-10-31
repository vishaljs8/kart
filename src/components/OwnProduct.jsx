import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function OwnProduct() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem("token");

  const jwt = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const handleProduct = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/user/own-product`,
        jwt
      );
      setProducts(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    handleProduct();
  }, [token]);

  return (
    <div>
      <button onClick={() => setShowForm(true)}>Create Product</button>
      {showForm && (
        <ProductForm
          onClose={() => setShowForm(false)}
          jwt={jwt}
          refreshProducts={handleProduct}
        />
      )}
      <h2>Your Products</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <b>Product: </b>{p.productName} <br></br><b>Description: </b>{p.description}<hr></hr>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductForm({ onClose, jwt, refreshProducts }) {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/user/create-prd`,
        { productName, description },
        jwt
      );
      console.log("Product created:", res.data);
      refreshProducts(); 
    } catch (err) {
      console.error("Failed:", err.response?.data || err.message);
    }

    onClose();
  };

  return (
    <>
      <div style={styles.overlay}></div>
      <div style={styles.popup}>
        <h3>Create Product</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="productname"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div>
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
  popup: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    zIndex: 2,
  },
};

export default OwnProduct;