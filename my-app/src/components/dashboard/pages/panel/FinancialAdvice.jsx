import React, { useEffect, useState } from "react";
//import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Box, Card, CardContent } from "@mui/material";
import Finance_01 from "./FinanceAdvice/Finance_01.mp4";
import Finance_02 from "./FinanceAdvice/Finance_02.mp4";
import Finance_03 from "./FinanceAdvice/Finance_03.mp4";

import Community from "./FinanceAdvice/usercommunity/Community";

const FinancialAdvice = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isSideBarOpen, setSideBarOpen] = useState(false);

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
      <Box height={70} />
      <Box sx={{ display: "flex" }}>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3 }}
          className="bg-slate-400"
        >
          <div className="py-5">
            <header className="p-4 bg-blue-600 text-white text-center">
              <h1 className="text-2xl font-bold">Finance Advices);</h1>
            </header>
          </div>
          <div className="flex justify-between">
            <Card sx={{ minWidth: 400 }}>
              <CardContent>
                <video src={Finance_01} autoPlay loop muted />
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 400 }}>
              <CardContent>
                <video src={Finance_02} autoPlay loop muted />
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 400 }}>
              <CardContent>
                <video src={Finance_03} autoPlay loop muted />
              </CardContent>
            </Card>
          </div>
          <div className="p-6">
            <Community />
          </div>
        </Box>
      </Box>
    </>
  );
};

export default FinancialAdvice;
