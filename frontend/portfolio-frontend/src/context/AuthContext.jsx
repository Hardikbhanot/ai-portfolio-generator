import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Store user details

  // Helper to decode token safely
  const processToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      // Map claims to a user object. 
      // Note: 'sub' is standard for username/email. 'userId' is our custom claim.
      setUser({
        email: decoded.sub,
        id: decoded.userId,
        name: decoded.name
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Check for a token when the app first loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      processToken(token);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    processToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook for easy access to the context
export const useAuth = () => {
  return useContext(AuthContext);
};