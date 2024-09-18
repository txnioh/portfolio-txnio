import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaCog } from 'react-icons/fa';
import SearchBar from './SearchBar';
import SettingsContent from './WindowContents/SettingsContent';
import { WindowState, DesktopIcon } from '../types';

const TopBarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 25px;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  color: white;
  font-size: 12px;
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

const TopBarIcon = styled.div`
  margin: 0 5px;
  cursor: pointer;
`;

const TopBarText = styled.div`
  margin: 0 5px;
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

const SettingsContainer = styled.div`
  width: 80%;
  max-width: 800px;
  height: 80%;
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
}

const TopBar: React.FC<TopBarProps> = ({ windows, desktopIcons, toggleWindow, openUrl, currentWallpaper, setWallpaper }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <TopBarWrapper>
        <TopBarLeft>
          <TopBarText>made with love by txnio.</TopBarText>
        </TopBarLeft>
        <TopBarRight>
          <TopBarIcon onClick={() => setIsSearchOpen(true)}>
            <FaSearch />
          </TopBarIcon>
          <TopBarIcon onClick={() => setIsSettingsOpen(true)}>
            <FaCog />
          </TopBarIcon>
          <TopBarText>{formatDate(currentTime)}</TopBarText>
          <TopBarText>{formatTime(currentTime)}</TopBarText>
        </TopBarRight>
      </TopBarWrapper>
      {isSearchOpen && (
        <SearchBar 
          windows={windows}
          desktopIcons={desktopIcons}
          toggleWindow={toggleWindow}
          openUrl={openUrl}
          onClose={() => setIsSearchOpen(false)} 
        />
      )}
      {isSettingsOpen && (
        <SettingsOverlay onClick={() => setIsSettingsOpen(false)}>
          <SettingsContainer onClick={(e) => e.stopPropagation()}>
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