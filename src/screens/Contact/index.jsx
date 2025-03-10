import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { generateClient } from '@aws-amplify/api'; // Import the client generation function
import BottomTab from '../../components/BottomTabs';
import './index.css'; // Import the CSS file

const createMessages = /* GraphQL */ `
  mutation CreateMessages(
    $input: CreateMessagesInput!
    $condition: ModelMessagesConditionInput
  ) {
    createMessages(input: $input, condition: $condition) {
      id
      mail
      nom
      note
      createdAt
      updatedAt
      __typename
    }
  }
`;

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Initialize client
  const client = generateClient(); 

  const onSubmit = async (data) => {
    try {
      const input = {
        mail: data.mail,
        nom: data.name,
        note: data.message,
      };

      // Use the client to perform the GraphQL mutation
      const newMessage = await client.graphql({
        query: createMessages,
        variables: { input },
      });

      // Show success message and reset form fields
      setSuccessMessage("Votre message a été envoyé avec succès !");
      setErrorMessage(null);
      reset(); // Reset form fields after successful submission

    } catch (err) {
      // Show error message in French
      setErrorMessage("Erreur lors de l'envoi du message : " + err.message);
      setSuccessMessage(null);
    }
  };

  return (
    <main>
      <div className="container">
        {/* Contact Information */}
        <section className="contact-info">
          <h2 className="section-title">Informations de contact</h2>
          <div className="contact-details">
            <p className="contact-label"><strong>Téléphone:</strong></p>
            <p className="contact-text">+237 679 678 406</p>
            <p className="contact-text">+237 697 682 375</p>
            
            <p className="contact-label"><strong>Emplacement:</strong></p>
            <p className="contact-text">Douala</p>

            <p className="contact-label"><strong>Email:</strong></p>
            <p className="contact-text">haussinj@yahoo.fr</p>
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-form">
          <h2 className="section-title">Envoyez-nous un message</h2>

          {/* Display success or error messages */}
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div>
              <label htmlFor="name" className="form-label">Nom</label>
              <input 
                type="text" 
                id="name" 
                {...register("name", { required: true })}
                className={`form-input ${errors.name ? 'input-error' : ''}`}
              />
              {errors.name && <p className="error-text">le Nom est requis</p>}
            </div>

            <div>
              <label htmlFor="mail" className="form-label">Email</label>
              <input 
                type="email" 
                id="mail" 
                {...register("mail", { required: true })}
                className={`form-input ${errors.mail ? 'input-error' : ''}`}
              />
              {errors.mail && <p className="error-text">l'e-mail est requis</p>}
            </div>

            <div>
              <label htmlFor="message" className="form-label">Votre Message</label>
              <textarea 
                id="message" 
                {...register("message", { required: true })}
                rows="4" 
                className={`form-textarea ${errors.message ? 'input-error' : ''}`}
              ></textarea>
              {errors.message && <p className="error-text">Le message est requis</p>}
            </div>

            <button 
              type="submit" 
              className="submit-button"
            >
              Envoyer 
            </button>
          </form>
        </section>
      </div>
      <BottomTab />
    </main>
  );
}
