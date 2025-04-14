"use client"
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from 'axios';
import API_BASE_URL from '../config/api';

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

/*const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    
  },
  {
    id: "2",
    email: "pro@example.com",
    password: "pro123",
    firstName: "Professional",
    lastName: "User",
    role: "professional",
    specialties: ["Masajes", "Tratamientos Corporales"],
    
  },
  {
    id: "3",
    email: "user@example.com",
    password: "user123",
    firstName: "Regular",
    lastName: "User",
    role: "client",
    
  },
]*/

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
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      //console.log('Respuesta del servidor:', response.data);

      const { user, token } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      setCurrentUser(user);
      setError(null);

      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.error || 'Error al iniciar sesión';
      setError(message);
      return { success: false, error: message };
    }

    /*const user = mockUsers.find((user) => user.email === email && user.password === password)

    if (user) {
    
      const userWithoutPassword = { ...user }
      delete userWithoutPassword.password
            
      setCurrentUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return { success: true, user: userWithoutPassword }
    } else {
      setError("Email o contraseña incorrectos")
      return { success: false, error: "Email o contraseña incorrectos" }
    }*/
  }

  
  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, userData);

      /*if (mockUsers.some((user) => user.email === userData.email)) {
        setError("Este email ya está registrado")
        return { success: false, error: "Este email ya está registrado" }
      }
      
      const newUser = {
        id: `${mockUsers.length + 1}`,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: "client",
      }
      
      mockUsers.push(newUser)
  
      const userWithoutPassword = { ...newUser }
      delete userWithoutPassword.password
  
      setCurrentUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
  
      return { success: true, user: userWithoutPassword }*/

      return { success: true, data: res.data.message, id: res.data.id };
    } catch (err) {
      const message = err.response?.data?.error || 'Error al registrarse';
      setError(message);
      return { success: false, error: message };
    }
  }

  
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("user")
    
    return { success: true }
  }

  const value = {
    currentUser,
    isLoggedIn: !!currentUser,
    isAdmin: currentUser?.role === "admin",
    isProfessional: currentUser?.role === "professional",
    isClient: currentUser?.role === "client",
    login,
    register,
    logout,
    error,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export default AuthContext
