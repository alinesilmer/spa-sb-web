"use client"
import SimpleModal from "./SimpleModal"

const ServiceDetailsModal = ({ isOpen, onClose, service }) => {
  if (!service) return null

  return (
    <SimpleModal isOpen={isOpen} onClose={onClose} title="Detalles del Servicio">
      <div className="service-details">
        <div className="service-image">
          <img src={service.image || "/placeholder.svg?height=200&width=400"} alt={service.name} />
        </div>
        <div className="service-info">
          <h3>{service.name}</h3>

          <div className="service-meta">
            <div className="service-meta-item">
              <strong>Categoría:</strong> {service.category}
            </div>
            <div className="service-meta-item">
              <strong>Precio:</strong> ${service.price.toLocaleString()}
            </div>
            <div className="service-meta-item">
              <strong>Duración:</strong> {service.duration} minutos
            </div>
          </div>

          <div className="service-description">
            <h4>Descripción Corta</h4>
            <p>{service.shortDescription}</p>

            <h4>Descripción Completa</h4>
            <p>{service.description}</p>
          </div>

          {service.benefits && service.benefits.length > 0 && (
            <div className="service-benefits">
              <h4>Beneficios</h4>
              <ul>
                {service.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {service.includes && service.includes.length > 0 && (
            <div className="service-includes">
              <h4>Incluye</h4>
              <ul>
                {service.includes.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </SimpleModal>
  )
}

export default ServiceDetailsModal
