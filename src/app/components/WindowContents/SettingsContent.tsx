import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaDesktop, FaSpinner, FaUser, FaWifi, FaBluetooth, FaLock, FaKeyboard } from 'react-icons/fa';

const SettingsContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  background-color: #1e1e1e;
  color: #e0e0e0;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #2c2c2c;
  padding: 20px;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    height: 60px;
    padding: 10px;
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
  }
`;

const SidebarItem = styled.div<{ isActive: boolean }>`
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  background-color: ${props => props.isActive ? '#4a4a4a' : 'transparent'};
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #3a3a3a;
  }

  svg {
    margin-right: 10px;
    font-size: 1.2em;
  }

  @media (max-width: 768px) {
    margin-right: 10px;
    margin-bottom: 0;
    padding: 8px 12px;
    white-space: nowrap;
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

const WallpaperOption = styled.div<{ isSelected: boolean; backgroundImage: string }>`
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

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const SpinnerIcon = styled(FaSpinner)`
  font-size: 48px;
  color: #ffffff;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #3a3a3a;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  font-size: 1rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #0078d4;
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
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('wallpaper');
  const [searchTerm, setSearchTerm] = useState('');

  const wallpapers = ['wallpaper1', 'wallpaper2', 'wallpaper3'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'wallpaper':
        return (
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
      {isLoading && (
        <LoadingOverlay>
          <SpinnerIcon />
        </LoadingOverlay>
      )}
    </SettingsContainer>
  );
};

export default SettingsContent;