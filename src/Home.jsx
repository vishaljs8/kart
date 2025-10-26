import { useNavigate } from "react-router-dom";
export default function Home() {
    const navigate = new useNavigate();
    function handle(){
        navigate("/About")
    }
  return (<>
  <h2>Home Page</h2>
    <button onClick ={handle}></button></>
  );
}
