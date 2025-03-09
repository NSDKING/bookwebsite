import React from 'react';
import './index.css'; // Import CSS for styling

export default function Card({ article }) {
  const { image, title, author, date } = article;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options).replace(',', '');
  };

  return (
    <div className="card">
      <div className="card-content">
        <div className="card-text">
          <h3 className="card-title">{title}</h3>
          <p className="card-author">{author}</p>
          <p className="card-date">{formatDate(date)}</p>
        </div>
        <div className="card-image">
          <img 
            src={image} 
            alt={title} 
            layout="responsive" // Use responsive layout
            width={500} // Set a width (adjust as needed)
            height={300} // Set a height (adjust as needed)
          />
        </div>
      </div>
    </div>
  );
}
