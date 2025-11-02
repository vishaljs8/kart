import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const Product = () => {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const token = localStorage.getItem("token");
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
      alert("✅ Product booked successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Failed to book product. Please try again.");
    }
  };

  useEffect(() => {
    if (!product) {
      axios.get(`${API_URL}/public/product/${id}`).then((res) => setProduct(res.data));
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl w-full">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={product.image}
            alt={product.productName}
            className="w-64 h-64 object-contain rounded-xl border border-gray-200 shadow-sm"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-semibold text-indigo-600 mb-3">
              {product.productName}
            </h1>
            <p className="text-gray-700 mb-4">{product.description}</p>

            <button
              onClick={handleBook}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition duration-300"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
