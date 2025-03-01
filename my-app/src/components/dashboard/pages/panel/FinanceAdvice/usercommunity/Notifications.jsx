import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../../../AuthContext";

const Notifications = () => {
  const { apiFetch, userId } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await apiFetch(
          `http://localhost:5000/api/notifications/${userId}`
        );
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, [apiFetch, userId]);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map((notification) => (
        <div key={notification._id}>{notification.message}</div>
      ))}
    </div>
  );
};

export default Notifications;
