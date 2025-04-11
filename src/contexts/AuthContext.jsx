"use client"
import React, { createContext, useState, useContext, useEffect } from "react"

// Create the authentication context
const AuthContext = createContext()

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext)
}

// ================================
// Mock user data for demo purposes.
// In a real app, you would handle real data from a backend.
// ================================
const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    // Uncomment the next line for a custom picture or leave undefined to use default:
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

  // On app load, check for an existing session.
  // For a real backend, you might also retrieve a JWT or auth token
  // from localStorage and verify it with an API call.
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    // If using tokens, also check for a token:
    // const token = localStorage.getItem("token")
    // Optionally, validate the token by requesting a backend endpoint.
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Login function – in a real app, replace this with an API call.
  const login = (email, password) => {
    setError("")

    // ****************************
    // REAL BACKEND TIP:
    // Instead of searching through mockUsers, you would send a request like:
    //
    //   fetch('https://your-backend.com/api/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password })
    //   })
    //   .then(response => response.json())
    //   .then(data => {
    //     if(data.success){
    //       // data.user -> contains user data
    //       // data.token -> your JWT or auth token
    //     } else {
    //       // handle error message
    //     }
    //   })
    //
    // And then store both the user and the token.
    // ****************************

    // Find user in mock data (for demo purposes only)
    const user = mockUsers.find((user) => user.email === email && user.password === password)

    if (user) {
      // Create a user object without the password
      const userWithoutPassword = { ...user }
      delete userWithoutPassword.password
      
      // Set a default profile picture if none exists
      if (!userWithoutPassword.profilePicture) {
        userWithoutPassword.profilePicture = "/default-profile.png"
      }

      // REAL BACKEND: Here you would extract the token from your server's response.
      // For example: const token = data.token;
      //
      // Then store it in localStorage:
      // localStorage.setItem("token", token)

      // Store the user data in state and in localStorage
      setCurrentUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return { success: true, user: userWithoutPassword }
    } else {
      setError("Email o contraseña incorrectos")
      return { success: false, error: "Email o contraseña incorrectos" }
    }
  }

  // Register function – similar idea applies as in login.
  // In a real app, you would call an API to create a new user and obtain a token (if applicable).
  const register = (userData) => {
    setError("")

    // Check if the email already exists (mock check)
    if (mockUsers.some((user) => user.email === userData.email)) {
      setError("Este email ya está registrado")
      return { success: false, error: "Este email ya está registrado" }
    }

    // Create a new user object
    const newUser = {
      id: `${mockUsers.length + 1}`,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: "client",
    }

    // In a real app, send a POST request to your backend:
    // fetch('https://your-backend.com/api/register', { ... })
    // and then handle the response accordingly.
    mockUsers.push(newUser)

    // Remove the password before storing in client-side state
    const userWithoutPassword = { ...newUser }
    delete userWithoutPassword.password

    // Set a default profile picture
    userWithoutPassword.profilePicture = "/default-profile.png"

    // REAL BACKEND: If your registration API returns a token, store it:
    // localStorage.setItem("token", data.token)

    // Store the user in state and localStorage
    setCurrentUser(userWithoutPassword)
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))

    return { success: true, user: userWithoutPassword }
  }

  // Logout function – remember to remove the token too.
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("user")
    // REAL BACKEND: Also remove the token when logging out:
    // localStorage.removeItem("token")
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
