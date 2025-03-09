import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import './index.css';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from 'aws-amplify';

// Define types for our data structures based on the schema
interface ParagraphData {
  text: string;
  image: File | null;
  imagePreview: string;
  imageDescription: string;
}

interface ArticleInput {
  Titles: string;
  images?: string;
  userID: string;
  rubrique: string;
  carrousel?: boolean;
}

interface ParagraphInput {
  text: string;
  title?: string;
  articlesID: string;
  order: number;
}

interface ImageInput {
  link: string;
  descriptions: string;
  positions: string;
  paragraphID: string;
}

interface ModalProps {
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  userId: string;
}

const Modal: React.FC<ModalProps> = ({ onClose, onSubmit, userId }) => {
  const [title, setTitle] = useState<string>('');
  const client = generateClient<Schema>();
  const Rub: string[] = ["Actualité", "Nouveauté", "Portrait", "Chronique", "Agenda"];
  const [rubrique, setRubrique] = useState<string>('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [coverDescription, setCoverDescription] = useState<string>('');
  const [paragraphs, setParagraphs] = useState<ParagraphData[]>([{ 
    text: '', 
    image: null, 
    imagePreview: '',
    imageDescription: '' 
  }]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Function to create an article with paragraphs and images
  const createArticleWithContent = async (): Promise<void> => {
    try {
      // Check if client is properly initialized
      if (!client) {
        throw new Error('AWS client not properly initialized');
      }

      // Add connection check
      try {
        // Test connection with a simple query
        await client.models.Articles.list({});
      } catch (connectionError) {
        console.error('Connection error:', connectionError);
        throw new Error('Unable to connect to AWS services. Please check your internet connection and AWS configuration.');
      }

      // 1. Create the Article first
      const articleInput = {
        Titles: title,
        userID: userId,
        rubrique: rubrique.toLowerCase(),
        carrousel: false
      };
      
      // If there's a cover image, we'll store the base64 string directly
      if (coverImage && coverPreview) {
        articleInput.images = coverPreview;
      }
      
      // Create the article
      const articleResult = await client.models.Articles.create(articleInput);
      
      if (!articleResult.data) {
        throw new Error('Failed to create article');
      }
      
      const articleId = articleResult.data.id;
      
      // 2. Create each paragraph and its images
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        
        // Create the paragraph
        const paragraphInput = {
          text: paragraph.text,
          articlesID: articleId,
          order: i,
          title: i === 0 ? title : undefined // Only set title for the first paragraph
        };
        
        const paragraphResult = await client.models.Paragraph.create(paragraphInput);
        
        if (!paragraphResult.data) {
          throw new Error('Failed to create paragraph');
        }
        
        const paragraphId = paragraphResult.data.id;
        
        // If this paragraph has an image, create the image record with the base64 string
        if (paragraph.image && paragraph.imagePreview) {
          const imageInput = {
            link: paragraph.imagePreview, // Store the base64 string directly
            descriptions: paragraph.imageDescription || '',
            positions: "center", // Default position
            paragraphID: paragraphId
          };
          
          await client.models.Images.create(imageInput);
        }
      }
      
      console.log("Article, paragraphs, and images created successfully");
      
    } catch (error) {
      console.error("Error creating article content:", error);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      throw error;
    }
  };

  // Handle cover image upload and convert to base64
  const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove cover image
  const removeCoverImage = (): void => {
    setCoverImage(null);
    setCoverPreview('');
    setCoverDescription('');
  };

  // Handle paragraph image upload and convert to base64
  const handleParagraphImageChange = (index: number, e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const newParagraphs = [...paragraphs];
      newParagraphs[index].image = file;
      
      const reader = new FileReader();
      reader.onloadend = () => {
        newParagraphs[index].imagePreview = reader.result as string;
        setParagraphs(newParagraphs);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove paragraph image
  const removeParagraphImage = (index: number): void => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index].image = null;
    newParagraphs[index].imagePreview = '';
    newParagraphs[index].imageDescription = '';
    setParagraphs(newParagraphs);
  };

  // Update paragraph text
  const handleParagraphTextChange = (index: number, e: ChangeEvent<HTMLTextAreaElement>): void => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index].text = e.target.value;
    setParagraphs(newParagraphs);
  };

  // Update paragraph image description
  const handleParagraphImageDescriptionChange = (index: number, e: ChangeEvent<HTMLInputElement>): void => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index].imageDescription = e.target.value;
    setParagraphs(newParagraphs);
  };

  // Add a new paragraph
  const addParagraph = (): void => {
    setParagraphs([...paragraphs, { 
      text: '', 
      image: null, 
      imagePreview: '',
      imageDescription: '' 
    }]);
  };

  // Remove a paragraph
  const removeParagraph = (index: number): void => {
    if (paragraphs.length > 1) {
      const newParagraphs = [...paragraphs];
      newParagraphs.splice(index, 1);
      setParagraphs(newParagraphs);
    }
  };

  // Form validation
  const validateForm = (): boolean => {
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
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    console.log("press")
    
    try {
      // Create form data for API submission
      console.log("press")
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
      
      // Create article in the database using the schema
      await createArticleWithContent();
      
      // Call the onSubmit prop with the form data
      onSubmit(formData);
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
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
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setRubrique(e.target.value)}
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
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCoverDescription(e.target.value)}
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
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleParagraphTextChange(index, e)}
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
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleParagraphImageChange(index, e)}
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
                          id={`paragraph-image-description-${index}`