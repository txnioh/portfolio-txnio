import React from 'react';
import styled from 'styled-components';
import { FaDesktop, FaCamera, FaFilm, FaFigma, FaRobot, FaPalette } from 'react-icons/fa';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: rgba(18, 18, 18, 0.95);
  color: #e0e0e0;
  height: 100%;
  overflow-y: auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #4a90e2;
  text-align: center;
  text-shadow: 0 0 10px rgba(74, 144, 226, 0.3);
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 30px;
  text-align: center;
  color: #b0b0b0;
`;

const InterestsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1000px;
`;

const InterestCard = styled.div`
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

const InterestIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
  color: #4a90e2;
`;

const InterestTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #ffffff;
`;

const InterestDescription = styled.p`
  font-size: 0.9rem;
  color: #b0b0b0;
  line-height: 1.4;
`;

const GallerySection = styled.div`
  width: 100%;
  margin-top: 40px;
`;

const GalleryTitle = styled.h2`
  font-size: 2rem;
  color: #4a90e2;
  text-align: center;
  margin-bottom: 20px;
`;

const GalleryPlaceholder = styled.div`
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  color: #b0b0b0;
`;

const HomeContent: React.FC = () => {
  const interests = [
    { 
      icon: <FaDesktop />, 
      title: "Desarrollo Web", 
      description: "Creando experiencias digitales intuitivas y atractivas con las últimas tecnologías frontend.",
    },
    { 
      icon: <FaCamera />, 
      title: "Fotografía", 
      description: "Capturando momentos y perspectivas únicas a través del lente.",
    },
    { 
      icon: <FaFilm />, 
      title: "Producción Audiovisual", 
      description: "Narrando historias visualmente impactantes a través del cine y el vídeo.",
    },
    { 
      icon: <FaFigma />, 
      title: "Diseño UI/UX", 
      description: "Diseñando y prototipando interfaces de usuario intuitivas y atractivas.",
    },
    { 
      icon: <FaRobot />, 
      title: "Inteligencia Artificial", 
      description: "Explorando las fronteras de la IA y su aplicación en el desarrollo web y diseño.",
    },
    {
      icon: <FaPalette />,
      title: "Diseño Gráfico",
      description: "Creando identidades visuales y gráficos que comunican de manera efectiva.",
    }
  ];

  return (
    <HomeContainer>
      <Title>Bienvenido al Portfolio de Antonio J. González</Title>
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
      <GallerySection>
        <GalleryTitle>Mi Galería</GalleryTitle>
        <GalleryPlaceholder>
          Aquí se mostrarán las fotos de la galería próximamente.
        </GalleryPlaceholder>
      </GallerySection>
    </HomeContainer>
  );
};

export default HomeContent;