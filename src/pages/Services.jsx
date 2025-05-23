"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate, useLocation } from "react-router-dom"
import ServiceCard from "../components/ServiceCard"
import ServiceModal from "../components/ServiceModal"
import CategoryIcons from "../components/CategoryIcons"
import Video from "../components/Video";
import ScrollArrow from "../assets/scrolldown-arrow.svg"
import videoBg from "../assets/service-video-bg.mp4";
import "../styles/services.css"
import { getActiveServices } from "../services/serviceService"

const Services = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [services, setServices] = useState([])
  const [activeCategory, setActiveCategory] = useState("todo")
  const [filteredServices, setFilteredServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await getActiveServices();
        setServices(result.length > 0 ? result : []);
      } catch (error) {
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchServices();
  }, []);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const highlightId = params.get("highlight")

    if (highlightId) {
      const serviceToHighlight = services.find((s) => s.id === highlightId)
      if (serviceToHighlight) {
        setSelectedService(serviceToHighlight)
        if (serviceToHighlight.category) {
          setActiveCategory(serviceToHighlight.category)
        }
      }
    }
  }, [location.search, services])

  useEffect(() => {
    if (services.length === 0) return;
  
    let filtered = [...services];

    if (activeCategory !== "todo") {
      filtered = filtered.filter((service) => service.category.toLowerCase() === activeCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredServices(filtered)
  }, [services, activeCategory, searchTerm])

  const handleViewMore = (service) => {
    setSelectedService(service)
  }

  const handleBooking = (service) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      navigate(`/booking/${service.id}`)
    }
  }

  const closeModal = () => {
    setSelectedService(null)

    const params = new URLSearchParams(location.search)
    if (params.has("highlight")) {
      params.delete("highlight")
      const newUrl = params.toString() ? `${location.pathname}?${params.toString()}` : location.pathname
      navigate(newUrl, { replace: true })
    }
  }

  return (
    <div className="services-page">
      <Video videoSrc={videoBg} height="h-screen">
        <div className="container">
          <div className="text-container">
            <h1 className="about-hero-title">Nuestros Servicios</h1>
            <p className="about-hero-subtitle">Descubrí nuestros tratamientos exclusivos para cuerpo y mente
          </p>
          </div>
          <h5 className="scroll-instruction">Deslizá hacia abajo</h5>
                            <img src={ScrollArrow} className="scroll-arrow"/>
        </div>
      </Video>

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
        {isLoading ? (
          <div className="loader-container">
            <div className="loader-spinner" />
            <p className="loader-text">Cargando servicios...</p>
          </div>
        ) : filteredServices.length > 0 ? (
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
                setActiveCategory("todo");
                setSearchTerm("");
              }}
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {/* Service Detail Modal */}
      {selectedService && <ServiceModal service={selectedService} onClose={closeModal} isLoggedIn={isLoggedIn} />}

      {showLoginModal && (
      <div className="login-required-modal visible">
        <div className="login-required-content">
          <h3>Iniciar Sesión</h3>
          <p>Para reservar este servicio, por favor iniciá sesión.</p>
          <div className="login-required-actions">
            <button
              className="login-required-login-btn"
              onClick={() => {
                setShowLoginModal(false);
                navigate("/login")
              }}
            >
              Iniciar Sesión
            </button>
          </div>
          <button 
            className="login-required-close-btn" 
            onClick={() => setShowLoginModal(false)}
            >  
              Cerrar
          </button>
        </div>
      </div>
      )}
    </div>
  );
}

export default Services
