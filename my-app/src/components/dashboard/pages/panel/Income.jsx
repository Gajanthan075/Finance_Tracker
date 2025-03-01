import React, { useState } from "react";
import FetchIncomeTarget from "./IncomeTarget/FetchIncomeTarget";
import Creation from "./IncomeTarget/Creation";
import FetchIncomeRecord from "./IncomeRecord/FetchIncomeRecord";
import FetchCurrentMonthIncomeRecord from "./IncomeRecord/FetchCurrentMonthIncomeRecord";
import { Box } from "@mui/material";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const Income = () => {
  const [isSideBarOpen, setSideBarOpen] = useState(true);
  const [view, setView] = useState("all"); // New state to toggle between 'all' and 'current'

  const toggleSideBar = () => {
    setSideBarOpen(!isSideBarOpen);
  };

  const handleViewChange = (type) => {
    setView(type); // Set view to 'all' or 'current'
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
              Income Target
            </div>
            <div>
              <div className="bg-white p-4 rounded-lg shadow-md flex-grow flex-shrink-0">
                <FetchIncomeTarget />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex-grow flex-shrink-0">
                <Creation />
              </div>
            </div>
            <div className="bg-slate-300 p-4 rounded-lg shadow-md text-gray-800 font-semibold">
              Income Record
            </div>
            <div className="flex gap-5">
              <button
                className={`${
                  view === "all" ? "bg-blue-600" : "bg-gray-500"
                } text-white px-3 py-1 mt-2 rounded hover:bg-blue-600`}
                onClick={() => handleViewChange("all")}
              >
                All
              </button>
              <button
                className={`${
                  view === "current" ? "bg-blue-600" : "bg-gray-500"
                } text-white px-3 py-1 mt-2 rounded hover:bg-blue-600`}
                onClick={() => handleViewChange("current")}
              >
                Current month
              </button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              {view === "all" && <FetchIncomeRecord />}
              {view === "current" && <FetchCurrentMonthIncomeRecord />}
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default Income;
