import React from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import Window from './Window';
import { WindowState } from '../types'; // Añade esta línea

const WindowContainerWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 10; // Añadimos un z-index más alto
`;

interface WindowContainerProps {
  windows: WindowState[];
  closeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
}

const WindowContainer: React.FC<WindowContainerProps> = ({ windows, closeWindow, bringToFront }) => {
  return (
    <WindowContainerWrapper>
      <AnimatePresence>
        {windows.filter(window => window.isOpen).map((window) => (
          <Window
            key={window.id}
            window={window}
            closeWindow={closeWindow}
            bringToFront={bringToFront}
          />
        ))}
      </AnimatePresence>
    </WindowContainerWrapper>
  );
};

export default WindowContainer;