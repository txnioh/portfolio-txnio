import React, { useState } from 'react';
import styled from 'styled-components';
import { FaThLarge, FaList } from 'react-icons/fa';

const ProjectsContainer = styled.div`
  display: flex;
  height: 100%; // Aseguramos que ocupe toda la altura
  background-color: rgba(30, 30, 30, 0.5);
  backdrop-filter: blur(10px);
  color: #e0e0e0;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: rgba(37, 37, 38, 0.5);
  backdrop-filter: blur(5px);
  border-right: 1px solid rgba(62, 62, 62, 0.5);
  overflow-y: auto;
`;

const ProjectList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ProjectItem = styled.li<{ isActive: boolean }>`
  padding: 10px 20px;
  cursor: pointer;
  background-color: ${props => props.isActive ? '#FFA500' : 'transparent'};
  color: ${props => props.isActive ? '#1e1e1e' : '#e0e0e0'};

  &:hover {
    background-color: ${props => props.isActive ? '#FFA500' : '#3e3e3e'};
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 10px;
`;

const ToggleButton = styled.button<{ isActive: boolean }>`
  background-color: ${props => props.isActive ? '#FFA500' : 'transparent'};
  color: ${props => props.isActive ? '#1e1e1e' : '#e0e0e0'};
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: ${props => props.isActive ? '#FFA500' : '#3e3e3e'};
  }
`;

const GridView = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const ListView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProjectCard = styled.div`
  background-color: rgba(45, 45, 45, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(60, 60, 60, 0.5);
  }
`;

const ProjectTitle = styled.h3`
  margin-top: 0;
  color: #FFA500;
`;

const ProjectDescription = styled.p`
  font-size: 14px;
`;

interface Project {
  id: number;
  title: string;
  description: string;
}

const projects: Project[] = [
  { id: 1, title: "E-commerce App", description: "Una aplicación de comercio electrónico construida con React y Node.js" },
  { id: 2, title: "Portfolio Website", description: "Sitio web de portfolio personal construido con Next.js" },
  { id: 3, title: "Task Manager", description: "Aplicación de gestión de tareas con React y Firebase" },
  { id: 4, title: "Weather Dashboard", description: "Dashboard del clima utilizando la API de OpenWeatherMap" },
];

const ProjectsContent: React.FC = () => {
  const [activeProject, setActiveProject] = useState<Project>(projects[0]);
  const [isGridView, setIsGridView] = useState(true);

  const renderProjects = () => {
    const ProjectView = isGridView ? GridView : ListView;
    return (
      <ProjectView>
        {projects.map(project => (
          <ProjectCard key={project.id}>
            <ProjectTitle>{project.title}</ProjectTitle>
            <ProjectDescription>{project.description}</ProjectDescription>
          </ProjectCard>
        ))}
      </ProjectView>
    );
  };

  return (
    <ProjectsContainer>
      <Sidebar>
        <ProjectList>
          {projects.map(project => (
            <ProjectItem
              key={project.id}
              isActive={project.id === activeProject.id}
              onClick={() => setActiveProject(project)}
            >
              {project.title}
            </ProjectItem>
          ))}
        </ProjectList>
      </Sidebar>
      <Content>
        <Header>
          <Title>Proyectos</Title>
          <ViewToggle>
            <ToggleButton
              isActive={isGridView}
              onClick={() => setIsGridView(true)}
            >
              <FaThLarge />
            </ToggleButton>
            <ToggleButton
              isActive={!isGridView}
              onClick={() => setIsGridView(false)}
            >
              <FaList />
            </ToggleButton>
          </ViewToggle>
        </Header>
        {renderProjects()}
      </Content>
    </ProjectsContainer>
  );
};

export default ProjectsContent;