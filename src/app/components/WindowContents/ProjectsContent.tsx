import React from 'react';
import styled from 'styled-components';
import { FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
`;

const ProjectsContent: React.FC = () => {
  const handleProjectClick = (demoUrl: string) => {
    window.open(demoUrl, '_blank', 'noopener,noreferrer');
  };

  const renderProjectCard = (project: Project) => (
    <ProjectCard
      key={project.id}
      onClick={() => handleProjectClick(project.demoUrl)}
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
      <ProjectDescription>{project.description}</ProjectDescription>
    </ProjectCard>
  );

  return (
    <ProjectsGrid>
      {projects.map(renderProjectCard)}
    </ProjectsGrid>
  );
};

export default ProjectsContent;
