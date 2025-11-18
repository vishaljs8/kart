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
  const [status, setStatus] = useState("BOOK");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/booking/borrow?productId=${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      setStatus("REQUESTED");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to book product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/booking/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userBooking = res.data.find(
          (b) =>
            String(b.productId) === String(id) &&
            b.status !== "RETURNED" &&
            b.status !== "CANCELLED"
        );

        if (userBooking) {
          switch (userBooking.status) {
            case "REQUESTED":
              setStatus("REQUESTED");
              break;
            case "ACTIVE":
              setStatus("BOOKED");
              break;
            default:
              setStatus("BOOK");
          }
        } else {
          setStatus("BOOK");
        }
      } catch (error) {
        console.error("Error fetching booking status:", error);
        setStatus("BOOK");
      }
    };

    if (token) fetchStatus();
  }, [id, token]);

  if (!product)
    return <div className="text-center mt-20 text-gray-600 text-lg">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 p-10 flex justify-center items-center">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-2xl w-full border border-gray-100 transform hover:scale-[1.02] transition-all duration-300">
        <div className="text-center mb-8">
          <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-5xl text-white">📦</span>
          </div>
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
            {product.productName}
          </h1>
          <p className="text-gray-600 text-lg italic">{product.description}</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 space-y-3 shadow-inner border border-gray-200">
          <p>
           -<span className="font-semibold text-indigo-700">Owner:</span>{" "}
            {ownerEmail}
          </p>
          <p>
             -<span className="font-semibold text-indigo-700">Quantity:</span>{" "}
            {product.quantity}
          </p>
          <p>
             -<span className="font-semibold text-indigo-700">Status:</span>{" "}
            {product.status}
          </p>
        </div>

        {user && user.email !== ownerEmail && (
          <button
            onClick={handleBook}
            disabled={status !== "BOOK" || loading}
            className={`w-full py-3 rounded-xl font-semibold text-lg shadow-md transition-all duration-300 ${
              status === "BOOK"
                ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-pink-600 hover:to-yellow-400 text-white hover:shadow-lg hover:scale-[1.02]"
                : "bg-gray-400 cursor-not-allowed text-white"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Booking...
              </span>
            ) : (
              status
            )}
          </button>
        )}

        {user && user.email === ownerEmail && (
          <p className="mt-6 text-center text-sm text-gray-600">
            You are the owner of this product.
          </p>
        )}
      </div>
    </div>
  );
};

export default Product;
