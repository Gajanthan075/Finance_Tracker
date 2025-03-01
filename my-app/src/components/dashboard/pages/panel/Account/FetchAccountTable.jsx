import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../../../../../AuthContext";

const FetchAccountTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editAccount, setEditAccount] = useState(null); // State for the account being edited
  const [editForm, setEditForm] = useState({
    account_name: "",
    account_type: "",
    current_balance: 0,
    note: "",
  });
  const [deleteAccount, setDeleteAccount] = useState(null); // State for the account being deleted
  const { userId } = useContext(AuthContext);

  // Fetch accounts
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/account/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Handler to pre-fill form and show edit modal
  const handleEditClick = (account) => {
    setEditForm({
      account_name: account.account_name,
      account_type: account.account_type,
      current_balance: account.current_balance,
      note: account.note || "",
    });
    setEditAccount(account);
  };

  // Update account handler
  const handleUpdateClick = async () => {
    if (!editAccount || !editAccount._id) return;

    try {
      const response = await fetch(
        `http://localhost:5000/account/${userId}/${editAccount._id.$oid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );

      if (response.ok) {
        setEditAccount(null);
        fetchAccounts();
      } else {
        console.error("Error updating account:", await response.text());
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // Delete account handler
  const handleDeleteClick = async () => {
    if (!deleteAccount || !deleteAccount._id) return;

    try {
      const response = await fetch(
        `http://localhost:5000/account/${deleteAccount._id.$oid}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setDeleteAccount(null);
        fetchAccounts();
      } else {
        console.error("Error deleting account:", await response.text());
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return (
    <div>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <div className="flex justify-center items-center">
          <table className="w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b-2 border-gray-300">
                  Account Name
                </th>
                <th className="py-2 px-4 border-b-2 border-gray-300">
                  Account Type
                </th>
                <th className="py-2 px-4 border-b-2 border-gray-300">
                  Balance
                </th>
                <th className="py-2 px-4 border-b-2 border-gray-300">Note</th>
                <th
                  className="py-2 px-4 border-b-2 border-gray-300"
                  colSpan={2}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account._id}>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    {account.account_name}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    {account.account_type}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-green-600 text-center">
                    ${account.current_balance.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-green-600 text-center">
                    {account.note}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleEditClick(account)}
                      className="bg-blue-500 text-white px-3 py-1 mt-2 rounded hover:bg-blue-800"
                    >
                      Update
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => setDeleteAccount(account)}
                      className="bg-red-500 text-white px-3 py-1 mt-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Edit Modal */}
          {editAccount && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-4 relative w-full max-w-lg">
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setEditAccount(null)}
                >
                  ✖
                </button>
                <h3 className="text-xl font-semibold">Edit Account</h3>
                <form>
                  <label>Account Name:</label>
                  <input
                    type="text"
                    value={editForm.account_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, account_name: e.target.value })
                    }
                    className="border rounded px-4 py-2 w-full"
                  />
                  <label className="block mt-4">Account Type:</label>
                  <input
                    type="text"
                    value={editForm.account_type}
                    onChange={(e) =>
                      setEditForm({ ...editForm, account_type: e.target.value })
                    }
                    className="border rounded px-4 py-2"
                  />

                  <label className="block mt-4">Current Balance:</label>
                  <input
                    type="number"
                    value={editForm.current_balance}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        current_balance: e.target.value,
                      })
                    }
                    className="border rounded px-4 py-2"
                  />

                  <label className="block mt-4">Note:</label>
                  <input
                    type="text"
                    value={editForm.note}
                    onChange={(e) =>
                      setEditForm({ ...editForm, note: e.target.value })
                    }
                    className="border rounded px-4 py-2"
                  />

                  <button
                    type="button"
                    onClick={handleUpdateClick}
                    className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {deleteAccount && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-4 relative w-full max-w-lg">
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setDeleteAccount(null)}
                >
                  ✖
                </button>
                <p className="text-lg font-semibold">
                  Are you sure you want to delete this account?
                </p>
                <button
                  onClick={handleDeleteClick}
                  className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FetchAccountTable;
