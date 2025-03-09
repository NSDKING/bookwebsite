import React, { useState, useRef, useEffect } from 'react';
import './index.css';

const EditModal = ({ onClose, onSubmit, userId, article }) => {
  const Rub = ["Actualité", "Nouveauté", "Portrait", "Chronique", "Agenda"];
  const [title, setTitle] = useState('');
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
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);

  // Populate the modal with existing article data when it opens
  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setRubrique(article.rubrique);
      setCoverPreview(article.coverImagePreview || '');
      setCoverDescription(article.coverDescription || '');
      setParagraphs(article.paragraphs || []);
    }
  }, [article]);

  // Handle cover image upload
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle paragraph image upload
  const handleParagraphImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
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
      setError('Veuillez entrer un titre');
      return false;
    }
    
    if (!rubrique.trim()) {
      setError('Veuillez sélectionner une catégorie');
      return false;
    }
    
    for (let i = 0; i < paragraphs.length; i++) {
      if (!paragraphs[i].text.trim()) {
        setError(`Le paragraphe ${i + 1} ne peut pas être vide`);
        return false;
      }
    }
    
    if (!userId) {
      setError('L\'ID utilisateur est manquant. Veuillez vous reconnecter.');
      return false;
    }
    
    setError('');
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
      // Create form data for API submission
      const formData = new FormData();
      formData.append('title', title);
      formData.append('rubrique', rubrique);
      formData.append('userId', userId);
      
      if (coverImage) {
        formData.append('coverImage', coverImage);
        formData.append('coverDescription', coverDescription);
      }
      
      // Add paragraphs
      paragraphs.forEach((paragraph, index) => {
        formData.append(`paragraphs[${index}][text]`, paragraph.text);
        if (paragraph.image) {
          formData.append(`paragraphs[${index}][image]`, paragraph.image);
          formData.append(`paragraphs[${index}][imageDescription]`, paragraph.imageDescription || '');
        }
      });
      
      onSubmit(formData);
    } catch (error) {
      setError('Échec de la mise à jour de l\'article. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Modifier l'Article</h2>
          <button className="close-button" onClick={onClose} type="button" aria-label="Fermer">×</button>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
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
                onClick={() => document.getElementById('coverImage').click()}
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
                      onClick={() => document.getElementById(`paragraph-image-${index}`).click()}
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
            <button type="button" className="cancel-button" onClick={onClose}>
              Annuler
            </button>
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isSubmitting}
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