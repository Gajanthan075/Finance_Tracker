import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../../AuthContext";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

const FetchExpenseRecord = () => {
  const [expenseRecords, setExpenseRecords] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useContext(AuthContext);

  const [editRecord, setEditRecord] = useState(null);
  const [deleteRecordId, setDeleteRecordId] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    expense_name: "",
    amount: "",
    date: "",
    expense_type: "",
    account_type: "",
    note: "",
  });

  useEffect(() => {
    const fetchExpenseRecords = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/expense-record/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch expense records");
        }
        const data = await response.json();
        setExpenseRecords(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchExpenseRecords();
  }, [userId]);

  const handleInputChange = (e) => {
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateSubmit = async (recordId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/expense-record/${userId}/${recordId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update expense record");
      }
      const updatedRecords = expenseRecords.map((record) =>
        record._id === recordId ? { ...record, ...updatedData } : record
      );
      setExpenseRecords(updatedRecords);
      setEditRecord(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (recordId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/expense-record/${userId}/${recordId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setExpenseRecords((prevRecords) =>
          prevRecords.filter((record) => record._id !== recordId)
        );
        setMessage("Record deleted successfully");
      } else {
        setMessage("Failed to delete record");
      }
      setDeleteRecordId(null);
    } catch (error) {
      setMessage("An error occurred while deleting the record");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-full mx-auto bg-white p-5 rounded-md shadow-md">
      {message && <p className="text-green-500">{message}</p>}
      {expenseRecords.length === 0 ? (
        <p>No expense records found</p>
      ) : (
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th>Expense Name</th>
              <th>Date</th>
              <th>Expense Type</th>
              <th>Account Type</th>
              <th>Amount</th>
              <th>Note</th>
              <th colSpan={2}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenseRecords.map((record) => (
              <tr key={record._id}>
                <td>{record.expense_name}</td>
                <td>
                  {record.date
                    ? new Date(record.date).toLocaleDateString()
                    : "No date available"}
                </td>
                <td>{record.expense_type || "No type"}</td>
                <td>{record.account_type || "No account type"}</td>
                <td>{record.amount}</td>
                <td>{record.note || "No note"}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditRecord(record);
                      setUpdatedData(record);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => setDeleteRecordId(record._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Update Modal */}
      <Modal isOpen={!!editRecord} onClose={() => setEditRecord(null)}>
        <h3>Update Expense</h3>
        <input
          type="text"
          name="expense_name"
          value={updatedData.expense_name}
          onChange={handleInputChange}
          placeholder="Expense Name"
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="number"
          name="amount"
          value={updatedData.amount}
          onChange={handleInputChange}
          placeholder="Amount"
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="date"
          name="date"
          value={updatedData.date}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-2"
        />
        <button
          onClick={() => handleUpdateSubmit(editRecord._id)}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Submit
        </button>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteRecordId} onClose={() => setDeleteRecordId(null)}>
        <h3>Are you sure you want to delete this record?</h3>
        <button
          onClick={() => handleDelete(deleteRecordId)}
          className="bg-red-500 text-white px-3 py-1 rounded mr-2"
        >
          Yes
        </button>
        <button
          onClick={() => setDeleteRecordId(null)}
          className="bg-gray-500 text-white px-3 py-1 rounded"
        >
          No
        </button>
      </Modal>
    </div>
  );
};

export default FetchExpenseRecord;
