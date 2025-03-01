import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../AuthContext";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const TransactionTrends = () => {
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
          setTransactions(responseData);
        } else {
          setMessage("Failed to fetch transactions.");
        }
      } catch (error) {
        setMessage("Network error: " + error.message);
      }
    };

    fetchTransactions();
  }, [userId]);

  // Prepare data for Line Chart
  const chartData = {
    labels: transactions.map((t) =>
      new Date(t.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Transaction Amounts",
        data: transactions.map((t) => parseFloat(t.amount)),
        borderColor: "#4F46E5",
        backgroundColor: "#A5B4FC",
        pointRadius: 6,
        pointBackgroundColor: transactions.map((t) => {
          const max = Math.max(
            ...transactions.map((tx) => parseFloat(tx.amount))
          );
          const min = Math.min(
            ...transactions.map((tx) => parseFloat(tx.amount))
          );
          if (t.amount === max) return "#10B981"; // Green for highest
          if (t.amount === min) return "#EF4444"; // Red for lowest
          return "#3B82F6";
        }),
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {message && <p className="text-red-500 text-center mb-4">{message}</p>}

      {/* Line Chart */}
      {transactions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">
            Transaction Trends
          </h3>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TransactionTrends;
