import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../../../../../AuthContext";
import { Wallet } from "@mui/icons-material";
import "./Card.css";

const FetchCard = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useContext(AuthContext);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/account/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // Fetch accounts one by one
      for (const account of data) {
        setAccounts((prevAccounts) => [...prevAccounts, account]);
        // Wait for a short duration to simulate loading effect
        await new Promise((resolve) => setTimeout(resolve, 300)); // Adjust duration as needed
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAccounts(); // Fetch accounts on component load
  }, [fetchAccounts]);

  return (
    <div>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
          {accounts.map((account) => (
            <Card key={account._id} account={account} />
          ))}
        </div>
      )}
    </div>
  );
};

const Card = ({ account }) => {
  return (
    <div className="e-card playing bg-gray-100 p-6 rounded-lg border-2 border-double hover:shadow-lg">
      <div className="infotop">
        <div className="name flex items-center space-x-2">
          <Wallet className="text-blue-600" />
          <h2 className="text-xl font-semibold">{account.account_name}</h2>
        </div>
        <p className="text-gray-800 text-2xl font-bold">Balance</p>
        <p className="text-green-600 text-2xl font-bold">
          ${account.current_balance.toFixed(2)}
        </p>
        <p className="text-gray-700 text-2xl font-bold">
          {account.account_type}
        </p>
      </div>
    </div>
  );
};

export default FetchCard;
