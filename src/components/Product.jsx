
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const Product = () => {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const token = localStorage.getItem("token");
  const name = "jadoo";
  const jwt = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const handleBook = async () => {
  try {
    const res = await axios.post(
      `${API_URL}/booking/borrow?productId=${id}`,
      {}, 
      jwt
    );
    console.log(res.data);
    alert("Product booked successfully!");
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Failed to book product");
  }
};


  useEffect(() => {
    if (!product) {
      axios
        .get(`${API_URL}/public/product/${id}`)
        .then((res) => setProduct(res.data));
    }
  }, [id, product]);

  if (!product) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <img
        src={product.image}
        alt={product.productName}
        style={{ width: "200px", height: "200px", objectFit: "contain" }}
      />
      <h1>{product.productName}</h1>
      <p>{product.description}</p>
      <button onClick={handleBook}>BOOK</button>
    </div>
  );
};

export default Product;
