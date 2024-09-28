import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectsContainer = styled.div`
  position: relative;
  height: 100%;
  background-color: #121212;
  color: #e0e0e0;
  overflow: hidden;
  padding: 20px;
  font-family: monospace;
`;

const ProjectsList = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  z-index: 10;
`;

const ProjectName = styled.div<{ isActive: boolean }>`
  cursor: pointer;
  padding: 5px 10px;
  background-color: ${props => props.isActive ? '#FFA500' : 'transparent'};
  color: ${props => props.isActive ? '#121212' : '#FFA500'};
  transition: all 0.3s ease;

  &:hover {
    background-color: #FFA500;
    color: #121212;
  }
`;

const ProjectCard = styled.div<{ x: number; y: number; rotation: number; isBlurred: boolean }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  transform: rotate(${props => props.rotation}deg);
  background-color: rgba(45, 45, 45, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 8px;
  padding: 20px;
  width: 250px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
  filter: blur(${props => props.isBlurred ? '5px' : '0px'});

  &:hover {
    transform: rotate(${props => props.rotation}deg) scale(1.05);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ProjectTitle = styled.h3`
  color: #FFA500;
  margin-top: 0;
  margin-bottom: 10px;
`;

const ProjectDescription = styled.p`
  font-size: 14px;
  margin-bottom: 15px;
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 10px;
`;

const ProjectLink = styled.a`
  display: flex;
  align-items: center;
  color: #4a90e2;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;

  &:hover {
    color: #FFA500;
  }

  svg {
    margin-right: 5px;
  }
`;

interface Project {
  id: number;
  title: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
}

const projects: Project[] = [
  { 
    id: 1, 
    title: "3D Crystal Effect", 
    description: "Un efecto visual de cristal 3D implementado con JavaScript.",
    githubUrl: "https://github.com/txnioh/3d-cristal-effect",
    demoUrl: "https://3d-cristal-effect.vercel.app/"
  },
  { 
    id: 2, 
    title: "Infinite Particles", 
    description: "Una animación de partículas infinitas creada con JavaScript.",
    githubUrl: "https://github.com/txnioh/infinite-particles",
    demoUrl: "https://infinite-particles-txnio.vercel.app/"
  },
  { 
    id: 3, 
    title: "Floating Images", 
    description: "Una galería mínima con interacción del mouse para imágenes flotantes.",
    githubUrl: "https://github.com/txnioh/floating-images",
    demoUrl: "https://floating-images.vercel.app/"
  },
  { 
    id: 4, 
    title: "Pixel Transition", 
    description: "Una transición de píxeles simple para la barra de menú.",
    githubUrl: "https://github.com/txnioh/pixel-transition",
    demoUrl: "https://pixel-transition-eight.vercel.app/"
  },
  { 
    id: 5, 
    title: "Gradient Generator", 
    description: "Un generador de gradientes implementado en JavaScript.",
    githubUrl: "https://github.com/txnioh/gradient-generator",
    demoUrl: "https://gradient-generator-txnio.vercel.app/"
  },
];

const ProjectsContent: React.FC = () => {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [positions, setPositions] = useState<{ [key: number]: { x: number; y: number; rotation: number } }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const newPositions: { [key: number]: { x: number; y: number; rotation: number } } = {};
      projects.forEach((project) => {
        const x = Math.random() * (containerWidth - 300) + 150;
        const y = Math.random() * (containerHeight - 200) + 100;
        const rotation = Math.random() * 20 - 10;

        newPositions[project.id] = { x, y, rotation };
      });
      setPositions(newPositions);
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);

    return () => window.removeEventListener('resize', updatePositions);
  }, []);

  const handleProjectHover = (id: number) => {
    setActiveProject(id);
  };

  const handleProjectLeave = () => {
    setActiveProject(null);
  };

  return (
    <ProjectsContainer ref={containerRef}>
      <ProjectsList>
        {projects.map(project => (
          <ProjectName 
            key={project.id}
            isActive={activeProject === project.id}
            onMouseEnter={() => handleProjectHover(project.id)}
            onMouseLeave={handleProjectLeave}
          >
            {project.title}
          </ProjectName>
        ))}
      </ProjectsList>
      {projects.map(project => (
        <ProjectCard 
          key={project.id}
          x={positions[project.id]?.x || 0}
          y={positions[project.id]?.y || 0}
          rotation={positions[project.id]?.rotation || 0}
          isBlurred={activeProject !== null && activeProject !== project.id}
        >
          <ProjectTitle>{project.title}</ProjectTitle>
          <ProjectDescription>{project.description}</ProjectDescription>
          <ProjectLinks>
            <ProjectLink href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <FaGithub /> GitHub
            </ProjectLink>
            <ProjectLink href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              <FaExternalLinkAlt /> Demo
            </ProjectLink>
          </ProjectLinks>
        </ProjectCard>
      ))}
    </ProjectsContainer>
  );
};

export default ProjectsContent;