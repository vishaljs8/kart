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
    const res = await axios.get(
      `${API_URL}/booking/my-bookings`,
      jwt
    );
    setOrder(res.data);
    console.log(res.data);
  };
  useEffect(() => {
    handleorder();
  }, []);

  const handleReturn =async(id)=>{
    const res = await axios.post(`${API_URL}/booking/return/${id}`,{}, jwt);
    console.log(res.data);
  };

  return (
    <div>
      <h5>my order</h5>
      <ul>
        {order.map((item) => (
          <li key={item.id}>
            <button onClick={()=>handleReturn(item.id)}>return</button>
            {item.ownerName}
            {item.type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Myorder;
