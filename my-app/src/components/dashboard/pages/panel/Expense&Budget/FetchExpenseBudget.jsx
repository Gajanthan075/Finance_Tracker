import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../AuthContext";

const ExpenseTypeBudgets = () => {
  const [expenseTypeBudgets, setExpenseTypeBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useContext(AuthContext);
  const [editTarget, setEditTarget] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetForDelete, setTargetForDelete] = useState(null);

  const [editForm, setEditForm] = useState({
    expense_type: "",
    monthly_budget: "",
  });

  useEffect(() => {
    const fetchExpenseTypeBudgets = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/expense-type-budget/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch expense type budgets");
        }
        const data = await response.json();
        setExpenseTypeBudgets(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchExpenseTypeBudgets();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const openEditModal = (target) => {
    setEditTarget(target);
    setEditForm({
      expense_type: target.expense_type,
      monthly_budget: target.monthly_budget,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (target) => {
    setTargetForDelete(target);
    setShowDeleteModal(true);
  };

  const updateExpenseBudget = async (expense_type_budget_id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/expense-type-budget/${userId}/${expense_type_budget_id.$oid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        }
      );
      if (response.ok) {
        setExpenseTypeBudgets((prevTargets) =>
          prevTargets.map((t) =>
            t._id.$oid === expense_type_budget_id.$oid
              ? { ...t, ...editForm }
              : t
          )
        );
        setShowEditModal(false);
        setError("");
      } else {
        setError("Failed to update expense type and budget");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteExpenseBudget = async (expense_type_budget_id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/expense-type-budget/${expense_type_budget_id.$oid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setExpenseTypeBudgets((prevTargets) =>
          prevTargets.filter((t) => t._id.$oid !== expense_type_budget_id.$oid)
        );
        setShowDeleteModal(false);
        setError("");
      } else {
        setError("Failed to delete expense type and budget");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Expense Type Budgets
      </h2>
      {expenseTypeBudgets.length === 0 ? (
        <p>No expense type budgets found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {expenseTypeBudgets.map((budget) => (
            <div
              key={budget._id.$oid}
              className="border border-gray-300 p-4 rounded-md shadow-sm"
            >
              <p className="text-gray-700">
                <strong>Expense Type:</strong> {budget.expense_type}
              </p>
              <p className="text-gray-700">
                <strong>Monthly Budget:</strong> ${budget.monthly_budget}
              </p>
              <p className="text-gray-700">
                <strong>Expense This Month:</strong> $
                {budget.expense_this_month}
              </p>
              <p className="text-gray-700">
                <strong>Budget Utilization:</strong> {budget.budget_utilization}
                %
              </p>
              <p className="text-gray-700">
                <strong>Created At:</strong>{" "}
                {new Date(budget.created_at).toLocaleString()}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => openEditModal(budget)}
                  className="bg-blue-600 rounded text-white p-2 transition duration-200 hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => openDeleteModal(budget)}
                  className="bg-red-600 rounded text-white p-2 transition duration-200 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h3 className="text-xl font-bold mb-4">Edit Expense Budget</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateExpenseBudget(editTarget._id);
              }}
            >
              <label className="block mb-2">
                Expense Type:
                <input
                  type="text"
                  name="expense_type"
                  value={editForm.expense_type}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </label>
              <label className="block mb-2">
                Monthly Budget:
                <input
                  type="number"
                  name="monthly_budget"
                  value={editForm.monthly_budget}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </label>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this expense budget?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteExpenseBudget(targetForDelete._id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTypeBudgets;
