import React, { useState, useContext } from "react";
import { AuthContext } from "../../../../../AuthContext";
import SupportList from "./SupportList";

const Supports = () => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open"); // Default status to 'open'
  const [message, setMessage] = useState("");

  const { userId } = useContext(AuthContext);

  const handleCreateTicket = async (event) => {
    event.preventDefault();
    console.log("Creating support ticket for user", userId);

    try {
      const response = await fetch(`http://localhost:5000/support/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          description,
          status,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Support ticket created successfully!");
        // Reset the form fields
        setSubject("");
        setDescription("");
        setStatus("open");
      } else {
        setMessage(data.error || "Failed to create support ticket");
      }
    } catch (error) {
      setMessage("Network error: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create Support Ticket
        </h1>
        <form onSubmit={handleCreateTicket}>
          <input
            type="text"
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="pending">Pending</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Create Support Ticket
          </button>
        </form>
        <p className="text-red-500 mt-4 text-center">{message}</p>
      </div>
      <div>
        <SupportList />
      </div>
    </div>
  );
};

export default Supports;
