import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../../AuthContext";

const CreateTransaction = () => {
  const { userId } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    date: "",
    transfer_name: "",
    type: "",
    amount: "",
    transfer_from: "",
    transfer_to: "",
    fund_to_goals: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateTransaction = async (event) => {
    event.preventDefault();

    if (!userId) {
      setMessage("No user is logged in.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/transaction/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Transaction created successfully!");
        // Clear the form fields
        setFormData({
          date: "",
          transfer_name: "",
          type: "",
          amount: "",
          transfer_from: "",
          transfer_to: "",
          fund_to_goals: "",
        });
      } else {
        setMessage(data.error || "Failed to create transaction.");
      }
    } catch (error) {
      setMessage("Network error: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-5 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Create New Transaction</h2>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      <form onSubmit={handleCreateTransaction}>
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
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="transfer_name"
            className="block text-sm font-medium text-gray-700"
          >
            Transfer Name
          </label>
          <input
            type="text"
            name="transfer_name"
            placeholder="Enter transfer name"
            value={formData.transfer_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select Type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="transfer">Transfer</option>
          </select>
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
            name="amount"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="transfer_from"
            className="block text-sm font-medium text-gray-700"
          >
            Transfer From Account
          </label>
          <input
            type="text"
            name="transfer_from"
            placeholder="Enter source account"
            value={formData.transfer_from}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="transfer_to"
            className="block text-sm font-medium text-gray-700"
          >
            Transfer To Account
          </label>
          <input
            type="text"
            name="transfer_to"
            placeholder="Enter destination account"
            value={formData.transfer_to}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="fund_to_goals"
            className="block text-sm font-medium text-gray-700"
          >
            Fund to Goals
          </label>
          <input
            type="text"
            name="fund_to_goals"
            placeholder="Enter fund for goals"
            value={formData.fund_to_goals}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Create Transaction
        </button>
      </form>
    </div>
  );
};

export default CreateTransaction;
