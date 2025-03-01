import React, { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  // Function to log in the user and save their userId
  const login = (userid) => {
    setUserId(userid);
    localStorage.setItem("userId", userid);
  };

  // Function to log out the user
  const logout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
  };

  // Authenticated fetch utility
  const apiFetch = async (url, options = {}) => {
    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...defaultHeaders, ...options.headers },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Fetch Error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout, apiFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
