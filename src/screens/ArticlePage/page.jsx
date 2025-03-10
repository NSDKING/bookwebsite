import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import CircularProgress from '@mui/material/CircularProgress';
import { useParams } from 'react-router-dom';  // Import useParams hook
import './index.css';
import BottomTab from '../../components/BottomTabs';

const ArticlePage = () => {
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get article ID from URL params instead of search params
  const { id: articleId } = useParams();
   
  const client = generateClient();

  // Fetch article details from Amplify
  const fetchArticleDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if article ID exists
      if (!articleId) {
        setError("Aucun identifiant d'article n'a été trouvé. Veuillez vérifier l'URL et réessayer.");
        setLoading(false);
        return;
      }
      
      // Fetch the single article with full details
      const response = await client.graphql({
        query: getArticleWithDetails,
        variables: { id: articleId }
      });
      
      const fetchedArticle = response.data.getArticles;
      
      // Check if article exists in database
      if (!fetchedArticle) {
        setError("L'article demandé n'existe pas ou a été supprimé.");
        setLoading(false);
        return;
      }
      
      setArticle(fetchedArticle);
      
      // Fetch related articles (same category/rubrique)
      if (fetchedArticle) {
        fetchRelatedArticles(fetchedArticle.rubrique);
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      setError("Une erreur s'est produite lors du chargement de l'article. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch related articles
  const fetchRelatedArticles = async (rubrique) => {
    try {
      const response = await client.graphql({
        query: listArticlesByRubrique,
        variables: { 
          filter: { 
            rubrique: { eq: rubrique }
          },
          limit: 2
        }
      });
      
      const fetchedArticles = response.data.listArticles.items;
      setRelatedArticles(fetchedArticles);
    } catch (error) {
      console.error("Error fetching related articles:", error);
    }
  };
  
  useEffect(() => {
    fetchArticleDetails();
  }, [articleId]); // Add articleId as dependency to refetch when it changes
  
  // Get article image helper function
  const getArticleImage = (article) => {
    if (article?.Images?.items && article.Images.items.length > 0) {
      // Sort by positions if available
      const sortedImages = [...article.Images.items].sort((a, b) => {
        if (a.positions && b.positions) {
          return a.positions - b.positions;
        }
        return 0;
      });
      
      return sortedImages[0];
    }
    
    // Return a placeholder if no image is found
    return { link: "/api/placeholder/800/250", description: "" };
  };
  
  // Get article content (paragraphs)
  const getArticleContent = () => {
    if (!article) {
      return (
        <div className="loading-content-container">
          <CircularProgress />
        </div>
      );
    }
    
    if (article?.Paragraphes?.items && article.Paragraphes.items.length > 0) {
      const sortedParagraphs = [...article.Paragraphes.items].sort((a, b) => a.order - b.order);
      
      return sortedParagraphs.map(paragraph => (
        <div key={paragraph.id} className="article-paragraph-container">
          <p className="article-paragraph">
            {paragraph.text}
          </p>
          
          {paragraph.Images?.items && paragraph.Images.items.length > 0 && (
            <div className="paragraph-image-container">
              <div className="image-wrapper">
                <img 
                  src={paragraph.Images.items[0].link} 
                  alt={paragraph.Images.items[0].description || "Image du paragraphe"} 
                  className="paragraph-image"
                />
              </div>
              
              {paragraph.Images.items[0].description && (
                <div className="image-description-wrapper">
                  <p className="image-description">
                    {paragraph.Images.items[0].description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ));
    }
    
    return (
      <div className="loading-content-container">
        <CircularProgress />
      </div>
    );
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "March 10, 2025";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Get author name (default to "Junior Hussain" if userID is not available)
  const getAuthorName = (userID) => {
    return "Junior Hussain";
  };
  
  // Render error message
  if (error) {
    return (
      <div className="page-container">
        <div className="content-container">
          <div className="site-header">
            Lalecturejecontribue
          </div>
          
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Erreur</h2>
            <p className="error-message">{error}</p>
            <button 
              className="error-button"
              onClick={() => window.location.href = '/'}
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
        
        <BottomTab/>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="page-container">
        <div className="content-container">
          <div className="site-header">
            Lalecturejecontribue
          </div>
          <div className="loading-container">
            <CircularProgress />
            <p className="loading-text">Chargement de l'article...</p>
          </div>
        </div>
        
        <BottomTab/>
      </div>
    );
  }
  
  // Render the related articles section
  const renderRelatedArticles = () => {
    if (relatedArticles.length === 0) {
      return (
        <div className="loading-related-container">
          <CircularProgress size={30} />
        </div>
      );
    }
    
    return (
      <div className="related-grid">
        {relatedArticles.map(relArticle => (
          <div 
            key={relArticle.id} 
            className="related-card"
            onClick={() => window.location.href = `/article/${relArticle.id}`}
          >
            <img 
              src={getArticleImage(relArticle).link} 
              alt={`${relArticle.titles} thumbnail`} 
              className="related-image"
            />
            <div className="related-content">
              <div className="related-title">{relArticle.titles}</div>
              <div className="related-meta">
                <span>Par {getAuthorName(relArticle.userID)}</span>
                <span className="article-separator">•</span>
                <span>{formatDate(relArticle.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const articleImage = article ? getArticleImage(article) : null;
  
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="site-header">
          Lalecturejecontribue
        </div>
        
        <article className="article-container">
          <div className="featured-image-container">
            {article ? (
              <div className="featured-image-wrapper">
                <div className="image-container">
                  <img 
                    src={articleImage.link} 
                    alt="Article featured image" 
                    className="featured-image"
                  />
                </div>
                
                {articleImage.description && (
                  <div className="featured-image-description-wrapper">
                    <p className="image-description">
                      {articleImage.description}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="loading-image-container">
                <CircularProgress />
              </div>
            )}
          </div>
          
          <div className="article-content">
            <h1 className="article-title">
              {article?.titles || (
                <div className="loading-title">
                  <CircularProgress size={20} />
                </div>
              )}
            </h1>
            
            <div className="article-meta">
              {article ? (
                <>
                  <span className="article-author">Par {getAuthorName(article.userID)}</span>
                  <span className="article-separator">•</span>
                  <span className="article-date">{formatDate(article?.createdAt)}</span>
                </>
              ) : (
                <div className="loading-meta">
                  <CircularProgress size={15} />
                </div>
              )}
            </div>
            
            <div className="article-text">
              {getArticleContent()}
            </div>
 
          </div>
        </article>
        
        <div className="related-articles-section">
          <h3 className="related-header">
            Articles liés
          </h3>
          
          {renderRelatedArticles()}
        </div>
      </div>
              
    <BottomTab/>
    </div>
  );
};

// GraphQL queries
const getArticleWithDetails = /* GraphQL */ `
  query GetArticleWithDetails($id: ID!) {
    getArticles(id: $id) {
      id
      titles
      rubrique
      caroussel
      userID
      createdAt
      updatedAt
      Images {
        items {
          id
          link
          paragraphesID
          positions
          description
        }
      }
      Paragraphes {
        items {
          id
          articlesID
          order
          text
          title
          Images {
            items {
              id
              link
              description
              paragraphesID
              positions
              createdAt
            }
          }
        }
      }
      __typename
    }
  }
`;

const listArticlesByRubrique = /* GraphQL */ `
  query ListArticlesByRubrique(
    $filter: ModelArticlesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listArticles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        titles
        rubrique
        userID
        createdAt
        Images {
          items {
            id
            link
            positions
            description
          }
        }
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export default ArticlePage;