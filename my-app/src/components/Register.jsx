import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import video from "../components/asset/v1.mp4";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userid, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null); // To track success or failure
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:5000/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid, username, password, email }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(data.message);
      setIsSuccess(true);
      navigate("/login");
    } else {
      setMessage(data.error);
      setIsSuccess(false);
    }
  };

  return (
    <div className="registerPage flex">
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
            <span className="text">Have an account?</span>
            <Link to={"/login"}>
              <button className="btn">Login</button>
            </Link>
          </div>
        </div>
        <div className="formDiv flex">
          <div className="headerDiv">
            <h3>Let Us know You!</h3>
          </div>

          <form onSubmit={handleSubmit} className="form grid ">
            <div className="inputDiv">
              <label>UserId:</label>
              <div className="input flex size-10 w-full">
                <input
                  type="text"
                  value={userid}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded mb-4"
                />
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="username">Username</label>
              <div className="input flex size-10 w-full">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded mb-4"
                />
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="Password">Password</label>
              <div className="input flex size-10 w-full">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded mb-4"
                />
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="Email">Email:</label>
              <div className="input flex size-10 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded mb-4"
                />
              </div>
            </div>
            <button type="submit" className="btn flex size-10 w-full">
              <span>Register</span>
            </button>
            <span className="forgotPassword">
              Forgot your Password? <a href="*">Click Here</a>
            </span>
          </form>

          {/* Display the registration message */}
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

export default Register;
