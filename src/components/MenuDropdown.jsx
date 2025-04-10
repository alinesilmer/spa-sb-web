"use client"
import React, { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import ClientDashboard from "../pages/client/Dashboard"
import "../styles/menudropdown.css"

const MenuDropdown = ({ isMenuOpen, setIsMenuOpen }) => {
  const menuRef = useRef(null)
  const { currentUser, logout } = useAuth()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen, setIsMenuOpen])

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscKey)
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isMenuOpen, setIsMenuOpen])

  if (!isMenuOpen) return null

  return (
    <div className="menu-dropdown" ref={menuRef}>
      <div className="menu-header">
        <button className="close-menu" onClick={() => setIsMenuOpen(false)}>
          ×
        </button>
      </div>
      
      {currentUser ? (
        <div className="menu-section">
          <div className="profile-info">
            <img
              src={currentUser.profilePicture || "/default-profile.png"}
              alt="Perfil"
              className="profile-picture"
            />
            <h3 className="menu-title">Bienvenido, {currentUser.firstName}</h3>
          </div>
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="Dashboard" element={<ClientDashboard />} className="menu-link" onClick={() => setIsMenuOpen(false)}>
                Mi Perfil
              </Link>
            </li>
            <li className="menu-item">
              <button className="menu-link" onClick={() => { logout(); setIsMenuOpen(false) }}>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <div className="menu-section">
          <h3 className="menu-title">Cuenta</h3>
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/login" className="menu-link" onClick={() => setIsMenuOpen(false)}>
                Inicio de sesión
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/register" className="menu-link" onClick={() => setIsMenuOpen(false)}>
                Registro
              </Link>
            </li>
          </ul>
        </div>
      )}

      <div className="menu-section">
        <h3 className="menu-title">Categorías</h3>
        <ul className="menu-list">
          <li className="menu-item">
            <Link to="/" className="menu-link" onClick={() => setIsMenuOpen(false)}>
              Inicio
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/about-us" className="menu-link" onClick={() => setIsMenuOpen(false)}>
              Nosotros
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/services" className="menu-link" onClick={() => setIsMenuOpen(false)}>
              Servicios
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/contact" className="menu-link" onClick={() => setIsMenuOpen(false)}>
              Contacto
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default MenuDropdown
