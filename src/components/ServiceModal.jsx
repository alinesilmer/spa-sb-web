"use client";
import { Link } from "react-router-dom";
import "../styles/service-modal.css";
import { useAuth } from "../contexts/AuthContext";

const ServiceModal = ({ service, onClose, isLoggedIn }) => {
  const { currentUser } = useAuth();

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal" onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="service-modal-content">
          <div className="service-modal-image">
            <img
              src={service.image || "/placeholder.svg?height=400&width=600"}
              alt={service.name}
              className="modal-image"
            />
          </div>
          <div className="service-modal-details">
            <h2 className="service-modal-title">{service.name}</h2>
            <div className="service-modal-info">
              <div className="service-modal-info-item">
                <span className="service-modal-info-label">Precio:</span>
                <span className="service-modal-info-value">${service.price.toLocaleString()}</span>
              </div>
              <div className="service-modal-info-item">
                <span className="service-modal-info-label">Duración:</span>
                <span className="service-modal-info-value">{service.duration} minutos</span>
              </div>
              <div className="service-modal-info-item">
                <span className="service-modal-info-label">Categoría:</span>
                <span className="service-modal-info-value">{service.category}</span>
              </div>
            </div>
            <div className="service-modal-description">
              <h3>Descripción</h3>
              <p>{service.description}</p>
            </div>
            {service.benefits && service.benefits.length > 0 && (
              <div className="service-modal-benefits">
                <h3>Beneficios</h3>
                <ul>
                  {service.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
            {service.includes && service.includes.length > 0 && (
              <div className="service-modal-includes">
                <h3>Incluye</h3>
                <ul>
                  {service.includes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="service-modal-actions">
              {isLoggedIn ? (
                <Link to={`/booking/${service.id}`} className="service-modal-book-button">
                  Reservar Ahora
                </Link>
              ) : (
                <>
                  <Link to="/login" className="service-modal-login-button">
                    Iniciar Sesión para Reservar
                  </Link>
                  <p className="service-modal-register-prompt">
                    ¿No tienes una cuenta?{" "}
                    <Link to="/register" className="service-modal-register-link">
                      Regístrate aquí
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
