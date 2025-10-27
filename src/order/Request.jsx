import axios from "axios";
import React, { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const Request = () => {
  const [product, setProduct] = useState([]);
  const token = localStorage.getItem("token");
  const jwt = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const handleproduct = async () => {
    const res = await axios.get(`${API_URL}/booking/myReq`, jwt);
    setProduct(res.data);
    console.log(res.data);
  };
  useEffect(() => {
    handleproduct();
  }, []);

  const handleAccept = async (id, pid) => {
    const res = await axios.post(
      `${API_URL}/booking/accept/${id}/${pid}`,
      {},
      jwt
    );
    console.log(res.data);
  };
  const handleReject = async (id) => {
    const res = await axios.post(`${API_URL}/booking/reject/${id}`, {}, jwt);
    console.log(res.data);
  };
  return (
    <div>
      <h1>Requests</h1>
      {product.length === 0 ? (
        <h2>: : empty : :</h2>
      ) : (
        <div>
          {product.map((item) => (
            <div key={item.id}>
              <hr></hr>
              <button onClick={() => handleAccept(item.id, item.productId)}>
                Accept
              </button>
              <button onClick={() => handleReject(item.id)}>Reject</button>

              {item.status}
              {item.borrowerName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Request;
