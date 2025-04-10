import React from 'react';
import { Link } from "react-router-dom"
import '../styles/footer.css';
import instagram from '../assets/icons8-instagram.svg';
import facebook from '../assets/icons8-facebook.svg';
import tiktok from '../assets/icons8-tiktok.svg';

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
            
              <a href="#" className="social-icon"><img src={ instagram } className="icons-img-footer" alt="Instagram" /></a>
              <a href="#" className="social-icon"><img src={ facebook } className="icons-img-footer" alt="Facebook" /></a>
              <a href="#" className="social-icon"><img src={ tiktok } className="icons-img-footer" alt="TikTok" /></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Enlaces Rápidos</h3>
            <div className="footer-links">
             <Link to="/">Inicio</Link>
               <Link to="/about-us">Nosotros</Link>
              <Link to="/services">Servicios</Link>
                <Link to="/contact">Contacto</Link>
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
