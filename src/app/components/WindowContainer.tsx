import React from 'react';
import Window from './Window';
import { WindowState } from '../types';

interface WindowContainerProps {
  window: WindowState;
  closeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  position: { x: number; y: number };
  size: { width: number; height: number };
  updateWindowPosition: (id: string, newPosition: { x: number; y: number }) => void;
  updateWindowSize: (id: string, newSize: { width: number; height: number }) => void;
  currentWallpaper: string;
  setWallpaper: (wallpaper: string) => void;
  isMobile: boolean;
}

const WindowContainer: React.FC<WindowContainerProps> = ({
  window,
  closeWindow,
  bringToFront,
  position,
  size,
  updateWindowPosition,
  updateWindowSize,
  currentWallpaper,
  setWallpaper,
  isMobile,
}) => {
  return (
    <Window
      window={window}
      closeWindow={closeWindow}
      bringToFront={bringToFront}
      position={position}
      size={size}
      updatePosition={(newPosition) => updateWindowPosition(window.id, newPosition)}
      updateSize={(newSize) => updateWindowSize(window.id, newSize)}
      currentWallpaper={currentWallpaper}
      setWallpaper={setWallpaper}
      isMobile={isMobile}
    />
  );
};

export default WindowContainer;