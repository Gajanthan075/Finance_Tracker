import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { AuthContext } from "../../../../../AuthContext";

const SubscriptionChart = () => {
  const [chartData, setChartData] = useState(null);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/subscriptions/balance/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const subscriptions = await response.json();
        if (!subscriptions || subscriptions.length === 0) {
          console.error("No subscriptions data available");
          return;
        }

        const labels = subscriptions.map((sub) => sub.name);
        const data = subscriptions.map((sub) => sub.remaining_balance);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Remaining Balance",
              data: data,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching subscription data", error);
      }
    };

    if (userId) {
      fetchSubscriptions();
    } else {
      console.error("User ID is not available");
    }
  }, [userId]);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Bar
        data={chartData}
        options={{
          title: {
            display: true,
            text: "Subscription Remaining Balance",
            fontSize: 25,
          },
          legend: {
            display: true,
            position: "right",
          },
        }}
      />
    </div>
  );
};

export default SubscriptionChart;
