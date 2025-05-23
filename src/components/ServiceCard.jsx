"use client";
import "../styles/service-card.css";

const ServiceCard = ({ service, onViewMore, onBooking }) => {
  return ( 
    <div className="service-card">
      <div className="service-card-image">
        <img
          src={service.image || "/placeholder.svg?height=300&width=400"}
          alt={service.name}
          className="responsive-image"
        />
      </div>

      <div className="service-card-content">
        <h3 className="service-card-title">{service.name}</h3>
        <p className="service-card-description">{service.shortDescription}</p>

        <div className="service-card-details">
          <span className="service-card-price">
            ${service.price.toLocaleString()}
          </span>
          <span className="service-card-duration">{service.duration} min</span>
        </div>

        <div className="service-card-actions">
          <button
            className="service-card-view-more"
            onClick={() => onViewMore(service)}
          >
            Ver Más
          </button>

          <button
            className="service-card-book-now"
            onClick={() => onBooking(service)}
          >
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
