import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import WindowContainer from './WindowContainer';
import TopBar from './TopBar';
import Dock from './Dock';
import DesktopIcons from './DesktopIcons';
import { WindowState, DesktopIcon } from '../types';

const DesktopWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 100%;
    min-height: 100vh;
  }
`;

const WindowContainerStyled = styled.div`
  position: relative;
  flex: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    height: calc(100vh - 95px); // Ajustado para la barra superior y el dock
    margin-top: 35px; // Espacio para la barra superior
  }
`;

interface DesktopProps {
  windows: WindowState[];
  toggleWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  desktopIcons: DesktopIcon[];
  openUrl: (url: string, id?: string) => void;
  currentWallpaper: string;
  setWallpaper: (wallpaper: string) => void;
  windowPositions: { [key: string]: { x: number; y: number } };
  windowSizes: { [key: string]: { width: number; height: number } };
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  children?: React.ReactNode;
}

const Desktop: React.FC<DesktopProps> = ({
  windows,
  toggleWindow,
  closeWindow,
  bringToFront,
  desktopIcons,
  openUrl,
  currentWallpaper,
  setWallpaper,
  windowPositions,
  windowSizes,
  updateWindowPosition,
  updateWindowSize,
  children
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <DesktopWrapper>
      <TopBar 
        windows={windows}
        desktopIcons={desktopIcons}
        toggleWindow={toggleWindow}
        openUrl={openUrl}
        currentWallpaper={currentWallpaper}
        setWallpaper={setWallpaper}
        isMobile={isMobile}
      />
      <WindowContainerStyled>
        <DesktopIcons icons={desktopIcons} openUrl={(url, id) => openUrl(url, id)} />
        {windows.map((window) => (
          <WindowContainer
            key={window.id}
            window={window}
            closeWindow={closeWindow}
            bringToFront={bringToFront}
            position={windowPositions[window.id] || { x: 0, y: 0 }}
            size={windowSizes[window.id] || { width: 800, height: 600 }}
            updateWindowPosition={updateWindowPosition}
            updateWindowSize={updateWindowSize}
            currentWallpaper={currentWallpaper}
            setWallpaper={setWallpaper}
            isMobile={isMobile}
          />
        ))}
      </WindowContainerStyled>
      <Dock 
        windows={windows.filter(window => window.id !== 'Snake Game')} 
        toggleWindow={toggleWindow} 
        isMobile={isMobile} 
      />
      {children}
    </DesktopWrapper>
  );
};

export default Desktop;