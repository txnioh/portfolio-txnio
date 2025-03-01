import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectsContent from './WindowContents/ProjectsContent';
import AboutMeContent from './WindowContents/AboutMeContent';
import ContactContent from './WindowContents/ContactContent';
import HomeContent from './WindowContents/HomeContent';
import SettingsContent from './WindowContents/SettingsContent';
import SnakeGame from './WindowContents/SnakeGame';
import IframeContent from './WindowContents/IframeContent';
import { WindowState } from '../types';

interface WindowProps {
  window: WindowState;
  closeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  updatePosition: (newPosition: { x: number; y: number }) => void;
  updateSize: (newSize: { width: number; height: number }) => void;
  currentWallpaper: string;
  setWallpaper: (wallpaper: string) => void;
  isMobile: boolean;
}

const MOBILE_WINDOW_WIDTH = 'calc(100% - 20px)';
const MOBILE_WINDOW_HEIGHT = 'calc(100vh - 130px)';
const TOP_BAR_HEIGHT = 35;
const DOCK_HEIGHT = 60;
const BOTTOM_BUFFER = 10;

const WindowContainer = styled(motion.div)<{ isMobile: boolean }>`
  position: ${({ isMobile }) => isMobile ? 'fixed' : 'absolute'};
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(15px);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  color: white;
  overflow: hidden;
  ${({ isMobile }) => isMobile && `
    top: 45px !important;
    left: 10px !important;
    right: 10px !important;
    bottom: ${DOCK_HEIGHT + 10}px !important;
    width: ${MOBILE_WINDOW_WIDTH} !important;
    height: ${MOBILE_WINDOW_HEIGHT} !important;
    max-height: calc(100vh - ${TOP_BAR_HEIGHT + DOCK_HEIGHT + BOTTOM_BUFFER}px) !important;
  `}
`;

const WindowHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.03);
  cursor: move;
  user-select: none;
  height: 30px;
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

const WindowContent = styled.div<{ isMobile: boolean }>`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  padding: 0;
  ${({ isMobile }) => isMobile && `
    height: 100%;
    max-height: calc(100vh - ${TOP_BAR_HEIGHT + DOCK_HEIGHT + 50}px);
  `}
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
  window: windowProp,
  closeWindow,
  bringToFront,
  position,
  size,
  updatePosition,
  updateSize,
  currentWallpaper,
  setWallpaper,
  isMobile
}) => {
  const { id, zIndex, isOpen } = windowProp;
  const [isClosing, setIsClosing] = useState(false);

  const windowSize = useMemo(() => {
    if (isMobile) {
      return { width: MOBILE_WINDOW_WIDTH, height: MOBILE_WINDOW_HEIGHT };
    }
    const maxHeight = globalThis.window.innerHeight - DOCK_HEIGHT - BOTTOM_BUFFER;
    return {
      width: typeof size.width === 'string' ? parseInt(size.width, 10) : size.width,
      height: Math.min(
        typeof size.height === 'string' ? parseInt(size.height, 10) : size.height,
        maxHeight
      )
    };
  }, [isMobile, size]);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newY = e.clientY - dragOffset.y;
        updatePosition({
          x: e.clientX - dragOffset.x,
          y: Math.max(TOP_BAR_HEIGHT, newY),
        });
      } else if (isResizing) {
        let newWidth: number;
        let newHeight: number;
        let newX = position.x;

        const currentWidth = typeof windowSize.width === 'string' 
          ? parseInt(windowSize.width, 10) 
          : windowSize.width;

        const currentHeight = typeof windowSize.height === 'string'
          ? parseInt(windowSize.height, 10)
          : windowSize.height;

        if (resizeDirection.includes('right')) {
          newWidth = e.clientX - position.x;
        } else if (resizeDirection.includes('left')) {
          newWidth = currentWidth + (position.x - e.clientX);
          newX = e.clientX;
        } else {
          newWidth = currentWidth;
        }

        if (resizeDirection.includes('bottom')) {
          newHeight = e.clientY - position.y;
        } else {
          newHeight = currentHeight;
        }

        updateSize({ 
          width: Math.max(newWidth, 200), 
          height: Math.max(newHeight, 100) 
        });
        if (resizeDirection.includes('left')) {
          updatePosition({ x: newX, y: position.y });
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
  }, [isDragging, isResizing, dragOffset, position, windowSize, updatePosition, updateSize, resizeDirection]);

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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeWindow(id);
      setIsClosing(false);
    }, 200);
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
        return <SettingsContent currentWallpaper={currentWallpaper} setWallpaper={setWallpaper} />;
      case 'Snake Game':
        return isOpen ? <SnakeGame /> : null;
      case 'txniOS Old':
        return windowProp.url ? <IframeContent url={windowProp.url} /> : null;
      default:
        return <div>Contenido no disponible</div>;
    }
  };

  const variants = {
    hidden: { 
      opacity: 0, 
      filter: 'blur(10px)',
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      filter: 'blur(0px)',
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0, 
      filter: 'blur(10px)',
      transition: { duration: 0.2 }
    }
  };

  useEffect(() => {
    if (isOpen) {
      const newY = Math.max(TOP_BAR_HEIGHT, position.y);
      if (newY !== position.y) {
        updatePosition({
          x: position.x,
          y: newY
        });
      }
    }
  }, [isOpen, position.x, position.y, updatePosition]);

  useEffect(() => {
    const handleResize = () => {
      if (!isMobile) {
        const maxHeight = globalThis.window.innerHeight - DOCK_HEIGHT - BOTTOM_BUFFER;
        const currentHeight = typeof windowSize.height === 'string' ? parseInt(windowSize.height, 10) : windowSize.height;
        const newHeight = Math.min(currentHeight, maxHeight);
        if (newHeight !== currentHeight) {
          updateSize({
            width: typeof windowSize.width === 'string' ? parseInt(windowSize.width, 10) : windowSize.width,
            height: newHeight
          });
        }
      }
    };

    globalThis.window.addEventListener('resize', handleResize);
    return () => globalThis.window.removeEventListener('resize', handleResize);
  }, [windowSize, updateSize, isMobile]);

  return (
    <AnimatePresence>
      {(isOpen || isClosing) && (
        <WindowContainer
          ref={windowRef}
          style={{
            left: isMobile ? '10px' : `${position.x}px`,
            top: isMobile ? '60px' : `${position.y}px`,
            width: isMobile ? MOBILE_WINDOW_WIDTH : `${windowSize.width}px`,
            height: isMobile ? MOBILE_WINDOW_HEIGHT : `${windowSize.height}px`,
            maxHeight: `calc(100vh - ${DOCK_HEIGHT + BOTTOM_BUFFER}px)`,
            zIndex,
          }}
          onClick={() => bringToFront(id)}
          variants={variants}
          initial="hidden"
          animate={isClosing ? "exit" : "visible"}
          exit="exit"
          isMobile={isMobile}
        >
          <WindowHeader onMouseDown={isMobile ? undefined : handleMouseDown}>
            <CloseButton onClick={handleClose} />
            <WindowTitle>{id}</WindowTitle>
          </WindowHeader>
          <WindowContent isMobile={isMobile}>{renderContent()}</WindowContent>
          {!isMobile && (
            <>
              <ResizeHandle position="right" onMouseDown={(e) => handleResizeMouseDown(e, 'right')} />
              <ResizeHandle position="bottom" onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')} />
              <ResizeHandle position="left" onMouseDown={(e) => handleResizeMouseDown(e, 'left')} />
              <ResizeHandle position="bottom-right" onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')} />
              <ResizeHandle position="bottom-left" onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')} />
            </>
          )}
        </WindowContainer>
      )}
    </AnimatePresence>
  );
};

export default Window;
