import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Check login on load
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const resData = await response.json();

      if (!resData.success) {
        throw new Error(resData.message || 'Authentication failed');
      }

      localStorage.setItem('token', resData.token);
      localStorage.setItem('user', JSON.stringify(resData.user));
      
      setToken(resData.token);
      setUser(resData.user);
      
      return resData;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const resData = await response.json();

      if (!resData.success) {
        throw new Error(resData.message || 'Registration failed');
      }

      localStorage.setItem('token', resData.token);
      localStorage.setItem('user', JSON.stringify(resData.user));
      
      setToken(resData.token);
      setUser(resData.user);
      
      return resData;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUserSettings = async (theme, customApiKey) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ theme, customApiKey })
      });

      const resData = await response.json();

      if (resData.success) {
        localStorage.setItem('user', JSON.stringify(resData.user));
        setUser(resData.user);
        return resData.user;
      }
      throw new Error(resData.message || 'Failed to update settings');
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const getAuthHeaders = (isMultipart = false) => {
    const headers = {};
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUserSettings, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
