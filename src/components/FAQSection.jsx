import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import "../styles/faqsection.css"; 

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };


  const faqItems = [
    {
      question: "¿Cuáles son los horarios de atención?",
      answer: "Nuestro spa está abierto de lunes a viernes de 9:00 a 20:00, sábados de 10:00 a 18:00 y domingos de 10:00 a 15:00."
    },
    {
      question: "¿Qué servicios ofrecen?",
      answer: "Ofrecemos una amplia gama de servicios incluyendo masajes terapéuticos, tratamientos faciales, terapias corporales, baños de inmersión y paquetes especiales de spa."
    },
    {
      question: "¿Cómo puedo reservar un turno?",
      answer: "Puede reservar un turno a través de nuestra página web en la sección 'Reservas', llamando a nuestro número de atención o visitando nuestras instalaciones."
    },
    {
      question: "¿Tienen promociones especiales?",
      answer: "Sí, contamos con promociones mensuales y paquetes especiales para fechas importantes. También ofrecemos descuentos para miembros y clientes frecuentes."
    },
    {
      question: "¿Aceptan tarjetas de crédito?",
      answer: "No, actualmente sólo trabajamos con transferencias bancarias y efectivo."
    }
  ];

  return (
    <section className="faq-section">
      <div className="faq-container">
        {/* LEFT COLUMN: FAQ Title and Questions */}
        <div className="faq-left">
          <h1 className="faq-title">Preguntas Frecuentes</h1>
          <p className="faq-subtitle">
            Conocé las respuestas a las consultas más comunes.
            <br />
            ¡Estamos para ayudarte!
          </p>

          <ul className="faq-list">
            {faqItems.map((item, index) => (
              <li key={index} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleQuestion(index)}
                  aria-expanded={activeIndex === index}
                >
                  {item.question}
                  <svg
                    className={`faq-icon ${activeIndex === index ? "active" : ""}`}
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
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div className={`faq-answer ${activeIndex === index ? "open" : ""}`}>
                  <p>{item.answer}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT COLUMN: CTA to Contact Form */}
        <div className="faq-right">
          <h2 className="contact-title">¿Necesitás más ayuda?</h2>
          <p className="contact-description">
            Si tu duda no está en la lista o querés más detalles, ¡estaremos encantados de atenderte personalmente!
          </p>
          <Link to="/contact" className="contact-button">
            Ir al Formulario de Contacto
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;