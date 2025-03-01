import React, { useContext, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { AuthContext } from "../../../AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Report = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchTotalIncome = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/total-income/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch total income");
        }
        const data = await response.json();
        setTotalIncome(data.total_income);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchTotalExpenses = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/total-expenses/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch total expenses");
        }
        const data = await response.json();
        setTotalExpenses(
          data.total_expense !== undefined ? data.total_expense : 0
        );
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTotalIncome();
    fetchTotalExpenses();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Data for Bar chart
  const chartData = {
    labels: ["Total Income", "Total Expenses"],
    datasets: [
      {
        label: "Amount (in USD)",
        data: [totalIncome, totalExpenses],
        backgroundColor: ["#4caf50", "#f44336"], // Colors for bars
        borderColor: ["#388e3c", "#d32f2f"],
        borderWidth: 1,
      },
    ],
  };

  // Options for Bar chart
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Income vs Expenses Report",
        font: {
          size: 18,
        },
      },
    },
  };

  return (
    <Box
      className="w-full max-w-lg mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg"
      sx={{
        backgroundColor: "#f0f4f8",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Title */}
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "20px",
          color: "#333",
        }}
      >
        Financial Report
      </Typography>

      {/* Bar Chart */}
      <Box mt={4}>
        <Bar data={chartData} options={chartOptions} />
      </Box>
    </Box>
  );
};

export default Report;
