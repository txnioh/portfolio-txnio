import React from 'react';
import styled from 'styled-components';
import { FaDesktop, FaCamera, FaFilm, FaFigma, FaRobot, FaPalette } from 'react-icons/fa';
import { SiAdobecreativecloud } from 'react-icons/si';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: rgba(255, 250, 250, 0.1);
  backdrop-filter: blur(10px);
  color: #333;
  height: 100%;
  overflow-y: auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #FF9AA2;
  text-align: center;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 30px;
  text-align: center;
  color: #555;
`;

const InterestsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1000px;
`;

const InterestCard = styled.div`
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const InterestIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
  color: #FFB7B2;
`;

const InterestTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
`;

const InterestDescription = styled.p`
  font-size: 0.9rem;
  color: #555;
  line-height: 1.4;
`;

const HomeContent: React.FC = () => {
  const interests = [
    { 
      icon: <FaDesktop />, 
      title: "Desarrollo Web", 
      description: "Creando experiencias digitales intuitivas y atractivas con las últimas tecnologías frontend.",
      color: "#FFB7B2"
    },
    { 
      icon: <FaCamera />, 
      title: "Fotografía", 
      description: "Capturando momentos y perspectivas únicas a través del lente.",
      color: "#FFDAC1"
    },
    { 
      icon: <FaFilm />, 
      title: "Producción Audiovisual", 
      description: "Narrando historias visualmente impactantes a través del cine y el vídeo.",
      color: "#E2F0CB"
    },
    { 
      icon: <FaFigma />, 
      title: "Diseño UI/UX", 
      description: "Diseñando y prototipando interfaces de usuario intuitivas y atractivas.",
      color: "#B5EAD7"
    },
    { 
      icon: <SiAdobecreativecloud />, 
      title: "Adobe Creative Suite", 
      description: "Dominando las herramientas creativas líderes para diseño gráfico y edición.",
      color: "#C7CEEA"
    },
    { 
      icon: <FaRobot />, 
      title: "Inteligencia Artificial", 
      description: "Explorando las fronteras de la IA y su aplicación en el desarrollo web y diseño.",
      color: "#FF9AA2"
    },
    {
      icon: <FaPalette />,
      title: "Diseño Gráfico",
      description: "Creando identidades visuales y gráficos que comunican de manera efectiva.",
      color: "#FDFD96"
    }
  ];

  return (
    <HomeContainer>
      <Title>Bienvenido al Portfolio de Antonio J. González</Title>
      <Subtitle>Desarrollador Full Stack | Creativo Digital | Entusiasta de la Tecnología</Subtitle>
      <InterestsGrid>
        {interests.map((interest, index) => (
          <InterestCard key={index}>
            <InterestIcon style={{ color: interest.color }}>{interest.icon}</InterestIcon>
            <InterestTitle>{interest.title}</InterestTitle>
            <InterestDescription>{interest.description}</InterestDescription>
          </InterestCard>
        ))}
      </InterestsGrid>
    </HomeContainer>
  );
};

export default HomeContent;