"use client";
import React, { useEffect, useState } from 'react';
import "./index.css";
import Header from '../../components/adminHeader/index';
import Modal from '../../components/AddArticleModal/index';
import EditModal from '../../components/EditModal';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import CircularProgress from '@mui/material/CircularProgress';
 
export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const client = generateClient();
 
  // Fetch articles from the backend
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const listArticlesResponse = await client.graphql({ query: listArticlesWithDetails });
      setArticles(listArticlesResponse.data.listArticles.items);
      console.log(listArticlesResponse.data.listArticles.items);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserId = async () => {
    try {
      const { userId } = await getCurrentUser();
      setUserId(userId);
    } catch (error) {
      console.error("Error fetching user ID or admin status:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchUserId();
  }, []);

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleAddArticle = async (newArticle) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newArticle, userId }),
      });
      
      if (response.ok) {
        const addedArticle = await response.json();
        setArticles([...articles, addedArticle]);
        setIsModalOpen(false);
        showAlert('Article added successfully', 'success');
      } else {
        showAlert('Failed to add article', 'error');
      }
    } catch (error) {
      console.error('Error adding article:', error);
      showAlert('Error adding article', 'error');
    }
  };

  const handleEditArticle = async (updatedArticle) => {
    try {
      const response = await fetch(`/api/articles/${updatedArticle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...updatedArticle, userId }),
      });
      
      if (response.ok) {
        setArticles(articles.map(article => 
          article.id === updatedArticle.id ? updatedArticle : article
        ));
        setIsEditModalOpen(false);
        showAlert('Article updated successfully', 'success');
      } else {
        showAlert('Failed to update article', 'error');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      showAlert('Error updating article', 'error');
    }
  };
   
  const handleEditClick = (article) => {
    setCurrentArticle(article);
    setIsEditModalOpen(true);
  };

  const handleDeleteArticle = async (articleId) => {
    if (!isAdmin) {
      showAlert('Only administrators can delete articles', 'error');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setArticles(articles.filter(article => article.id !== articleId));
        showAlert('Article deleted successfully', 'success');
      } else {
        showAlert('Failed to delete article', 'error');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      showAlert('Error deleting article', 'error');
    }
  };

  // Fixed the property name to lowercase "titles" to match GraphQL schema
  const filteredArticles = articles.filter(article => 
    article.titles?.toLowerCase().includes(search.toLowerCase())
  );

  // Get the first paragraph text for excerpt
  const getExcerpt = (article) => {
    if (article.Paragraphes?.items && article.Paragraphes.items.length > 0) {
      const sortedParagraphs = [...article.Paragraphes.items].sort((a, b) => a.order - b.order);
      return sortedParagraphs[0].text?.substring(0, 100) + "...";
    }
    return "No content available...";
  };

  // Get the direct image from the article
  const getDirectImage = (article) => {
    // Get images directly attached to the article (not in paragraphs)
    if (article.Images?.items && article.Images.items.length > 0) {
      // Sort by positions if available
      const sortedImages = [...article.Images.items].sort((a, b) => {
        if (a.positions && b.positions) {
          return a.positions - b.positions;
        }
        return 0; // Keep original order if positions not available
      });
      
      return sortedImages[0].link;
    }
    
    // Return a placeholder if no direct image is found
    return "https://via.placeholder.com/300x200?text=No+Image";
  };

  return (
    <div className="main-container">
      <Header />
      <div className="content">
        <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search articles..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            className="add-button" 
            onClick={() => setIsModalOpen(true)}
          >
            Add New Article
          </button>
        </div>

        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <CircularProgress />
          </div>
        ) : (
          <div className="articles-grid">
            {filteredArticles.length > 0 ? (
              filteredArticles.map(article => (
                <div className="article-card" key={article.id}>
                  {/* Article Image - Using only direct images */}
                  <div className="article-image-container">
                    <img 
                      src={getDirectImage(article)} 
                      alt={article.titles || "Article image"} 
                      className="article-image"
                    />
                  </div>
                  
                  {/* Article Content */}
                  <h3 className="article-title">{article.titles}</h3>
                  <p className="article-excerpt">{getExcerpt(article)}</p>
                  
                  <div className="article-footer">
                    <span className="article-date">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                    <div className="article-actions">
                      <button 
                        className="edit-button" 
                        onClick={() => handleEditClick(article)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-button" 
                        onClick={() => handleDeleteArticle(article.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-articles">
                {search ? 'No articles match your search' : 'No articles available'}
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal 
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddArticle}
          userId={userId}
        />
      )}

      {isEditModalOpen && currentArticle && (
        <EditModal 
          article={currentArticle}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditArticle}
          userId={userId}
        />
      )}
    </div>
  );
}

export const listArticlesWithDetails = /* GraphQL */ `
  query ListArticlesWithDetails(
    $filter: ModelArticlesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listArticles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;