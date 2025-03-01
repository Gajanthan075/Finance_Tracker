import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

import FetchSubscription from "./Subscription/FetchSubscription";
import Creation from "./Subscription/Creation";
import { Box } from "@mui/material";
import DueDateChart from "./Subscription/DueDateChart";

const Subscriptions = () => {
  const [isSideBarOpen, setSideBarOpen] = useState(true);
  const [subscriptionsData, setSubscriptionsData] = useState([]);
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
            <div className="flex p-10 ">
              <div>
                <FetchSubscription
                  setSubscriptionsData={setSubscriptionsData}
                />

                <Creation />
              </div>
            </div>

            <DueDateChart subscriptions={subscriptionsData} />
          </Box>
        </div>
      </Box>
    </div>
  );
};

export default Subscriptions;
