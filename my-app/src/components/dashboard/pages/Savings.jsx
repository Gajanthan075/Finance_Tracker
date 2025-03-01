import React from "react";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Saving from "./property/saving/Saving";

const Savings = () => {
  return (
    <>
      <Navbar />
      <Box height={40} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          <Saving />
        </Box>
      </Box>
    </>
  );
};

export default Savings;
