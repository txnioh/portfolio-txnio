import React from 'react';
import styled from 'styled-components';
import Dock from './Dock';
import TopBar from './TopBar';
import WindowContainer from './WindowContainer';
import DesktopIcons from './DesktopIcons';
import { WindowState, DesktopIcon } from '../types'; // Añade esta línea

const DesktopWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

interface DesktopProps {
  windows: WindowState[];
  desktopApps: WindowState[];
  openApps: WindowState[];
  toggleWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  desktopIcons: DesktopIcon[];
  openUrl: (url: string) => void;
  currentWallpaper: string;
  setWallpaper: (wallpaper: string) => void;
}

const Desktop: React.FC<DesktopProps> = ({
  windows,
  desktopApps,
  openApps,
  toggleWindow,
  closeWindow,
  bringToFront,
  desktopIcons,
  openUrl,
  currentWallpaper,
  setWallpaper
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
      <DesktopIcons icons={desktopIcons} openUrl={openUrl} />
      <WindowContainer
        windows={[...windows, ...desktopApps]}
        closeWindow={closeWindow}
        bringToFront={bringToFront}
        currentWallpaper={currentWallpaper}
        setWallpaper={setWallpaper}
      />
      <Dock windows={windows} openApps={openApps} toggleWindow={toggleWindow} />
    </DesktopWrapper>
  );
};

export default Desktop;