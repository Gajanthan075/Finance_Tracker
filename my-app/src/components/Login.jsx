import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "../App.css";

import video from "../components/asset/v1.mp4";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null); // Tracks success/failure of login
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:5000/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Login successful");
      setIsSuccess(true); // Set login success
      login(data.userid);
      navigate("/dashboard");
    } else {
      setMessage(data.error || "Login failed");
      setIsSuccess(false); // Set login failure
    }
  };

  return (
    <div className="loginPage flex">
      <div className="container flex">
        <div className="videoDiv">
          <video src={video} autoPlay loop muted />
          <div className="textDiv">
            <h2 className="title">
              Your Financial Hub: Smarter Spending, Saving, and Investing at a
              Glance
            </h2>
            <p>Empower your financial future with confidence</p>
          </div>
          <div className="footerDiv flex">
            <span className="text">Don't have an account?</span>
            <Link to="/register">
              <button className="btn">Sign Up</button>
            </Link>
          </div>
        </div>
        <div className="formDiv flex">
          <div className="headerDiv">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
              Login ):
            </h1>
          </div>

          <form className="form grid" onSubmit={handleLogin}>
            <div className="inputDiv">
              <label htmlFor="userId">User_ID</label>
              <div className="input flex size-10 w-full">
                <input
                  type="text"
                  placeholder="Enter userId"
                  value={userid}
                  onChange={(e) => setUserid(e.target.value)}
                  className="w-full px-3 py-2 border rounded mb-4"
                />
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="password">Password</label>
              <div className="input flex size-10 w-full ">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded mb-4"
                />
              </div>
            </div>

            <button type="submit" className="btn flex">
              <span>Login</span>
            </button>
            <span className="forgotPassword">
              Forgot your Password? <a href="/">Click Here</a>
            </span>
          </form>

          {/* Display the login message */}
          {message && (
            <div className={`message ${isSuccess ? "success" : "error"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
