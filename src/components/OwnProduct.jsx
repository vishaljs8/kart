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

  const onDelete = async (productId) => {
    try {
      const res = await axios.delete(
        `${API_URL}/user/delete-prd/${productId}`,
        jwt
      );
      alert(res.data.message || "Product deleted successfully!");
      handleProduct();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-extrabold text-indigo-700 tracking-tight">
            Your Products
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105"
          >
            + Add Product
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <div
                key={p.id}
                className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300"
              >
                <div className="absolute top-3 right-3 text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                  {p.status || "....."}
                </div>
                <h3 className="text-xl font-bold text-indigo-700 mb-2">
                  {p.productName}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{p.description}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Quantity:{" "}
                  <span className="font-semibold text-gray-700">
                    {p.quantity}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => onDelete(p.id)}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-16 text-lg italic">
            You haven’t added any products yet. Start by creating one above 🚀
          </p>
        )}
      </div>
    </div>
  );
}

function ProductForm({ onClose, jwt, refreshProducts }) {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/user/create-prd`,
        { productName, description, quantity },
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
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10"></div>

      <div className="fixed inset-0 flex justify-center items-center z-20 animate-fadeIn">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 border-t-4 border-indigo-600 transform scale-100 hover:scale-[1.01] transition-transform duration-300">
          <h3 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
            Create Product
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Product Quantity"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onInput={(e) => {
                if (e.target.value < 1) e.target.value = 1;
              }}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
            ></textarea>

            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-300"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-300"
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
