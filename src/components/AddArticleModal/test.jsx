// In the updateArticleWithContent function, before the return statement
// Add the formattedArticle construction

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
  
  // Then update the handleSubmit function to use the formatted article
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