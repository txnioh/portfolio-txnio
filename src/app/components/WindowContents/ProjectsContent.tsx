import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaArrowRight } from 'react-icons/fa';
import { motion, useMotionValue, AnimatePresence, MotionValue } from 'framer-motion';
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
  transition: box-shadow 0.3s ease;
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
  margin-bottom: 20px; // Add this line to create space below the image
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

const ProjectPosition = styled.div`
  position: absolute;
  bottom: 10px; // Increase this value to move it further from the bottom
  right: 15px; // Increase this value to move it further from the right
  font-size: 14px; // Increase font size slightly
  color: #FFA500;
  font-weight: bold; // Make the text bold
  background-color: rgba(0, 0, 0, 0.5); // Add a semi-transparent background
  padding: 5px 10px; // Add some padding
  border-radius: 4px; // Round the corners
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

const MobileProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  overflow-y: auto;
  height: 100%;
`;

const MobileProjectCard = styled.div`
  background-color: rgba(45, 45, 45, 0.3);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 15px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

// Define a type for the motion values
type MotionValues = {
  [key: number]: {
    x: MotionValue<number>;
    y: MotionValue<number>;
    rotation: MotionValue<number>;
  }
};

const ProjectsContent: React.FC = () => {
  const [positions, setPositions] = useState<{ [key: number]: { x: number; y: number; rotation: number } }>({
    1: { x: 602, y: 210, rotation: 0 },
    2: { x: 783, y: -22, rotation: 0 },
    3: { x: 202, y: 144, rotation: 0 },
    4: { x: 69, y: 215, rotation: 0 },
    5: { x: 379, y: -23, rotation: 0 }
  });

  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zIndexOrder, setZIndexOrder] = useState<{ [key: number]: number }>(
    projects.reduce((acc, project, index) => ({ ...acc, [project.id]: index }), {})
  );
  const [isHoveringList, setIsHoveringList] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Create motion values for each project
  const motionValues: MotionValues = {
    1: { x: useMotionValue(positions[1].x), y: useMotionValue(positions[1].y), rotation: useMotionValue(positions[1].rotation) },
    2: { x: useMotionValue(positions[2].x), y: useMotionValue(positions[2].y), rotation: useMotionValue(positions[2].rotation) },
    3: { x: useMotionValue(positions[3].x), y: useMotionValue(positions[3].y), rotation: useMotionValue(positions[3].rotation) },
    4: { x: useMotionValue(positions[4].x), y: useMotionValue(positions[4].y), rotation: useMotionValue(positions[4].rotation) },
    5: { x: useMotionValue(positions[5].x), y: useMotionValue(positions[5].y), rotation: useMotionValue(positions[5].rotation) },
  };

  // Update motion values when positions change
  useEffect(() => {
    Object.entries(positions).forEach(([id, pos]) => {
      const numId = Number(id);
      motionValues[numId].x.set(pos.x);
      motionValues[numId].y.set(pos.y);
      motionValues[numId].rotation.set(pos.rotation);
    });
  }, [positions, motionValues]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const updateZIndex = (projectId: number) => {
    setZIndexOrder(prev => {
      const highestZIndex = Math.max(...Object.values(prev)) + 1;
      return { ...prev, [projectId]: highestZIndex };
    });
  };

  const handleDragStart = (projectId: number) => {
    setIsDragging(true);
    updateZIndex(projectId);
  };

  const handleDragEnd = (projectId: number, info: { offset: { x: number; y: number } }) => {
    setPositions(prev => {
      const currentPos = prev[projectId];
      return {
        ...prev,
        [projectId]: {
          ...currentPos,
          x: currentPos.x + info.offset.x,
          y: currentPos.y + info.offset.y,
        }
      };
    });
    setIsDragging(false);
  };

  // Keep motion values in sync with positions
  useEffect(() => {
    Object.entries(positions).forEach(([id, pos]) => {
      const numId = Number(id);
      motionValues[numId].x.set(pos.x);
      motionValues[numId].y.set(pos.y);
      motionValues[numId].rotation.set(pos.rotation);
    });
  }, [positions, motionValues]);

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

  const handleListEnter = () => {
    setIsHoveringList(true);
  };

  const handleListLeave = () => {
    setIsHoveringList(false);
    setHoveredProject(null);
  };

  const handleProjectClick = (demoUrl: string) => {
    window.open(demoUrl, '_blank', 'noopener,noreferrer');
  };

  const renderMobileContent = () => (
    <MobileProjectsList>
      {projects.map(project => (
        <MobileProjectCard key={project.id}>
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
        </MobileProjectCard>
      ))}
    </MobileProjectsList>
  );

  const renderDesktopContent = () => (
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
            onClick={() => handleProjectClick(project.demoUrl)}
          >
            {project.title}
          </ProjectName>
        ))}
      </ProjectsList>
      <AnimatePresence>
        {projects.map(project => {
          const { x, y, rotation } = motionValues[project.id];

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
                zIndex: zIndexOrder[project.id],
              }}
              isActive={hoveredProject === project.id}
              onMouseEnter={() => handleProjectHover(project.id)}
              onMouseLeave={handleProjectLeave}
              initial={{ opacity: 1, filter: 'blur(0px)' }}
              animate={{ 
                opacity: isHoveringList ? (hoveredProject === project.id ? 1 : 0) : 1,
                filter: isHoveringList ? (hoveredProject === project.id ? 'blur(0px)' : 'blur(20px)') : 'blur(0px)',
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

  return isMobile ? renderMobileContent() : renderDesktopContent();
};

export default ProjectsContent;