import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../../AuthContext";

const FetchCurrentMonthExpenseRecord = () => {
  const [expenseRecords, setExpenseRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchExpenseRecords = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/expense-record/${userId}/current-month`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch current month expense records");
        }
        const data = await response.json();
        setExpenseRecords(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchExpenseRecords();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-5 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Current Month's Expense Records
      </h2>
      {expenseRecords.length === 0 ? (
        <p>No expense records found for this month</p>
      ) : (
        <ul>
          {expenseRecords.map((record) => (
            <li key={record._id} className="mb-4">
              <div className="flex justify-between">
                <div>
                  <span className="block font-medium">
                    {record.expense_name}
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

export default FetchCurrentMonthExpenseRecord;
