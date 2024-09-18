import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ProjectsContent from './WindowContents/ProjectsContent';
import AboutMeContent from './WindowContents/AboutMeContent';
import ContactContent from './WindowContents/ContactContent';
import HomeContent from './WindowContents/HomeContent';
import SettingsContent from './WindowContents/SettingsContent';
import SnakeGame from './WindowContents/SnakeGame';
import { WindowState } from '../types'; // Asegúrate de importar WindowState

interface WindowProps {
  window: WindowState;
  closeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updatePosition: (id: string, position: { x: number; y: number }) => void;
  updateSize: (id: string, size: { width: number; height: number }) => void;
}

const WindowContainer = styled(motion.div)`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  color: white;
  overflow: hidden;
`;

const WindowHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: move;
  user-select: none;
`;

const CloseButton = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ff5f56;
  border: none;
  margin-right: 8px;
  cursor: pointer;
  position: absolute;
  left: 8px;
`;

const WindowTitle = styled.span`
  flex: 1;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const WindowContent = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const ResizeHandle = styled.div<{ position: string }>`
  position: absolute;
  ${({ position }) => {
    switch (position) {
      case 'right':
        return 'top: 0; right: 0; width: 5px; height: 100%; cursor: ew-resize;';
      case 'bottom':
        return 'bottom: 0; left: 0; width: 100%; height: 5px; cursor: ns-resize;';
      case 'left':
        return 'top: 0; left: 0; width: 5px; height: 100%; cursor: ew-resize;';
      case 'bottom-right':
        return 'bottom: 0; right: 0; width: 10px; height: 10px; cursor: nwse-resize;';
      case 'bottom-left':
        return 'bottom: 0; left: 0; width: 10px; height: 10px; cursor: nesw-resize;';
      default:
        return '';
    }
  }}
`;

const Window: React.FC<WindowProps> = ({ 
  window, 
  closeWindow, 
  bringToFront, 
  updatePosition,
  updateSize 
}) => {
  const { id, title, zIndex, position, size } = window;
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updatePosition(id, {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      } else if (isResizing) {
        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;

        if (resizeDirection.includes('right')) {
          newWidth = e.clientX - position.x;
        } else if (resizeDirection.includes('left')) {
          newWidth = size.width + (position.x - e.clientX);
          newX = e.clientX;
        }

        if (resizeDirection.includes('bottom')) {
          newHeight = e.clientY - position.y;
        }

        updateSize(id, { width: Math.max(newWidth, 200), height: Math.max(newHeight, 100) });
        if (resizeDirection.includes('left')) {
          updatePosition(id, { x: newX, y: position.y });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, id, position, size, updatePosition, updateSize, resizeDirection]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    bringToFront(id);
    e.preventDefault();
  };

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    bringToFront(id);
  };

  const renderContent = () => {
    switch (id) {
      case 'Home':
        return <HomeContent />;
      case 'Proyectos':
        return <ProjectsContent />;
      case 'Sobre Mí':
        return <AboutMeContent />;
      case 'Contacto':
        return <ContactContent />;
      case 'Settings':
        return <SettingsContent currentWallpaper="" setWallpaper={() => {}} />;
      case 'Snake Game':
        return <SnakeGame />;
      default:
        return <div>Contenido no disponible</div>;
    }
  };

  return (
    <WindowContainer
      ref={windowRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex,
      }}
      onClick={() => bringToFront(id)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <WindowHeader onMouseDown={handleMouseDown}>
        <CloseButton onClick={() => closeWindow(id)} />
        <WindowTitle>{title}</WindowTitle>
      </WindowHeader>
      <WindowContent>{renderContent()}</WindowContent>
      <ResizeHandle position="right" onMouseDown={(e) => handleResizeMouseDown(e, 'right')} />
      <ResizeHandle position="bottom" onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')} />
      <ResizeHandle position="left" onMouseDown={(e) => handleResizeMouseDown(e, 'left')} />
      <ResizeHandle position="bottom-right" onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')} />
      <ResizeHandle position="bottom-left" onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')} />
    </WindowContainer>
  );
};

export default Window;