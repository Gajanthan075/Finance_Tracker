import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../../AuthContext";

const SupportList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/support/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch support tickets");
        }

        const data = await response.json();
        setTickets(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Support Tickets</h1>
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket._id} className="border-b py-4">
              <div>
                <strong>Subject:</strong> {ticket.subject}
              </div>
              <div>
                <strong>Description:</strong> {ticket.description}
              </div>
              <div>
                <strong>Status:</strong> {ticket.status}
              </div>
              <div>
                <strong>Created:</strong>{" "}
                {new Date(ticket.created).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SupportList;
