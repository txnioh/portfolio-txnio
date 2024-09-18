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
  }
`;

interface WindowState {
  id: string;
  isOpen: boolean;
  zIndex: number;
  icon: string;
  position: { x: number; y: number };
  url?: string;
}

interface DesktopIcon {
  id: string;
  icon: string;
  url: string;
}

export default function Home() {
  const [windows, setWindows] = useState<WindowState[]>([
    { id: 'Home', isOpen: false, zIndex: 0, icon: '/icons/apple.png', position: { x: 0, y: 0 } },
    { id: 'Proyectos', isOpen: false, zIndex: 0, icon: '/icons/notas.png', position: { x: 0, y: 0 } },
    { id: 'Sobre Mí', isOpen: false, zIndex: 0, icon: '/icons/visualstudio.png', position: { x: 0, y: 0 } },
    { id: 'Contacto', isOpen: false, zIndex: 0, icon: '/icons/correo.png', position: { x: 0, y: 0 } },
    // Eliminamos la línea de Ajustes
  ]);

  const [desktopIcons] = useState<DesktopIcon[]>([
    { id: 'LinkedIn', icon: '/icons/linkedin.png', url: 'https://www.linkedin.com/in/txnio/' },
    { id: 'GitHub', icon: '/icons/github.png', url: 'https://github.com/txnioh' },
    { id: 'Curriculum', icon: '/icons/pdf.png', url: '/CV.pdf' },  // Nuevo ícono para el CV
  ]);

  const toggleWindow = (id: string) => {
    setWindows(prevWindows => {
      const targetWindow = prevWindows.find(w => w.id === id);
      if (targetWindow?.url) {
        window.open(targetWindow.url, '_blank');
        return prevWindows;
      }

      const openWindows = prevWindows.filter(w => w.isOpen);
      const newWindows = prevWindows.map(w => {
        if (w.id === id) {
          const isOpening = !w.isOpen;
          const newZIndex = Math.max(...prevWindows.map(w => w.zIndex)) + 1;
          const newPosition = isOpening
            ? { x: openWindows.length * 30, y: openWindows.length * 30 }
            : w.position;
          return { ...w, isOpen: isOpening, zIndex: newZIndex, position: newPosition };
        }
        return w;
      });
      return newWindows;
    });
  };

  const closeWindow = (id: string) => {
    setWindows(prevWindows => prevWindows.map(window => 
      window.id === id ? { ...window, isOpen: false } : window
    ));
  };

  const bringToFront = (id: string) => {
    setWindows(prevWindows => {
      const maxZIndex = Math.max(...prevWindows.map(w => w.zIndex));
      return prevWindows.map(window => 
        window.id === id ? { ...window, zIndex: maxZIndex + 1 } : window
      );
    });
  };

  const openUrl = (url: string) => {
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      // Para archivos locales como el PDF, abrimos en la misma ventana
      window.open(url, '_self');
    }
  };

  const [wallpaperBase, setWallpaperBase] = useState('wallpaper1');
  const [isNightTime, setIsNightTime] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Ajusta este tiempo según tus necesidades

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkTime = () => {
      const currentHour = new Date().getHours();
      setIsNightTime(currentHour >= 18 || currentHour < 6);
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const wallpaper = `/${wallpaperBase}-${isNightTime ? 'night' : 'day'}.png`;

  const setWallpaper = (newWallpaperBase: string) => {
    setWallpaperBase(newWallpaperBase);
  };

  return (
    <>
      <GlobalStyles wallpaper={wallpaper} />
      {isLoading ? (
        <MacLoading />
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
        />
      )}
    </>
  );
}
