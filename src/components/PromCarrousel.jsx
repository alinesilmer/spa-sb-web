import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/promcarrousel.css';
import Card from './Card';


const ArrowLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PromCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef(null);
   const navigate = useNavigate();
  
/*HAY QUE REEMPLAZAR LAS IMÁGENES CON ASSETS*/ 
  const services = [
    { 
      id: "PqnekT3S0RKIdaRowVvw", 
      title: "2x1 Masaje Relajante", 
      description: "Nuestro masaje exclusivo combina técnicas para aliviar la tensión y promover una relajación profunda.", 
      image: "https://imgs.search.brave.com/kdEeoMpDF6YbfN6S8sa02Fypvsxq2FeOCSqfcEvmWpY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTA2/MjA1MDI5NC9waG90/by9iZWF1dHkuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPXp0/OHVrTWJVZ09Db3NJ/S3NFRzV0bGdOY0JT/U2dpSFhjOTNuaXht/emdUS3M9"
    },
    { 
      id: "lswgswy3uiRBhtVdj1oy", 
      title: "15% OFF Tratamiento Facial", 
      description:"Rejuvenecé tu piel con nuestro tratamiento facial premium utilizando productos orgánicos adaptados a tu tipo de piel.", 
      image: "https://imgs.search.brave.com/puKZkUyXvObWJKQlyPj2D7jR_p9g2v39Bupb4muLiz0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vcGljanVt/Ym8uY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy9iZWF1dHktZGF5/LXdvbWFuLWdldHRp/bmctZmFjaWFsLXRy/ZWF0bWVudC1pbi1z/cGEtZnJlZS1pbWFn/ZS5qcGVnP3c9NjAw/JnF1YWxpdHk9ODA"
    },
    { 
      id: "FLxNOyCd7plSnvAq4U1s", 
      title: "3x2 Piedras Calientes", 
      description: "Experimentá el poder curativo de las piedras basálticas calientes para derretir el estrés y la tensión muscular.", 
     image: "https://imgs.search.brave.com/G6hdDr2P97BHsdk3b1MooTTY6TekP4ca8zC4heEk3oE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMuc3BhbG9waWEu/YXBwLzdlOWExN2Q0/LTExOWEtNTU3ZC1i/ZGZlLTA3NDE1OGJm/MzFjYS9zM2ZzLXB1/YmxpYy9yZmgtc3Bh/LXRyZWF0bWVudHMv/bWFzYWplX3BpZWRy/YXNfY2FsaWVudGVz/XzIwXzAuanBn"
    },
    { 
      id: "3tzDe9O0nlx3dxvuAxje", 
      title: "2x1 Sesión de Yoga + Aromaterapia", 
      description: "Sumergite en aceites esenciales que mejoran tu estado de ánimo y promueven el bienestar general.", 
   image: "https://imgs.search.brave.com/UKnI6woJ23Ej_hRQToC-Le-pJ-cxkXq_HZmbyXnEqTU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTMy/NTA5NTI4OS9waG90/by9zdGlsbC1saWZl/LWNsb3NldXAtb2Yt/YS10cmFucXVpbC1z/cGEtYXJyYW5nZW1l/bnQuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPXlyTlhJQUEx/bVNTenlwemJLTVRs/NDgwN25SRzRTOHJz/NVJzV2ItSjBNOVU9"
    },
    { 
      id: "fBAL8nHTHewNW9sKk5Mi", 
      title: "20% OFF Pack Luxury", 
      description: "Date un capricho con nuestra experiencia completa de spa que incluye masaje, facial y tratamientos corporales.",  
      image: "https://imgs.search.brave.com/qrOwxZYSAHpR-0ErS3lE2leE93b79ph9BhrZ54aqT-E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDg2/ODczMTg2L3Bob3Rv/L3doYXQtYS1wbGVh/c3VyZS5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9MnVrLW9s/Sk4zWEpVNEl0RDh2/VjgweGlpMUdRVWFw/NWdaNTJhX1B6TlZy/cz0"
    },
  ];

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + services.length) % services.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Function to get visible cards (current, prev, next)
  const getVisibleCards = () => {
    const result = [];
    const len = services.length;
    
    // Add previous card
    const prevIndex = (currentIndex - 1 + len) % len;
    result.push({ ...services[prevIndex], position: 'prev' });
    
    // Add current card
    result.push({ ...services[currentIndex], position: 'current' });
    
    // Add next card
    const nextIndex = (currentIndex + 1) % len;
    result.push({ ...services[nextIndex], position: 'next' });
    
    return result;
  };

  
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);

  const visibleCards = getVisibleCards();

  return (
    <div className="prom-carousel">
      <h2 className="carousel-title">Nuestras Promociones</h2>
      
      <div className="carousel-container">
        <button 
          className="arrow-button left-arrow" 
          onClick={goToPrev}
          aria-label="Previous service"
        >
          <ArrowLeft />
        </button>
        
       <div className="carousel-viewport" ref={carouselRef}>
          <div className={`carousel-track position-${currentIndex}`}>
            {visibleCards.map((service) => (
              <div 
                key={service.id} 
                className={`carousel-slide ${service.position}`}
                onClick={() => navigate(`/booking/${service.id}`)} 
                style={{ cursor: 'pointer' }} 
              >
                <Card 
                  title={service.title} 
                  description={service.description} 
                  isActive={service.position === 'current'}
                  image={service.image}
                />
              </div>
            ))}
          </div>
        </div>
        
        <button 
          className="arrow-button right-arrow" 
          onClick={goToNext}
          aria-label="Next service"
        >
          <ArrowRight />
        </button>
      </div>
      
      <div className="carousel-indicators">
        {services.map((_, index) => (
          <button 
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              setIsAnimating(true);
              setCurrentIndex(index);
              setTimeout(() => setIsAnimating(false), 500);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromCarousel;
