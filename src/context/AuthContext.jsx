import React, { createContext, useContext, useState } from 'react';
import {
  getToken,
  getCurrentUser,
  setAuthData,
  clearAuthData,
  authApi,
} from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getToken());
  const [user, setUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(false);

  const login = async ({ phone, password }) => {
    setLoading(true);
    try {
      const response = await authApi.login({ phone, password });
      // response: { success, message, data: LoginResponse, timestamp }
      const loginData = response.data;
      if (loginData && loginData.token) {
        const userObj = {
          userId: loginData.userId,
          username: loginData.username,
          fullName: loginData.fullName,
          phone: loginData.phone,
          email: loginData.email,
          role: loginData.role,
        };
        setAuthData(loginData.token, userObj);
        setToken(loginData.token);
        setUser(userObj);
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ username, password, fullName, email, phone }) => {
    setLoading(true);
    try {
      const response = await authApi.register({
        username,
        password,
        fullName,
        email,
        phone,
      });
      const regData = response.data;
      if (regData && regData.token) {
        const userObj = {
          userId: regData.userId,
          username: regData.username,
          fullName: regData.fullName,
          phone: regData.phone,
          email: regData.email,
          role: regData.role,
        };
        setAuthData(regData.token, userObj);
        setToken(regData.token);
        setUser(userObj);
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isMember: user?.role === 'Member',
    isCoach: user?.role === 'Coach',
    isManager: user?.role === 'Manager',
    isReceptionist: user?.role === 'Receptionist',
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
