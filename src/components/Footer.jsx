import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-section">
            <div className="footer-logo">Sentirse Bien</div>
            <p className="footer-description">
              Un oasis de calma diseñado para rejuvenecerte, con terapias que renuevan cuerpo y mente.
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon facebook" aria-label="Facebook">Facebook</a>
              <a href="#" className="social-icon twitter" aria-label="Twitter">Twitter</a>
              <a href="#" className="social-icon instagram" aria-label="Instagram">Instagram</a>
              
              {/* Alternative text-based version if you don't have Font Awesome */}
              {/* 
              <a href="#" className="social-icon-text">FB</a>
              <a href="#" className="social-icon-text">TW</a>
              <a href="#" className="social-icon-text">IG</a>
              */}
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Enlaces Rápidos</h3>
            <div className="footer-links">
              <a href="#" className="footer-link">Inicio</a>
              <a href="#" className="footer-link">Servicios</a>
              <a href="#" className="footer-link">Reservas</a>
              <a href="#" className="footer-link">Sobre Nosotros</a>
              <a href="#" className="footer-link">Contacto</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Contacto</h3>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>Av. Alberdi 200, Resistencia</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+3624 532536</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>sentirsebienspa@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">&copy; 2025 Sentirse Bien Spa. Todos los derechos reservados.</p>
          <div className="footer-bottom-links">
            <a href="#" className="footer-bottom-link">Términos y Condiciones</a>
            <a href="#" className="footer-bottom-link">Política de Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
