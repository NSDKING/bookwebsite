"use client";
import React, { useEffect, useState } from 'react';
import "./index.css";
import Header from '../../components/adminHeader/index';
import Modal from '../../components/AddArticleModal/index';
import EditModal from '../../components/EditModal';

export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState('');

  // Fetch articles from the backend
  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      showAlert('Error loading articles', 'error');
    }
  };

  // Check user admin status
  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/user/status');
      const data = await response.json();
      setIsAdmin(data.isAdmin);
      setUserId(data.userId);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    checkAdminStatus();
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

  const filteredArticles = articles.filter(article => 
    article.Titles?.toLowerCase().includes(search.toLowerCase())
  );

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

        <div className="articles-grid">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <div className="article-card" key={article.id}>
                <h3 className="article-title">{article.Titles}</h3>
                <p className="article-excerpt">{article.Content?.substring(0, 100)}...</p>
                <div className="article-footer">
                  <span className="article-date">
                    {new Date(article.CreatedAt).toLocaleDateString()}
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
      </div>

      {isModalOpen && (
        <Modal 
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddArticle}
          userId={userId} // Pass userId to the Modal
        />
      )}

      {isEditModalOpen && currentArticle && (
        <EditModal 
          article={currentArticle}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditArticle}
          userId={userId} // Pass userId to the EditModal if needed
        />
      )}
    </div>
  );
} 