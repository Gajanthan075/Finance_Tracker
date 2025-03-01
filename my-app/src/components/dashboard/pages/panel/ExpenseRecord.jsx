import React from "react";
import CreateExpenseRecord from "../panel/ExpenseRecord/CreateExpenseRecord";
import FetchExpenseRecord from "../panel/ExpenseRecord/FetchExpenseRecord";
import ExpenseBudget from "../panel/ExpenseBudget";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const ExpenseRecord = () => {
  return (
    <div>
      <div className="flex justify-center">
        <Navbar />
        <Sidebar />
        <div className="p-20 bg-slate-400 mt-20">
          <CreateExpenseRecord />
          <FetchExpenseRecord />
          <ExpenseBudget />
        </div>
      </div>
    </div>
  );
};

export default ExpenseRecord;
