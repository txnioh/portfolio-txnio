import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import '../../../i18n/config';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: rgba(30, 30, 30, 0.95);
  color: #ffffff;
  backdrop-filter: blur(10px);

  @media (min-width: 769px) {
    flex-direction: row;
  }
`;

const Sidebar = styled.div`
  display: none;

  @media (min-width: 769px) {
    display: flex;
    flex-direction: column;
    width: 200px;
    height: 100%;
    background-color: rgba(40, 40, 40, 0.6);
    padding: 16px;
    overflow-y: auto;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    
    /* Webkit scrollbar styling */
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 3px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.5);
      }
    }
  }
`;

const SidebarItem = styled.div<{ isActive: boolean }>`
  display: inline-block;
  padding: 6px 10px;
  margin-right: 8px;
  cursor: pointer;
  background-color: ${props => props.isActive ? 'rgba(0, 122, 255, 0.2)' : 'transparent'};
  border-radius: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-size: 14px;
  border: ${props => props.isActive ? '1px solid rgba(0, 122, 255, 0.3)' : '1px solid transparent'};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .icon {
    margin-right: 6px;
    width: 16px;
    height: 16px;
    object-fit: contain;
  }

  @media (min-width: 769px) {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    margin-right: 0;
    padding: 8px 12px;

    .icon {
      margin-right: 8px;
      width: 16px;
      height: 16px;
    }
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const Title = styled.h2`
  color: #ffffff;
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 12px;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  color: #007AFF;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
  
  .icon {
    margin-right: 8px;
    width: 20px;
    height: 20px;
    object-fit: contain;
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
  padding: 8px 12px;
  margin-bottom: 12px;
  background-color: rgba(60, 60, 60, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  backdrop-filter: blur(10px);

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    outline: none;
    border-color: #007AFF;
    box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
  }

  @media (min-width: 769px) {
    margin-bottom: 16px;
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
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('wallpaper');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadedWallpapers, setLoadedWallpapers] = useState<{ [key: string]: boolean }>({});

  const wallpapers = ['wallpaper1', 'wallpaper2', 'wallpaper3', 'wallpaper-txnios-old'];

  const handleImageLoad = (wallpaper: string) => {
    setLoadedWallpapers(prev => ({
      ...prev,
      [wallpaper]: true
    }));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'wallpaper':
        return (
          <Section>
            <SectionTitle><img src="/icons/mac.png" alt="Display" className="icon" /> {t('settings.wallpaper.title')}</SectionTitle>
            <WallpaperGrid>
              {wallpapers.map((wallpaper) => (
                <WallpaperWrapper
                  key={wallpaper}
                  onClick={() => setWallpaper(wallpaper)}
                >
                  <WallpaperImage
                    src={wallpaper === 'wallpaper-txnios-old' ? `/${wallpaper}.jpg` : `/${wallpaper}-day.jpg`}
                    alt={`Wallpaper ${wallpaper}`}
                    isLoaded={!!loadedWallpapers[wallpaper]}
                    onLoad={() => handleImageLoad(wallpaper)}
                  />
                  <WallpaperOverlay isSelected={currentWallpaper === `/${wallpaper === 'wallpaper-txnios-old' ? wallpaper + '.jpg' : wallpaper + '-day.jpg'}`} />
                </WallpaperWrapper>
              ))}
            </WallpaperGrid>
          </Section>
        );
      case 'user':
        return (
          <Section>
            <SectionTitle><img src="/icons/apple.png" alt="User" className="icon" /> {t('settings.user.title')}</SectionTitle>
            <p>{t('settings.user.description')}</p>
          </Section>
        );
      case 'network':
        return (
          <Section>
            <SectionTitle><img src="/icons/cdrom.png" alt="Network" className="icon" /> {t('settings.network.title')}</SectionTitle>
            <p>{t('settings.network.description')}</p>
          </Section>
        );
      case 'bluetooth':
        return (
          <Section>
            <SectionTitle><img src="/icons/directory.png" alt="Bluetooth" className="icon" /> {t('settings.bluetooth.title')}</SectionTitle>
            <p>{t('settings.bluetooth.description')}</p>
          </Section>
        );
      case 'security':
        return (
          <Section>
            <SectionTitle><img src="/icons/pdf.png" alt="Security" className="icon" /> {t('settings.security.title')}</SectionTitle>
            <p>{t('settings.security.description')}</p>
          </Section>
        );
      case 'keyboard':
        return (
          <Section>
            <SectionTitle><img src="/icons/notas.png" alt="Keyboard" className="icon" /> {t('settings.keyboard.title')}</SectionTitle>
            <p>{t('settings.keyboard.description')}</p>
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
          placeholder={t('settings.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {[
          { id: 'wallpaper', icon: '/icons/mac.png', labelKey: 'settings.wallpaper.label' },
          { id: 'user', icon: '/icons/apple.png', labelKey: 'settings.user.label' },
          { id: 'network', icon: '/icons/cdrom.png', labelKey: 'settings.network.label' },
          { id: 'bluetooth', icon: '/icons/directory.png', labelKey: 'settings.bluetooth.label' },
          { id: 'security', icon: '/icons/pdf.png', labelKey: 'settings.security.label' },
          { id: 'keyboard', icon: '/icons/notas.png', labelKey: 'settings.keyboard.label' }
        ].map(({ id, icon, labelKey }) => (
          <SidebarItem 
            key={id}
            isActive={activeSection === id}
            onClick={() => setActiveSection(id)}
          >
            <img src={icon} alt={t(labelKey)} className="icon" />
            {t(labelKey)}
          </SidebarItem>
        ))}
      </Sidebar>
      <ContentArea>
        <Title>{t('settings.title')}</Title>
        {renderContent()}
      </ContentArea>
    </SettingsContainer>
  );
};

export default SettingsContent;