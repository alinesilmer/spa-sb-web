import React, { useState } from 'react';
import '../styles/contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'El asunto es requerido';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'El mensaje es requerido';
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset submission status after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
    
    // In a real application, you would send the form data to your backend
    /*
    // Backend logic (to be implemented with Firebase)
    const sendContactForm = async (formData) => {
      try {
        const db = firebase.firestore();
        await db.collection('contactMessages').add({
          ...formData,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { success: true };
      } catch (error) {
        console.error('Error sending contact form:', error);
        return { success: false, error };
      }
    };
    */
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">Contacto</h1>
          <p className="contact-hero-subtitle">Estamos acá para responder tus consultas</p>
        </div>
      </div>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="contact-container">
          <div className="contact-form-container">
            <h2 className="contact-section-title">Envianos un mensaje</h2>
            <p className="contact-section-description">
              Completá el formulario y te responderemos a la brevedad
            </p>
            
            {isSubmitted ? (
              <div className="form-success-message">
                <div className="success-icon">✓</div>
                <h3>¡Mensaje enviado con éxito!</h3>
                <p>Gracias por contactarnos. Te responderemos lo más pronto posible.</p>
              </div>
            ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="first-row-form">
                <div className="form-group">
                  <label htmlFor="name">Nombre completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={formErrors.name ? 'error' : ''}
                  />
                  {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                  </div>
                  
                   <div className="form-group">
                  <label htmlFor="subject">Asunto *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={formErrors.subject ? 'error' : ''}
                  />
                  {formErrors.subject && <span className="error-message">{formErrors.subject}</span>}
                    </div>
                    </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={formErrors.email ? 'error' : ''}
                    />
                    {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Teléfono (opcional)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
            
                
                <div className="form-group">
                  <label htmlFor="message">Mensaje *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={formErrors.message ? 'error' : ''}
                  ></textarea>
                  {formErrors.message && <span className="error-message">{formErrors.message}</span>}
                </div>
                
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="contact-container">
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-info-icon">📍</div>
              <h3 className="contact-info-title">Ubicación</h3>
              <p className="contact-info-text">Av. Alberdi 200, Microcentro</p>
              <p className="contact-info-text">Resistencia, Chaco</p>
            </div>
            
            <div className="contact-info-card">
              <div className="contact-info-icon">🕒</div>
              <h3 className="contact-info-title">Horarios de Atención</h3>
              <p className="contact-info-text">Lunes a Viernes: 9:00 - 20:00</p>
              <p className="contact-info-text">Sábados: 10:00 - 18:00</p>
              <p className="contact-info-text">Domingos: 10:00 - 15:00</p>
            </div>
            
            <div className="contact-info-card">
              <div className="contact-info-icon">📱</div>
              <h3 className="contact-info-title">Contacto</h3>
              <p className="contact-info-text">
                <a href="https://wa.me/3624532536" className="contact-link">WhatsApp: +3624 532536</a>
              </p>
              <p className="contact-info-text">
                <a href="mailto:sentirsebienspa@gmail.com" className="contact-link">sentirsebienspa@gmail.com</a>
              </p>
            </div>
            
            <div className="contact-info-card">
              <div className="contact-info-icon">🌐</div>
              <h3 className="contact-info-title">Redes Sociales</h3>
              <div className="social-links">
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-container">
          <iframe
            className="contact-map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.448520159029!2d-58.99047808171555!3d-27.45529260609075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94450cf35e48d94b%3A0x4a61a571ef4d090f!2sAv.%20Alberdi%20200%2C%20H3500AWD%20Resistencia%2C%20Chaco!5e0!3m2!1ses!2sar!4v1743774267856!5m2!1ses!2sar" 
            allowFullScreen
            loading="lazy"
            title="Ubicación del Spa"
            aria-label="Mapa de ubicación del Spa"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Contact;
