import React, { useState, useEffect, useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { AuthContext } from "../../../AuthContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccountData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/account/${userId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const accounts = await response.json();

        // Process the data for the chart
        //const labels = accounts.map((account) => account.account_name);
        const data = accounts.map((account) => account.current_balance);

        // Set chart data
        setChartData({
          //labels: labels, // Account names
          datasets: [
            {
              label: "Account Balances",
              data: data, // Current balances
              backgroundColor: [
                "#FF6384",
                "#FFCE56",
                "#36A2EB",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ], // You can add more colors as needed
              hoverBackgroundColor: [
                "#FF6384",
                "#FFCE56",
                "#36A2EB",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching account data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData(); // Fetch account data on component load
  }, [userId]); // Re-fetch data if userId changes

  if (loading) {
    return <p>Loading chart data...</p>;
  }

  if (error) {
    return <p>Error loading chart data: {error}</p>;
  }

  return (
    <Doughnut
      data={chartData}
      options={{
        cutout: "60%",
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
        },
      }}
    />
  );
};

export default DoughnutChart;
