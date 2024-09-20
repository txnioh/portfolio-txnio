import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  background-color: rgba(30, 30, 30, 0.7);
  backdrop-filter: blur(10px);
  color: #e0e0e0;
  overflow-y: auto;
`;

const WelcomeMessage = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1.2rem;
  text-align: center;
  max-width: 600px;
  margin-bottom: 30px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #0078d4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005a9e;
  }
`;

const HomeContent: React.FC = () => {
  return (
    <HomeContainer>
      <WelcomeMessage>Bienvenido a mi Portfolio</WelcomeMessage>
      <Description>
        Soy un desarrollador apasionado por crear experiencias web únicas y funcionales.
        Explora mis proyectos y conoce más sobre mí.
      </Description>
      <ButtonContainer>
        <Button>Ver Proyectos</Button>
        <Button>Sobre Mí</Button>
      </ButtonContainer>
    </HomeContainer>
  );
};

export default HomeContent;