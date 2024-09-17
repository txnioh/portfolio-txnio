'use client'

import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaCompass, FaCog } from 'react-icons/fa';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-image: url('/mac-wallpaper.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    color: #e0e0e0;
  }
`;

const Desktop = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Dock = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
`;

const DockIcon = styled(motion.div)`
  width: 60px;
  height: 60px;
  margin: 0 15px;
  cursor: pointer;
  border-radius: 10px;
  overflow: visible;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  position: relative;
`;

const IconLabel = styled.span`
  font-size: 12px;
  margin-top: 5px;
  color: white;
  text-shadow: 0 0 3px rgba(0,0,0,0.5);
`;

const OpenIndicator = styled.div`
  width: 5px;
  height: 5px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
`;

const WindowContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;

const Window = styled(motion.div)`
  background-color: rgba(30, 30, 30, 0.6);
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
`;

const WindowHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background-color: rgba(50, 50, 50, 0.8);
  border-bottom: 1px solid #444;
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

const DesktopIcons = styled.div`
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DesktopIcon = styled(motion.div)`
  width: 80px;
  height: 80px;
  margin: 10px 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 40px;
`;

const DesktopIconLabel = styled.span`
  font-size: 12px;
  margin-top: 5px;
  color: white;
  text-shadow: 0 0 3px rgba(0,0,0,0.5);
  text-align: center;
`;

// Nuevos styled components para la página de proyectos
const ProjectsContainer = styled.div`
  display: flex;
  height: 100%;
  background-color: transparent;
`;

const ProjectsSidebar = styled.div`
  width: 250px;
  background-color: rgba(20, 20, 20, 0.4);
  border-right: 1px solid rgba(80, 80, 80, 0.3);
  overflow-y: auto;
`;

const ProjectsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ProjectItem = styled.li<{ isActive: boolean }>`
  padding: 10px 20px;
  cursor: pointer;
  background-color: ${props => props.isActive ? 'rgba(80, 80, 80, 0.5)' : 'transparent'};
  color: ${props => props.isActive ? '#ffffff' : '#b0b0b0'};

  &:hover {
    background-color: rgba(80, 80, 80, 0.5);
  }
`;

const ProjectContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: transparent;
`;

const ProjectTitle = styled.h3`
  margin-top: 0;
  font-size: 24px;
  color: #e0e0e0;
`;

const ProjectDescription = styled.p`
  font-size: 16px;
  color: #b0b0b0;
  line-height: 1.5;
`;

const ProjectLink = styled.a`
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #0056b3;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #003d82;
  }
`;

const VSCodeContainer = styled.div`
  background-color: rgba(30, 30, 30, 0.6);
  color: #d4d4d4;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const VSCodeHeader = styled.div`
  background-color: #252526;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #1e1e1e;
`;

const VSCodeTab = styled.div`
  padding: 5px 10px;
  background-color: #2d2d2d;
  border-right: 1px solid #252526;
  font-size: 12px;
`;

const VSCodeContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: 10px;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 18px;
  background-color: #333;
  animation: blink 0.7s infinite;
  vertical-align: middle;

  @keyframes blink {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

// Nuevos styled components para el formulario de contacto
const ContactContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
  background-color: transparent;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: rgba(20, 20, 20, 0.4);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  color: #e0e0e0;
  text-align: center;
  margin-bottom: 20px;
`;

const FormInput = styled.input`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #444;
  background-color: #2d2d2d;
  color: #e0e0e0;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #0056b3;
  }
`;

const FormTextarea = styled.textarea`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #444;
  background-color: #2d2d2d;
  color: #e0e0e0;
  font-size: 16px;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #0056b3;
  }
`;

const FormButton = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  background-color: #0056b3;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #003d82;
  }
`;

const TopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 25px;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  color: white;
  font-size: 12px;
  z-index: 1000;
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
`;

const TopBarIcon = styled.div`
  margin: 0 5px;
  cursor: pointer;
`;

const TopBarText = styled.div`
  margin: 0 5px;
`;

interface WindowState {
  id: string;
  isOpen: boolean;
  zIndex: number;
  icon: string;
  position: { x: number; y: number };
  url?: string;
}

export default function Home() {
  const [windows, setWindows] = useState<WindowState[]>([
    { id: 'Home', isOpen: false, zIndex: 0, icon: '/icons/home.png', position: { x: 0, y: 0 } },
    { id: 'Proyectos', isOpen: false, zIndex: 0, icon: '/icons/notas.png', position: { x: 0, y: 0 } },
    { id: 'Sobre Mí', isOpen: false, zIndex: 0, icon: '/icons/visualstudio.png', position: { x: 0, y: 0 } },
    { id: 'Contacto', isOpen: false, zIndex: 0, icon: '/icons/correo.png', position: { x: 0, y: 0 } },
  ]);

  const [desktopIcons] = useState([
    { id: 'LinkedIn', icon: '/icons/linkedin.png', url: 'https://www.linkedin.com/in/txnio/' },
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
    window.open(url, '_blank');
  };

  const projects = [
    {
      id: 1,
      title: "E-commerce App",
      description: "Una aplicación de comercio electrónico construida con React y Node.js",
      icon: "/icons/ecommerce.png",
      link: "https://github.com/yourusername/ecommerce-app"
    },
    {
      id: 2,
      title: "Weather Dashboard",
      description: "Dashboard del clima utilizando la API de OpenWeatherMap",
      icon: "/icons/weather.png",
      link: "https://github.com/yourusername/weather-dashboard"
    },
    {
      id: 3,
      title: "Task Manager",
      description: "Aplicación de gestión de tareas con React y Firebase",
      icon: "/icons/task.png",
      link: "https://github.com/yourusername/task-manager"
    },
    {
      id: 4,
      title: "Portfolio Website",
      description: "Sitio web de portfolio personal construido con Next.js",
      icon: "/icons/portfolio.png",
      link: "https://github.com/yourusername/portfolio-website"
    }
  ];

  const [activeProject, setActiveProject] = useState(projects[0]);

  const aboutMeCode = `const aboutTxnio = {
  name: "Txnio",
  role: "Full Stack Developer",
  skills: [
    "JavaScript", "TypeScript", "React",
    "Node.js", "Python", "SQL", "NoSQL"
  ],
  interests: [
    "Web Development", "Machine Learning",
    "Blockchain", "Open Source"
  ],
  currentlyLearning: "Next.js and GraphQL",
  funFact: "I can solve a Rubik's cube in under 2 minutes!"
};

console.log("Welcome to my portfolio!");
console.log(aboutTxnio);`;

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <GlobalStyles />
      <Desktop>
        <TopBar>
          <TopBarLeft>
            <TopBarIcon><FaCompass /></TopBarIcon>
            <TopBarIcon><FaCog /></TopBarIcon>
          </TopBarLeft>
          <TopBarRight>
            <TopBarText>{formatDate(currentTime)}</TopBarText>
            <TopBarText>{formatTime(currentTime)}</TopBarText>
          </TopBarRight>
        </TopBar>
        <Image
          src="/mac-wallpaper.jpg"
          alt="Mac Wallpaper"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          priority
        />
        <DesktopIcons>
          {desktopIcons.map((icon) => (
            <DesktopIcon
              key={icon.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openUrl(icon.url)}
            >
              <Image src={icon.icon} alt={icon.id} width={60} height={60} />
              <DesktopIconLabel>{icon.id}</DesktopIconLabel>
            </DesktopIcon>
          ))}
        </DesktopIcons>
        <WindowContainer>
          <AnimatePresence>
            {windows.filter(window => window.isOpen).map((window) => (
              <Window
                key={window.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  x: window.position.x,
                  y: window.position.y
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{ zIndex: window.zIndex }}
                onClick={() => bringToFront(window.id)}
              >
                <WindowHeader>
                  <CloseButton onClick={() => closeWindow(window.id)} />
                  <WindowTitle>{window.id}</WindowTitle>
                </WindowHeader>
                {window.id === 'Proyectos' ? (
                  <ProjectsContainer>
                    <ProjectsSidebar>
                      <ProjectsList>
                        {projects.map((project) => (
                          <ProjectItem
                            key={project.id}
                            isActive={project.id === activeProject.id}
                            onClick={() => setActiveProject(project)}
                          >
                            {project.title}
                          </ProjectItem>
                        ))}
                      </ProjectsList>
                    </ProjectsSidebar>
                    <ProjectContent>
                      <ProjectTitle>{activeProject.title}</ProjectTitle>
                      <ProjectDescription>{activeProject.description}</ProjectDescription>
                      <ProjectLink href={activeProject.link} target="_blank" rel="noopener noreferrer">
                        Ver Proyecto
                      </ProjectLink>
                    </ProjectContent>
                  </ProjectsContainer>
                ) : window.id === 'Sobre Mí' ? (
                  <VSCodeContainer>
                    <VSCodeHeader>
                      <VSCodeTab>aboutMe.js</VSCodeTab>
                    </VSCodeHeader>
                    <VSCodeContent>
                      <SyntaxHighlighter
                        language="javascript"
                        style={vscDarkPlus}
                        showLineNumbers
                        wrapLines
                        customStyle={{
                          backgroundColor: 'transparent',
                          padding: 0,
                          margin: 0,
                        }}
                      >
                        {aboutMeCode}
                      </SyntaxHighlighter>
                      <Cursor />
                    </VSCodeContent>
                  </VSCodeContainer>
                ) : window.id === 'Contacto' ? (
                  <ContactContainer>
                    <ContactForm action="https://formsubmit.co/txniodev@gmail.com" method="POST">
                      <FormTitle>Contáctame</FormTitle>
                      <FormInput type="text" name="name" placeholder="Nombre" required />
                      <FormInput type="email" name="email" placeholder="Email" required />
                      <FormTextarea name="message" placeholder="Mensaje" required />
                      <FormButton type="submit">Enviar Mensaje</FormButton>
                    </ContactForm>
                  </ContactContainer>
                ) : (
                  <div>
                    {window.id === 'Home' && <p>Bienvenido al Portfolio de Txnio</p>}
                  </div>
                )}
              </Window>
            ))}
          </AnimatePresence>
        </WindowContainer>
        <Dock>
          {windows.map((window) => (
            <DockIcon key={window.id} whileHover={{ scale: 1.2 }} onClick={() => toggleWindow(window.id)}>
              <Image src={window.icon} alt={window.id} width={40} height={40} />
              <IconLabel>{window.id}</IconLabel>
              {window.isOpen && <OpenIndicator />}
            </DockIcon>
          ))}
        </Dock>
      </Desktop>
    </>
  );
}
