import React from 'react';
import styled from 'styled-components';
import WindowContainer from './WindowContainer';
import TopBar from './TopBar';
import Dock from './Dock';
import DesktopIcons from './DesktopIcons';
import { WindowState, DesktopIcon } from '../types'; // Añade esta línea

const DesktopWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const WindowContainerStyled = styled.div`
  position: relative;
  flex: 1;
`;

interface DesktopProps {
  windows: WindowState[];
  toggleWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  desktopIcons: DesktopIcon[];
  openUrl: (url: string) => void;
  currentWallpaper: string;
  setWallpaper: (wallpaper: string) => void;
  windowPositions: { [key: string]: { x: number; y: number } };
  windowSizes: { [key: string]: { width: number; height: number } };
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
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
  updateWindowSize
}) => {
  return (
    <DesktopWrapper>
      <TopBar 
        windows={windows}
        desktopIcons={desktopIcons}
        toggleWindow={toggleWindow}
        openUrl={openUrl}
        currentWallpaper={currentWallpaper}
        setWallpaper={setWallpaper}
      />
      <WindowContainerStyled>
        <DesktopIcons icons={desktopIcons} openUrl={openUrl} />
        {windows.map((window) => (
          window.isOpen && (
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
            />
          )
        ))}
      </WindowContainerStyled>
      <Dock windows={windows} toggleWindow={toggleWindow} />
    </DesktopWrapper>
  );
};

export default Desktop;