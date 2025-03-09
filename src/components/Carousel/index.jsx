import React, { useState } from 'react';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

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
    return new Date(dateString).toLocaleDateString('en-US', options).replace(',', '');
  };

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
          src={datas[currentIndex].image} 
          alt={`Slide ${currentIndex}`} 
          className="carousel-image" 
          layout="responsive"
          width={500}
          height={300}
        />
        <h3 className="carousel-title">{datas[currentIndex].title}</h3>
        <div className="text-area">
          <p className="carousel-author">{datas[currentIndex].author}</p>
          <p className="carousel-date">{formatDate(datas[currentIndex].date)}</p>
        </div>
        <a href="#">Lire maintenant</a>
      </div>
    </div>
  );
};

export default Carousel;
