"use client";
import React, { useEffect, useState } from 'react';
import './index.css'; // Reuse your existing dashboard styles
import Header from '../../components/adminHeader/index';
import { generateClient } from 'aws-amplify/api';
 
import { updateImages } from '../../graphql/mutations';
import CircularProgress from '@mui/material/CircularProgress';
import { list } from 'aws-amplify/storage';
import { listArticlesWithDetails } from '../page';

export default function EditCover() {
  const client = generateClient();
  const [carouselArticles, setCarouselArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchCarouselArticles();
  }, []);

  const fetchCarouselArticles = async () => {
    setLoading(true);
    try {
      const response = await client.graphql({
        query: listArticlesWithDetails
      });
      const articles = response.data.listArticles.items;
      const filtered = articles.filter(a => a.caroussel);
      setCarouselArticles(filtered);
    } catch (error) {
      console.error("Error fetching carousel articles:", error);
      showAlert("Erreur lors du chargement des articles", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleUpdateImage = async (articleId, imageId, newLink) => {
    if (!newLink || !imageId) return;
    try {
      await client.graphql({
        query: updateImages,
        variables: {
          input: {
            id: imageId,
            link: newLink
          }
        }
      });
      showAlert("Image mise à jour avec succès", "success");
      fetchCarouselArticles();
    } catch (error) {
      console.error("Error updating image:", error);
      showAlert("Erreur lors de la mise à jour de l'image", "error");
    }
  };

  return (
    <div className="main-container">
      <Header />

      <div className="content">
        <div className="search-container">
          <h2 style={{ margin: 0 }}>Modifier les images du carrousel</h2>
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
            {carouselArticles.map(article => {
              const mainImage = article.Images?.items?.[0];
              return (
                <div className="article-card" key={article.id}>
                  <div className="article-image-container">
                    <img
                      src={mainImage?.link || 'https://via.placeholder.com/300x200?text=Aucune+Image'}
                      alt="cover"
                      className="article-image"
                    />
                  </div>

                  <h3 className="article-title">{article.titles}</h3>
                  <p className="article-excerpt">
                    Vous pouvez changer le lien de l'image utilisée dans le carrousel.
                  </p>

                  <div className="article-footer">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Lien de l'image"
                      defaultValue={mainImage?.link}
                      onBlur={(e) =>
                        handleUpdateImage(article.id, mainImage?.id, e.target.value)
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
