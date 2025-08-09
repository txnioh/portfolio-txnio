'use client'

import React, { useState, useEffect } from 'react';
import Desktop from '../components/Desktop';
import MacLoading from '../components/MacLoading';
import { WindowState, DesktopIcon } from '../types';

const MacFolioPage = () => {
  const [loading, setLoading] = useState(true);
  const [windows, setWindows] = useState<WindowState[]>([
    // Aplicaciones permanentes en el dock
    { id: 'Sobre Mí', isOpen: false, zIndex: 1, isPermanent: true, icon: '/emojis/U+1F468_U+200D_U+1F4BB.png' },
    { id: 'Proyectos', isOpen: false, zIndex: 1, isPermanent: true, icon: '/emojis/U+1F4BB.png' },
    { id: 'Contacto', isOpen: false, zIndex: 1, isPermanent: true, icon: '/emojis/U+1F4E7.png' },
    { id: 'Settings', isOpen: false, zIndex: 1, isPermanent: true, icon: '/emojis/U+2699.png' },
    { id: 'Snake Game', isOpen: false, zIndex: 1, isPermanent: true, icon: '/emojis/U+1F40D.png' },
  ]);
  const [windowPositions, setWindowPositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [windowSizes, setWindowSizes] = useState<{ [key: string]: { width: number; height: number } }>({});
  const [currentWallpaper, setCurrentWallpaper] = useState('/wallpaper1-day.jpg');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const desktopIcons: DesktopIcon[] = [
    { id: 'Sobre Mí', name: 'About Me', icon: '/emojis/U+1F468_U+200D_U+1F4BB.png', url: 'about' },
    { id: 'Proyectos', name: 'Projects', icon: '/emojis/U+1F4BB.png', url: 'projects' },
    { id: 'Contacto', name: 'Contact', icon: '/emojis/U+1F4E7.png', url: 'contact' },
    { id: 'Settings', name: 'Settings', icon: '/emojis/U+2699.png', url: 'settings' },
    { id: 'Snake Game', name: 'Snake Game', icon: '/emojis/U+1F40D.png', url: 'snake' },
  ];

  const openUrl = (url: string, id?: string) => {
    const windowId = id || url;
    const existingWindow = windows.find(w => w.id === windowId);
    
    if (existingWindow) {
      if (!existingWindow.isOpen) {
        setWindows(prev =>
          prev.map(window =>
            window.id === windowId 
              ? { ...window, isOpen: true, zIndex: Math.max(...prev.map(w => w.zIndex), 0) + 1 }
              : window
          )
        );
      } else {
        bringToFront(windowId);
      }
      return;
    }

    // Solo crear nueva ventana si no existe como permanente
    const newWindow: WindowState = {
      id: windowId,
      title: desktopIcons.find(icon => icon.url === url)?.id || url,
      url: url,
      isOpen: true,
      isMinimized: false,
      zIndex: Math.max(...windows.map(w => w.zIndex), 0) + 1,
      icon: desktopIcons.find(icon => icon.url === url)?.icon || '',
    };

    setWindows(prev => [...prev, newWindow]);
  };

  const toggleWindow = (id: string) => {
    setWindows(prev =>
      prev.map(window =>
        window.id === id 
          ? { 
              ...window, 
              isOpen: window.isPermanent ? !window.isOpen : window.isOpen,
              isMinimized: window.isPermanent ? false : !window.isMinimized,
              zIndex: !window.isOpen || window.isMinimized ? Math.max(...prev.map(w => w.zIndex), 0) + 1 : window.zIndex
            }
          : window
      )
    );
  };

  const closeWindow = (id: string) => {
    setWindows(prev => 
      prev.map(window =>
        window.id === id
          ? window.isPermanent 
            ? { ...window, isOpen: false, isMinimized: false }
            : window
          : window
      ).filter(window => !window.isPermanent || window.isPermanent)
    );
  };

  const bringToFront = (id: string) => {
    const maxZ = Math.max(...windows.map(w => w.zIndex));
    setWindows(prev =>
      prev.map(window =>
        window.id === id 
          ? { ...window, zIndex: maxZ + 1, isMinimized: false }
          : window
      )
    );
  };

  const updateWindowPosition = (id: string, position: { x: number; y: number }) => {
    setWindowPositions(prev => ({
      ...prev,
      [id]: position
    }));
  };

  const updateWindowSize = (id: string, size: { width: number; height: number }) => {
    setWindowSizes(prev => ({
      ...prev,
      [id]: size
    }));
  };

  const setWallpaper = (wallpaper: string) => {
    setCurrentWallpaper(wallpaper);
  };

  if (loading) {
    return <MacLoading />;
  }

  return (
    <Desktop
      windows={windows}
      toggleWindow={toggleWindow}
      closeWindow={closeWindow}
      bringToFront={bringToFront}
      desktopIcons={desktopIcons}
      openUrl={openUrl}
      currentWallpaper={currentWallpaper}
      setWallpaper={setWallpaper}
      windowPositions={windowPositions}
      windowSizes={windowSizes}
      updateWindowPosition={updateWindowPosition}
      updateWindowSize={updateWindowSize}
    />
  );
};

export default MacFolioPage;