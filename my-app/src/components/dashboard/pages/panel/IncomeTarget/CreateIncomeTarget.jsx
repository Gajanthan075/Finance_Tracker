import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../../AuthContext";

const CreateIncomeTarget = () => {
  const [incomeType, setIncomeType] = useState("");
  const [monthlyTarget, setMonthlyTarget] = useState("");
  const [message, setMessage] = useState("");
  const { userId } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/income-type-target/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            income_type: incomeType,
            monthly_target: monthlyTarget,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIncomeType(""); // Reset input fields
        setMonthlyTarget("");
      } else {
        setMessage(data.error || "An error occurred");
      }
    } catch (error) {
      setMessage("An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Add New Income Type and Target
      </h2>
      {message && (
        <p
          className={`mb-4 text-center ${
            message.includes("error") ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="incomeType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Income Type
          </label>
          <select
            id="incomeType"
            value={incomeType}
            onChange={(e) => setIncomeType(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Select Income Type
            </option>
            <option value="Payroll">Payroll</option>
            <option value="Business">Business</option>
            <option value="Bonus">Bonus</option>
            <option value="Funding">Funding</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-6">
          <label
            htmlFor="monthlyTarget"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Monthly Target ($)
          </label>
          <input
            type="number"
            id="monthlyTarget"
            value={monthlyTarget}
            onChange={(e) => setMonthlyTarget(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-200 ease-in-out"
        >
          Add Income Type and Target
        </button>
      </form>
    </div>
  );
};

export default CreateIncomeTarget;
