import React, { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";

const UpdateUser = () => {
  const { userId } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdateUser = async (event) => {
    event.preventDefault();

    if (!userId) {
      setMessage("No user is logged in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("User updated successfully!");
        // Optionally clear the form fields
        setPassword("");
        setEmail("");
      } else {
        setMessage(data.error || "Failed to update user.");
      }
    } catch (error) {
      setMessage("Network error: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Update Account</h1>
        <form onSubmit={handleUpdateUser}>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <input
            type="email"
            placeholder="Enter new email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Update Account
          </button>
        </form>
        <p className="text-red-500 mt-4 text-center">{message}</p>
      </div>
    </div>
  );
};

export default UpdateUser;
