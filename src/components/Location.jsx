import "../styles/location.css"

const Location = () => {
  return (
    <div className="location-container">
      <div className="location-content">
        <div className="location-header">
          <h1 className="location-title">Nuestra Ubicación</h1>
          <p className="location-description">
            Estamos ubicados en el corazón de la ciudad, en un entorno tranquilo y accesible, cerca de todas las
            atracciones principales y con fácil acceso al transporte público.
          </p>
        </div>

        <div className="location-map-container">
          <iframe
            className="location-map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.448520159029!2d-58.99047808171555!3d-27.45529260609075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94450cf35e48d94b%3A0x4a61a571ef4d090f!2sAv.%20Alberdi%20200%2C%20H3500AWD%20Resistencia%2C%20Chaco!5e0!3m2!1ses!2sar!4v1743774267856!5m2!1ses!2sar" 
            allowFullScreen
            loading="lazy"
            title="Ubicación del Spa"
            aria-label="Mapa de ubicación del Spa"
          ></iframe>
        </div>

        <div className="location-details">
          <div className="location-info-card">
            <h3 className="info-card-title">
              <span className="info-card-icon">📍</span>
              Dirección
            </h3>
            <div className="address-details">
              <p>Av. Alberdi 200</p>
              <p>Microcentro</p>
              <p>Resistencia, Chaco</p>
              <p>Argentina</p>
            </div>
          </div>

          <div className="location-info-card">
            <h3 className="info-card-title">
              <span className="info-card-icon">📞</span>
              Contacto
            </h3>
                      <div className="contact-details">
             <a href="https://wa.me/123456789">WhatsApp: +3624 532536</a>
              <a href="mailto:info@sentirsebien.com">sentirsebienspa@gmail.com</a>
            </div>
          </div>

          <div className="location-info-card">
            <h3 className="info-card-title">
              <span className="info-card-icon">🕒</span>
              Horarios
            </h3>
            <div className="hours-details">
              <ul className="hours-list">
                <li className="hours-item">
                  <span className="day">Lunes - Viernes</span>
                  <span className="time">9:00 - 20:00</span>
                </li>
                <li className="hours-item">
                  <span className="day">Sábados</span>
                  <span className="time">10:00 - 18:00</span>
                </li>
                <li className="hours-item">
                  <span className="day">Domingos</span>
                  <span className="time">10:00 - 15:00</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  )
}

export default Location

