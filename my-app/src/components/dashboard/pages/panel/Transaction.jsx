import React, { useState } from "react";
import FetchTransaction from "./Transaction/FetchTransaction";
import Creation from "./Transaction/Creation";
import Navbar from "../../components/Navbar";
import { Box } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import TransactionTotal from "./Transaction/edit/TransactionTotal";

const Transaction = () => {
  const [isSideBarOpen, setSideBarOpen] = useState(true);
  const toggleSideBar = () => {
    setSideBarOpen(!isSideBarOpen);
  };
  return (
    <div>
      <Navbar toggleSideBar={toggleSideBar} />
      <Box sx={{ display: "flex" }}>
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
          <div className="transactions mt-5 gap-5">
            <div className="transactions-header">
              <div className="header-box">
                <h1 className="header-box-title">Transanctions History</h1>
                <p className="header-box-subtext">
                  See your transacions details!
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="transactions-account">
                <div className="transactions-account-balance">
                  <p className="text-14">Total Transaction Amount</p>
                  <p className="text-24 text-center font-bold">
                    <TransactionTotal />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-10">
            <FetchTransaction />
            <Creation />
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default Transaction;
