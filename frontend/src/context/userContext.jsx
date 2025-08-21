import React, { useEffect, useState, createContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (error) {
        // Only clear user data if it's a real auth error, not a network error
        if (error.response?.status === 401) {
          clearUserData();
        } else {
          // Try to get user from localStorage as fallback
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (parseError) {
              clearUserData();
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    if (userData.token) localStorage.setItem("accessToken", userData.token);
    // localStorage.setItem("user", JSON.stringify(userData)); // optional, only if needed
    setLoading(false);
  };

  const clearUserData = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    // localStorage.removeItem("user"); // remove if unused
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
};
