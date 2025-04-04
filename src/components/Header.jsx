import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Logo from "../assets/logo-sb.png";
import MenuIcon from "../assets/menu.svg";
import SearchIcon from "../assets/search.svg";
import '../styles/header.css';
import MenuDropdown from "./MenuDropdown"


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOpaque, setIsOpaque] = useState(false);
    
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) { 
        setIsOpaque(true);
      } else {
        setIsOpaque(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
    
  return (
    <header className={`header ${isOpaque ? 'opaque' : 'transparent'}`}>
      {isOpaque && (
              <>
                  <div class="nav-container">
          <div className="search-area">
            <div className={`search-input ${isSearchOpen ? 'visible' : 'hidden'}`}>
              <input
                type="text"
                placeholder="¿Qué estás buscando?"
                className="search-text-input"
                autoFocus={isSearchOpen}
              />
              <button onClick={toggleSearch} className="close-search" aria-label="Close Search">
                ×
              </button>
            </div>
            <button className={`search-button ${isSearchOpen ? 'hidden' : 'visible'}`} onClick={toggleSearch}>
              <img src={SearchIcon} alt="search-icon" className="icon" />
              <span>Buscar</span>
            </button>
                      </div>
                      </div>

                  <div class="nav-container">
          <ul className="nav-links">
            <li><Link to="/">Inicio</Link></li>
              <li><Link to="/about-us">Nosotros</Link></li>
              <li><Link to="/services">Servicios</Link></li>
              <li><img src={Logo} alt="Logo" className="logo" /></li>
            <li>Tratamientos</li>
            <li>Shop</li>
            <li>Contacto</li>
                      </ul>
                      </div>

                  <div class="nav-container">
         <div className="menu">
        <button className="menu-button" aria-label="Open Menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <img src={MenuIcon} alt="menu-icon" className="icon" />
        </button>
        <MenuDropdown isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
                          </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
