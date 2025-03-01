import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../AuthContext";
import DoughnutChart from "../../../pages/panel/FinancialGoal/DoughnutChart";

const Goal = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch(`http://localhost:5000/goals/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch financial Goal");
        }
        const data = await response.json();
        setGoals(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchGoals();
  }, [userId]);

  const totalTargetAmount = goals.reduce(
    (total, goal) => total + parseFloat(goal.target_amount || 0),
    0
  );
  const totalCurrentAmount = goals.reduce(
    (total, goal) => total + parseFloat(goal.current_amount || 0),
    0
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-lg shadow-lg text-white">
      {/* Overall Financial Progress */}
      <div className="mb-10 text-center">
        <h3 className="text-2xl font-semibold mb-6">Goal Accomplishment</h3>
        <div className="bg-white p-6 rounded-lg shadow-md mx-auto w-72">
          <DoughnutChart
            targetAmount={totalTargetAmount}
            currentAmount={totalCurrentAmount}
          />
        </div>
      </div>

      {/* Goal Details */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white text-center p-6 rounded-lg shadow-lg">
          <h4 className="text-xl font-semibold text-gray-700">
            Total Target Amount
          </h4>
          <p className="text-xl font-bold text-green-500">
            ${totalTargetAmount.toFixed(2)}
          </p>
        </div>
        <div className="bg-white text-center p-6 rounded-lg shadow-lg">
          <h4 className="text-xl font-semibold text-gray-700">
            Total Current Amount
          </h4>
          <p className="text-xl font-bold text-blue-500">
            ${totalCurrentAmount.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Goal;
