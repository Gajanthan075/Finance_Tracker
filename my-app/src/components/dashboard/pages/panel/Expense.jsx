import React, { useState } from "react";
import ExpenseTypeBudgets from "./Expense&Budget/FetchExpenseBudget";
import Creation from "./Expense&Budget/Creation";
import FetchExpenseRecord from "./ExpenseRecord/FetchExpenseRecord";
import FetchCurrentMonthExpenseRecord from "./ExpenseRecord/FetchCurrentMonthExpenseRecord";
import { Box } from "@mui/material";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const Expense = () => {
  const [isSideBarOpen, setSideBarOpen] = useState(true);

  const toggleSideBar = () => {
    setSideBarOpen(!isSideBarOpen);
  };
  return (
    <div className="flex flex-col h-screen">
      <Navbar toggleSideBar={toggleSideBar} />
      <div className="flex flex-1">
        <Box
          sx={{
            width: isSideBarOpen ? 240 : 0,
            transition: "width 0.3s",
            overflow: "hidden",
          }}
        >
          <Sidebar isSideBarOpen={isSideBarOpen} />
        </Box>
        <Box sx={{ flexGrow: 1, p: 3 }} className="bg-gray-100 overflow-auto">
          <div className="space-y-6 mt-10">
            <div className="bg-slate-400 p-4 rounded-lg shadow-md text-white font-semibold">
              Expense Budget
            </div>
            <div>
              <div className="bg-white p-4 rounded-lg shadow-md flex-grow flex-shrink-0">
                <ExpenseTypeBudgets />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex-grow flex-shrink-0">
                <Creation />
              </div>
            </div>
            <div className="bg-slate-300 p-4 rounded-lg shadow-md text-gray-800 font-semibold">
              Expense Record
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <FetchExpenseRecord />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <FetchCurrentMonthExpenseRecord />
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default Expense;
