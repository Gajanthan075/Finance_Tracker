import React, { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";

const DeleteUser = () => {
  const { userId, logout } = useContext(AuthContext);
  const [message, setMessage] = useState("");

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
      } else {
        setMessage(data.error || "Failed to delete user.");
      }
    } catch (error) {
      setMessage("Network error: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Delete Account</h1>
        <p className="text-red-500 mb-4 text-center">{message}</p>
        <button
          onClick={handleDeleteUser}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default DeleteUser;
