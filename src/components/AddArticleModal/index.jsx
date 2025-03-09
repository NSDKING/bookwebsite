import React, { useState, useRef } from 'react';
import './index.css';
import { createArticles, createParagraphes, createImages } from '../../graphql/mutations';
import { generateClient } from 'aws-amplify/api';

// Define the Modal component
const Modal = ({ onClose, onSubmit, userId }) => {
  const [title, setTitle] = useState('');
  const Rub = ["Actualité", "Nouveauté", "Portrait", "Chronique", "Agenda"];
  const [rubrique, setRubrique] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [coverDescription, setCoverDescription] = useState('');
  const [paragraphs, setParagraphs] = useState([{ 
    text: '', 
    image: null, 
    imagePreview: '',
    imageDescription: '' 
  }]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);
  const client = generateClient();

  
  // Improved function to create an article with paragraphs and images using GraphQL mutations
  const createArticleWithContent = async () => {
    try {
      // Check if client is properly initialized
      if (!client) {
        throw new Error('AWS client not properly initialized');
      }
 
      // 1. Create the Article first using GraphQL mutation
      const articleInput = {
        titles: title,
        userID: userId,
        rubrique: rubrique.toLowerCase(),
        caroussel: false,
        Images: []  // This will be handled separately
      };
      
      // Create the article
      const articleResult = await client.graphql({
        query: createArticles,
        variables: {
          input: articleInput
        }
      });
      
      if (!articleResult.data?.createArticles) {
        throw new Error('Failed to create article');
      }
      
      const articleId = articleResult.data.createArticles.id;
      
      // 2. Create each paragraph and its images
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        
        // Create the paragraph using GraphQL mutation
        const paragraphInput = {
          text: paragraph.text,
          articlesID: articleId,
          order: i.toString(),
          title: i === 0 ? title : undefined, // Only set title for the first paragraph
          Images: []  // This will be handled separately
        };
        
        const paragraphResult = await client.graphql({
          query: createParagraphes,
          variables: {
            input: paragraphInput
          }
        });
        
        if (!paragraphResult.data?.createParagraphes) {
          throw new Error('Failed to create paragraph');
        }
        
        const paragraphId = paragraphResult.data.createParagraphes.id;
        
        // If this paragraph has an image, create the image record with the base64 string
        if (paragraph.image && paragraph.imagePreview) {
          const imageInput = {
            link: paragraph.imagePreview, // Store the base64 string directly
            descriptions: paragraph.imageDescription || '',
            positions: "center", // Default position
            paragraphesID: paragraphId
          };
          
          await client.graphql({
            query: createImages,
            variables: {
              input: imageInput
            }
          });
        }
      }
      
      // 3. If there's a cover image, create it associated with the article
      if (coverImage && coverPreview) {
        const coverImageInput = {
          link: coverPreview,
          descriptions: coverDescription || '',
          positions: "cover", // Indicating this is a cover image
          articlesID: articleId
        };
        
        await client.graphql({
          query: createImages,
          variables: {
            input: coverImageInput
          }
        });
      }
      
      console.log("Article, paragraphs, and images created successfully");
      return articleId;
      
    } catch (error) {
      console.error("Error creating article content:", error);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      throw error;
    }
  };

  // Handle cover image upload and convert to base64
  const handleCoverImageChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove cover image
  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverPreview('');
    setCoverDescription('');
  };

  // Handle paragraph image upload and convert to base64
  const handleParagraphImageChange = (index, e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const newParagraphs = [...paragraphs];
      newParagraphs[index].image = file;
      
      const reader = new FileReader();
      reader.onloadend = () => {
        newParagraphs[index].imagePreview = reader.result;
        setParagraphs(newParagraphs);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove paragraph image
  const removeParagraphImage = (index) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index].image = null;
    newParagraphs[index].imagePreview = '';
    newParagraphs[index].imageDescription = '';
    setParagraphs(newParagraphs);
  };

  // Update paragraph text
  const handleParagraphTextChange = (index, e) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index].text = e.target.value;
    setParagraphs(newParagraphs);
  };

  // Update paragraph image description
  const handleParagraphImageDescriptionChange = (index, e) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index].imageDescription = e.target.value;
    setParagraphs(newParagraphs);
  };

  // Add a new paragraph
  const addParagraph = () => {
    setParagraphs([...paragraphs, { 
      text: '', 
      image: null, 
      imagePreview: '',
      imageDescription: '' 
    }]);
  };

  // Remove a paragraph
  const removeParagraph = (index) => {
    if (paragraphs.length > 1) {
      const newParagraphs = [...paragraphs];
      newParagraphs.splice(index, 1);
      setParagraphs(newParagraphs);
    }
  };

  // Form validation
  const validateForm = () => {
    if (!title.trim()) {
      setErrorMessage('Veuillez entrer un titre');
      return false;
    }
    
    if (!rubrique.trim()) {
      setErrorMessage('Veuillez sélectionner une catégorie');
      return false;
    }
    
    for (let i = 0; i < paragraphs.length; i++) {
      if (!paragraphs[i].text.trim()) {
        setErrorMessage(`Le paragraphe ${i + 1} ne peut pas être vide`);
        return false;
      }
    }
    
    if (!userId) {
      setErrorMessage('L\'ID utilisateur est manquant. Veuillez vous reconnecter.');
      return false;
    }
    
    // Check image sizes - base64 strings can be large
    if (coverPreview && coverPreview.length > 5000000) { // ~5MB limit
      setErrorMessage('L\'image de couverture est trop volumineuse. Veuillez utiliser une image plus petite.');
      return false;
    }
    
    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].imagePreview && paragraphs[i].imagePreview.length > 5000000) {
        setErrorMessage(`L'image du paragraphe ${i + 1} est trop volumineuse. Veuillez utiliser une image plus petite.`);
        return false;
      }
    }
    
    setErrorMessage('');
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create article in the database using GraphQL mutations
      const articleId = await createArticleWithContent();
      
      // Notify parent component of successful submission
      onSubmit({ 
        id: articleId,
        title, 
        rubrique,
        coverImage: coverPreview ? true : false
      });
      
      // Close the modal
      onClose();
    } catch (error) {
      setErrorMessage('Échec de la création de l\'article. Veuillez réessayer.');
      console.error('Error creating article:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Créer un Nouvel Article</h2>
          <button className="close-button" onClick={onClose} type="button" aria-label="Fermer">×</button>
        </div>
        
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Titre *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Entrez le titre de l'article"
            />
          </div>
          
          {/* Category/Rubrique Selection */}
          <div className="form-group">
            <label htmlFor="rubrique">Catégorie *</label>
            <select
              id="rubrique"
              value={rubrique}
              onChange={(e) => setRubrique(e.target.value)}
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              {Rub.map((item, index) => (
                <option key={index} value={item.toLowerCase()}>{item}</option>
              ))}
            </select>
          </div>
          
          {/* Cover Image */}
          <div className="form-group">
            <label htmlFor="coverImage">Image de Couverture</label>
            <div className="image-upload-container">
              <input
                type="file"
                id="coverImage"
                onChange={handleCoverImageChange}
                accept="image/*"
                className="file-input"
              />
              <button 
                type="button" 
                className="file-input-button"
                onClick={() => document.getElementById('coverImage')?.click()}
              >
                Choisir une Image
              </button>
              <span className="file-name">
                {coverImage ? coverImage.name : 'Aucun fichier choisi'}
              </span>
            </div>
            
            {coverPreview && (
              <div className="image-preview-wrapper">
                <div className="image-preview-container">
                  <img src={coverPreview} alt="Aperçu de la couverture" className="image-preview" />
                  <button 
                    type="button" 
                    className="remove-image-button"
                    onClick={removeCoverImage}
                    aria-label="Remove cover image"
                  >
                    ×
                  </button>
                </div>
                
                <div className="image-description-container">
                  <label htmlFor="coverDescription">Description/Légende de l'Image</label>
                  <input
                    type="text"
                    id="coverDescription"
                    value={coverDescription}
                    onChange={(e) => setCoverDescription(e.target.value)}
                    placeholder="Ajoutez une description ou légende pour cette image"
                    className="image-description-input"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Paragraphs Section */}
          <div className="paragraphs-section">
            <h3>Contenu de l'Article</h3>
            
            {paragraphs.map((paragraph, index) => (
              <div key={index} className="paragraph-container">
                <div className="paragraph-header">
                  <h4>Paragraphe {index + 1}</h4>
                  {paragraphs.length > 1 && (
                    <button 
                      type="button" 
                      className="remove-paragraph-button"
                      onClick={() => removeParagraph(index)}
                    >
                      Supprimer
                    </button>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor={`paragraph-${index}`}>Texte du Paragraphe *</label>
                  <textarea
                    id={`paragraph-${index}`}
                    value={paragraph.text}
                    onChange={(e) => handleParagraphTextChange(index, e)}
                    rows={4}
                    required
                    placeholder="Entrez le contenu du paragraphe"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`paragraph-image-${index}`}>Image du Paragraphe</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      id={`paragraph-image-${index}`}
                      onChange={(e) => handleParagraphImageChange(index, e)}
                      accept="image/*"
                      className="file-input"
                    />
                    <button 
                      type="button" 
                      className="file-input-button"
                      onClick={() => document.getElementById(`paragraph-image-${index}`)?.click()}
                    >
                      Choisir une Image
                    </button>
                    <span className="file-name">
                      {paragraph.image ? paragraph.image.name : 'Aucun fichier choisi'}
                    </span>
                  </div>
                  
                  {paragraph.imagePreview && (
                    <div className="image-preview-wrapper">
                      <div className="image-preview-container">
                        <img src={paragraph.imagePreview} alt={`Aperçu du paragraphe ${index + 1}`} className="image-preview" />
                        <button 
                          type="button" 
                          className="remove-image-button"
                          onClick={() => removeParagraphImage(index)}
                          aria-label={`Remove paragraph ${index + 1} image`}
                        >
                          ×
                        </button>
                      </div>
                      
                      <div className="image-description-container">
                        <label htmlFor={`paragraph-image-description-${index}`}>Description/Légende de l'Image</label>
                        <input
                          type="text"
                          id={`paragraph-image-description-${index}`}
                          value={paragraph.imageDescription}
                          onChange={(e) => handleParagraphImageDescriptionChange(index, e)}
                          placeholder="Ajoutez une description ou légende pour cette image"
                          className="image-description-input"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <button type="button" className="add-paragraph-button" onClick={addParagraph}>
              Ajouter un Paragraphe
            </button>
          </div>
          
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Envoi...' : 'Créer l\'Article'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;