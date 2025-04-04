import React from 'react';
import '../styles/card.css';

const Card = ({ title, description, isActive, image }) => {
  return (
    <div className={`card ${isActive ? "active" : ""}`}>
      <div className="card-inner">
        {image && <div className="card-image" style={{ backgroundImage: `url(${image})` }} />}
        <div className="card-content">
          <h2 className="card-title">{title}</h2>
          <p className="card-description">{description}</p>
                  {isActive && (
                      /*se puede poner un {description} en vez de reservar, o dejar como prom-card*/
            <button className="card-button">Reservar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
