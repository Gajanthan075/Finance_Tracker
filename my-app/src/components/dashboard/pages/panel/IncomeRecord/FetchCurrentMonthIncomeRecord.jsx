import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../../AuthContext";

const FetchCurrentMonthIncomeRecord = () => {
  const [incomeRecords, setIncomeRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchIncomeRecords = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/income-record/${userId}/current-month`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch current month income records");
        }
        const data = await response.json();
        setIncomeRecords(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchIncomeRecords();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-5 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Current Month's Income Records</h2>
      {incomeRecords.length === 0 ? (
        <p>No income records found for this month</p>
      ) : (
        <ul>
          {incomeRecords.map((record) => (
            <li key={record._id} className="mb-4">
              <div className="flex justify-between">
                <div>
                  <span className="block font-medium">
                    {record.income_name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {record.date?.$date
                      ? new Date(record.date.$date).toLocaleDateString()
                      : "No date available"}
                  </span>
                </div>
                <span>${record.amount}</span>
              </div>
              {record.note && (
                <p className="text-sm text-gray-700 mt-2">{record.note}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FetchCurrentMonthIncomeRecord;
