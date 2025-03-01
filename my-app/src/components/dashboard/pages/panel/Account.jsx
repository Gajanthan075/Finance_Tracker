import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import FetchAccounts from "./Account/FetchAccount";
import Creation from "./Account/Creation";
import { Box } from "@mui/material";
import { AccountBalance } from "@mui/icons-material";
import FetchAccountTable from "./Account/FetchAccountTable";

const Account = () => {
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
            <div className="my-banks">
              <div className="header-box">
                <h1 className="header-box-title">
                  <AccountBalance />
                  &nbsp;My Accounts
                </h1>
                <p className="header-box-subtext">
                  Effortlessy manage your accounts
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="header-2">Your Accounts</h2>
                <FetchAccounts />
              </div>
            </div>
            <div className="space-y-4 p-5">
              <Creation />
            </div>
            <div className="">
              <FetchAccountTable />
            </div>
          </Box>
        </div>
      </Box>
    </div>
  );
};

export default Account;
