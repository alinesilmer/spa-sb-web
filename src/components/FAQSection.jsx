import { useState } from "react";
import '../styles/faqsection.css';

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
      answer: "Sí, aceptamos todas las tarjetas de crédito principales, tarjetas de débito, transferencias bancarias y efectivo."
    }
  ];

  return (
    <div className="qa-list-container">
      <ul className="qa-list">
        {faqItems.map((item, index) => (
          <li key={index} className="qa-item-container">
            <button
              className="qa-item"
              onClick={() => toggleQuestion(index)}
              aria-expanded={activeIndex === index}
            >
              {item.question}
              <svg 
                className={`qa-icon ${activeIndex === index ? 'qa-icon-active' : ''}`}
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
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            <div className={`qa-answer ${activeIndex === index ? 'qa-answer-active' : ''}`}>
              <p>{item.answer}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FAQSection;
