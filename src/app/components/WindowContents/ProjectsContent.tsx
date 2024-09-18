import React, { useState } from 'react';
import styled from 'styled-components';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: rgba(30, 30, 30, 0.5);
  backdrop-filter: blur(10px);
  color: #e0e0e0;
  overflow-y: auto;
  padding: 20px;
`;

const Title = styled.h2`
  color: #FFA500;
  margin-bottom: 20px;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const ProjectCard = styled.div`
  background-color: rgba(45, 45, 45, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
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
    demoUrl: "https://infinite-particles-txnio.vercel.app/" // URL actualizada
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
    demoUrl: "https://pixel-transition-eight.vercel.app/" // URL actualizada
  },
  { 
    id: 5, 
    title: "Gradient Generator", 
    description: "Un generador de gradientes implementado en JavaScript.",
    githubUrl: "https://github.com/txnioh/gradient-generator",
    demoUrl: "https://gradient-generator-txnio.vercel.app/" // URL actualizada
  },
];

const ProjectsContent: React.FC = () => {
  return (
    <ProjectsContainer>
      <Title>Mis Proyectos</Title>
      <ProjectGrid>
        {projects.map(project => (
          <ProjectCard key={project.id}>
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
      </ProjectGrid>
    </ProjectsContainer>
  );
};

export default ProjectsContent;