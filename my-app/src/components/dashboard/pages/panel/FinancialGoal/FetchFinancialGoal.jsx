import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../AuthContext";
import DoughnutChart from "./DoughnutChart";

const FetchFinancialGoal = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editGoal, setEditGoal] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    target_amount: "",
    current_amount: "",
    due_date: "",
  });
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

  const handleEditClick = (goal) => {
    setEditGoal(goal._id.$oid);
    setEditForm({
      name: goal.name,
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      due_date: goal.due_date,
    });
  };

  const updateGoal = async (goalId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/goals/${userId}/${goalId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        }
      );

      if (response.ok) {
        const updatedGoals = goals.map((goal) =>
          goal._id.$oid === goalId ? { ...goal, ...editForm } : goal
        );
        setGoals(updatedGoals);
        setEditGoal(null);
      } else {
        const result = await response.json();
        setError(result.error || "Failed to update goal.");
      }
    } catch (error) {
      setError("An error occurred while updating the goal.");
    }
  };

  const handleDelete = async (goalId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/goals/${userId}/${goalId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const updatedGoals = goals.filter((goal) => goal._id.$oid !== goalId);
        setGoals(updatedGoals);
      } else {
        const result = await response.json();
        setError(result.error || "Failed to delete goal.");
      }
    } catch (error) {
      setError("An error occurred while deleting the goal.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="w-full bg-white p-10 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Financial Goals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div key={goal._id.$oid} className="bg-gray-50 p-6 rounded-lg shadow">
            <section className="flex gap-6">
              {/* Doughnut chart on the left */}
              <div className="w-1/2">
                <DoughnutChart
                  targetAmount={goal.target_amount}
                  currentAmount={goal.current_amount}
                />
              </div>

              {/* Financial goal details on the right */}
              <div className="w-1/2">
                <h3 className="text-lg font-bold">{goal.name}</h3>
                <p>Target Amount: ${goal.target_amount}</p>
                <p>Current Amount: ${goal.current_amount}</p>
                <p>Due Date: {new Date(goal.due_date).toLocaleDateString()}</p>
              </div>
            </section>

            <div className="flex gap-4 mt-4">
              {editGoal === goal._id.$oid ? (
                <>
                  <button
                    type="button"
                    onClick={() => updateGoal(goal._id.$oid)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditGoal(null)}
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleEditClick(goal)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(goal._id.$oid)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {editGoal && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Edit Financial Goal</h3>
          <form>
            <label className="block">Name:</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="border rounded px-4 py-2"
            />
            <label className="block mt-4">Target Amount:</label>
            <input
              type="number"
              value={editForm.target_amount}
              onChange={(e) =>
                setEditForm({ ...editForm, target_amount: e.target.value })
              }
              className="border rounded px-4 py-2"
            />
            <label className="block mt-4">Current Amount:</label>
            <input
              type="number"
              value={editForm.current_amount}
              onChange={(e) =>
                setEditForm({ ...editForm, current_amount: e.target.value })
              }
              className="border rounded px-4 py-2"
            />
            <label className="block mt-4">Due Date:</label>
            <input
              type="date"
              value={editForm.due_date}
              onChange={(e) =>
                setEditForm({ ...editForm, due_date: e.target.value })
              }
              className="border rounded px-4 py-2"
            />
            <button
              type="button"
              onClick={() => updateGoal(editGoal)}
              className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FetchFinancialGoal;
