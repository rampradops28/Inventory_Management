import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

// ✅ Create Context
const AuthContext = createContext();

// ✅ Helper functions for localStorage tokens
export const getAuthTokens = () => {
  const t = localStorage.getItem("tokens");
  return t ? JSON.parse(t) : null;
};

export const setAuthTokens = (tokens) => {
  const existing = getAuthTokens() || {};
  const updated = { ...existing, ...tokens };
  localStorage.setItem("tokens", JSON.stringify(updated));
};

export const clearAuthTokens = () => localStorage.removeItem("tokens");

// ✅ Provider
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load profile on mount if access token exists
  useEffect(() => {
    const tokens = getAuthTokens();
    if (tokens?.accessToken) fetchProfile();
    else setLoading(false);
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/api/profile");
      setUser(data.user);
    } catch (e) {
      console.error(e);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login
  const login = async (email, password) => {
    const { data } = await API.post("/api/login", { email, password });
    setAuthTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    setUser(data.user);
    navigate("/dashboard");
  };

  // ✅ Logout
  const logout = () => {
    clearAuthTokens();
    setUser(null);
    navigate("/login");
  };

  // ✅ Forgot Password
  const forgotPassword = async (email) => {
    return API.post("/api/forgot-password", { email });
  };

  // ✅ Reset Password
  const resetPassword = async (token, password) => {
    return API.post(`/api/reset-password/${token}`, { password });
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      forgotPassword,
      resetPassword,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook for easy access
export const useAuth = () => useContext(AuthContext);
