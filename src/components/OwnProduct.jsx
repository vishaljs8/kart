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
      const res = await axios.get(`${API_URL}/user/own-product`, jwt);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-700">Your Products</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition duration-300"
          >
            + Create Product
          </button>
        </div>

        {showForm && (
          <ProductForm
            onClose={() => setShowForm(false)}
            jwt={jwt}
            refreshProducts={handleProduct}
          />
        )}

        {products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                  {p.productName}
                </h3>
                <p className="text-gray-700 mb-2">{p.description}</p>
                <p className="text-sm text-gray-500 italic">
                  Status: {p.status || "Available"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-10 text-lg">
            You haven't added any products yet.
          </p>
        )}
      </div>
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
      onClose();
    } catch (err) {
      console.error("Failed:", err.response?.data || err.message);
      alert("Failed to create product!");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-10"></div>

      {/* Modal */}
      <div className="fixed inset-0 flex justify-center items-center z-20">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96">
          <h3 className="text-2xl font-bold text-indigo-700 mb-5 text-center">
            Create Product
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>

            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium shadow"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default OwnProduct;
