import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Public() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      localStorage.setItem("token", urlToken);
      setToken(urlToken);
      navigate("/Public", { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/user/get-user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/public/product`);
        setProducts(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleItemClick = (product) => {
    navigate(`/Product/${product.id}/${product.ownerEmail}`, { state: { product } });
  };

  const handleLogin = () => navigate("/Login");

  if (loading)
    return (
      <h2 className="text-center text-gray-500 text-lg mt-10 animate-pulse">
        Loading products...
      </h2>
    );

  if (error)
    return (
      <h2 className="text-center text-red-500 font-semibold mt-10">
        Error: {error}
      </h2>
    );

  return (
    <div className="min-h-screen bg-gray-50">
     
      <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center sticky top-0 z-10">
        
        <div className="flex items-center gap-3 cursor-pointer" >
          {token && user ? (
            <div
              onClick={() => navigate("/Profile")}
              className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg"
              title={user.fullname || user.email}
            >
              {(user.fullname || user.email)?.charAt(0).toUpperCase()}
            </div>
          ) : (
            <></>
          )}
          <h1
            className="text-2xl font-bold text-blue-600 hover:text-blue-700"
          >
            CampusKart 🛒
          </h1>
        </div>

        
        <div className="flex items-center gap-3">
          {token ? (
            <>
              <button
                onClick={() => navigate("/Myorder")}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                My Orders
              </button>
              <button
                onClick={() => navigate("/Request")}
                className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
              >
                Requests
              </button>
              <button
                onClick={() => navigate("/OwnProduct")}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                My Products
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      
      <section className="px-6 py-10">
        {products.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
            {products.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-transform transform hover:-translate-y-1 cursor-pointer"
              >
               
                <div className="bg-gray-100 h-40 flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-5xl">📦</span>
                  )}
                </div>

                <div className="p-5 text-left">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {item.productName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {item.description || "No description provided."}
                  </p>
                  <p className="text-gray-700 font-medium mb-1">
                    <span className="font-semibold">Status:</span> {item.status}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Owner:</span>{" "}
                    {item.ownerName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h3 className="text-center text-gray-500 text-lg">
            No products available right now 😔
          </h3>
        )}
      </section>
    </div>
  );
}

export default Public;
