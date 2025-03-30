import React, { useEffect, useState } from 'react';
import './index.css';
import SearchBar from '../../components/SearchBar';
import Carousel from '../../components/Carousel';
import Card from '../../components/card';
import SubHeader from '../../components/SubHeader';
import BottomTab from '../../components/BottomTabs';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import CircularProgress from '@mui/material/CircularProgress';
 
const Home = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  
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
      console.log(fetchedArticles)
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

  // Handle search functionality
  useEffect(() => {
    if (searchTerm) {
      const results = articles.filter(article => 
        article.titles?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredArticles(results);
    } else {
      // If search is cleared, reapply category filter
      if (activeIndex === 0) {
        setFilteredArticles(articles);
      } else {
        const category = navItems[activeIndex].toLowerCase();
        const filtered = articles.filter(article => 
          article.rubrique.toLowerCase() === category
        );
        setFilteredArticles(filtered);
      }
    }
  }, [searchTerm, articles, activeIndex, navItems]);

  // Get carousel items (articles marked for carousel)
  const getCarouselItems = () => {
    return articles
      .filter(article => article.caroussel) // Only include articles marked for carousel
      .map(article => ({
        title: article.titles || "",
        image: getArticleImage(article),
        author: "JUNIOR HAUSSIN",
        date: article.createdAt || new Date().toISOString(),
        type: article.rubrique || "Actualité",
        id: article.id
      }));
  };

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

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <main>
      <h1 className="header-title">laLecturejecontribue</h1>
            
      {loading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : (
        <>
          {articles.length > 0 && (
            <Carousel datas={getCarouselItems()} />
          )}
          
          <SubHeader 
            items={navItems}
            activeIndex={activeIndex} 
            setActiveIndex={setActiveIndex}
          />
          
          <div className="card-container">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <Card 
                  key={article.id} 
                  article={{
                    id: article.id,
                    image: getArticleImage(article),
                    title: article.titles || "Sans titre",
                    author:  "JUNIOR HAUSSIN",
                    date: article.createdAt || new Date().toISOString(),
                    excerpt: getExcerpt(article),
                    type: article.rubrique || "Actualité"
                  }} 
                />
              ))
            ) : (
              <div className="no-articles">
                {searchTerm ? 'Aucun article ne correspond à votre recherche' : 'Aucun article disponible dans cette catégorie'}
              </div>
            )}
          </div>
        </>
      )}
      
      <BottomTab />
    </main>
  );
};

export default Home;


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