import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../../AuthContext";
import CountUp from "react-countup";

const TotalCurrentBalance = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchTotalBalance = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/account/total_balance/${userId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // The response contains the total balance as a single object
        const data = await response.json();

        // Set the total balance directly from the response
        setTotalBalance(data.total_balance);
      } catch (error) {
        console.error("Error fetching total balance:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalBalance();
  }, [userId]);

  return (
    <div>
      {loading ? (
        <p>Loading total balance...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <CountUp
          start={0.0}
          end={totalBalance.toFixed(2)}
          duration={20}
          prefix="$"
          decimals={2}
        />
      )}
    </div>
  );
};

export default TotalCurrentBalance;
