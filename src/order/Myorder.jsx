import React, { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const Myorder = () => {
  const [order, setOrder] = useState([]);
  const token = localStorage.getItem("token");
  const jwt = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const handleorder = async () => {
    try {
      const res = await axios.get(`${API_URL}/booking/my-bookings`, jwt);
      setOrder(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    handleorder();
  }, []);

  const handleReturn = async (id) => {
    try {
      const res = await axios.post(`${API_URL}/booking/return/${id}`, {}, jwt);
      alert(res.data.message || "Product returned successfully");
      handleorder(); 
    } catch (err) {
      console.error("Failed to return product:", err);
      alert("Failed to return product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          My Orders
        </h1>

        {order.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            You have no current orders.
          </p>
        ) : (
          <ul className="space-y-6">
            {order.map((item) => (
              <li
                key={item.id}
                className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition duration-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-800 mb-1">
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <b>Owner:</b> {item.ownerEmail}
                    </p>
                    <p className="text-sm text-gray-600">
                      <b>Borrower:</b> {item.borrowerEmail}
                    </p>
                    <p className="text-sm text-gray-600">
                      <b>Start:</b> {new Date(item.startDate).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <b>End:</b>{" "}
                      {item.endDate
                        ? new Date(item.endDate).toLocaleString()
                        : "Active"}
                    </p>
                    <p
                      className={`mt-2 text-sm font-medium ${
                        item.status === "REQUESTED"
                          ? "text-yellow-600"
                          : item.status === "APPROVED"
                          ? "text-green-600"
                          : item.status === "RETURNED"
                          ? "text-gray-500"
                          : "text-indigo-600"
                      }`}
                    >
                      Status: {item.status}
                    </p>
                  </div>
                  {item.status === "ACTIVE" && (
                    <button
                      onClick={() => handleReturn(item.id)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition duration-200"
                    >
                      Return
                    </button>
                  )}
                  {item.status === "REQUESTED" && (
                    <button
                      onClick={() => handleReturn(item.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition duration-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Myorder;
