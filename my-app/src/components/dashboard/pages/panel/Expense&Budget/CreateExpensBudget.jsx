import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../AuthContext";

const CreateExpenseBudget = () => {
  const [expenseType, setExpenseType] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [expenseNames, setExpenseNames] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    // Fetch expense names when the component mounts
    const fetchExpenseNames = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/expense-names/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch expense names");
        }
        const data = await response.json();
        setExpenseNames(data.expense_names); // Correct the variable name
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchExpenseNames();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Creating expense budget for user", userId);

    try {
      const response = await fetch(
        `http://localhost:5000/expense-type-budget/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            expense_type: expenseType,
            monthly_budget: monthlyBudget,
            expense_name: expenseName,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error || "An error occurred");
      }
    } catch (error) {
      setMessage("An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-5 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Add New Expense Type and Budget
      </h2>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="expenseType"
            className="block text-sm font-medium text-gray-700"
          >
            Expense Type
          </label>
          <input
            type="text"
            id="expenseType"
            value={expenseType}
            onChange={(e) => setExpenseType(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="monthlyBudget"
            className="block text-sm font-medium text-gray-700"
          >
            Monthly Budget
          </label>
          <input
            type="number"
            id="monthlyBudget"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        {/*<div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Expense Name
          </label>
          <select
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="" disabled>
              Select an expense name
            </option>
            {expenseNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>*/}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700"
        >
          Add Expense Type and Budget
        </button>
      </form>
    </div>
  );
};

export default CreateExpenseBudget;
