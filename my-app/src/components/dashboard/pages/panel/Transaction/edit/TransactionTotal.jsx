import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../../AuthContext";

const TransactionTotal = () => {
  const [totalTransactionAmount, setTotalTransactionAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchTotalTransactionAmount = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/total-transaction-amount/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch total transaction amount");
        }

        const data = await response.json();
        setTotalTransactionAmount(data.total_transaction_amount);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTotalTransactionAmount();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <p>${totalTransactionAmount.toFixed(2)}</p>
    </div>
  );
};

export default TransactionTotal;
