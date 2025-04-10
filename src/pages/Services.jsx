"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { services } from "../data/mockData" // Import from mockData.js
import ServiceCard from "../components/ServiceCard"
import ServiceModal from "../components/ServiceModal"
import CategoryIcons from "../components/CategoryIcons"
import "../styles/services.css"

const Services = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeCategory, setActiveCategory] = useState("todo")
  const [filteredServices, setFilteredServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoggedIn] = useState(false) // This would come from the auth context

  // Check if we need to highlight a specific service from search
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const highlightId = params.get("highlight")

    if (highlightId) {
      const serviceToHighlight = services.find((s) => s.id === highlightId)
      if (serviceToHighlight) {
        setSelectedService(serviceToHighlight)

        // Set the active category to match the highlighted service
        if (serviceToHighlight.category) {
          setActiveCategory(serviceToHighlight.category)
        }
      }
    }
  }, [location.search])

  useEffect(() => {
    // Filter services based on active category and search term
    let filtered = services
    if (activeCategory !== "todo") {
      filtered = filtered.filter((service) => service.category === activeCategory)
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    setFilteredServices(filtered)
  }, [activeCategory, searchTerm])

  const handleViewMore = (service) => {
    setSelectedService(service)
  }

  const handleBooking = (service) => {
    if (!isLoggedIn) {
      // Show login required modal
      document.getElementById("login-required-modal").classList.add("visible")
    } else {
      // Redirect to booking page
      navigate(`/booking/${service.id}`)
    }
  }

  const closeModal = () => {
    setSelectedService(null)

    // Remove the highlight parameter from URL if it exists
    const params = new URLSearchParams(location.search)
    if (params.has("highlight")) {
      params.delete("highlight")
      const newUrl = params.toString() ? `${location.pathname}?${params.toString()}` : location.pathname
      navigate(newUrl, { replace: true })
    }
  }

  const closeLoginRequiredModal = () => {
    document.getElementById("login-required-modal").classList.remove("visible")
  }

  return (
    <div className="services-page">
      {/* Hero Section */}
      <div className="services-hero">
        <div className="services-hero-content">
          <h1 className="services-hero-title">Nuestros Servicios</h1>
          <p className="services-hero-subtitle">Descubre nuestros tratamientos exclusivos para cuerpo y mente</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="services-filter-section">
        <div className="services-filter-content">
          <div className="services-section-header">
            <h2 className="services-section-title">Explorá Nuestros Servicios</h2>
            <p className="services-section-description">Seleccioná una categoría para ver los servicios disponibles</p>
          </div>

          <div className="services-search-container">
            <input
              type="search"
              placeholder="Buscar servicios..."
              className="services-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="services-search-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        <CategoryIcons activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      </div>

      {/* Services Grid */}
      <div className="services-grid-container">
        {filteredServices.length > 0 ? (
          <div className="services-grid">
            {filteredServices.map((service) => (
              <div className="service-grid-item" key={service.id}>
                <ServiceCard service={service} onViewMore={handleViewMore} onBooking={handleBooking} />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-services-message">
            <p>No hay servicios disponibles con los criterios seleccionados.</p>
            <button
              className="reset-filters-button"
              onClick={() => {
                setActiveCategory("todo")
                setSearchTerm("")
              }}
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {/* Service Detail Modal */}
      {selectedService && <ServiceModal service={selectedService} onClose={closeModal} isLoggedIn={isLoggedIn} />}

      {/* Login Required Modal */}
      <div id="login-required-modal" className="login-required-modal">
        <div className="login-required-content">
          <h3>Iniciar Sesión</h3>
          <p>Para reservar este servicio, por favor inicia sesión.</p>
          <div className="login-required-actions">
            <button
              className="login-required-login-btn"
              onClick={() => {
                closeLoginRequiredModal()
                navigate("/login")
              }}
            >
              Iniciar Sesión
            </button>
          </div>
          <button className="login-required-close-btn" onClick={closeLoginRequiredModal}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Services
