import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom'; // Import if using React Router

export default function Card({ article }) {
  const { id, image, title, author, date, excerpt, type } = article;
  const navigate = useNavigate(); // Initialize navigation (requires React Router)

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    } catch (error) {
      return dateString; // Return the original string if parsing fails
    }
  };

  const handleCardClick = () => {
    // Navigate to article detail page
    navigate(`/article/${id}`);
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <div className="card-content">
        <div className="card-image">
          <img
            src={image}
            alt={title}
            className="card-img"
          />
          <div className="card-category">{type}</div>
        </div>
        
        <div className="card-text">
          <h3 className="card-title">{title}</h3>
          {excerpt && <p className="card-excerpt">{excerpt}</p>}
          
          <div className="card-meta">
            <p className="card-author">Par {author}</p>
            <p className="card-date">{formatDate(date)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}