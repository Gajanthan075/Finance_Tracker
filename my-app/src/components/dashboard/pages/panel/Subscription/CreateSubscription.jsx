import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../../AuthContext";

const CreateSubscription = () => {
  const [name, setName] = useState("");
  const [billing, setBilling] = useState("");
  const [status, setStatus] = useState("");
  const [amount, setAmount] = useState("");
  const [activationDate, setActivationDate] = useState(""); // Add state for activation date
  const [message, setMessage] = useState("");
  const { userId } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Creating subscriptions for user", userId);

    try {
      const response = await fetch(
        `http://localhost:5000/subscriptions/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            billing: billing,
            status: status,
            amount: amount,
            activation_date: activationDate, // Send activation date to backend
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
    <div>
      <div className="max-w-md mx-auto bg-white p-5 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Create New Subscription</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="activation_date"
            >
              Activation Date
            </label>
            <input
              type="date"
              id="activation_date"
              value={activationDate}
              onChange={(e) => setActivationDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Subscription Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="billing"
            >
              Billing
            </label>
            <select
              id="billing"
              value={billing}
              onChange={(e) => setBilling(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="" disabled>
                Choose billing cycle
              </option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>

            {billing && (
              <div className="mt-4">
                <p>
                  Selected Billing Cycle: <strong>{billing}</strong>
                </p>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="status"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="Select">Select</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="amount"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Subscription
            </button>
          </div>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateSubscription;
