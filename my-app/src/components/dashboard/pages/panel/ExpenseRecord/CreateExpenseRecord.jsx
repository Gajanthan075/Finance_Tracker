import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../AuthContext";

const CreateExpenseRecord = () => {
  const [date, setDate] = useState();
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [expenseTypes, setExpenseTypes] = useState("");
  const [accountType, setAccountType] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    // Fetch expense names when the component mounts
    const fetchExpenseTypes = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/expense-types/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch expense types");
        }
        const data = await response.json();
        setExpenseTypes(data.expense_types); // Correct the variable name
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchExpenseTypes();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Creating expenserecord for user", userId);

    try {
      const response = await fetch(
        `http://localhost:5000/expense-record/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: date,
            expense_name: expenseName,
            amount: parseFloat(amount),
            expense_type: expenseType,
            account_type: accountType,
            note: note,
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
      <h2 className="text-xl font-bold mb-4">Add New Expense Record</h2>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            type="date"
            name="date"
            placeholder="Enter date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="expenseName"
            className="block text-sm font-medium text-gray-700"
          >
            Expense Name
          </label>
          <input
            type="text"
            id="expenseName"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Expense Type
          </label>
          <select
            value={expenseType}
            onChange={(e) => setExpenseType(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="" disabled>
              Select an expense Type
            </option>
            {expenseTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Account Type</label>
          <select
            type="text"
            placeholder="Account Type"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="saving">Saving</option>
            <option value="business">Business</option>
            <option value="cash">Cash</option>
            <option value="Checking">Checking</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gray-700"
          >
            Note
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700"
        >
          Add Expense Record
        </button>
      </form>
    </div>
  );
};

export default CreateExpenseRecord;
