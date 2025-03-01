import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../../AuthContext";
import ProgressBar from "./ProgressBar"; // Import the ProgressBar component

const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/subscriptions/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subscriptions");
        }

        const data = await response.json();
        setSubscriptions(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSubscriptions();
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
        <h1 className="text-2xl font-bold mb-6 text-center">Subscriptions</h1>
        <ul>
          {subscriptions.map((subscription) => (
            <li key={subscription._id} className="border-b py-4">
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">{subscription.name}</div>
                <div className="text-lg">{subscription.amount}</div>
              </div>
              <div className="flex justify-between items-center">
                <div>{subscription.frequency}</div>
                <div>
                  {new Date(subscription.nextpayment_date).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-2">
                <ProgressBar nextPaymentDate={subscription.nextpayment_date} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubscriptionList;
