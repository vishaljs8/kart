import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const Product = () => {
  const { id, ownerEmail } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const [status, setStatus] = useState("Book");

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API_URL}/user/get-user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to fetch user:", err));
  }, [token]);

  useEffect(() => {
    if (!product) {
      axios
        .get(`${API_URL}/public/product/${id}`)
        .then((res) => setProduct(res.data))
        .catch((err) => console.error("Failed to fetch product:", err));
    }
  }, [id, product]);

  const handleBook = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/booking/borrow?productId=${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatus(res.data.status);
      alert(res.data.message);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to book product. Please try again.");
    }
  };
useEffect(() => {
  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/booking/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      
      const userBooking = res.data.find(
        (b) => String(b.productId) === String(id) && b.status !== "RETURNED"
      );
     
      if (userBooking) {
        if (userBooking.status === "REQUESTED") setStatus("REQUESTED");
        else if (userBooking.status === "ACTIVE") setStatus("BOOKED");
        else if (userBooking.status === "RETURNED") setStatus("BOOK");
        else setStatus("BOOKED");
      } else {
        setStatus("BOOK");
      }
    } catch (error) {
      console.error("Error fetching booking status:", error);
      setStatus("Book");
    }
  };

  if (token) fetchStatus();
}, [id, handleBook]);



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

            {user && user.email !== ownerEmail && (
              <button
                onClick={handleBook}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition duration-300"
              >
                {status}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
