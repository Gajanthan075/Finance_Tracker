import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../../AuthContext"; // Assuming AuthContext is used for managing authentication

const CashFlow = () => {
  const { userId } = useContext(AuthContext); // Get the logged-in user's ID from AuthContext
  const [cashflow, setCashflow] = useState(null); // State to hold the cashflow data
  const [currency, setCurrency] = useState("USD"); // Default currency is USD
  const [message, setMessage] = useState(""); // State to handle messages (like errors)

  // Fetch cashflow data from backend
  useEffect(() => {
    const fetchCashFlow = async () => {
      if (!userId) {
        setMessage("No user is logged in.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/cashflow/${userId}/${currency}`
        );
        if (response.ok) {
          const data = await response.json();
          setCashflow(data); // Set cashflow data
        } else {
          const errorData = await response.json();
          setMessage("Failed to fetch cashflow data: " + errorData.error);
        }
      } catch (error) {
        setMessage("Network error: " + error.message);
      }
    };

    fetchCashFlow(); // Call the fetch function to load the data
  }, [userId, currency]); // Re-fetch data whenever userId or currency changes

  // Handle currency selection change
  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      {message && <p className="text-red-500">{message}</p>}{" "}
      {/* Display error messages */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Combined Cashflow</h2>
        <select
          onChange={handleCurrencyChange}
          value={currency}
          className="border p-2 rounded-md"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="INR">INR (Indian Rupee)</option>
          <option value="LKR">LKR (Sri Lankan Rupee)</option>
          <option value="AUD">AUD</option>
          <option value="CAD">CAD</option>
          <option value="JPY">JPY</option>
          <option value="CNY">CNY</option>
          <option value="MXN">MXN</option>
          <option value="BRL">BRL</option>
          <option value="CHF">CHF</option>
          <option value="NZD">NZD</option>
          <option value="SGD">SGD</option>
          <option value="ZAR">ZAR</option>
          <option value="KRW">KRW</option>
          <option value="RUB">RUB</option>
          <option value="TRY">TRY</option>
          <option value="SEK">SEK</option>
          <option value="NOK">NOK</option>
          <option value="DKK">DKK</option>
          <option value="HKD">HKD</option>
        </select>
      </div>
      {cashflow ? (
        <div className="mt-6">
          <h3 className="font-bold text-lg">Account Balances</h3>
          <ul>
            {cashflow.labels.map((label, index) => (
              <li
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow mb-4 flex justify-between"
              >
                <span className="font-semibold">{label}</span>
                <span className="text-blue-600">
                  {cashflow.balances[index].toFixed(2)} {currency}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4">Loading cashflow data...</p>
      )}
    </div>
  );
};

export default CashFlow;
