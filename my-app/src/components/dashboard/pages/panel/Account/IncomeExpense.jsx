import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../AuthContext";
import { Box, Typography, Card, CardContent } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const IncomeExpense = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    // Fetch total income from backend when component mounts
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

    const fetchTotalExpense = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/total-expenses/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch total expenses");
        }

        const data = await response.json();

        // Ensure data is available and correctly set
        if (data.total_expense !== undefined) {
          setTotalExpenses(data.total_expense);
        } else {
          throw new Error("total_expense not found in response");
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTotalIncome();
    fetchTotalExpense();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="w-full max-w-lg mx-auto mt-10 p-5 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        <Card className="transactions-account-card bg-gray-50 shadow-md hover:shadow-lg">
          <CardContent className="flex justify-between items-center p-6">
            <Box className="flex items-center">
              <TrendingDownIcon fontSize="large" className="text-red-600" />
              <Box ml={2}>
                <Typography variant="h6" className="text-gray-600">
                  Total Expenses
                </Typography>
                <Typography variant="h4" className="font-bold text-red-600">
                  ${totalExpenses.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card className="transactions-account-card bg-gray-50 shadow-md hover:shadow-lg">
          <CardContent className="flex justify-between items-center p-6">
            <Box className="flex items-center">
              <AttachMoneyIcon fontSize="large" className="text-green-600" />
              <Box ml={2}>
                <Typography variant="h6" className="text-gray-600">
                  Total Income
                </Typography>
                <Typography variant="h4" className="font-bold text-green-600">
                  ${totalIncome.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IncomeExpense;
