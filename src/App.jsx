
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Entry from "./Entry";
import Login from "./components/Login";
import Signin from "./components/Signin";
import Public from "./components/Public";
import Myorder from "./order/Myorder";
import Request from "./order/Request";
import Product from "./components/Product";
import OwnProduct from "./components/OwnProduct";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Entry />} />
        <Route path="/Login" element={<Login />}/>
        <Route path="/Signin" element={<Signin />}/>
        <Route path="/Public" element={<Public />}/>
        <Route path="/Myorder" element={<Myorder />}/>
        <Route path="/Request" element={<Request />}/>
        <Route path="/Product/:id/:ownerEmail" element={<Product />}/>
        <Route path="/OwnProduct" element={<OwnProduct />}/>
        <Route path="/Profile" element={<Profile />}/>
      </Routes>
    </Router>
  );
}

export default App;
