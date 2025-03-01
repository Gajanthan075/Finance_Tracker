import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../AuthContext";
import master from "../../../asset/Mastercard-Logo.wine.png";
import TotalCurrentBalance from "../../pages/panel/Account/TotalCurrentBalance";

const Card = () => {
  const [username, setUsername] = useState("");
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsername = async () => {
      const response = await fetch(`http://localhost:5000/user/${userId}`);
      const data = await response.json();
      setUsername(data.username);
    };

    fetchUsername();
  }, [userId]);
  return (
    <div>
      <div className="flex flex-col">
        <div className="bank-card ">
          <div className="bank-card_content">
            <div>
              <h1 className="text-16 font-semibold text-white">{username}</h1>
              <p className="font-serif font-black text-white">
                <TotalCurrentBalance />
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <h1 className="text-12 font-semibold text-white">{username}</h1>
                <h2 className="text-12 font-semibold text-white">
                  &nbsp;** / **
                </h2>
              </div>
              <p className="text-14 font-semibold tracking-[1.1px] text-white">
                **** **** **** <span className="text-16">1234</span>
              </p>
            </div>
          </div>
          <div className="bank-card_icon">
            <img src={master} alt="" width={10} height={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
