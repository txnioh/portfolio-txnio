import React from 'react';
import styled from 'styled-components';
import { FaDesktop } from 'react-icons/fa';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgba(25, 25, 25, 0.9);
  backdrop-filter: blur(10px);
  color: #e0e0e0;
  padding: 20px;
  overflow-y: auto;
  height: 100%;
  width: 100%;
`;

const Title = styled.h2`
  color: #ffffff;
  margin-bottom: 20px;
  font-size: 1.5rem;
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  color: #0078d4;
  margin-bottom: 15px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
  }
`;

const WallpaperGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
`;

const WallpaperOption = styled.div<{ isSelected: boolean; backgroundImage: string }>`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  border: 3px solid ${props => props.isSelected ? '#0078d4' : 'transparent'};
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.isSelected ? 'rgba(0, 120, 212, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
    transition: background 0.2s ease-in-out;
  }

  &:hover::after {
    background: rgba(0, 0, 0, 0.2);
  }
`;

interface SettingsContentProps {
  currentWallpaper: string;
  setWallpaper: (wallpaper: string) => void;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ 
  currentWallpaper, 
  setWallpaper
}) => {
  const wallpapers = ['wallpaper1', 'wallpaper2', 'wallpaper3'];

  return (
    <SettingsContainer>
      <Title>Ajustes del Sistema</Title>
      <Section>
        <SectionTitle><FaDesktop /> Fondo de Pantalla</SectionTitle>
        <WallpaperGrid>
          {wallpapers.map((wallpaper) => (
            <WallpaperOption
              key={wallpaper}
              isSelected={currentWallpaper === wallpaper}
              backgroundImage={`/${wallpaper}-day.jpg`}
              onClick={() => setWallpaper(wallpaper)}
            />
          ))}
        </WallpaperGrid>
      </Section>
    </SettingsContainer>
  );
};

export default SettingsContent;