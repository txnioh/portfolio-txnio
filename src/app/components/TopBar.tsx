import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaCog } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import SearchBar from './SearchBar';
import SettingsContent from './WindowContents/SettingsContent';
import { WindowState, DesktopIcon } from '../types';
import '../../i18n/config';

const TopBarWrapper = styled.div<{ isMobile: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${props => props.isMobile ? '35px' : '25px'};
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  color: white;
  font-size: ${props => props.isMobile ? '14px' : '12px'};
  z-index: 1000;
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
`;

const TopBarIcon = styled.div<{ isMobile: boolean }>`
  margin: 0 ${props => props.isMobile ? '10px' : '5px'};
  cursor: pointer;
  font-size: ${props => props.isMobile ? '18px' : '14px'};
`;

const TopBarText = styled.div<{ isMobile: boolean }>`
  margin: 0 ${props => props.isMobile ? '10px' : '5px'};
`;

const SettingsOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const SettingsContainer = styled.div<{ isMobile: boolean }>`
  width: ${props => props.isMobile ? '90%' : '80%'};
  max-width: 800px;
  height: ${props => props.isMobile ? '90%' : '80%'};
  max-height: 600px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;



interface TopBarProps {
  windows: WindowState[];
  desktopIcons: DesktopIcon[];
  toggleWindow: (id: string) => void;
  openUrl: (url: string) => void;
  currentWallpaper: string;
  setWallpaper: (wallpaper: string) => void;
  isMobile: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  windows,
  desktopIcons,
  toggleWindow,
  openUrl,
  currentWallpaper,
  setWallpaper,
  isMobile
}) => {
  const { t, i18n } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);



  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const locale = i18n.language === 'en' ? 'en-US' : 'es-ES';
    return date.toLocaleDateString(locale, options);
  };

  const formatTime = (date: Date) => {
    const locale = i18n.language === 'en' ? 'en-US' : 'es-ES';
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <TopBarWrapper isMobile={isMobile}>
        <TopBarLeft>
          <TopBarText isMobile={isMobile}>{t('common.madeWithLove')}</TopBarText>
        </TopBarLeft>
        <TopBarRight>

          <TopBarIcon isMobile={isMobile} onClick={() => setIsSearchOpen(true)}>
            <FaSearch />
          </TopBarIcon>
          <TopBarIcon isMobile={isMobile} onClick={() => setIsSettingsOpen(true)}>
            <FaCog />
          </TopBarIcon>
          {!isMobile && (
            <>
              <TopBarText isMobile={isMobile}>{formatDate(currentTime)}</TopBarText>
              <TopBarText isMobile={isMobile}>{formatTime(currentTime)}</TopBarText>
            </>
          )}
        </TopBarRight>
      </TopBarWrapper>
      {isSearchOpen && (
        <SearchBar
          windows={windows}
          desktopIcons={desktopIcons}
          toggleWindow={toggleWindow}
          openUrl={openUrl}
          onClose={() => setIsSearchOpen(false)}
          isMobile={isMobile}
        />
      )}
      {isSettingsOpen && (
        <SettingsOverlay onClick={() => setIsSettingsOpen(false)}>
          <SettingsContainer onClick={(e) => e.stopPropagation()} isMobile={isMobile}>
            <SettingsContent
              currentWallpaper={currentWallpaper}
              setWallpaper={setWallpaper}
            />
          </SettingsContainer>
        </SettingsOverlay>
      )}
    </>
  );
};

export default TopBar;