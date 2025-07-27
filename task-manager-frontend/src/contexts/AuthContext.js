// src/contexts/AuthContext.js
// Provides authentication state and functions (login, logout) to the entire application.
// Uses localStorage to persist the authentication token.

import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser } from '../api/api'; // Import API functions

// Create the AuthContext
const AuthContext = createContext(null);

// AuthProvider component to wrap the application and provide auth state
export const AuthProvider = ({ children }) => {
  // State to hold the authentication token and user information
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // Stores { id, username }
  const [loading, setLoading] = useState(true); // Loading state for initial auth check

  // Effect to run once on component mount to initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        // Attempt to parse user data from localStorage
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        // Clear invalid data if parsing fails
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false); // Authentication check complete
  }, []);

  // Function to handle user login
  const login = async (username, password) => {
    try {
      const data = await loginUser(username, password);
      const newToken = data.token;
      const newUser = data.data.user; // Assuming API returns { token, data: { user: { id, username } } }

      // Store token and user data in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      // Update state
      setToken(newToken);
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      // Return error message for UI display
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  // Function to handle user registration
  const register = async (username, password) => {
    try {
      const data = await registerUser(username, password);
      const newToken = data.token;
      const newUser = data.data.user;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  // Function to handle user logout
  const logout = () => {
    // Clear token and user data from state and localStorage
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Provide the auth state and functions through the context
  const authContextValue = {
    token,
    user,
    isAuthenticated: !!token, // Convenience boolean
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
