import React from "react";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Supports from "./property/support/Supports";

const SupportTicket = () => {
  return (
    <>
      <Navbar />
      <Box height={40} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Supports />
        </Box>
      </Box>
    </>
  );
};

export default SupportTicket;
