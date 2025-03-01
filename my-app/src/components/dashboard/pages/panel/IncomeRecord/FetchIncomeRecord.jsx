import React, { useState, useEffect, useContext } from "react";
import { Modal, Box } from "@mui/material";
import { AuthContext } from "../../../../../AuthContext";

const FetchIncomeRecord = () => {
  const [incomeRecords, setIncomeRecords] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editIncome, setEditIncome] = useState(null);
  const [deleteIncome, setDeleteIncome] = useState(null);
  const { userId } = useContext(AuthContext);
  const [editForm, setEditForm] = useState({
    date: "",
    income_name: "",
    amount: "",
    income_type: "",
    account_type: "",
    note: "",
  });

  // Fetch income records when the component mounts
  useEffect(() => {
    const fetchIncomeRecords = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/income-record/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch income records");
        }
        const data = await response.json();
        setIncomeRecords(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchIncomeRecords();
  }, [userId]);

  // Open the edit modal with selected record's data
  const handleEditClick = (record) => {
    setEditIncome(record._id.$oid);
    setEditForm({
      date: record.date?.$date || "",
      income_name: record.income_name || "",
      amount: record.amount || "",
      income_type: record.income_type || "",
      account_type: record.account_type || "",
      note: record.note || "",
    });
  };

  // Function to update an income record
  const updateRecord = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/income-record/${userId}/${editIncome}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        }
      );

      if (response.ok) {
        setMessage("Income record updated successfully!");
        const updatedRecords = incomeRecords.map((record) =>
          record._id.$oid === editIncome ? { ...record, ...editForm } : record
        );
        setIncomeRecords(updatedRecords);
        setEditIncome(null); // Close the edit modal
      } else {
        const result = await response.json();
        setMessage(result.error || "Failed to update the income record.");
      }
    } catch (error) {
      setMessage("An error occurred while updating the income record.");
    }
  };

  // Function to delete an income record
  const deleteRecord = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/income-record/${userId}/${deleteIncome}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setMessage("Income record deleted successfully!");
        setIncomeRecords((prevRecords) =>
          prevRecords.filter((record) => record._id.$oid !== deleteIncome)
        );
        setDeleteIncome(null); // Close the delete modal
      } else {
        const result = await response.json();
        setMessage(result.error || "Failed to delete income record.");
      }
    } catch (error) {
      setMessage("An error occurred while deleting the income record.");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white rounded-lg shadow-md">
      {message && (
        <p
          className={`text-center ${
            message.includes("error") ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </p>
      )}
      <table className="min-w-full bg-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-4 py-2">Income Name</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2" colSpan={2}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {incomeRecords.map((record) => (
            <tr key={record._id.$oid} className="border-b">
              <td className="px-4 py-2">{record.income_name}</td>
              <td className="px-4 py-2">
                {new Date(record.date?.$date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">${record.amount}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleEditClick(record)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Update
                </button>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => setDeleteIncome(record._id.$oid)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <Modal open={!!editIncome} onClose={() => setEditIncome(null)}>
        <Box
          className="p-6 bg-white rounded shadow-md max-w-md mx-auto mt-20"
          sx={{ outline: "none" }}
        >
          <h3 className="text-xl font-semibold mb-4">Edit Income Record</h3>
          <form className="space-y-4">
            <input
              type="text"
              value={editForm.income_name}
              onChange={(e) =>
                setEditForm({ ...editForm, income_name: e.target.value })
              }
              placeholder="Income Name"
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="date"
              value={editForm.date}
              onChange={(e) =>
                setEditForm({ ...editForm, date: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
            <button
              type="button"
              onClick={updateRecord}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </form>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteIncome} onClose={() => setDeleteIncome(null)}>
        <Box
          className="p-6 bg-white rounded shadow-md max-w-md mx-auto mt-20"
          sx={{ outline: "none" }}
        >
          <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
          <p>Are you sure you want to delete this income record?</p>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={deleteRecord}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteIncome(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default FetchIncomeRecord;
