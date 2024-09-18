import React from 'react';
import styled from 'styled-components';
import Window from './Window';
import { WindowState } from '../types';

const WindowContainerStyled = styled.div`
  position: relative;
  flex: 1;
`;

interface WindowContainerProps {
  windows: WindowState[];
  closeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  currentWallpaper: string;
  setWallpaper: (wallpaper: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
}

const WindowContainer: React.FC<WindowContainerProps> = ({
  windows,
  closeWindow,
  bringToFront,
  currentWallpaper,
  setWallpaper,
  updateWindowPosition,
  updateWindowSize
}) => {
  return (
    <WindowContainerStyled>
      {windows.map((window) => (
        window.isOpen && (
          <Window
            key={window.id}
            window={window}
            closeWindow={closeWindow}
            bringToFront={bringToFront}
            currentWallpaper={currentWallpaper}
            setWallpaper={setWallpaper}
            updatePosition={updateWindowPosition}
            updateSize={updateWindowSize}
          />
        )
      ))}
    </WindowContainerStyled>
  );
};

export default WindowContainer;