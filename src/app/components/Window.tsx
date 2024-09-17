import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { WindowState } from '../types';
import ProjectsContent from './WindowContents/ProjectsContent';
import AboutMeContent from './WindowContents/AboutMeContent';
import ContactContent from './WindowContents/ContactContent';
import HomeContent from './WindowContents/HomeContent';

const WindowWrapper = styled(motion.div)`
  background-color: rgba(30, 30, 30, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  width: 80%;
  max-width: 800px;
  height: 70%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  z-index: 100; // Aseguramos que cada ventana tenga un z-index alto
`;

const WindowHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background-color: rgba(50, 50, 50, 0.5);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid rgba(68, 68, 68, 0.5);
  position: relative;
`;

const WindowTitle = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #e0e0e0;
`;

const CloseButton = styled.button`
  background-color: #ff5f57;
  border: none;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  cursor: pointer;
  position: absolute;
  left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ff5f57;
    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 8px;
      height: 2px;
      background-color: rgba(0, 0, 0, 0.5);
    }
    &::before {
      transform: rotate(45deg);
    }
    &::after {
      transform: rotate(-45deg);
    }
  }
`;

const WindowContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0; // Eliminamos el padding
  display: flex; // Añadimos display flex
  flex-direction: column; // Para que el contenido se extienda verticalmente
`;

interface WindowProps {
  window: WindowState;
  closeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
}

const Window: React.FC<WindowProps> = ({ window, closeWindow, bringToFront }) => {
  const renderContent = () => {
    switch (window.id) {
      case 'Home':
        return <HomeContent />;
      case 'Proyectos':
        return <ProjectsContent />;
      case 'Sobre Mí':
        return <AboutMeContent />;
      case 'Contacto':
        return <ContactContent />;
      default:
        return <div>Contenido no disponible</div>;
    }
  };

  return (
    <WindowWrapper
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: window.position.x,
        y: window.position.y,
        zIndex: window.zIndex + 100 // Aseguramos que el z-index sea siempre alto
      }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={() => bringToFront(window.id)}
    >
      <WindowHeader>
        <CloseButton onClick={() => closeWindow(window.id)} />
        <WindowTitle>{window.id}</WindowTitle>
      </WindowHeader>
      <WindowContent>
        {renderContent()}
      </WindowContent>
    </WindowWrapper>
  );
};

export default Window;