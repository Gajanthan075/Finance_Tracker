import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import FetchFinancialGoal from "./FinancialGoal/FetchFinancialGoal";
import { Box } from "@mui/material";
import Creation from "./FinancialGoal/Creation";

const FinancialGoal = () => {
  const [isSideBarOpen, setSideBarOpen] = useState(true);
  const toggleSideBar = () => {
    setSideBarOpen(!isSideBarOpen);
  };
  return (
    <div>
      <Navbar toggleSideBar={toggleSideBar} />
      <Box sx={{ display: "flex" }}>
        <div className="flex justify-center">
          <Box
            sx={{
              width: isSideBarOpen ? 240 : 0,
              transition: "width 0.3s",
              overflow: "hidden",
            }}
          >
            <Sidebar isSideBarOpen={isSideBarOpen} />
          </Box>
          <Box sx={{ flexGrow: 1, p: 3, overflow: "hidden" }}>
            <div className="flex ">
              <div className="p-20">
                <FetchFinancialGoal />
                <Creation />
              </div>
            </div>
          </Box>
        </div>
      </Box>
    </div>
  );
};

export default FinancialGoal;
