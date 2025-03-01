import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../AuthContext";
import moment from "moment";

const FetchSubscription = ({ setSubscriptionsData }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editSubscription, setEditSubscription] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    billing: "",
    status: "",
    amount: "",
  });
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/subscriptions/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch subscriptions!");
        }
        const data = await response.json();
        setSubscriptions(data);
        setSubscriptionsData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [userId, setSubscriptionsData]);

  const handleEditClick = (subscription) => {
    setEditSubscription(subscription._id.$oid);
    setEditForm({
      name: subscription.name,
      billing: subscription.billing,
      status: subscription.status,
      amount: subscription.amount,
    });
    setShowEditModal(true);
  };

  const updateSubscription = async (subscriptionId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/subscriptions/${userId}/${subscriptionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        }
      );

      if (response.ok) {
        const updatedSubscriptions = subscriptions.map((subscription) =>
          subscription._id.$oid === subscriptionId
            ? { ...subscription, ...editForm }
            : subscription
        );
        setSubscriptions(updatedSubscriptions);
        setEditSubscription(null);
        setShowEditModal(false);
      } else {
        const result = await response.json();
        setError(result.error || "Failed to update subscription.");
      }
    } catch (error) {
      setError("An error occurred while updating the subscription.");
    }
  };

  const handleDeleteClick = (subscriptionId) => {
    setEditSubscription(subscriptionId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/subscriptions/${userId}/${editSubscription}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const updatedSubscriptions = subscriptions.filter(
          (subscription) => subscription._id.$oid !== editSubscription
        );
        setSubscriptions(updatedSubscriptions);
        setEditSubscription(null);
        setShowDeleteModal(false);
      } else {
        const result = await response.json();
        setError(result.error || "Failed to delete subscription.");
      }
    } catch (error) {
      setError("An error occurred while deleting the subscription.");
    }
  };

  const isOverdue = (dueDate) => {
    return moment(dueDate).isBefore(moment());
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-5 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Subscriptions</h2>
      <ul className="flex flex-wrap gap-4">
        {subscriptions.map((subscription) => (
          <li
            key={subscription._id.$oid}
            className={`flex-grow max-w-xs p-4 rounded-lg shadow-md ${
              isOverdue(subscription.due_date) &&
              subscription.status === "Active"
                ? "bg-red-100"
                : "bg-gray-100"
            }`}
          >
            <div className="flex flex-col items-center">
              <h2 className="text-gray-900 text-lg font-bold">
                {subscription.name}
              </h2>
              <p>Amount: ${subscription.amount}</p>
              <p>Billing: {subscription.billing}</p>
              <p>Status: {subscription.status}</p>
              <p>Monthly Cost: ${subscription.monthly_cost}</p>
              <p>
                Due Date: {moment(subscription.due_date).format("YYYY-MM-DD")}
              </p>
              {isOverdue(subscription.due_date) &&
                subscription.status === "Active" && (
                  <p className="text-red-500 font-bold">Overdue!</p>
                )}

              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => handleEditClick(subscription)}
                  className="text-sm px-4 py-2 bg-indigo-400 text-white rounded-lg hover:bg-indigo-500"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteClick(subscription._id.$oid)}
                  className="text-sm px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Subscription</h3>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="border rounded px-4 py-2 w-full mb-2"
            />
            <input
              type="text"
              value={editForm.billing}
              onChange={(e) =>
                setEditForm({ ...editForm, billing: e.target.value })
              }
              className="border rounded px-4 py-2 w-full mb-2"
            />
            <input
              type="text"
              value={editForm.status}
              onChange={(e) =>
                setEditForm({ ...editForm, status: e.target.value })
              }
              className="border rounded px-4 py-2 w-full mb-2"
            />
            <input
              type="number"
              value={editForm.amount}
              onChange={(e) =>
                setEditForm({ ...editForm, amount: e.target.value })
              }
              className="border rounded px-4 py-2 w-full mb-2"
            />
            <button
              type="button"
              onClick={() => updateSubscription(editSubscription)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this subscription?</p>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchSubscription;
