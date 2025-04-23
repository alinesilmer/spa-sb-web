import React, { useState, useEffect } from 'react';
import '../styles/reviews.css';


const avatars = [
  "https://randomuser.me/api/portraits/women/32.jpg",
  "https://randomuser.me/api/portraits/men/44.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/men/75.jpg",
  "https://randomuser.me/api/portraits/women/90.jpg"
];

const reviewsData = [
  {
    text: "Una experiencia increíble. El masaje de piedras calientes fue revitalizante y el personal extremadamente atento. Sin duda, el mejor spa que he visitado en años.",
    author: "María Fernández",
    rating: 5,
    avatar: avatars[0]
  },
  {
    text: "Ambiente tranquilo y relajante. Los tratamientos faciales son excepcionales y noté resultados inmediatos. Muy recomendable para quienes buscan un momento de paz.",
    author: "Carlos Mendoza",
    rating: 5,
    avatar: avatars[1]
  },
  {
    text: "Excelente servicio desde el momento en que entrás. El ritual de aromaterapia fue una experiencia transformadora. Volveré pronto para probar más tratamientos.",
    author: "Laura Gutiérrez",
    rating: 4,
    avatar: avatars[2]
  },
  {
    text: "Una experiencia maravillosa. Un oasis de tranquilidad en medio de la ciudad. El personal es profesional y los masajes son de primera calidad. Una experiencia que todos deberían darse.",
    author: "Javier Rodríguez",
    rating: 5,
    avatar: avatars[3]
  },
  {
    text: "Increíble atención al detalle. Desde las toallas calientes hasta las infusiones después del tratamiento. Todo está pensado para brindarte la máxima relajación.",
    author: "Ana Martínez",
    rating: 5,
    avatar: avatars[4]
  }
];

const Reviews = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleReviews, setVisibleReviews] = useState([]);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  useEffect(() => {
    let count = 3; 
    
    if (windowWidth < 768) {
      count = 1; 
    } else if (windowWidth < 1024) {
      count = 2; 
    }
    
    
    const visible = [];
    for (let i = 0; i < count; i++) {
      const index = (activeIndex + i) % reviewsData.length;
      visible.push(reviewsData[index]);
    }
    
    setVisibleReviews(visible);
  }, [activeIndex, windowWidth]);

  
  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % reviewsData.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + reviewsData.length) % reviewsData.length);
  };

  
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`review-star ${i < rating ? 'filled' : ''}`}>★</span>
    ));
  };

  return (
    <div className="reviews-section">
      <div className="reviews-container">
        <h2 className="reviews-title">Experiencias Reales</h2>
        
        <div className="reviews-navigation">
          <button 
            className="reviews-nav-button prev" 
            onClick={handlePrev}
            aria-label="Ver reseñas anteriores"
          >
            &#10094;
          </button>
          
          <div className="reviews-cards-container">
            {visibleReviews.map((review, index) => (
              <div 
                className="review-card" 
                key={index}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <p className="review-text">{review.text}</p>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
                <div className="review-author-container">
                  <img 
                    src={review.avatar || "/placeholder.svg"} 
                    alt={review.author} 
                    className="review-avatar" 
                  />
                  <p className="review-author">{review.author}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="reviews-nav-button next" 
            onClick={handleNext}
            aria-label="Ver más reseñas"
          >
            &#10095;
          </button>
        </div>
        
        <div className="reviews-dots">
          {reviewsData.map((_, index) => (
            <span 
              key={index} 
              className={`review-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
