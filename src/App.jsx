"use client"

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { AuthProvider } from "./contexts/AuthContext"
import Header from "./components/Header"
import Home from "./pages/Home"
import Footer from "./components/Footer"
import AboutUs from "./pages/AboutUs"
import Services from "./pages/Services"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import Booking from "./pages/Booking"
import AdminDashboard from "./pages/admin/Dashboard"
import ProfessionalDashboard from "./pages/profesional/Dashboard"
import ClientDashboard from "./pages/cliente/Dashboard"
import ChatBot from "./components/ChatBot"

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <ChatBot />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking/:serviceId" element={<Booking />} />
        <Route path="/booking/cart" element={<Booking />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/profesional/dashboard" element={<ProfessionalDashboard />} />
        <Route path="/cliente/dashboard" element={<ClientDashboard />} />
      </Routes>
      <Footer />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
    </AuthProvider>
  )
}

export default App
