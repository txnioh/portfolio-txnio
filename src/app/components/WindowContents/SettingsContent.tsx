import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: rgba(30, 30, 30, 0.5);
  backdrop-filter: blur(10px);
  color: #e0e0e0;
  height: 100%;
  overflow-y: auto;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const WallpaperSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const WallpaperOptions = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
`;

const WallpaperOption = styled.div<{ isSelected: boolean }>`
  cursor: pointer;
  border: 2px solid ${props => props.isSelected ? '#FFA500' : 'transparent'};
  border-radius: 8px;
  overflow: hidden;
  width: 120px;
  height: 67px;
  position: relative;

  &:hover {
    border-color: #FFA500;
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
  return (
    <SettingsContainer>
      <Title>Ajustes</Title>
      <WallpaperSection>
        <h3>Fondo de pantalla</h3>
        <WallpaperOptions>
          {wallpapers.map((wallpaper, index) => (
            <WallpaperOption
              key={index}
              isSelected={currentWallpaper.startsWith(wallpaper)}
              onClick={() => setWallpaper(wallpaper)}
            >
              <Image src={`/${wallpaper}-day.jpg`} alt={`Wallpaper ${index + 1}`} layout="fill" objectFit="cover" />
            </WallpaperOption>
          ))}
        </WallpaperOptions>
      </WallpaperSection>
    </SettingsContainer>
  );
};

export default SettingsContent;