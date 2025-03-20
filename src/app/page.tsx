'use client'

import React, { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import Desktop from './components/Desktop';
import MacLoading from './components/MacLoading';

const GlobalStyles = createGlobalStyle<{ wallpaper: string }>`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-image: url(${props => props.wallpaper});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    color: #e0e0e0;
    user-select: none; // Evita la selección de texto en todo el cuerpo
  }
`;

interface WindowState {
  id: string;
  isOpen: boolean;
  zIndex: number;
  icon: string;
  position: { x: number; y: number };
  url?: string;
  isPermanent: boolean;
}

interface DesktopIcon {
  id: string;
  icon: string;
  url: string;
}

const wallpapers = ['wallpaper1', 'wallpaper2', 'wallpaper3'];

export default function Home() {
  const [windows, setWindows] = useState<WindowState[]>([
    { id: 'Home', isOpen: false, zIndex: 0, icon: '/icons/apple.png', position: { x: 0, y: 0 }, isPermanent: true },
    { id: 'Proyectos', isOpen: false, zIndex: 0, icon: '/icons/directory.png', position: { x: 0, y: 0 }, isPermanent: true },
    { id: 'Sobre Mí', isOpen: false, zIndex: 0, icon: '/icons/visualstudio.png', position: { x: 0, y: 0 }, isPermanent: true },
    { id: 'Contacto', isOpen: false, zIndex: 0, icon: '/icons/correo.png', position: { x: 0, y: 0 }, isPermanent: true },
    { id: 'Snake Game', isOpen: false, zIndex: 0, icon: '/icons/game.png', position: { x: 0, y: 0 }, isPermanent: false },
    { id: 'txniOS Old', isOpen: false, zIndex: 0, icon: '/icons/mac.png', position: { x: 0, y: 0 }, url: 'https://os.txnio.com', isPermanent: true }
  ]);

  const [desktopIcons] = useState<DesktopIcon[]>([
    { id: 'LinkedIn', icon: '/icons/linkedin.png', url: 'https://www.linkedin.com/in/txnio/' },
    { id: 'GitHub', icon: '/icons/github.png', url: 'https://github.com/txnioh' },
    { id: 'Proyectos', icon: '/icons/directory.png', url: '' },
    { id: 'Sobre Mí', icon: '/icons/visualstudio.png', url: '' },
    { id: 'Snake Game', icon: '/icons/game.png', url: '' },
    { id: 'txniOS Old', icon: '/icons/mac.png', url: 'https://os.txnio.com' }
  ]);

  const [wallpaperBase, setWallpaperBase] = useState('wallpaper1');
  const [isNightTime, setIsNightTime] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [windowPositions, setWindowPositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [windowSizes, setWindowSizes] = useState<{ [key: string]: { width: number; height: number } }>({});

  useEffect(() => {
    const checkTime = () => {
      const currentHour = new Date().getHours();
      setIsNightTime(currentHour >= 18 || currentHour < 6);
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const preloadImages = async () => {
      const imagesToPreload = [
        ...windows.map(w => w.icon),
        ...desktopIcons.map(d => d.icon),
        ...wallpapers.flatMap(w => [`/${w}-day.jpg`, `/${w}-night.jpg`])
      ];

      const imagePromises = imagesToPreload.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setIsLoading(false);
      } catch (error) {
        console.error('Error preloading images:', error);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, [windows, desktopIcons]);

  const getCenterPosition = (index: number = 0) => {
    const windowWidth = 1200; // Ancho predeterminado de la ventana (aumentado)
    const windowHeight = 800; // Alto predeterminado de la ventana (aumentado)
    const offset = index * 30; // Desplazamiento para ventanas subsiguientes
    return {
      x: Math.max(0, Math.floor((window.innerWidth - windowWidth) / 2) + offset),
      y: Math.max(0, Math.floor((window.innerHeight - windowHeight) / 2) + offset)
    };
  };

  const toggleWindow = (id: string) => {
    const targetWindow = windows.find(w => w.id === id);
    if (targetWindow) {
      const openWindowsCount = windows.filter(w => w.isOpen).length;
      setWindows(prevWindows => 
        prevWindows.map(window => {
          if (window.id === id) {
            const newIsOpen = !window.isOpen;
            if (newIsOpen) {
              const centerPosition = getCenterPosition(openWindowsCount);
              setWindowPositions(prev => ({ ...prev, [id]: centerPosition }));
              setWindowSizes(prev => ({ ...prev, [id]: { width: 1200, height: 800 } }));
            }
            return { ...window, isOpen: newIsOpen };
          }
          return window;
        })
      );
      bringToFront(id);
    }
  };

  const closeWindow = (id: string) => {
    setWindows(prevWindows => 
      prevWindows.map(window => 
        window.id === id ? { ...window, isOpen: false } : window
      )
    );
  };

  const bringToFront = (id: string) => {
    setWindows(prevWindows => {
      const maxZIndex = Math.max(...prevWindows.map(w => w.zIndex));
      return prevWindows.map(window => 
        window.id === id ? { ...window, zIndex: maxZIndex + 1 } : window
      );
    });
  };

  const openUrl = (url: string, id?: string) => {
    if (id === 'txniOS Old') {
      toggleWindow('txniOS Old');
    } else if (id === 'Proyectos') {
      toggleWindow('Proyectos');
    } else if (id === 'Sobre Mí') {
      toggleWindow('Sobre Mí');
    } else if (url) {
      window.open(url, '_blank');
    } else {
      // If the URL is empty and no specific case, it's the Snake Game
      toggleWindow('Snake Game');
    }
  };

  const wallpaper = `/${wallpaperBase}-${isNightTime ? 'night' : 'day'}.jpg`;

  const setWallpaper = (newWallpaperBase: string) => {
    setWallpaperBase(newWallpaperBase);
  };

  const updateWindowPosition = (id: string, newPosition: { x: number; y: number }) => {
    setWindowPositions(prev => ({ ...prev, [id]: newPosition }));
  };

  const updateWindowSize = (id: string, newSize: { width: number; height: number }) => {
    setWindowSizes(prev => ({ ...prev, [id]: newSize }));
  };

  return (
    <>
      <GlobalStyles wallpaper={wallpaper} />
      {isLoading ? (
        <MacLoading text="..." />
      ) : (
        <Desktop
          windows={windows}
          toggleWindow={toggleWindow}
          closeWindow={closeWindow}
          bringToFront={bringToFront}
          desktopIcons={desktopIcons}
          openUrl={openUrl}
          currentWallpaper={wallpaperBase}
          setWallpaper={setWallpaper}
          windowPositions={windowPositions}
          windowSizes={windowSizes}
          updateWindowPosition={updateWindowPosition}
          updateWindowSize={updateWindowSize}
        />
      )}
    </>
  );
}
