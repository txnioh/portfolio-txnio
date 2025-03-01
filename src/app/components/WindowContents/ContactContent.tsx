import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const ContactContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #e0e0e0;
  height: 100%;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.9) 0%,
      rgba(255, 165, 0, 0.2) 25%,
      rgba(0, 0, 0, 0.9) 50%,
      rgba(255, 165, 0, 0.2) 75%,
      rgba(0, 0, 0, 0.9) 100%
    );
    background-size: 400% 400%;
    animation: ${gradientAnimation} 15s ease infinite;
    z-index: -1;
  }
`;

const Title = styled.h2`
  color: #FFA500;
  margin-bottom: 40px;
  font-size: 2em;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  width: 100%;
  max-width: 800px;
  position: relative;
  z-index: 1;
`;

const ContactCard = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  text-decoration: none;
  color: #e0e0e0;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 165, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    background-color: rgba(0, 0, 0, 0.8);
    box-shadow: 0 5px 15px rgba(255, 165, 0, 0.2);
    border-color: rgba(255, 165, 0, 0.3);
  }

  svg {
    font-size: 2.5em;
    margin-bottom: 15px;
    color: #FFA500;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
`;

const ContactLabel = styled.span`
  font-size: 1.2em;
  margin-bottom: 8px;
  font-weight: 500;
  color: #FFA500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const ContactValue = styled.span`
  color: #e0e0e0;
  text-align: center;
`;

const Description = styled.p`
  text-align: center;
  color: #e0e0e0;
  margin-bottom: 40px;
  max-width: 600px;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
`;

const ContactContent: React.FC = () => {
  return (
    <ContactContainer>
      <Title>¡Hablemos!</Title>
      <Description>
        Si tienes alguna pregunta, propuesta de colaboración o simplemente quieres charlar,
        no dudes en contactarme a través de cualquiera de estos medios.
      </Description>
      <ContactGrid>
        <ContactCard href="mailto:txniodev@gmail.com">
          <FaEnvelope />
          <ContactLabel>Email</ContactLabel>
          <ContactValue>txniodev@gmail.com</ContactValue>
        </ContactCard>
        <ContactCard 
          href="https://www.linkedin.com/in/txnio" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <FaLinkedin />
          <ContactLabel>LinkedIn</ContactLabel>
          <ContactValue>linkedin.com/in/txnio</ContactValue>
        </ContactCard>
        <ContactCard 
          href="https://github.com/txnioh" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <FaGithub />
          <ContactLabel>GitHub</ContactLabel>
          <ContactValue>github.com/txnioh</ContactValue>
        </ContactCard>
      </ContactGrid>
    </ContactContainer>
  );
};

export default ContactContent;