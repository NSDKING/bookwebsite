import React, { useState } from 'react';
import './article-page.css'; // Import the CSS file you'll create

const ArticlePage = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  
  const tabs = [
    { icon: '🏠', label: 'Home' },
    { icon: '🔍', label: 'Search' },
    { icon: '📚', label: 'Library' },
    { icon: '👤', label: 'Profile' }
  ];
  
  const relatedArticles = [
    {
      id: 1,
      title: 'Urban Farming: The Future of City Food Systems',
      author: 'Robert Johnson',
      date: 'March 8, 2025',
      image: '/api/placeholder/400/180'
    },
    {
      id: 2,
      title: 'Smart Cities: Technology Reshaping Urban Living',
      author: 'Sarah Williams',
      date: 'March 5, 2025',
      image: '/api/placeholder/400/180'
    }
  ];
  
  return (
    <div className="article-container">
      <div className="content-wrapper">
        <div className="header-title">
          Lalecturejecontribue
        </div>
        
        <article className="article">
          <div className="article-image-container">
            <img 
              src="/api/placeholder/800/250" 
              alt="Article featured image" 
              className="article-image"
            />
          </div>
          
          <div className="article-content">
            <h1 className="article-title">
              The Evolution of Sustainable Architecture in Urban Environments
            </h1>
            
            <div className="article-meta">
              <span className="article-author">By Jane Smith</span>
              <span className="article-date-separator">•</span>
              <span className="article-date">March 10, 2025</span>
            </div>
            
            <div className="article-body">
              <p className="article-paragraph">
                As cities continue to grow and expand, architects and urban planners are increasingly turning to sustainable design principles to create buildings that not only serve their inhabitants but also minimize environmental impact. This shift represents a fundamental change in how we think about the structures that define our urban landscapes.
              </p>
              
              <p className="article-paragraph">
                The concept of sustainable architecture isn't new, but recent technological advances have dramatically expanded what's possible. From living walls that improve air quality to advanced materials that reduce energy consumption, today's sustainable buildings are marvels of innovation.
              </p>
              
              <p className="article-paragraph">
                "We're seeing a renaissance in how buildings interact with their environment," explains Dr. Michael Chen, an urban planning expert at the University of California. "The best new structures aren't just passive containers—they actively contribute to healthier cities."
              </p>
              
              <p className="article-paragraph">
                One striking example is the Bosco Verticale in Milan, a pair of residential towers covered in more than 900 trees and over 2,000 plants. The vegetation provides natural cooling, filters air pollution, and creates habitat for urban wildlife. Similar projects are now underway in cities around the world.
              </p>
              
              <p className="article-paragraph">
                Beyond vegetation, many new buildings incorporate renewable energy generation through solar panels, wind turbines, or geothermal systems. These technologies, once considered experimental, are now standard features in forward-thinking architectural projects.
              </p>
              
              <p className="article-paragraph">
                The push for sustainability extends beyond individual buildings to entire neighborhoods. In Barcelona's Superblocks initiative, groups of residential blocks are being redesigned to prioritize pedestrians and cyclists over cars, with more green spaces and reduced pollution. The result is not just more sustainable—it's more livable.
              </p>
            </div>
            
            <button className="continue-reading-button">
              Continue Reading
            </button>
          </div>
        </article>
        
        <div className="related-articles">
          <h3 className="related-title">
            Related Articles
          </h3>
          
          <div className="related-articles-container">
            {relatedArticles.map(article => (
              <div 
                key={article.id} 
                className="article-card"
              >
                <img 
                  src={article.image} 
                  alt={`${article.title} thumbnail`} 
                  className="article-card-image"
                />
                <div className="article-card-content">
                  <div className="article-card-title">{article.title}</div>
                  <div className="article-card-meta">
                    <span>By {article.author}</span>
                    <span className="article-date-separator">•</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <nav className="bottom-nav">
        <div className="bottom-nav-container">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className="bottom-nav-button"
              onClick={() => setActiveTabIndex(index)}
            >
              <div className="bottom-nav-icon">{tab.icon}</div>
              <span className={`bottom-nav-label ${activeTabIndex === index ? "active" : ""}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default ArticlePage;