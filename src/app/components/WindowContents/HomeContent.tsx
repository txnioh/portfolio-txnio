import React from 'react';
import styled from 'styled-components';
import { FaDesktop, FaCamera, FaFilm, FaFigma, FaRobot } from 'react-icons/fa';
import { SiAdobecreativecloud } from 'react-icons/si';

const HomeContainer = styled.div`
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

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #FFA500;
  text-align: center;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 30px;
  text-align: center;
  color: #b0b0b0;
`;

const InterestsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 800px;
`;

const InterestCard = styled.div`
  background-color: rgba(45, 45, 45, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease, background-color 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background-color: rgba(60, 60, 60, 0.5);
  }
`;

const InterestIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 10px;
  color: #FFA500;
`;

const InterestTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #e0e0e0;
`;

const InterestDescription = styled.p`
  font-size: 0.9rem;
  color: #b0b0b0;
`;

const HomeContent: React.FC = () => {
  const interests = [
    { icon: <FaDesktop />, title: "UI/UX Design", description: "Creando experiencias digitales intuitivas y atractivas" },
    { icon: <FaCamera />, title: "Photography", description: "Capturando momentos y perspectivas únicas" },
    { icon: <FaFilm />, title: "Filmmaking", description: "Narrando historias a través del lente" },
    { icon: <FaFigma />, title: "Figma", description: "Diseñando y prototipando con precisión" },
    { icon: <SiAdobecreativecloud />, title: "Adobe Suite", description: "Dominando las herramientas creativas líderes" },
    { icon: <FaRobot />, title: "AI Enthusiast", description: "Explorando las fronteras de la inteligencia artificial" },
  ];

  return (
    <HomeContainer>
      <Title>Bienvenido al Portfolio de Txnio</Title>
      <Subtitle>Desarrollador Full Stack | Creativo Digital | Entusiasta de la Tecnología</Subtitle>
      <InterestsGrid>
        {interests.map((interest, index) => (
          <InterestCard key={index}>
            <InterestIcon>{interest.icon}</InterestIcon>
            <InterestTitle>{interest.title}</InterestTitle>
            <InterestDescription>{interest.description}</InterestDescription>
          </InterestCard>
        ))}
      </InterestsGrid>
    </HomeContainer>
  );
};

export default HomeContent;