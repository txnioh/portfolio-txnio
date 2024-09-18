import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaCog } from 'react-icons/fa';
import SearchBar from './SearchBar';
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

interface TopBarProps {
  windows: WindowState[];
  desktopIcons: DesktopIcon[];
  toggleWindow: (id: string) => void;
  openUrl: (url: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ windows, desktopIcons, toggleWindow, openUrl }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
          <TopBarText>Txnio Portfolio</TopBarText>
        </TopBarLeft>
        <TopBarRight>
          <TopBarIcon onClick={() => setIsSearchOpen(true)}>
            <FaSearch />
          </TopBarIcon>
          <TopBarIcon>
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
    </>
  );
};

export default TopBar;