import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../AuthContext";

const SavingList = () => {
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/savings/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch savings entries");
        }

        const data = await response.json();
        setSavings(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSavings();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Savings Entries</h1>
        <ul>
          {savings.map((saving) => (
            <li key={saving._id} className="border-b py-4">
              <div>
                <strong>Amount:</strong> {saving.amount}
              </div>
              <div>
                <strong>Start Date:</strong>{" "}
                {new Date(saving.start_date).toLocaleDateString()}
              </div>
              <div>
                <strong>End Date:</strong>{" "}
                {new Date(saving.end_date).toLocaleDateString()}
              </div>
              <div>
                <strong>Goal ID:</strong> {saving.goal_id}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SavingList;
