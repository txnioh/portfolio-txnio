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
}

interface DesktopIcon {
  id: string;
  icon: string;
  url: string;
}

const wallpapers = ['wallpaper1', 'wallpaper2', 'wallpaper3'];

export default function Home() {
  const [windows, setWindows] = useState<WindowState[]>([
    { id: 'Home', isOpen: false, zIndex: 0, icon: '/icons/apple.png', position: { x: 0, y: 0 } },
    { id: 'Proyectos', isOpen: false, zIndex: 0, icon: '/icons/notas.png', position: { x: 0, y: 0 } },
    { id: 'Sobre Mí', isOpen: false, zIndex: 0, icon: '/icons/visualstudio.png', position: { x: 0, y: 0 } },
    { id: 'Contacto', isOpen: false, zIndex: 0, icon: '/icons/correo.png', position: { x: 0, y: 0 } },
  ]);

  const [desktopApps, setDesktopApps] = useState<WindowState[]>([
    { id: 'Snake Game', isOpen: false, zIndex: 0, icon: '/icons/game.png', position: { x: 0, y: 0 } },
  ]);

  const [openApps, setOpenApps] = useState<WindowState[]>([]);

  const [desktopIcons] = useState<DesktopIcon[]>([
    { id: 'LinkedIn', icon: '/icons/linkedin.png', url: 'https://www.linkedin.com/in/txnio/' },
    { id: 'GitHub', icon: '/icons/github.png', url: 'https://github.com/txnioh' },
    { id: 'Curriculum', icon: '/icons/pdf.png', url: '/CV.pdf' },
    { id: 'Snake Game', icon: '/icons/game.png', url: '' },
  ]);

  const [wallpaperBase, setWallpaperBase] = useState('wallpaper1');
  const [isNightTime, setIsNightTime] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [windowPositions, setWindowPositions] = useState({});
  const [windowSizes, setWindowSizes] = useState({});

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

  const toggleWindow = (id: string) => {
    const targetWindow = [...windows, ...desktopApps].find(w => w.id === id);
    if (targetWindow) {
      if (desktopApps.some(app => app.id === id)) {
        setDesktopApps(prevApps => {
          const newApps = prevApps.map(app => 
            app.id === id ? { ...app, isOpen: !app.isOpen } : app
          );
          const updatedApp = newApps.find(app => app.id === id);
          if (updatedApp && updatedApp.isOpen) {
            const centerPosition = getCenterPosition();
            setWindowPositions(prev => ({ ...prev, [id]: centerPosition }));
            setWindowSizes(prev => ({ ...prev, [id]: { width: 1000, height: 700 } })); // Tamaño inicial más grande
            setOpenApps(prev => prev.some(app => app.id === id) ? prev : [...prev, updatedApp]);
          } else if (updatedApp) {
            setOpenApps(prev => prev.filter(app => app.id !== id));
          }
          return newApps;
        });
      } else {
        setWindows(prevWindows => 
          prevWindows.map(window => {
            if (window.id === id) {
              const newIsOpen = !window.isOpen;
              if (newIsOpen) {
                const centerPosition = getCenterPosition();
                setWindowPositions(prev => ({ ...prev, [id]: centerPosition }));
                setWindowSizes(prev => ({ ...prev, [id]: { width: 1000, height: 700 } })); // Tamaño inicial más grande
              }
              return { ...window, isOpen: newIsOpen };
            }
            return window;
          })
        );
      }
      bringToFront(id);
    }
  };

  const closeWindow = (id: string) => {
    if (desktopApps.some(app => app.id === id)) {
      setDesktopApps(prevApps => 
        prevApps.map(app => app.id === id ? { ...app, isOpen: false } : app)
      );
      setOpenApps(prev => prev.filter(app => app.id !== id));
    } else {
      setWindows(prevWindows => 
        prevWindows.map(window => window.id === id ? { ...window, isOpen: false } : window)
      );
    }
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
    if (url) {
      window.open(url, '_blank');
    } else {
      // Si la URL está vacía, busca la ventana correspondiente y la abre
      const window = [...windows, ...desktopApps].find(w => w.id === 'Snake Game');
      if (window) {
        toggleWindow(window.id);
      }
    }
  };

  const wallpaper = `/${wallpaperBase}-${isNightTime ? 'night' : 'day'}.jpg`;

  const setWallpaper = (newWallpaperBase: string) => {
    setWallpaperBase(newWallpaperBase);
  };

  const updateWindowPosition = (id: string, position: { x: number; y: number }) => {
    setWindowPositions(prev => ({ ...prev, [id]: position }));
  };

  const updateWindowSize = (id: string, size: { width: number; height: number }) => {
    setWindowSizes(prev => ({ ...prev, [id]: size }));
  };

  const getCenterPosition = () => {
    const windowWidth = 1000; // Ancho predeterminado de la ventana (aumentado)
    const windowHeight = 700; // Alto predeterminado de la ventana (aumentado)
    return {
      x: Math.max(0, Math.floor((window.innerWidth - windowWidth) / 2)),
      y: Math.max(0, Math.floor((window.innerHeight - windowHeight) / 2))
    };
  };

  return (
    <>
      <GlobalStyles wallpaper={wallpaper} />
      {isLoading ? (
        <MacLoading text="designed by txnio" />
      ) : (
        <Desktop
          windows={windows}
          desktopApps={desktopApps}
          openApps={openApps}
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
