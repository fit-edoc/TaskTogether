"use client";

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Invalid user data");
      localStorage.removeItem("user");
    }

    setLoading(false);
  }, []);

  const login = (data) => {
    const safeUser = {
      _id: data.user._id,
      name: data.user.name,
      email: data.user.email
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(safeUser));

    setUser(safeUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};