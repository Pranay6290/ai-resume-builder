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
        console.log('🔍 Fetching user profile with token:', accessToken);
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        console.log('✅ User profile fetched:', response.data);
        setUser(response.data);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
        console.error("Response status:", error.response?.status);
        console.error("Response data:", error.response?.data);

        // Only clear user data if it's a real auth error, not a network error
        if (error.response?.status === 401) {
          console.log('🔐 Token invalid, clearing user data');
          clearUserData();
        } else {
          console.log('⚠️ Network/server error, keeping user data');
          // Try to get user from localStorage as fallback
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
              console.log('📦 Using stored user data as fallback');
            } catch (parseError) {
              console.error('Error parsing stored user:', parseError);
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
