import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./AuthContext";

import Savings from "./components/dashboard/pages/Savings";
import SupportTicket from "./components/dashboard/pages/SupportTicket";
import Home from "./components/dashboard/pages/Home";
import DeleteUser from "./components/DeleteUser";
import UpdateUser from "./components/UpdateUser";
import Subscriptions from "./components/dashboard/pages/panel/Subscriptions";
import Account from "./components/dashboard/pages/panel/Account";
import CreateAccount from "./components/dashboard/pages/panel/Account/CreateAccount";
import FinancialGoal from "./components/dashboard/pages/panel/FinancialGoal";
import FinancialAdvices from "./components/dashboard/pages/panel/FinancialAdvice";
import Transactions from "./components/dashboard/pages/panel/Transaction";
import Income from "./components/dashboard/pages/panel/Income";
import CreateIncomeTarget from "./components/dashboard/pages/panel/IncomeTarget/CreateIncomeTarget";
import Expense from "./components/dashboard/pages/panel/Expense";
import CreateExpenseBudget from "./components/dashboard/pages/panel/Expense&Budget/CreateExpensBudget";
import CreateTransaction from "./components/dashboard/pages/panel/Transaction/CreateTransaction";
import CreateSubscription from "./components/dashboard/pages/panel/Subscription/CreateSubscription";
import CreateExpenseRecord from "./components/dashboard/pages/panel/ExpenseRecord/CreateExpenseRecord";
import CreateIncomeRecord from "./components/dashboard/pages/panel/IncomeRecord/CreateIncomeRecord";
import Logout from "./components/LogOut";
import "./index.css";
import CreateFinancialGoal from "./components/dashboard/pages/panel/FinancialGoal/CreateFinancialGoal";
import Intro from "./components/Intro";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/delete-account" component={DeleteUser} />
            <Route path="/update-account" element={<UpdateUser />} />
            <Route path="/home" element={<Home />} />

            {/*<Route path="/transaction" element={<Transaction />} />*/}
            <Route path="/account" element={<Account />} />
            <Route path="/create-account" element={<CreateAccount />} />

            <Route path="/income" element={<Income />} />
            <Route path="/create-target" element={<CreateIncomeTarget />} />

            <Route path="/expense" element={<Expense />} />
            <Route path="/create-budget" element={<CreateExpenseBudget />} />

            <Route path="/transaction" element={<Transactions />} />
            <Route path="/create-transaction" element={<CreateTransaction />} />

            <Route
              path="/create-subscription"
              element={<CreateSubscription />}
            />

            <Route path="/add-expense" element={<CreateExpenseRecord />} />
            <Route path="/add-income" element={<CreateIncomeRecord />} />
            <Route path="/add-transfer" element={<CreateTransaction />} />

            <Route path="/sub" element={<Subscriptions />} />
            <Route path="/subscriptions" element={<Subscriptions />} />

            <Route path="/financialGoal" element={<FinancialGoal />} />
            <Route path="/create-goal" element={<CreateFinancialGoal />} />

            <Route path="/financialAdvice" element={<FinancialAdvices />} />

            <Route path="/savings" element={<Savings />} />
            <Route path="/support" element={<SupportTicket />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
