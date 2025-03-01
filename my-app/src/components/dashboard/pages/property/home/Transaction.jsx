import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../AuthContext";

import "chart.js/auto";

const Transaction = () => {
  const { userId } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) {
        setMessage("No user is logged in.");
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:5000/transaction/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          const responseData = await response.json();

          // Sort transactions by date (most recent first)
          const sortedTransactions = responseData.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );

          // Get the 5 most recent transactions
          setTransactions(sortedTransactions.slice(0, 5));
        } else {
          setMessage("Failed to fetch transactions.");
        }
      } catch (error) {
        setMessage("Network error: " + error.message);
      }
    };

    fetchTransactions();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {message && <p className="text-red-500 text-center mb-4">{message}</p>}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-xl text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Recent Transactions
        </h2>
        {transactions.length === 0 ? (
          <p className="text-center">No transactions available.</p>
        ) : (
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction._id.$oid} className="mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-between items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                      {transaction.transfer_name[0]}
                    </div>
                    <div className="flex flex-col ml-4">
                      <p className="font-semibold text-gray-700 dark:text-white">
                        {transaction.transfer_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-green-500">
                      ${parseFloat(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Transaction;
