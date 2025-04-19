import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import Logo from "../assets/logo-sb.png"
import MenuIcon from "../assets/menu.svg"
import SearchIcon from "../assets/search.svg"
import "../styles/header.css"
import MenuDropdown from "./MenuDropdown"
import SearchResults from "./SearchResults"
import { globalSearch } from "../utils/searchUtils"
import { services } from "../data/mockData"
import { getSpecificUser } from '../services/userService'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [profUsers, setProfUsers] = useState([])
  const searchRef = useRef(null)
  const location = useLocation()

  
  const publicRoutes = ["/", "/about-us", "/services", "/contact"]
  const isPublicRoute = publicRoutes.includes(location.pathname)

  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const loadProfessionals = async () => {
      const userType = "profesional"
      const state = true
      const data = await getSpecificUser(userType, state)
      setProfUsers(data)
    }
    loadProfessionals()
  }, [])


  let headerClass = "header"
  if (isPublicRoute) {
    headerClass += isScrolled ? " opaque" : " hidden"
  } else {
    headerClass += " opaque"
  }


  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setTimeout(() => {
        document.querySelector(".search-text-input")?.focus()
      }, 100)
    } else {
      setSearchQuery("")
      setShowResults(false)
    }
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.trim().length > 2) {
      // Search across all content
      const results = globalSearch(query, { services, teamMembers: profUsers } )
      setSearchResults(results)
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  const handleResultClick = (result) => {
    setIsSearchOpen(false)
    setSearchQuery("")
    setShowResults(false)
    if (result.path.includes("highlight")) {
      // The navigation will be handled by the Link component
      // We'll just close the search
    }
  }

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className={headerClass}>
      <div className="search-area" ref={searchRef}>
        <div className={`search-input ${isSearchOpen ? "visible" : "hidden"}`}>
          <input
            type="text"
            placeholder="¿Qué estás buscando?"
            className="search-text-input"
            autoFocus={isSearchOpen}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button onClick={toggleSearch} className="close-search" aria-label="Close Search">
            ×
          </button>
          {showResults && (
            <SearchResults results={searchResults} onResultClick={handleResultClick} query={searchQuery} />
          )}
        </div>
        <button className={`search-button ${isSearchOpen ? "hidden" : "visible"}`} onClick={toggleSearch}>
          <img src={SearchIcon || "/placeholder.svg"} alt="search-icon" className="icon" />
          <span>Buscar</span>
        </button>
      </div>
      <div className="nav-container">
        <ul className="nav-links">
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/about-us">Nosotros</Link>
          </li>
          <li>
            <img src={Logo || "/placeholder.svg"} alt="Logo" className="logo" />
          </li>
          <li>
            <Link to="/services">Servicios</Link>
          </li>
          <li>
            <Link to="/contact">Contacto</Link>
          </li>
        </ul>
      </div>
      <div className="nav-container">
        <div className="menu">
          <button className="menu-button" aria-label="Open Menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <img src={MenuIcon || "/placeholder.svg"} alt="menu-icon" className="icon" />
          </button>
          <MenuDropdown isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </div>
      </div>
    </header>
  )
}

export default Header
