import React, { useState, useEffect, useRef } from 'react';
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
  const [isCarousel, setIsCarousel] = useState(false); // New state for carousel option
  
  const fileInputRef = useRef(null);
  const client = generateClient();

  useEffect(() => {
    console.log(userId)
  }, [userId]);

  // Function to compress image to a target size
  const compressImageToTargetSize = (base64String, targetSizeKB = 390) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64String;
      img.onload = () => {
        // Create a canvas to draw and compress the image
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Initial scaling - reduce dimensions for very large images
        const initialScaleFactor = Math.min(1, 1200 / Math.max(width, height));
        width = Math.floor(width * initialScaleFactor);
        height = Math.floor(height * initialScaleFactor);
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw the image on the canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Binary search to find optimal quality
        const compressWithQuality = (min, max, attempts = 8) => {
          // Base case - if we've tried enough or min/max are too close
          if (attempts <= 0 || (max - min) < 0.01) {
            // Use the min (lowest) quality to ensure we're under size limit
            return canvas.toDataURL('image/jpeg', min);
          }
          
          // Try the middle quality
          const mid = (min + max) / 2;
          const midResult = canvas.toDataURL('image/jpeg', mid);
          
          // Calculate the size in KB (base64 string length * 0.75 / 1024)
          const size = (midResult.length * 0.75) / 1024;
          
          console.log(`Attempt ${9-attempts}: Quality ${mid.toFixed(2)}, Size: ${size.toFixed(2)}KB`);
          
          if (size > targetSizeKB) {
            // Too big, try a lower quality
            return compressWithQuality(min, mid, attempts - 1);
          } else {
            // Good size, but try to improve quality if possible
            return compressWithQuality(mid, max, attempts - 1);
          }
        };
        
        // Try compression with binary search for optimal quality between 0.1 and 0.9
        let compressed = compressWithQuality(0.1, 0.9);
        let compressedSize = (compressed.length * 0.75) / 1024;

        // If we couldn't get it small enough with quality adjustment,
        // reduce dimensions and try again
        if (compressedSize > targetSizeKB) {
          console.log(`Still too large (${compressedSize.toFixed(2)}KB), reducing dimensions`);
          
          // Progressive dimension reduction
          const scaleDown = () => {
            // Reduce dimensions by 30%
            width = Math.floor(width * 0.7);
            height = Math.floor(height * 0.7);
            
            console.log(`Resizing to ${width}x${height}`);
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            // Try with highest quality first after resizing
            const resized = canvas.toDataURL('image/jpeg', 0.7);
            const newSize = (resized.length * 0.75) / 1024;
            
            if (newSize > targetSizeKB && width > 100 && height > 100) {
              // Still too big and not too small yet, keep reducing
              return scaleDown();
            }
            
            return resized;
          };
          
          compressed = scaleDown();
        }
        
        // Log final size
        const finalSize = (compressed.length * 0.75) / 1024;
        console.log(`Final image size: ${finalSize.toFixed(2)}KB`);
        
        resolve(compressed);
      };
    });
  };
  
  // Improved function to create an article with paragraphs and images using GraphQL mutations
  const createArticleWithContent = async () => {
    try {
        if (!client) {
            throw new Error('AWS client not properly initialized');
        }

        console.log(isCarousel);

        const articleInput = {
            titles: title,
            userID: userId,
            rubrique: rubrique.toLowerCase(),
        };

        const articleResult = await client.graphql({
            query: createArticles,
            variables: { input: articleInput }
        });

        if (!articleResult.data?.createArticles) {
            throw new Error('Failed to create article');
        }

        const articleId = articleResult.data.createArticles.id;
        console.log("articleId" + articleId);
        let paragraphIds = [];
        let uploadedImages = [];

        for (let i = 0; i < paragraphs.length; i++) {
            const paragraph = paragraphs[i];
            const paragraphInput = {
                text: paragraph.text,
                articlesID: articleId,
                order: i.toString(),
                title: i === 0 ? title : undefined
            };

            const paragraphResult = await client.graphql({
                query: createParagraphes,
                variables: { input: paragraphInput }
            });

            if (!paragraphResult.data?.createParagraphes) {
                throw new Error('Failed to create paragraph');
            }

            const paragraphId = paragraphResult.data.createParagraphes.id;
            paragraphIds.push(paragraphId);

            if (paragraph.image && paragraph.imagePreview) {
                try {
                    const compressedImage = await compressImageToTargetSize(paragraph.imagePreview);
                    const imageInput = {
                        link: compressedImage,
                        description: paragraph.imageDescription || '',
                        positions: "center",
                        articlesID: articleId,
                        paragraphesID: paragraphId
                    };

                    const imageResponse = await client.graphql({
                        query: createImages,
                        variables: { input: imageInput }
                    });

                    if (imageResponse.data?.createImages) {
                        uploadedImages.push(imageResponse.data.createImages);
                    }
                } catch (error) {
                    console.error(`Error processing image for paragraph ${i}:`, error);
                    setErrorMessage(`Erreur lors du traitement de l'image du paragraphe ${i + 1}`);
                }
            }
        }

        if (coverImage && coverPreview) {
            try {
                const compressedCoverImage = await compressImageToTargetSize(coverPreview);
                const coverImageInput = {
                    link: compressedCoverImage,
                    description: coverDescription || '',
                    positions: "cover",
                    articlesID: articleId,
                };

                const coverImageResponse = await client.graphql({
                    query: createImages,
                    variables: { input: coverImageInput }
                });

                if (coverImageResponse.data?.createImages) {
                    uploadedImages.push(coverImageResponse.data.createImages);
                }
            } catch (error) {
                console.error("Error processing cover image:", error);
                setErrorMessage("Erreur lors du traitement de l'image de couverture");
            }
        }

        console.log("Article, paragraphs, and images created successfully");

        const formattedArticle = {
            id: articleId,
            titles: title,
            rubrique: rubrique,
            caroussel: null,
            userID: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            Images: {
                items: uploadedImages.map(image => ({
                    id: image.id,
                    link: image.link,
                    description: image.description,
                    paragraphesID: image.paragraphesID || null,
                    positions: image.positions || "cover",
                    createdAt: new Date().toISOString()
                }))
            },
            Paragraphes: {
                items: paragraphs.map((paragraph, index) => ({
                    id: paragraphIds[index]  ,  
                    articlesID: articleId,
                    order: paragraph.order ? paragraph.order.toString() : index.toString(), // Ensure order is a string
                    text: paragraph.text,
                    title: paragraph.title,
                    Images: { 
                        items: uploadedImages.filter(img => img.paragraphesID === paragraphIds[index]) 
                    }
                }))
            }
            
            
        };

        return formattedArticle;
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
      console.log(userId);
      setErrorMessage('L\'ID utilisateur est manquant. Veuillez vous reconnecter.');
      return false;
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
      const articleData = await createArticleWithContent();
      
      // Notify parent component of successful submission
      onSubmit(articleData);
      
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
          
          {/* Carousel Option */}
          <div className="form-group checkbox-group">
            <label htmlFor="carousel" className="checkbox-label">
              <input
                type="checkbox"
                id="carousel"
                checked={isCarousel}
                onChange={(e) => setIsCarousel(e.target.checked)}
              />
              Ajouter au carousel de la page d'accueil
            </label>
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



