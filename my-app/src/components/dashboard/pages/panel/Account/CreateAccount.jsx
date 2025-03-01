import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../../AuthContext";

const CreateAccount = () => {
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [message, setMessage] = useState("");
  const { userId } = useContext(AuthContext);

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    console.log("Creating Account for user", userId);

    const response = await fetch(`http://localhost:5000/account/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_name: accountName,
        account_type: accountType,
        initial_amount: parseFloat(initialAmount),
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage(`Account created successfully: ${data.account_name}`);
    } else {
      setMessage(`Error: ${data.error}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>
        <form onSubmit={handleCreateAccount}>
          <div className="mb-4">
            <label className="block text-gray-700">Account Name</label>
            <input
              type="text"
              placeholder="Account Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
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
            <label className="block text-gray-700">Initial Amount</label>
            <input
              type="number"
              placeholder="Initial Amount"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Create Account
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default CreateAccount;
