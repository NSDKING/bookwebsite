import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { updateArticles, updateParagraphes, updateImages, createImages } from '../../graphql/mutations';
import { generateClient } from 'aws-amplify/api';

const EditModal = ({ onClose, onSubmit, userId, article }) => {
  const Rub = ["Actualité", "Nouveauté", "Portrait", "Chronique", "Agenda"];
  const [title, setTitle] = useState('');
  const [rubrique, setRubrique] = useState('');
  const [caroussel, setCaroussel] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [coverDescription, setCoverDescription] = useState('');
  const [paragraphs, setParagraphs] = useState([{ 
    id: '',
    text: '', 
    image: null, 
    imagePreview: '',
    imageDescription: '',
    imageId: ''
  }]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [Back, setBack]=useState()
  
  const client = generateClient();

  // Populate the modal with existing article data when it opens
  useEffect(() => {
    if (article) {
      setTitle(article.titles || '');
      setRubrique(article.rubrique || '');
      setCaroussel(article.caroussel || false);
      
      // Find cover image if it exists
      const coverImg = article.Images?.items?.find(img => img.positions === "cover");
      console.log(coverImg)
      console.log(article.Images)
      if (coverImg) {
        setCoverPreview(coverImg.link || '');
        // Fix: Correctly set the cover description from the existing image
        setCoverDescription(coverImg.description || '');
      }
      
      // Format paragraphs with their images
      const formattedParagraphs = [];
      if (article.Paragraphes?.items?.length > 0) {
        // Sort paragraphs by order
        const sortedParagraphs = [...article.Paragraphes.items].sort((a, b) => 
          parseInt(a.order) - parseInt(b.order)
        );
        
        sortedParagraphs.forEach(paragraph => {
          const paragraphImage = paragraph.Images?.items?.[0]; // Get first image
          formattedParagraphs.push({
            id: paragraph.id,
            text: paragraph.text || '',
            image: null, // No file object for existing images
            imagePreview: paragraphImage?.link || '',
            // Fix: Correctly set the image description from the existing paragraph image
            imageDescription: paragraphImage?.description || '',
            imageId: paragraphImage?.id || ''
          });
        });
      }
      
      if (formattedParagraphs.length > 0) {
        setParagraphs(formattedParagraphs);
      }
    }
  }, [article]);

  // Monitor changes to form data
  useEffect(() => {
    if (article) {
      const coverImg = article.Images?.items?.find(img => img.positions === "cover");
      const originalCoverDesc = coverImg?.description || '';
      
      const hasFormChanges = 
        title !== article.titles ||
        rubrique !== article.rubrique ||
        caroussel !== article.caroussel ||
        coverImage !== null ||
        coverDescription !== originalCoverDesc ||
        paragraphs.some((p, i) => {
          const originalParagraph = article.Paragraphes?.items?.find(op => op.id === p.id) || {};
          const originalImage = originalParagraph.Images?.items?.[0] || {};
          return p.text !== originalParagraph.text || 
                p.image !== null || 
                p.imageDescription !== originalImage.description;
        });
      
      setHasChanges(hasFormChanges);
    }
  }, [title, rubrique, caroussel, coverImage, coverDescription, paragraphs, article]);

  // Function to compress image to target size (unchanged)
  const compressImageToTargetSize = (base64String, targetSizeKB = 390) => {
    return new Promise((resolve) => {
      // Create an image element to load the base64 string
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
          if (attempts <= 0 || (max - min) < 0.01) {
            return canvas.toDataURL('image/jpeg', min);
          }
          
          const mid = (min + max) / 2;
          const midResult = canvas.toDataURL('image/jpeg', mid);
          const size = (midResult.length * 0.75) / 1024;
          
          if (size > targetSizeKB) {
            return compressWithQuality(min, mid, attempts - 1);
          } else {
            return compressWithQuality(mid, max, attempts - 1);
          }
        };
        
        // Try compression with binary search for optimal quality between 0.1 and 0.9
        let compressed = compressWithQuality(0.1, 0.9);
        let compressedSize = (compressed.length * 0.75) / 1024;
        
        // If still too large, reduce dimensions and try again
        if (compressedSize > targetSizeKB) {
          const scaleDown = () => {
            width = Math.floor(width * 0.7);
            height = Math.floor(height * 0.7);
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            const resized = canvas.toDataURL('image/jpeg', 0.7);
            const newSize = (resized.length * 0.75) / 1024;
            
            if (newSize > targetSizeKB && width > 100 && height > 100) {
              return scaleDown();
            }
            
            return resized;
          };
          
          compressed = scaleDown();
        }
        
        resolve(compressed);
      };
    });
  };
  
  // Handle functions remain the same
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

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverPreview('');
    setCoverDescription('');
  };

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

  const removeParagraphImage = (index) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index].image = null;
    newParagraphs[index].imagePreview = '';
    newParagraphs[index].imageDescription = '';
    setParagraphs(newParagraphs);
  };

  const handleParagraphTextChange = (index, e) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index].text = e.target.value;
    setParagraphs(newParagraphs);
  };

  const handleParagraphImageDescriptionChange = (index, e) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index].imageDescription = e.target.value;
    setParagraphs(newParagraphs);
  };

  const addParagraph = () => {
    setParagraphs([...paragraphs, { 
      id: '',
      text: '', 
      image: null, 
      imagePreview: '',
      imageDescription: '',
      imageId: ''
    }]);
  };

  const removeParagraph = (index) => {
    if (paragraphs.length > 1) {
      const newParagraphs = [...paragraphs];
      newParagraphs.splice(index, 1);
      setParagraphs(newParagraphs);
    }
  };

  const handleCarouselChange = (e) => {
    setCaroussel(e.target.checked);
  };

  const handleCoverImageDescriptionChange = (e) => {
    setCoverDescription(e.target.value);
    console.log("image description changed here:"+e.target.value)
  };

  // Form validation (unchanged)
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
    
    setErrorMessage('');
    return true;
  };

  // Fixed: Update article with all content (images and paragraphs)

  const updateArticleWithContent = async () => {
    console.log('push in')
  
    try {
      // 1. Update the main article information
      const articleInput = {
        id: article.id,
        titles: title,
        rubrique: rubrique.toLowerCase(),
        caroussel: caroussel,
        userID: userId
      };
      
      const articleResult = await client.graphql({
        query: updateArticles,
        variables: {
          input: articleInput
        }
      });
      
      if (!articleResult.data?.updateArticles) {
        throw new Error('Failed to update article');
      }
      
      const updatedParagraphIds = [];
      const updatedImages = [];
      
      // 2. Update or create paragraphs
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        let paragraphId = paragraph.id;
        
        // If paragraph has an ID, update it. Otherwise create new paragraph
        if (paragraphId) {
          const paragraphInput = {
            id: paragraphId,
            text: paragraph.text,
            order: i.toString(),
            title: i === 0 ? title : undefined
          };
          
          const paragraphResult = await client.graphql({
            query: updateParagraphes,
            variables: {
              input: paragraphInput
            }
          });
          
          if (paragraphResult.data?.updateParagraphes) {
            updatedParagraphIds.push(paragraphResult.data.updateParagraphes.id);
          }
        } else {
          // Create new paragraph (similar to AddArticle logic)
          // Implement this based on your createParagraphes mutation
          console.log("Would create new paragraph:", {
            text: paragraph.text,
            articlesID: article.id,
            order: i.toString()
          });
          // If you implement creation, add the new ID to updatedParagraphIds
        }
        
        // Handle paragraph image
        if ((paragraph.image && paragraph.imagePreview) || paragraph.imageId) {
          // If there's a new image or an existing image to update
          if (paragraph.image && paragraph.imagePreview) {
            // Compress the image if there's a new image
            const compressedImage = await compressImageToTargetSize(paragraph.imagePreview);
            
            if (paragraph.imageId) {
              // Update existing image
              const imageInput = {
                id: paragraph.imageId,
                link: compressedImage,
                description: paragraph.imageDescription || ''
              };
              
              const imageResult = await client.graphql({
                query: updateImages,
                variables: {
                  input: imageInput
                }
              });
              
              if (imageResult.data?.updateImages) {
                updatedImages.push(imageResult.data.updateImages);
              }
            } else {
              // Create new image
              const imageInput = {
                link: compressedImage,
                description: paragraph.imageDescription || '',
                positions: "center",
                articlesID: article.id,
                paragraphesID: paragraphId || ""
              };
              
              const imageResult = await client.graphql({
                query: createImages,
                variables: {
                  input: imageInput
                }
              });
              
              if (imageResult.data?.createImages) {
                updatedImages.push(imageResult.data.createImages);
              }
            }
          } else if (paragraph.imageId) {
            // Only update the image description if no new image was uploaded
            const imageInput = {
              id: paragraph.imageId,
              description: paragraph.imageDescription || ''
            };
            
            const imageResult = await client.graphql({
              query: updateImages,
              variables: {
                input: imageInput
              }
            });
            
            if (imageResult.data?.updateImages) {
              updatedImages.push(imageResult.data.updateImages);
            }
          }
        }
      }
  
      // 3. Handle cover image
      let updatedCoverImage = null;
      const coverImageId = article.Images?.items?.find(img => img.positions === "cover")?.id;
      
      // Check if we need to update the cover image or just its description
      if (coverImage && coverPreview) {
        // New cover image was uploaded, compress and update/create
        const compressedCoverImage = await compressImageToTargetSize(coverPreview);
        
        if (coverImageId) {
          // Update existing cover image
          const coverImageInput = {
            id: coverImageId,
            link: compressedCoverImage,
            description: coverDescription || ''
          };
          
          const coverImageResult = await client.graphql({
            query: updateImages,
            variables: {
              input: coverImageInput
            }
          });
          
          if (coverImageResult.data?.updateImages) {
            updatedCoverImage = coverImageResult.data.updateImages;
            updatedImages.push(updatedCoverImage);
          }
        } else {
          // Create new cover image
          const coverImageInput = {
            link: compressedCoverImage,
            description: coverDescription || '',
            positions: "cover",
            articlesID: article.id,
          };
          
          const coverImageResult = await client.graphql({
            query: createImages,
            variables: {
              input: coverImageInput
            }
          });
          
          if (coverImageResult.data?.createImages) {
            updatedCoverImage = coverImageResult.data.createImages;
            updatedImages.push(updatedCoverImage);
          }
        }
      } else if (coverImageId && coverPreview) {
        // Only update the cover image description
        const coverImageInput = {
          id: coverImageId,
          description: coverDescription || ''
        };
        
        const coverImageResult = await client.graphql({
          query: updateImages,
          variables: {
            input: coverImageInput
          }
        });
        
        if (coverImageResult.data?.updateImages) {
          updatedCoverImage = coverImageResult.data.updateImages;
          updatedImages.push(updatedCoverImage);
        }
      }
      
      // Create a formatted article object to return, similar to the AddArticle component
      const formattedArticle = {
        id: article.id,
        titles: title,
        rubrique: rubrique,
        caroussel: caroussel,
        userID: userId,
        updatedAt: new Date().toISOString(),
        Images: {
          items: updatedImages.length > 0 ? updatedImages.map(image => ({
            id: image.id,
            link: image.link,
            description: image.description,
            paragraphesID: image.paragraphesID || null,
            positions: image.positions || null,
            updatedAt: new Date().toISOString()
          })) : article.Images?.items
        },
        Paragraphes: {
          items: paragraphs.map((paragraph, index) => {
            // Find the corresponding updated images for this paragraph
            const paragraphImages = updatedImages.filter(img => 
              img.paragraphesID === paragraph.id
            );
            
            return {
              id: paragraph.id || `temp-${index}`,
              articlesID: article.id,
              order: index.toString(),
              text: paragraph.text,
              title: index === 0 ? title : undefined,
              Images: {
                items: paragraphImages.length > 0 ? paragraphImages : 
                  paragraph.imagePreview && !paragraph.image ? [{
                    id: paragraph.imageId,
                    link: paragraph.imagePreview,
                    description: paragraph.imageDescription
                  }] : []
              }
            };
          })
        }
      };
      
      // Now return the formatted article
      return formattedArticle;
    } catch (error) {
      console.error("Error updating article content:", error);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      throw error;
    }
  };
  // Handle form submission (unchanged)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update article with all content changes and get the formatted article
      const formattedArticle = await updateArticleWithContent();
      
      // Notify parent component of successful update with the formatted article
      onSubmit(formattedArticle);
      
      // Close the modal
      onClose();
    } catch (error) {
      setErrorMessage('Échec de la mise à jour de l\'article. Veuillez réessayer.');
      console.error("Error updating article:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm before closing (unchanged)
  const handleCloseWithConfirm = () => {
    if (hasChanges) {
      if (window.confirm("Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir fermer?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Modifier l'Article</h2>
          <button className="close-button" onClick={handleCloseWithConfirm} type="button" aria-label="Fermer">×</button>
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
          
          {/* Carousel Checkbox */}
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="caroussel"
              checked={caroussel}
              onChange={handleCarouselChange}
            />
            <label htmlFor="caroussel">Afficher dans le carrousel</label>
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
                {coverImage ? coverImage.name : coverPreview ? 'Image existante' : 'Aucun fichier choisi'}
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
                    onChange={handleCoverImageDescriptionChange}
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
                      {paragraph.image ? paragraph.image.name : paragraph.imagePreview ? 'Image existante' : 'Aucun fichier choisi'}
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
            
            <button 
              type="button" 
              className="add-paragraph-button"
              onClick={addParagraph}
            >
              Ajouter un Paragraphe
            </button>
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={handleCloseWithConfirm}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isSubmitting || !hasChanges}
            >
              {isSubmitting ? 'Mise à jour...' : 'Mettre à Jour l\'Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;