import React, { useState } from 'react';
import styled from 'styled-components';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import '../../../i18n/config';

const ProjectCard = styled(motion.div)<{ isActive?: boolean }>`
  background-color: rgba(45, 45, 45, 0.3);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
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

const ProjectDescription = styled.p`
  color: #e0e0e0;
  font-size: 0.9em;
  margin-top: 10px;
  line-height: 1.4;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #FFA500;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const IframeContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  padding-top: 70px;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const LoadingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #FFA500;
  gap: 20px;
`;

const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 165, 0, 0.3);
  border-radius: 50%;
  border-top-color: #FFA500;
`;

const LoadingText = styled.div`
  font-size: 1.2em;
  letter-spacing: 1px;
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
    id: 9, 
    title: "txniOS Old", 
    description: "Simulación interactiva de Mac OS 7 con ventanas funcionales y la estética clásica del sistema.",
    githubUrl: "https://github.com/txnioh/portfolio-txnio",
    demoUrl: "https://os.txnio.com",
    imagePath: "/projects-img/project-macold.png"
  },
  { 
    id: 8, 
    title: "Cubes", 
    description: "Una experiencia visual interactiva con cubos 3D utilizando Three.js y React Three Fiber.",
    githubUrl: "https://github.com/txnioh/cubes",
    demoUrl: "https://cubes-umber.vercel.app",
    imagePath: "/projects-img/project-cubes.png"
  },
  { 
    id: 6, 
    title: "Minder", 
    description: "Una aplicación para subir imágenes, comentarios y proyectos utilizando Firebase, React, TypeScript, Next.js y autenticación de Google.",
    githubUrl: "https://github.com/txnioh/minder",
    demoUrl: "https://minder-txnio.vercel.app/",
    imagePath: "/projects-img/project-minder.png"
  },
  { 
    id: 7, 
    title: "Second Portfolio", 
    description: "Un portafolio inspirado en el trabajo de Yihui Hu, con un diseño tipo pegatina.",
    githubUrl: "https://github.com/txnioh/second-portfolio",
    demoUrl: "https://second-portfolio-txnio.vercel.app/",
    imagePath: "/projects-img/project-second-portfolio.png"
  },
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

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  overflow-y: auto;
  height: 100%;

  /* Estilo para la barra de scroll */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.7);
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const ProjectsContent: React.FC = () => {
  const { t } = useTranslation();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleProjectClick = (project: Project) => {
    setCurrentProject(project);
    setIsLoading(true);
  };

  const handleBack = () => {
    setCurrentProject(null);
    setIsLoading(true);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const renderProjectCard = (project: Project) => (
    <ProjectCard
      key={project.id}
      onClick={() => handleProjectClick(project)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <ProjectTitle>
        {project.title}
        <ArrowIcon className="arrow" />
      </ProjectTitle>
      <ProjectImage 
        src={project.imagePath} 
        alt={project.title}
        width={350}
        height={230}
      />
      <ProjectDescription>{t(`projectDescriptions.${project.title}`) || project.description}</ProjectDescription>
    </ProjectCard>
  );

  if (currentProject) {
    return (
      <IframeContainer>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> {t('projects.backToProjects')}
        </BackButton>
        {isLoading && (
          <LoadingContainer>
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <LoadingText>{t('projects.loadingProject')} {currentProject.title}...</LoadingText>
          </LoadingContainer>
        )}
        <StyledIframe 
          src={currentProject.demoUrl}
          title={currentProject.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleIframeLoad}
          style={{ visibility: isLoading ? 'hidden' : 'visible' }}
        />
      </IframeContainer>
    );
  }

  return (
    <ProjectsGrid>
      <AnimatePresence>
        {projects.map(renderProjectCard)}
      </AnimatePresence>
    </ProjectsGrid>
  );
};

export default ProjectsContent;
