const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // Create the formatted article object
        const formattedArticle = {
            id: "a5cc55be-275d-46de-ae9e-61f3c8ea64bf", // Replace with actual ID generation logic
            titles: formData.titles, // Assuming formData contains input values
            rubrique: formData.rubrique,
            caroussel: null,
            userID: "810930fe-10c1-7041-73d9-0d823d85ae95", // Replace with actual user ID
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            Images: {
                items: uploadedImages.map(image => ({
                    id: image.id || generateUUID(), // Ensure an ID is provided
                    link: image.link,
                    description: image.description,
                    paragraphesID: null,
                    positions: image.positions || "cover",
                    createdAt: new Date().toISOString()
                }))
            },
            Paragraphes: {
                items: paragraphs.map(paragraph => ({
                    id: paragraph.id || generateUUID(),
                    articlesID: "a5cc55be-275d-46de-ae9e-61f3c8ea64bf", // Associate with the article
                    order: paragraph.order.toString(),
                    text: paragraph.text,
                    title: paragraph.title,
                    Images: { items: [] }
                }))
            },
            __typename: "Articles"
        };

        // Call the onSubmit function and pass the formatted article
        onSubmit({ formattedArticle });

        // Optionally, close the modal or reset the form
        closeModal();
    } catch (error) {
        console.error("Error submitting form:", error);
    }
};
