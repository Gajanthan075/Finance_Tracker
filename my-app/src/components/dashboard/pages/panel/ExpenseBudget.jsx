import React from "react";
import CreateExpenseBudget from "../panel/Expense&Budget/CreateExpensBudget";
import FetchExpenseBudget from "../panel/Expense&Budget/FetchExpenseBudget";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const ExpenseBudget = () => {
  return (
    <div>
      <div className="flex justify-center">
        <Navbar />
        <Sidebar />
        <div className="p-20 bg-slate-400 mt-20">
          <CreateExpenseBudget />
          <FetchExpenseBudget />
        </div>
      </div>
    </div>
  );
};

export default ExpenseBudget;
