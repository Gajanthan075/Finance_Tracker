import React, { useContext, useEffect, useState } from "react";
import Navbar from "./dashboard/components/Navbar";
import Sidebar from "./dashboard/components/Sidebar";
import { Box } from "@mui/material";
import "../index.css";
import { AuthContext } from "../AuthContext";
import DoughnutChart from "./dashboard/charts/DoughnutChart";
import Rightsidebar from "./dashboard/components/Rightsidebar";
import RecentTransaction from "./dashboard/components/RecentTransaction.";
import AccountCount from "./dashboard/pages/panel/Account/AccountCount";
import TotalCurrentBalance from "./dashboard/pages/panel/Account/TotalCurrentBalance";

import Loader from "./dashboard/charts/Loader";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true); // Use the loading state
  const [error, setError] = useState(null); // Use the error state
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${userId}`);
        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        setError(error.message); // Set the error if there is an issue
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchUsername();
  }, [userId]);

  const [isSideBarOpen, setSideBarOpen] = useState(true);
  const toggleSideBar = () => {
    setSideBarOpen(!isSideBarOpen);
  };

  return (
    <div>
      <Navbar toggleSideBar={toggleSideBar} />
      <Box sx={{ display: "flex" }}>
        <div className="flex">
          <Box
            sx={{
              width: isSideBarOpen ? 240 : 0,
              transition: "width 0.3s",
              overflow: "hidden",
            }}
          >
            <Sidebar isSideBarOpen={isSideBarOpen} />
          </Box>

          <div
            className="home p-20 top-2  flex-1 "
            style={{ marginRight: "260px" }}
          >
            <div className="home-content">
              <header className="home-header">
                <div className="header-box">
                  {loading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p className="text-red-500">Error: {error}</p>
                  ) : (
                    <h1 className="header-box-title">
                      Welcome to Your Financial Dashboard,
                      <span className="text-bankGradient">
                        &nbsp;{username.toUpperCase()}!
                      </span>
                    </h1>
                  )}
                  <p className="header-box-subtext">
                    Unlock your financial potential with powerful tools for
                    managing, growing, and optimizing your money. Dive in and
                    start your success story now!
                  </p>
                </div>
              </header>
              <section className="total-balance">
                <div className="total-balance-chart">
                  <DoughnutChart />
                </div>
                <div className="flex flex-col gap-6 ">
                  <h2 className="header-2">
                    <AccountCount />
                  </h2>
                  <div className="flex flex-col gap-2">
                    <p className="total-balance-label">Combined Cashflow</p>
                    <p className="total-balance-amount flex-center gap-2">
                      <div className="total-balance-amount flex-center gap-2">
                        <div className="w-full">
                          <TotalCurrentBalance />
                        </div>
                      </div>
                    </p>
                  </div>
                </div>
                <div className="total-balance-chart flex-col gap-2">
                  <Loader />
                </div>
              </section>
              <div>
                <RecentTransaction />
              </div>
            </div>
          </div>
          <Box
            sx={{
              position: "fixed",
              right: 0,
              top: 0,
              height: "100vh",
              backgroundColor: "white",
            }}
          >
            <Rightsidebar />
          </Box>
        </div>
      </Box>
    </div>
  );
};

export default Dashboard;
