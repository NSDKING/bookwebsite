import React, { useState } from 'react';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Carousel = ({ datas }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("");

  const nextSlide = () => {
    setAnimationClass("slide-out-left"); // Add slide-out animation
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % datas.length);
      setAnimationClass("slide-in-right"); // Add slide-in animation
    }, 300);
  };

  const prevSlide = () => {
    setAnimationClass("slide-out-right"); // Add slide-out animation
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + datas.length) % datas.length);
      setAnimationClass("slide-in-left"); // Add slide-in animation
    }, 300);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options).replace(',', '');
  };

  // Get current article data
  const currentArticle = datas[currentIndex] || {};

  return (
    <div className="carousel">
      <div className="carouselt-header">
        <h3>A la une</h3>
        <div className="carousel-buttons">
          <button className="carousel-button" onClick={prevSlide}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button className="carousel-button" onClick={nextSlide}>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>

      <div className={`carousel-content ${animationClass}`} onAnimationEnd={() => setAnimationClass("")}>
        <img
          src={currentArticle.image}
          alt={`Slide ${currentIndex}`}
          className="carousel-image"
          layout="responsive"
          width={500}
          height={300}
        />
        <h3 className="carousel-title">{currentArticle.title}</h3>
        <div className="text-area">
          <p className="carousel-author">{currentArticle.author}</p>
          <p className="carousel-date">{formatDate(currentArticle.date)}</p>
        </div>
        {/* Use Link component for proper navigation */}
        <Link to={`/article/${currentArticle.id}`} className="read-now-link">
          Lire maintenant
        </Link>
      </div>
    </div>
  );
};

export default Carousel;