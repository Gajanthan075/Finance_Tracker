import { useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // Call the logout function from AuthContext to clear user data
    navigate("/login"); // Redirect to the login page
  }, [logout, navigate]);

  return <div>Logging out...</div>; // Optional: You can show a loader or some message
};

export default Logout;
