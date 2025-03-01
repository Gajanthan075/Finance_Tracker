import React from "react";
import CreateIncomeRecord from "../panel/IncomeRecord/CreateIncomeRecord";
import FetchIncomeRecord from "../panel/IncomeRecord/FetchIncomeRecord";
import IncomeTarget from "./IncomeTarget";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const IncomeRecord = () => {
  return (
    <div>
      <div className="flex justify-center">
        <Navbar />
        <Sidebar />
        <div className="p-20 bg-slate-400 mt-20">
          <div className="flex">
            <div className="w-1/4">
              <CreateIncomeRecord />
              <FetchIncomeRecord />
            </div>
            <div className="w-1/4">
              <IncomeTarget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeRecord;
