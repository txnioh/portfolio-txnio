import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
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
  toggleWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  desktopIcons: DesktopIcon[];
  openUrl: (url: string) => void;
}

const Desktop: React.FC<DesktopProps> = ({
  windows,
  toggleWindow,
  closeWindow,
  bringToFront,
  desktopIcons,
  openUrl
}) => {
  return (
    <DesktopWrapper>
      <TopBar />
      <Image
        src="/mac-wallpaper.jpg"
        alt="Mac Wallpaper"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
        priority
      />
      <DesktopIcons icons={desktopIcons} openUrl={openUrl} />
      <WindowContainer
        windows={windows}
        closeWindow={closeWindow}
        bringToFront={bringToFront}
      />
      <Dock windows={windows} toggleWindow={toggleWindow} />
    </DesktopWrapper>
  );
};

export default Desktop;