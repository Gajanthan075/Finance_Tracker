import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Dashboard, Home, LogoutOutlined } from "@mui/icons-material";
import Account from "@mui/icons-material/Wallet";
import Income from "@mui/icons-material/AddCircleOutlineOutlined";
import Expense from "@mui/icons-material/RemoveCircleOutlineOutlined";
import Transaction from "@mui/icons-material/TransferWithinAStation";
import Subscription from "@mui/icons-material/CircleNotifications";
import Goal from "@mui/icons-material/Redeem";
//import FD from "@mui/icons-material/Psychology";
import CreateExpenseRecord from "../pages/panel/ExpenseRecord/CreateExpenseRecord"; // Import Add Expense Form
import CreateIncomeRecord from "../pages/panel/IncomeRecord/CreateIncomeRecord"; // Import Add Income Form
import CreateTransferRecord from "../pages/panel/Transaction/CreateTransaction"; // Import Add Transfer Form
import User from "../pages/property/home/User";

const Sidebar = ({ isSideBarOpen }) => {
  const [activeModal, setActiveModal] = useState(""); // State to manage active modal
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const openModal = (type) => {
    setActiveModal(type); // Set active modal type
  };

  const closeModal = () => {
    setActiveModal(""); // Reset modal type
  };

  const menuItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: Dashboard, label: "Dashboard", path: "/home" },
    { icon: Account, label: "Finance Account", path: "/account" },
    { icon: Income, label: "Income", path: "/income" },
    { icon: Expense, label: "Expense", path: "/expense" },
    { icon: Transaction, label: "Transactions", path: "/transaction" },
    { icon: Subscription, label: "Subscriptions", path: "/subscriptions" },
    { icon: Goal, label: "Financial Goal", path: "/financialGoal" },
    //{ icon: FD, label: "Financial Advice", path: "/financialAdvice" },
  ];

  const quickMenu = [
    {
      icon: Expense,
      label: "Add Expense",
      onClick: () => openModal("expense"),
    },
    { icon: Income, label: "Add Income", onClick: () => openModal("income") },
    {
      icon: Transaction,
      label: "Add Transfer",
      onClick: () => openModal("transfer"),
    },
    {
      icon: Dashboard, // Reusing the Dashboard icon for Settings
      label: "Settings",
      onClick: () => openModal("settings"), // Navigate to the Settings page
    },
  ];

  return (
    <div className="flex h-screen w-full">
      <div
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-transform ${
          isSideBarOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col justify-between shadow-lg`}
      >
        <div className="px-4 pb-4 overflow-y-auto">
          <h3 className="text-gray-900 dark:text-white text-lg font-semibold mb-2">
            Main Menu
          </h3>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className="flex items-center p-3 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition duration-200 ease-in-out transform hover:scale-105"
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="text-gray-600 mr-3" />
                <span className="text-sm font-medium">{item.label}</span>
              </li>
            ))}
          </ul>
          <h3 className="text-gray-900 dark:text-white text-lg font-semibold mt-6 mb-2">
            Quick Menu
          </h3>
          <ul className="space-y-2">
            {quickMenu.map((item, index) => (
              <li
                key={index}
                className="flex items-center p-3 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition duration-200 ease-in-out transform hover:scale-105"
                onClick={item.onClick}
              >
                <item.icon className="text-gray-600 mr-3" />
                <span className="text-sm font-medium">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <Link
          to="/logout"
          className="flex items-center p-3 border-t border-gray-200 dark:border-gray-700"
        >
          <LogoutOutlined className="text-gray-600 mr-3" />
          <span className="text-gray-900 dark:text-white font-medium">
            Logout
          </span>
        </Link>
      </div>

      {/* Modal for Adding Records */}
      {activeModal === "expense" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <CreateExpenseRecord closeModal={closeModal} />
          </div>
        </div>
      )}

      {activeModal === "income" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <CreateIncomeRecord closeModal={closeModal} />
          </div>
        </div>
      )}

      {activeModal === "transfer" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <CreateTransferRecord closeModal={closeModal} />
          </div>
        </div>
      )}

      {/* User Settings Modal */}
      {activeModal === "settings" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <User closeModal={closeModal} />
            {/* Render the User component here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
