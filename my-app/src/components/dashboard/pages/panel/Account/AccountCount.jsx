import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../../AuthContext";

const AccountCount = () => {
  const [accountCount, setAccountCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccountCount = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/account/count/${userId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAccountCount(data.account_count);
      } catch (error) {
        console.error("Error fetching account count:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountCount(); // Fetch account count on component load
  }, [userId]);

  return (
    <div>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <p className="text-center">Total Number of Accounts: {accountCount}</p>
      )}
    </div>
  );
};

export default AccountCount;
