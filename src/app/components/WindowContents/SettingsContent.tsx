import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

const SettingsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  color: #e0e0e0;
  height: 100%;
  overflow-y: auto;
  border-radius: 20px;
`;

const Title = styled.h2`
  margin-bottom: 30px;
  color: #000000;
  font-size: 24px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 20px;
  font-size: 18px;
  color: #000000;
`;

const WallpaperOptions = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const WallpaperOption = styled(motion.div)<{ isSelected: boolean }>`
  cursor: pointer;
  border: 2px solid ${props => props.isSelected ? '#000000' : 'transparent'};
  border-radius: 12px;
  overflow: hidden;
  width: 180px;
  height: 101px;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  }
`;

const InfoText = styled.p`
  font-size: 14px;
  color: #b0b0b0;
  margin-top: 10px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const SpinnerIcon = styled(FaSpinner)`
  font-size: 40px;
  color: #000000;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface SettingsContentProps {
  currentWallpaper: string;
  setWallpaper: (wallpaper: string) => void;
}

const wallpapers = [
  'wallpaper1',
  'wallpaper2',
  'wallpaper3'
];

const SettingsContent: React.FC<SettingsContentProps> = ({ currentWallpaper, setWallpaper }) => {
  const [loadingWallpapers, setLoadingWallpapers] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = wallpapers.map(wallpaper => {
        return new Promise((resolve, reject) => {
          const img = document.createElement('img');
          img.src = `/${wallpaper}-day.jpg`;
          img.onload = () => resolve(img);
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setLoadingWallpapers(false);
      } catch (error) {
        console.error('Error loading wallpaper images:', error);
        setLoadingWallpapers(false);
      }
    };

    loadImages();
  }, []);

  return (
    <SettingsContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Title>Ajustes</Title>
      <Section>
        <SectionTitle>Fondo de pantalla</SectionTitle>
        {loadingWallpapers ? (
          <LoadingContainer>
            <SpinnerIcon />
          </LoadingContainer>
        ) : (
          <AnimatePresence>
            <WallpaperOptions>
              {wallpapers.map((wallpaper, index) => (
                <WallpaperOption
                  key={wallpaper}
                  isSelected={currentWallpaper.startsWith(wallpaper)}
                  onClick={() => setWallpaper(wallpaper)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <Image src={`/${wallpaper}-day.jpg`} alt={`Wallpaper ${index + 1}`} layout="fill" objectFit="cover" />
                </WallpaperOption>
              ))}
            </WallpaperOptions>
          </AnimatePresence>
        )}
        <InfoText>
          El fondo de pantalla cambia automáticamente entre versiones de día y noche según la hora del día.
        </InfoText>
      </Section>
    </SettingsContainer>
  );
};

export default SettingsContent;