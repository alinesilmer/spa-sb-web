"use client"
import React, { createContext, useState, useContext, useEffect } from "react"

// Create the authentication context
const AuthContext = createContext()

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext)
}

// Mock user data
const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    // Uncomment the next line to provide a custom picture or leave undefined for the default:
    // profilePicture: "/images/admin.png",
  },
  {
    id: "2",
    email: "pro@example.com",
    password: "pro123",
    firstName: "Professional",
    lastName: "User",
    role: "professional",
    specialties: ["Masajes", "Tratamientos Corporales"],
    // profilePicture: "/images/pro.png",
  },
  {
    id: "3",
    email: "user@example.com",
    password: "user123",
    firstName: "Regular",
    lastName: "User",
    role: "client",
    // profilePicture can be left undefined to use the default image.
  },
]

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Login function
  const login = (email, password) => {
    setError("")

    // Find user in mock data
    const user = mockUsers.find((user) => user.email === email && user.password === password)

    if (user) {
      // Create a user object without the password
      const userWithoutPassword = { ...user }
      delete userWithoutPassword.password
      
      // Set a default profile picture if none exists
      if (!userWithoutPassword.profilePicture) {
        userWithoutPassword.profilePicture = "/default-profile.png"
      }

      // Store in state and localStorage
      setCurrentUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return { success: true, user: userWithoutPassword }
    } else {
      setError("Email o contraseña incorrectos")
      return { success: false, error: "Email o contraseña incorrectos" }
    }
  }

  // Register function
  const register = (userData) => {
    setError("")

    // Check if email already exists
    if (mockUsers.some((user) => user.email === userData.email)) {
      setError("Este email ya está registrado")
      return { success: false, error: "Este email ya está registrado" }
    }

    // Create new user
    const newUser = {
      id: `${mockUsers.length + 1}`,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: "client",
    }

    // Add to mock users (in a real app, this would be saved to a database)
    mockUsers.push(newUser)

    // Create a user object without the password
    const userWithoutPassword = { ...newUser }
    delete userWithoutPassword.password

    // Set a default profile picture
    userWithoutPassword.profilePicture = "/default-profile.png"

    // Store in state and localStorage
    setCurrentUser(userWithoutPassword)
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))

    return { success: true, user: userWithoutPassword }
  }

  // Logout function
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
