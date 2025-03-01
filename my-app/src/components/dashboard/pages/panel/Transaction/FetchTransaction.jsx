import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../AuthContext";

const FetchTransaction = () => {
  const { userId } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null); // Track the transaction being edited
  const [deleteTransactionId, setDeleteTransactionId] = useState(null); // Track the transaction to delete
  const [editForm, setEditForm] = useState({
    date: "",
    transfer_name: "",
    amount: "",
    type: "",
    transfer_from: "",
    transfer_to: "",
    fund_to_goals: "",
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) {
        setMessage("No user is logged in.");
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:5000/transaction/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          const responseData = await response.json();
          setTransactions(responseData);
        } else {
          setMessage("Failed to fetch transactions.");
        }
      } catch (error) {
        setMessage("Network error: " + error.message);
      }
    };

    fetchTransactions();
  }, [userId]);

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  // Function to open the edit modal
  const openEditModal = (transaction) => {
    setEditTransaction(transaction);
    setEditForm({
      date: transaction.date,
      transfer_name: transaction.transfer_name,
      amount: transaction.amount,
      type: transaction.type,
      transfer_from: transaction.transfer_from,
      transfer_to: transaction.transfer_to,
      fund_to_goals: transaction.fund_to_goals,
    });
    setShowEditModal(true);
  };

  // Function to update a transaction
  const updateTransaction = async (transactionId) => {
    const response = await fetch(
      `http://localhost:5000/transaction/${userId}/${transactionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      }
    );

    if (response.status === 200) {
      setMessage("Transaction updated successfully!");
      setTransactions((prevTransactions) =>
        prevTransactions.map((t) =>
          t._id.$oid === transactionId ? { ...t, ...editForm } : t
        )
      );
      setShowEditModal(false); // Close the modal
    } else {
      setMessage("Failed to update the transaction.");
    }
  };

  // Function to open the delete modal
  const openDeleteModal = (transactionId) => {
    setDeleteTransactionId(transactionId);
    setShowDeleteModal(true);
  };

  // Function to delete a transaction
  const deleteTransaction = async () => {
    const response = await fetch(
      `http://localhost:5000/transaction/${userId}/${deleteTransactionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      setMessage("Transaction deleted successfully!");
      setTransactions(
        transactions.filter((t) => t._id.$oid !== deleteTransactionId)
      );
      setShowDeleteModal(false); // Close the modal
    } else {
      setMessage("Failed to delete the transaction.");
    }
  };

  return (
    <div>
      {message && <p className="text-red-500 text-center">{message}</p>}
      <table className="min-w-full table-auto bg-gray-50 dark:bg-gray-700 rounded-lg">
        <thead>
          <tr className="text-left">
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Transfer Name</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Transfer From</th>
            <th className="px-4 py-2">Transfer To</th>
            <th className="px-4 py-2">Fund to Goals</th>
            <th className="px-4 py-2">Update</th>
            <th className="px-4 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id.$oid} className="hover:bg-gray-100">
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.transfer_name}</td>
              <td>${transaction.amount}</td>
              <td>{transaction.type}</td>
              <td>{transaction.transfer_from}</td>
              <td>{transaction.transfer_to}</td>
              <td>{transaction.fund_to_goals}</td>
              <td>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => openEditModal(transaction)}
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => openDeleteModal(transaction._id.$oid)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateTransaction(editTransaction._id.$oid);
              }}
            >
              {/* Form fields */}
              <input
                type="date"
                name="date"
                value={editForm.date}
                onChange={handleInputChange}
                className="border p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="transfer_name"
                value={editForm.transfer_name}
                onChange={handleInputChange}
                className="border p-2 mb-2 w-full"
              />
              <label className="block mb-2">
                Amount:
                <input
                  type="number"
                  name="amount"
                  value={editForm.amount}
                  onChange={handleInputChange}
                  className="border p-1 w-full"
                />
              </label>
              <label className="block mb-2">
                Type:
                <input
                  type="text"
                  name="type"
                  value={editForm.type}
                  onChange={handleInputChange}
                  className="border p-1 w-full"
                />
              </label>
              <label className="block mb-2">
                From:
                <input
                  type="text"
                  name="transfer_from"
                  value={editForm.transfer_from}
                  onChange={handleInputChange}
                  className="border p-1 w-full"
                />
              </label>
              <label className="block mb-2">
                To:
                <input
                  type="text"
                  name="transfer_to"
                  value={editForm.transfer_to}
                  onChange={handleInputChange}
                  className="border p-1 w-full"
                />
              </label>
              <label className="block mb-2">
                Fund to Goals:
                <input
                  type="text"
                  name="fund_to_goals"
                  value={editForm.fund_to_goals}
                  onChange={handleInputChange}
                  className="border p-1 w-full"
                />
              </label>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="ml-2 bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <h3>Are you sure you want to delete this transaction?</h3>
            <button
              onClick={deleteTransaction}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Yes
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="ml-2 bg-gray-400 px-4 py-2 rounded"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchTransaction;
