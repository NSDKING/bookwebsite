import React, { useState, useEffect } from 'react';
import './index.css';
import SubHeader from '../../components/SubHeader';
import Card from '../../components/card';
import BottomTab from '../../components/BottomTabs';
import { generateClient } from 'aws-amplify/api';
import CircularProgress from '@mui/material/CircularProgress';
import { listArticlesWithDetails } from '../Home';
 
const Discovery = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navItems = ["Tous", "Actualité", "Nouveauté", "Portrait", "Chronique", "Agenda"];
  const client = generateClient();

  // Fetch articles from the backend
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await client.graphql({ 
        query: listArticlesWithDetails 
      });
      const fetchedArticles = response.data.listArticles.items;
      setArticles(fetchedArticles);
      setFilteredArticles(fetchedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Filter articles based on the active category
  useEffect(() => {
    if (activeIndex === 0) {
      // "Tous" category - show all articles
      setFilteredArticles(articles);
    } else {
      // Filter by the selected category
      const category = navItems[activeIndex].toLowerCase();
      const filtered = articles.filter(article => 
        article.rubrique.toLowerCase() === category
      );
      setFilteredArticles(filtered);
    }
  }, [activeIndex, articles, navItems]);

  // Helper function to get article image
  const getArticleImage = (article) => {
    if (article.Images?.items && article.Images.items.length > 0) {
      // Sort by positions if available
      const sortedImages = [...article.Images.items].sort((a, b) => {
        if (a.positions && b.positions) {
          return a.positions - b.positions;
        }
        return 0;
      });
      
      return sortedImages[0].link;
    }
    
    // Return a placeholder if no image is found
    return "https://via.placeholder.com/500x300?text=Aucune+Image";
  };

  // Get excerpt from paragraphs
  const getExcerpt = (article) => {
    if (article.Paragraphes?.items && article.Paragraphes.items.length > 0) {
      const sortedParagraphs = [...article.Paragraphes.items].sort((a, b) => a.order - b.order);
      return sortedParagraphs[0].text?.substring(0, 100) + "...";
    }
    return "Aucun contenu disponible...";
  };

  return (
    <main className='discovery-page'>
      <h1 className="header-title">laLecturejecontribue</h1>
      
      <SubHeader 
        items={navItems}
        activeIndex={activeIndex} 
        setActiveIndex={setActiveIndex}
      />
      
      {loading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : (
        <div className="discovery-content">
          {filteredArticles.length > 0 ? (
            <div className="card-container">
              {filteredArticles.map((article) => (
                <Card 
                  key={article.id} 
                  article={{
                    id: article.id,
                    image: getArticleImage(article),
                    title: article.titles || "Sans titre",
                    author: "Junior Houssin",
                    date: article.createdAt || new Date().toISOString(),
                    excerpt: getExcerpt(article),
                    type: article.rubrique || "Actualité"
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className="no-articles">
              {searchTerm ? 'Aucun article ne correspond à votre recherche' : 'Aucun article disponible dans cette catégorie'}
            </div>
          )}
        </div>
      )}
      
      <BottomTab />
    </main>
  );
};

export default Discovery;