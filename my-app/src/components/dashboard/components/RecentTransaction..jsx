import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";

const RecentTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [limit, setLimit] = useState(10);
  const [message, setMessage] = useState("");
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/transaction/${userId}/recent?limit=${limit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const responseData = await response.json();
          setTransactions(responseData);
        } else {
          setMessage("Failed to fetch transactions.");
        }
      } catch (error) {
        setMessage("Network error: " + error.message);
      }
    };

    fetchTransactions();
  }, [userId, limit]);

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        {message && <p className="text-red-500 text-center">{message}</p>}
        <Link to="/Transaction" className="view-all-btn">
          View all
        </Link>
      </header>
      <div className="transaction-limit mb-4">
        <label className="text-sm text-gray-600 dark:text-gray-400 mr-2">
          Show
        </label>
        <select
          className="border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-700"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          transactions
        </span>
      </div>

      <table className="min-w-full table-auto bg-gray-50 dark:bg-gray-700 rounded-lg">
        <thead>
          <tr className="text-left">
            <th className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-200">
              Date
            </th>
            <th className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-200">
              Transfer Name
            </th>
            <th className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-200">
              Amount
            </th>
            <th className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-200">
              Type
            </th>
            <th className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-200">
              Transfer From
            </th>
            <th className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-200">
              Transfer To
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction._id}
              className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                {transaction.date}
              </td>
              <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                {transaction.transfer_name}
              </td>
              <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                ${transaction.amount}
              </td>
              <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                {transaction.type}
              </td>
              <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                {transaction.transfer_from}
              </td>
              <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                {transaction.transfer_to}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default RecentTransaction;
