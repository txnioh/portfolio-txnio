import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaGithub, FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const ProjectsContainer = styled.div`
  position: relative;
  height: 100%;
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

const ProjectCard = styled(motion.div)<{ isActive: boolean }>`
  position: absolute;
  background-color: rgba(45, 45, 45, 0.3);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 15px;
  width: 350px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, opacity 0.3s ease, filter 0.3s ease;
  cursor: grab;
  user-select: none;
  display: flex;
  flex-direction: column;

  &:active {
    cursor: grabbing;
  }
`;

const ProjectImage = styled(Image)`
  width: 100%;
  height: 230px;
  object-fit: cover;
  border-radius: 8px;
  pointer-events: none;
`;

const ProjectTitle = styled.h3`
  color: #FFA500;
  margin: 0 0 15px 0;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const ArrowIcon = styled(FaArrowRight)`
  margin-left: 5px;
  transition: transform 0.3s ease;
`;

const ProjectNumber = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 14px;
  color: #FFA500;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 2px 6px;
  border-radius: 4px;
`;

const ProjectPosition = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
  font-size: 12px;
  color: #FFA500;
`;

interface Project {
  id: number;
  title: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
  imagePath: string;
}

const projects: Project[] = [
  { 
    id: 1, 
    title: "3D Crystal Effect", 
    description: "Un efecto visual de cristal 3D implementado con JavaScript.",
    githubUrl: "https://github.com/txnioh/3d-cristal-effect",
    demoUrl: "https://3d-cristal-effect.vercel.app/",
    imagePath: "/projects-img/project-crystal-effect.png"
  },
  { 
    id: 2, 
    title: "Infinite Particles", 
    description: "Una animación de partículas infinitas creada con JavaScript.",
    githubUrl: "https://github.com/txnioh/infinite-particles",
    demoUrl: "https://infinite-particles-txnio.vercel.app/",
    imagePath: "/projects-img/project-infinite-particles.png"
  },
  { 
    id: 3, 
    title: "Floating Images", 
    description: "Una galería mínima con interacción del mouse para imágenes flotantes.",
    githubUrl: "https://github.com/txnioh/floating-images",
    demoUrl: "https://floating-images.vercel.app/",
    imagePath: "/projects-img/project-floating-images.png"
  },
  { 
    id: 4, 
    title: "Pixel Transition", 
    description: "Una transición de píxeles simple para la barra de menú.",
    githubUrl: "https://github.com/txnioh/pixel-transition",
    demoUrl: "https://pixel-transition-eight.vercel.app/",
    imagePath: "/projects-img/project-pixel-transition.png"
  },
  { 
    id: 5, 
    title: "Gradient Generator", 
    description: "Un generador de gradientes implementado en JavaScript.",
    githubUrl: "https://github.com/txnioh/gradient-generator",
    demoUrl: "https://gradient-generator-txnio.vercel.app/",
    imagePath: "/projects-img/project-gradient-generator.png"
  },
];

const ProjectsContent: React.FC = () => {
  const [positions, setPositions] = useState<{ [key: number]: { x: number; y: number; rotation: number } }>({
    1: { x: 830, y: 362, rotation: 0 },
    2: { x: 57, y: 311, rotation: 0 },
    3: { x: 461, y: 397, rotation: 0 },
    4: { x: 302, y: 179, rotation: 0 },
    5: { x: 617, y: 198, rotation: 0 }
  });

  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [draggingProject, setDraggingProject] = useState<number | null>(null);

  const [zIndexOrder, setZIndexOrder] = useState<{ [key: number]: number }>(
    projects.reduce((acc, project, index) => ({ ...acc, [project.id]: index }), {})
  );

  const updateZIndex = (projectId: number) => {
    setZIndexOrder(prev => {
      const highestZIndex = Math.max(...Object.values(prev)) + 1;
      return { ...prev, [projectId]: highestZIndex };
    });
  };

  const handleDragStart = (projectId: number) => {
    setIsDragging(true);
    setDraggingProject(projectId);
    updateZIndex(projectId);
  };

  const handleDragEnd = (projectId: number, info: any) => {
    setPositions(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        x: info.point.x,
        y: info.point.y,
      }
    }));
    setIsDragging(false);
    setDraggingProject(null);
    // No necesitamos llamar a updateZIndex aquí porque ya se hizo en handleDragStart
  };

  const handleTitleClick = (event: React.MouseEvent, demoUrl: string) => {
    event.stopPropagation();
    if (!isDragging) {
      window.open(demoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleProjectHover = (id: number) => {
    setHoveredProject(id);
  };

  const handleProjectLeave = () => {
    setHoveredProject(null);
  };

  const [isHoveringList, setIsHoveringList] = useState(false);

  const handleListEnter = () => {
    setIsHoveringList(true);
  };

  const handleListLeave = () => {
    setIsHoveringList(false);
    setHoveredProject(null);
  };

  return (
    <ProjectsContainer ref={containerRef}>
      <ProjectsList
        onMouseEnter={handleListEnter}
        onMouseLeave={handleListLeave}
      >
        {projects.map(project => (
          <ProjectName 
            key={project.id}
            isActive={hoveredProject === project.id}
            onMouseEnter={() => handleProjectHover(project.id)}
            onMouseLeave={handleProjectLeave}
          >
            {project.title}
          </ProjectName>
        ))}
      </ProjectsList>
      <AnimatePresence>
        {projects.map(project => {
          const x = useMotionValue(positions[project.id].x);
          const y = useMotionValue(positions[project.id].y);
          const rotation = useMotionValue(positions[project.id].rotation);

          return (
            <ProjectCard 
              key={project.id}
              drag
              dragMomentum={false}
              onDragStart={() => handleDragStart(project.id)}
              onDragEnd={(_, info) => handleDragEnd(project.id, info)}
              style={{ 
                x, 
                y, 
                rotate: rotation,
                opacity: isHoveringList && hoveredProject !== project.id ? 0.3 : 1,
                filter: isHoveringList && hoveredProject !== project.id ? 'blur(3px)' : 'none',
                zIndex: zIndexOrder[project.id],
              }}
              isActive={hoveredProject === project.id}
              onMouseEnter={() => handleProjectHover(project.id)}
              onMouseLeave={handleProjectLeave}
              initial={{ opacity: 1, filter: 'blur(0px)' }}
              animate={{ 
                opacity: isHoveringList && hoveredProject !== project.id ? 0.3 : 1,
                filter: isHoveringList && hoveredProject !== project.id ? 'blur(3px)' : 'none',
              }}
              transition={{ duration: 0.3 }}
            >
              <ProjectTitle onClick={(e) => handleTitleClick(e, project.demoUrl)}>
                {project.title}
                <ArrowIcon className="arrow" />
              </ProjectTitle>
              <ProjectImage 
                src={project.imagePath} 
                alt={project.title}
                width={350}
                height={230}
              />
              <ProjectPosition>
                x: {Math.round(x.get())}, y: {Math.round(y.get())}
              </ProjectPosition>
            </ProjectCard>
          );
        })}
      </AnimatePresence>
    </ProjectsContainer>
  );
};

export default ProjectsContent;