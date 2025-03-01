import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../AuthContext";
import { NotificationAddOutlined } from "@mui/icons-material";
import moment from "moment"; // Import moment.js for date formatting

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/subscriptions/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch subscriptions!");
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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-lg mx-auto bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-xl text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Your Subscriptions
      </h2>
      <ul>
        {subscriptions.map((subscription) => (
          <li key={subscription._id.$oid} className="mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-center">
                {/* Subscription Name with Icon */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <NotificationAddOutlined className="text-blue-500 mr-2" />
                  {subscription.name}
                </h2>
                {/* Subscription Amount */}
                <h3 className="text-xl font-bold text-green-500">
                  ${subscription.amount.toFixed(2)}
                </h3>
              </div>
              {/* Due Date */}
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Due Date: {moment(subscription.due_date).format("YYYY-MM-DD")}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Subscription;
