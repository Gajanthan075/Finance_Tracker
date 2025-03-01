import React, { useContext, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { AuthContext } from "../../../../../AuthContext";

const Budget = () => {
  const [expenseTypeBudgets, setExpenseTypeBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchExpenseTypeBudgets = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/expense-type-budget/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch expense type budgets");
        }
        const data = await response.json();
        setExpenseTypeBudgets(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseTypeBudgets();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Preparing data for the Doughnut Chart
  const labels = expenseTypeBudgets.map((budget) => budget.expense_type);
  const dataValues = expenseTypeBudgets.map(
    (budget) => budget.expense_this_month
  );

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          "#FF7043", // Shopping - coral orange
          "#FFB74D", // Food - amber
          "#66BB6A", // Bills - green
          "#26A69A", // Medicine - teal
          "#8E24AA", // Others - purple
          "#FF5252", // Entertainment - red
          "#7E57C2", // Education - indigo
          "#5C6BC0", // Transport - blue
          "#42A5F5", // Utilities - light blue
          "#00ACC1", // Miscellaneous - cyan
        ],
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false, // Disable default legend
      },
    },
    cutout: "70%", // Doughnut hole size
  };

  return (
    <div className="max-w-md mx-auto bg-white text-gray-700 p-5 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        EXPENSES
      </h2>
      <div className="flex justify-center">
        <div className="w-60 h-60">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
      {/* Expense Legend */}
      <ul className="mt-6 space-y-2">
        {labels.map((label, index) => (
          <li key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <span
                className="w-4 h-4 inline-block rounded-full mr-2"
                style={{
                  backgroundColor: chartData.datasets[0].backgroundColor[index],
                }}
              ></span>
              <span>{label}</span>
            </div>
            <span className="font-bold">
              {(
                (dataValues[index] / dataValues.reduce((a, b) => a + b, 0)) *
                100
              ).toFixed(1)}
              %
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Budget;
