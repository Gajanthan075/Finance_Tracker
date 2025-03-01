import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

const CombinedCashflowChart = ({ userId }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch cashflow data from the backend
    const fetchCashflowData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/cashflow/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cashflow data");
        }

        const data = await response.json();

        // Prepare data for Chart.js
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: "Income",
              data: data.income,
              backgroundColor: "rgba(75, 192, 192, 0.6)", // Light green
              borderWidth: 1,
            },
            {
              label: "Expenses",
              data: data.expenses,
              backgroundColor: "rgba(255, 99, 132, 0.6)", // Light red
              borderWidth: 1,
            },
            {
              label: "Transfers In",
              data: data.transfers_in,
              backgroundColor: "rgba(54, 162, 235, 0.6)", // Light blue
              borderWidth: 1,
            },
            {
              label: "Transfers Out",
              data: data.transfers_out,
              backgroundColor: "rgba(255, 206, 86, 0.6)", // Light yellow
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching cashflow data:", error);
      }
    };

    fetchCashflowData();
  }, [userId]);

  if (!chartData) return <p>Loading...</p>;

  return (
    <div>
      <h2>Combined Cashflow</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Cashflow Overview",
            },
          },
        }}
      />
    </div>
  );
};

export default CombinedCashflowChart;
