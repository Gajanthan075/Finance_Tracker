import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Box, Card, CardContent } from "@mui/material";
import FetchAccounts from "./panel/Account/FetchAccount";
import Report from "../charts/Report";
import IncomeExpense from "./panel/Account/IncomeExpense";
import Budget from "./property/home/Budget";
import Subscription from "./property/home/Subscription";
import Goal from "./property/home/Goal";
import IncomeChart from "./property/home/IncomeChart";
import FinanceAdvice from "./panel/FinanceAdvice/FinanceAdvice";
import TransactionTrends from "./property/home/TransactionTrends";
import Transaction from "./property/home/Transaction";
import CashFlow from "./property/home/Cashflow";

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isSideBarOpen, setSideBarOpen] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSideBar = () => {
    setSideBarOpen(!isSideBarOpen);
  };

  return (
    <>
      <div className={`${darkMode ? "dark" : ""}`}>
        <Navbar
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
          toggleSideBar={toggleSideBar}
        />
      </div>

      <Box sx={{ display: "flex", gap: 8 }}>
        {/* Sidebar */}

        <Box
          sx={{
            width: isSideBarOpen ? 240 : 0,
            transition: "width 0.3s",
            overflow: "hidden",
          }}
        >
          <Sidebar isSideBarOpen={isSideBarOpen} />
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: 3, overflow: "hidden" }}>
          <div className="p-10">
            <h1 className="header-box-title text-3xl font-semibold text-gray-800 text-center mb-10">
              Make Your Decision!
            </h1>

            {/* Horizontal FetchAccounts */}
            <div className="space-y-4">
              <FetchAccounts />
            </div>

            {/* Below FetchAccounts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-white hover:shadow-xl transition-shadow">
                <CardContent>
                  <TransactionTrends />
                </CardContent>
              </Card>
              <Card className="bg-white hover:shadow-xl transition-shadow">
                <CardContent>
                  <Budget />
                </CardContent>
              </Card>
              <Card className="bg-white hover:shadow-xl transition-shadow">
                <CardContent>
                  <IncomeExpense />
                  <Report />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-white hover:shadow-xl transition-shadow">
                <CardContent>
                  <Subscription />
                </CardContent>
              </Card>
              <Card className="bg-white hover:shadow-xl transition-shadow">
                <CardContent>
                  <Goal />
                </CardContent>
              </Card>
              <Card className="bg-white hover:shadow-xl transition-shadow">
                <CardContent>
                  <Transaction />
                </CardContent>
              </Card>
            </div>
            <Card className="bg-white hover:shadow-xl transition-shadow p-2">
              <CardContent>
                <IncomeChart />
              </CardContent>
            </Card>
            <Card className="bg-white hover:shadow-xl transition-shadow p-2">
              <CardContent>
                <CashFlow />
              </CardContent>
            </Card>
          </div>
          <FinanceAdvice />
        </Box>
      </Box>
    </>
  );
};

export default Home;
