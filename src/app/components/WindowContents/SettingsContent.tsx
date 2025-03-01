import React, { useState } from 'react';
import styled from 'styled-components';
import { FaDesktop, FaUser, FaWifi, FaBluetooth, FaLock, FaKeyboard } from 'react-icons/fa';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #1e1e1e;
  color: #e0e0e0;

  @media (min-width: 769px) {
    flex-direction: row;
  }
`;

const Sidebar = styled.div`
  display: none;

  @media (min-width: 769px) {
    display: block;
    width: 250px;
    height: 100%;
    background-color: #2c2c2c;
    padding: 20px;
    overflow-y: auto;
  }
`;

const SidebarItem = styled.div<{ isActive: boolean }>`
  display: inline-block;
  padding: 8px 12px;
  margin-right: 10px;
  cursor: pointer;
  background-color: ${props => props.isActive ? '#4a4a4a' : 'transparent'};
  border-radius: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background-color: #3a3a3a;
  }

  svg {
    margin-right: 5px;
    font-size: 1.2em;
  }

  @media (min-width: 769px) {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    margin-right: 0;
    padding: 10px;

    svg {
      margin-right: 10px;
    }
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const Title = styled.h2`
  color: #ffffff;
  margin-bottom: 20px;
  font-size: 1.8rem;
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  color: #0078d4;
  margin-bottom: 15px;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
  }
`;

const WallpaperGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
`;

const WallpaperWrapper = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

const WallpaperImage = styled.img<{ isLoaded: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease-out;
  filter: ${props => props.isLoaded ? 'blur(0)' : 'blur(20px)'};
`;

const WallpaperOverlay = styled.div<{ isSelected: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 3px solid ${props => props.isSelected ? '#0078d4' : 'transparent'};
  background: ${props => props.isSelected ? 'rgba(0, 120, 212, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
  transition: all 0.2s ease-in-out;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #3a3a3a;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  font-size: 1rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #0078d4;
  }

  @media (min-width: 769px) {
    margin-bottom: 20px;
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
  const [activeSection, setActiveSection] = useState('wallpaper');
  const [searchTerm, setSearchTerm] = useState('');

  const wallpapers = ['wallpaper1', 'wallpaper2', 'wallpaper3'];

  const renderContent = () => {
    switch (activeSection) {
      case 'wallpaper':
        return (
          <Section>
            <SectionTitle><FaDesktop /> Fondo de Pantalla</SectionTitle>
            <WallpaperGrid>
              {wallpapers.map((wallpaper) => {
                const [isLoaded, setIsLoaded] = useState(false);
                
                return (
                  <WallpaperWrapper
                    key={wallpaper}
                    onClick={() => setWallpaper(wallpaper)}
                  >
                    <WallpaperImage
                      src={`/${wallpaper}-day.jpg`}
                      alt={`Wallpaper ${wallpaper}`}
                      isLoaded={isLoaded}
                      onLoad={() => setIsLoaded(true)}
                    />
                    <WallpaperOverlay isSelected={currentWallpaper === wallpaper} />
                  </WallpaperWrapper>
                );
              })}
            </WallpaperGrid>
          </Section>
        );
      case 'user':
        return (
          <Section>
            <SectionTitle><FaUser /> Usuario y Cuentas</SectionTitle>
            <p>Gestiona tus cuentas de usuario y ajustes de inicio de sesión.</p>
          </Section>
        );
      case 'network':
        return (
          <Section>
            <SectionTitle><FaWifi /> Red e Internet</SectionTitle>
            <p>Configura tus conexiones Wi-Fi y ajustes de red.</p>
          </Section>
        );
      case 'bluetooth':
        return (
          <Section>
            <SectionTitle><FaBluetooth /> Bluetooth</SectionTitle>
            <p>Administra tus dispositivos Bluetooth y conexiones.</p>
          </Section>
        );
      case 'security':
        return (
          <Section>
            <SectionTitle><FaLock /> Seguridad y Privacidad</SectionTitle>
            <p>Ajusta la configuración de seguridad y privacidad de tu sistema.</p>
          </Section>
        );
      case 'keyboard':
        return (
          <Section>
            <SectionTitle><FaKeyboard /> Teclado</SectionTitle>
            <p>Personaliza la configuración de tu teclado y atajos.</p>
          </Section>
        );
      default:
        return null;
    }
  };

  return (
    <SettingsContainer>
      <Sidebar>
        <SearchInput 
          type="text" 
          placeholder="Buscar ajustes..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {[
          { id: 'wallpaper', icon: FaDesktop, label: 'Fondo de pantalla' },
          { id: 'user', icon: FaUser, label: 'Usuario y Cuentas' },
          { id: 'network', icon: FaWifi, label: 'Red e Internet' },
          { id: 'bluetooth', icon: FaBluetooth, label: 'Bluetooth' },
          { id: 'security', icon: FaLock, label: 'Seguridad y Privacidad' },
          { id: 'keyboard', icon: FaKeyboard, label: 'Teclado' }
        ].map(({ id, icon: Icon, label }) => (
          <SidebarItem 
            key={id}
            isActive={activeSection === id}
            onClick={() => setActiveSection(id)}
          >
            <Icon />
            {label}
          </SidebarItem>
        ))}
      </Sidebar>
      <ContentArea>
        <Title>Ajustes del Sistema</Title>
        {renderContent()}
      </ContentArea>
    </SettingsContainer>
  );
};

export default SettingsContent;