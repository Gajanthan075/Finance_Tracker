import React, { useContext, useEffect, useState } from "react";

import gradient from "../../asset/gradient.jpg";
import { AuthContext } from "../../../AuthContext";
import Card from "./cards/Card";
//import Logo from "../charts/logo/Logo";

const Rightsidebar = () => {
  const [username, setUsername] = useState("");
  const [useremail, setUserEmail] = useState("");
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(`http://localhost:5000/user/${userId}`);
      const data = await response.json();
      setUsername(data.username); // Set both username and email
      setUserEmail(data.email);
    };

    fetchUserData();
  }, [userId]);
  return (
    <div className="right-sidebar">
      <div className="flex flex-col pb-8">
        <div className="profile-banner">
          <img src={gradient} alt="" />
          <div className="profile">
            <div className="profile-img">
              <span className="text-5xl font-bold text-blue-500">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="profile-details">
              <h1 className="profile-name">{username.toLocaleUpperCase()}</h1>
              <p className="profile-email">{useremail}</p>
            </div>
          </div>
          <div className="banks">
            <div className="flex w-full justify-between">
              <h2 className="header-2">Cards</h2>
              <div className="flex">
                <h2 className="text-14 font-semibold text-gray-500">+</h2>
                <h2 className="text-14 font-semibold text-gray-500">
                  Add Cards
                </h2>
              </div>
            </div>
            <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
              <div className="relative z-10">
                <Card />
              </div>
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <Card />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rightsidebar;
