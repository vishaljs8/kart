import React, { useEffect, useState } from "react";
import axios from "axios";
const Myorder = () => {
  const [order, setOrder] = useState([]);
  const token = localStorage.getItem("token");
  const jwt = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const handleorder = async () => {
    const res = await axios.get(
      "http://localhost:8080/booking/my-bookings",
      jwt
    );
    setOrder(res.data);
    console.log(res.data);
  };
  useEffect(() => {
    handleorder();
  }, []);

  const handleReturn =async(id)=>{
    const res = await axios.post(`http://localhost:8080/booking/return/${id}`,{}, jwt);
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
