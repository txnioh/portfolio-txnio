import React, { useState } from 'react';
import styled from 'styled-components';

const ContactContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: rgba(30, 30, 30, 0.5);
  backdrop-filter: blur(10px);
  color: #e0e0e0;
  height: 100%; // Aseguramos que ocupe toda la altura
  overflow-y: auto; // Permitimos scroll si el contenido es muy largo
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
`;

const FormTitle = styled.h2`
  color: #e0e0e0;
  margin-bottom: 20px;
  text-align: center;
`;

const FormField = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #b0b0b0;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  background-color: rgba(45, 45, 45, 0.5);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(68, 68, 68, 0.5);
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #0078d4;
    background-color: rgba(60, 60, 60, 0.5);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  background-color: rgba(45, 45, 45, 0.5);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(68, 68, 68, 0.5);
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 16px;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #0078d4;
    background-color: rgba(60, 60, 60, 0.5);
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #0078d4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005a9e;
  }

  &:disabled {
    background-color: #444;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  color: #4caf50;
  margin-top: 20px;
  text-align: center;
`;

const ContactContent: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', { name, email, message });
    setIsSubmitted(true);
    // Resetear el formulario
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <ContactContainer>
      <FormTitle>Contáctame</FormTitle>
      {!isSubmitted ? (
        <ContactForm onSubmit={handleSubmit}>
          <FormField>
            <Label htmlFor="name">Nombre</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormField>
          <FormField>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormField>
          <FormField>
            <Label htmlFor="message">Mensaje</Label>
            <TextArea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </FormField>
          <SubmitButton type="submit">Enviar Mensaje</SubmitButton>
        </ContactForm>
      ) : (
        <SuccessMessage>
          ¡Gracias por tu mensaje! Te responderé pronto.
        </SuccessMessage>
      )}
    </ContactContainer>
  );
};

export default ContactContent;