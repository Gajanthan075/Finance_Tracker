import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../../AuthContext";
import { useNavigate } from "react-router-dom";

const User = () => {
  const { userId, logout } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false); // State to toggle modal
  const navigate = useNavigate();

  const handleDeleteUser = async () => {
    if (!userId) {
      setMessage("No user is logged in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("User deleted successfully!");
        logout(); // Log the user out after successful deletion
        navigate("/");
      } else {
        setMessage(data.error || "Failed to delete user.");
      }
    } catch (error) {
      setMessage("Network error: " + error.message);
    }
    setShowConfirm(false); // Close the confirmation modal
  };

  const handleUpdateUser = () => {
    navigate("/update-account");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-64 rounded-lg border-2 border-indigo-500 bg-transparent p-4 text-center shadow-lg dark:bg-gray-800">
        <figure className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 dark:bg-indigo-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="currentColor"
            className="bi bi-person-fill text-white dark:text-indigo-300"
            viewBox="0 0 16 16"
          >
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
          </svg>
          <figcaption className="sr-only">John Doe, Web Developer</figcaption>
        </figure>
        <h2 className="mt-4 text-xl font-bold text-indigo-600 dark:text-indigo-400">
          User
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">Do you want!</p>
        <div className="flex items-center justify-center">
          <button
            onClick={handleUpdateUser}
            className="rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 dark:bg-indigo-400 dark:hover:bg-indigo-500"
          >
            Update
          </button>
          <button
            onClick={() => setShowConfirm(true)} // Open modal
            className="ml-4 rounded-full bg-gray-300 px-4 py-2 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Delete
          </button>
        </div>
        <p className="text-red-500 mt-4 text-center">{message}</p>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
            <h3 className="text-lg font-bold mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleDeleteUser}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)} // Close modal
                className="ml-4 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
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

export default User;
