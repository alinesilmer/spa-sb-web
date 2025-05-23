"use client"
import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  
  const login = async (email, password) => {
    try {
      const { token, user } = await loginUser (email, password);

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      setCurrentUser(user);
      setError(null);

      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al iniciar sesión';
      setError(message);
      return { success: false, error: message };
    }
  }

  const register = async (userData) => {
    try {      
      const response = await registerUser (userData);
      return { success: true, data: response.message, id: response.id };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al registrarse';
      setError(message);
      return { success: false, error: message };
    }
  }

  const logout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setCurrentUser(null);
    
    return { success: true }
  }

  const updateCurrentUser = (updatedUserData) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updatedUserData,
    }));
  };

  const value = {
    currentUser,
    setCurrentUser,
    updateCurrentUser,
    isLoggedIn: !!currentUser,
    isAdmin: currentUser?.userType === "admin",
    isProfessional: currentUser?.userType === "profesional",
    isClient: currentUser?.userType === "cliente",
    login,
    register,
    logout,
    error,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export default AuthContext
