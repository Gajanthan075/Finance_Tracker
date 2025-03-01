import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../AuthContext";

const Analyzer = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useContext(AuthContext); // Retrieve userId from AuthContext

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/analyze/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch analysis data.");
        }
        const data = await response.json();
        setAnalysisData(data);
      } catch (err) {
        setError(
          err.message || "An error occurred while fetching analysis data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [userId]);

  if (loading) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-5 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Financial Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold">Summary</h3>
          <ul className="mt-4">
            <li>
              <strong>Total Income:</strong> $
              {analysisData.total_income.toFixed(2)}
            </li>
            <li>
              <strong>Total Expenses:</strong> $
              {analysisData.total_expenses.toFixed(2)}
            </li>
            <li>
              <strong>Savings:</strong> ${analysisData.savings.toFixed(2)}
            </li>
            <li>
              <strong>Budget Utilization:</strong>{" "}
              {analysisData.budget_utilization.toFixed(2)}%
            </li>
          </ul>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold">Expense Breakdown</h3>
          <ul className="mt-4">
            {Object.entries(analysisData.category_breakdown).map(
              ([category, amount]) => (
                <li key={category}>
                  <strong>{category}:</strong> ${amount.toFixed(2)}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
