import React, { createContext, useContext, useState, useEffect } from 'react';
import { setAuthToken, registerLogoutCallback } from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Login handler
  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    setAuthToken(newToken);
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  // Bind interceptor's logout callback to trigger local context cleanup
  useEffect(() => {
    registerLogoutCallback(logout);
  }, []);

  const value = {
    token,
    user,
    loading,
    setLoading,
    login,
    logout,
    isAuthenticated: !!token,
    role: user?.role || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
