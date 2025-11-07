import React from 'react';

function GameCard({ title, image, link }) {
  return (
    <div className="card-container">
      <a href={link} className="card">
        <div className="card-img">
          <img src={image} alt={title} />
        </div>
        <div className="card-title">{title}</div>
      </a>
    </div>
  );
}

export default GameCard;
