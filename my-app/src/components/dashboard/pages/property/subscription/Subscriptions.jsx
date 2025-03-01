import React, { useState, useContext } from "react";
import { AuthContext } from "../../../../../AuthContext";

const Subscriptions = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("");
  const [nextpaymentDate, setNextpaymentDate] = useState("");
  const [message, setMessage] = useState("");

  const { userId } = useContext(AuthContext);

  const handleCreateSubscription = async (event) => {
    event.preventDefault();
    console.log("Creating subscription for user", userId);

    try {
      const response = await fetch(
        `http://localhost:5000/subscription/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            amount,
            frequency,
            nextpayment_date: nextpaymentDate,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Subscription created successfully!");
        // Reset the form fields
        setName("");
        setAmount("");
        setFrequency("");
        setNextpaymentDate("");
      } else {
        setMessage(data.error || "Failed to create subscription");
      }
    } catch (error) {
      setMessage("Network error: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create Subscription
        </h1>
        <form onSubmit={handleCreateSubscription}>
          <input
            type="text"
            placeholder="Enter subscription name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <input
            type="number"
            placeholder="Enter subscription amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <input
            type="text"
            placeholder="Enter subscription frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <input
            type="date"
            placeholder="Enter next payment date"
            value={nextpaymentDate}
            onChange={(e) => setNextpaymentDate(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Create Subscription
          </button>
        </form>
        <p className="text-red-500 mt-4 text-center">{message}</p>
      </div>
    </div>
  );
};

export default Subscriptions;
