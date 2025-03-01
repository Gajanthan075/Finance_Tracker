import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../../AuthContext";
import { Bar, Doughnut } from "react-chartjs-2";
import { Typography, CircularProgress, Box } from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const FetchIncomeTarget = () => {
  const { userId } = useContext(AuthContext);
  const [incomeTypeTargets, setIncomeTypeTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIncomeTypeTargets = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/income-type-target/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setIncomeTypeTargets(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchIncomeTypeTargets();
  }, [userId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  // Prepare Bar Chart Data for months
  const barData = {
    labels: ["January", "February", "March", "April"],
    datasets: [
      {
        label: "Income",
        backgroundColor: "#F87171",
        data: [5, 8, 15, 18], // Replace these values dynamically if needed
      },
      {
        label: "Target",
        backgroundColor: "#FBBF24",
        data: [6, 8, 10, 14],
      },
      {
        label: "Remaining",
        backgroundColor: "#34D399",
        data: [4, 5, 4, 8],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-5 rounded-md shadow-md">
      {/* Updated Title */}
      <Typography
        variant="h4"
        align="center"
        className="font-bold text-blue-600 mb-6"
      >
        <h1 className="text-4xl font-extrabold text-blue-600 text-center mb-12 bg-slate-700">
          Income Report
        </h1>
      </Typography>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Bar Chart */}
        <div className="bg-gray-50 rounded-lg shadow p-4">
          <Bar data={barData} options={barOptions} />
        </div>

        {/* Smaller Circular Charts */}
        <div className="grid grid-cols-1 gap-4">
          {incomeTypeTargets.slice(0, 2).map((record) => {
            const utilizationPercentage =
              (record.income_this_month / record.monthly_target) * 100;

            const doughnutData = {
              labels: ["Utilized", "Remaining"],
              datasets: [
                {
                  data: [
                    Math.min(utilizationPercentage, 100),
                    Math.max(100 - utilizationPercentage, 0),
                  ],
                  backgroundColor: ["#EF4444", "#FBBF24"],
                },
              ],
            };

            return (
              <Box
                key={record._id.$oid}
                className="text-center mx-auto"
                style={{ maxWidth: "200px" }} // Limit chart size
              >
                <Doughnut
                  data={doughnutData}
                  options={{ cutout: "80%", responsive: true }}
                />
                <Typography
                  variant="h6"
                  className="mt-2 font-semibold text-gray-700"
                >
                  {record.income_type}
                </Typography>
                <Typography variant="h5" className="text-gray-900 font-bold">
                  {Math.min(utilizationPercentage, 100).toFixed(0)}%
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  {record.income_this_month.toFixed(2)} /{" "}
                  {record.monthly_target.toFixed(2)}
                </Typography>
              </Box>
            );
          })}
        </div>
      </div>

      {/* Placeholder for description */}
      <Typography
        variant="body1"
        className="text-center mt-6 text-gray-500 italic"
      >
        Stay updated on your monthly income and targets.
      </Typography>
    </div>
  );
};

export default FetchIncomeTarget;
