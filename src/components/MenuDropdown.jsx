import React, { useState, useEffect, useRef } from "react";
import "../styles/menudropdown.css";

const MenuDropdown = ({ isMenuOpen, setIsMenuOpen }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const menuRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscKey);
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  const toggleSubmenu = (submenu) => {
    setActiveSubmenu(activeSubmenu === submenu ? null : submenu);
  };

  if (!isMenuOpen) return null;

  return (
    <div className="menu-dropdown" ref={menuRef}>
      <div className="menu-header">
        <button className="close-menu" onClick={() => setIsMenuOpen(false)}>
          ×
        </button>
      </div>
      
      <div className="menu-section">
        <h3 className="menu-title">Cuenta</h3>
        <ul className="menu-list">
          <li className="menu-item">
            <a href="/login" className="menu-link">Inicio de sesión</a>
          </li>
          <li className="menu-item">
            <a href="/register" className="menu-link">Registro</a>
          </li>
        </ul>
      </div>
      
      <div className="menu-section">
        <h3 className="menu-title">Categorías</h3>
        <ul className="menu-list">
          <li className="menu-item">
            <a href="/" className="menu-link">Inicio</a>
          </li>
          <li className="menu-item">
            <a href="/about-us" className="menu-link">Nosotros</a>
          </li>
          <li className="menu-item">
            <a href="/services" className="menu-link">Servicios</a>
                  </li>
                  <li className="menu-item">
            <a href="/contact" className="menu-link">Tratamientos</a>
          </li>
          <li className="menu-item has-submenu">
            <button 
              className={`menu-link submenu-toggle ${activeSubmenu === 'shop' ? 'active' : ''}`}
              onClick={() => toggleSubmenu('shop')}
            >
              Shop
              <span className={`chevron ${activeSubmenu === 'shop' ? 'open' : ''}`}></span>
            </button>
            <ul className={`submenu ${activeSubmenu === 'shop' ? 'open' : ''}`}>
              <li className="submenu-item">
                <a href="/shop/clothing" className="submenu-link">Cosméticos</a>
              </li>
              <li className="submenu-item">
                <a href="/shop/accessories" className="submenu-link">Hogar</a>
              </li>
              <li className="submenu-item">
                <a href="/shop/promotions" className="submenu-link">Promociones</a>
              </li>
            </ul>
          </li>
          <li className="menu-item">
            <a href="/location" className="menu-link">Contacto</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MenuDropdown;