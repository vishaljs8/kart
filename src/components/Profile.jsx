import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState(null); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const jwt = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const handleProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/get-user`, jwt);
        setUserData(res.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      }
    };
    handleProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/Public");
  };

  if (error)
    return (
      <div className="flex justify-center mt-10 text-red-500 font-semibold">
        Error: {error}
      </div>
    );

  if (!userData)
    return (
      <div className="flex justify-center mt-10 text-lg font-semibold">
        Loading profile...
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">
        User Profile
      </h2>

      <div className="bg-gray-100 p-5 rounded-lg mb-6">
        <p className="text-lg">
          <span className="font-semibold">Full Name:</span> {userData.fullname}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Email:</span> {userData.username}
        </p>
      </div>

      <h3 className="text-2xl font-semibold mb-3 text-gray-700">
        Your Products:
      </h3>

      {userData.productEntities && userData.productEntities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {userData.productEntities.map((p) => (
            <div
              key={p.id}
              className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <h4 className="text-lg font-semibold text-indigo-600">
                {p.productName}
              </h4>
              <p className="text-gray-700">{p.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Status: {p.status}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">You have no products yet.</p>
      )}

      <div className="text-center mt-8">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
