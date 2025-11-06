import axios from "axios";
import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const Request = () => {
  const [product, setProduct] = useState([]);
  const token = localStorage.getItem("token");
  const jwt = { headers: { Authorization: `Bearer ${token}` } };

  const handleproduct = async () => {
    try {
      const res = await axios.get(`${API_URL}/booking/myReq`, jwt);
      setProduct(res.data);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  useEffect(() => {
    handleproduct();
  }, []);

  const handleAccept = async (id, pid) => {
    try {
      const res = await axios.post(`${API_URL}/booking/accept/${id}/${pid}`, {}, jwt);
      alert(res.data.message || "Request accepted!");
      handleproduct(); 
    } catch (err) {
      console.error("Error accepting request:", err);
      alert("Failed to accept request.");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await axios.post(`${API_URL}/booking/reject/${id}`, {}, jwt);
      alert(res.data.message || "Request rejected.");
      handleproduct(); 
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("Failed to reject request.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-indigo-700 text-center mb-6">
          Product Requests
        </h1>

        {product.length === 0 ? (
          <p className="text-center text-gray-600 text-lg font-medium">
            : : No Requests Yet : :
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {product.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition duration-200"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.productName}
                </h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <b>Borrower:</b> {item.borrowerEmail}
                  </p>
                  <p>
                    <b>Owner:</b> {item.ownerEmail}
                  </p>
                  <p>
                    <b>Start Date:</b>{" "}
                    {new Date(item.startDate).toLocaleString()}
                  </p>
                  <p>
                    <b>End Date:</b>{" "}
                    {item.endDate
                      ? new Date(item.endDate).toLocaleString()
                      : "Pending"}
                  </p>
                  <p
                    className={`mt-2 font-medium ${
                      item.status === "REQUESTED"
                        ? "text-yellow-600"
                        : item.status === "APPROVED"
                        ? "text-green-600"
                        : item.status === "REJECTED"
                        ? "text-red-500"
                        : "text-gray-600"
                    }`}
                  >
                    Status: {item.status}
                  </p>
                </div>

                {item.status === "REQUESTED" && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleAccept(item.id, item.productId)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Request;
