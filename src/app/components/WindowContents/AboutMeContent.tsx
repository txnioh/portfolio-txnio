import React from 'react';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTranslation } from 'react-i18next';
import '../../../i18n/config';

const VSCodeContainer = styled.div`
  background-color: rgba(30, 30, 30, 0.5);
  backdrop-filter: blur(10px);
  color: #d4d4d4;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  height: 100%; // Aseguramos que ocupe toda la altura
  display: flex;
  flex-direction: column;
`;

const VSCodeHeader = styled.div`
  background-color: rgba(37, 37, 38, 0.5);
  backdrop-filter: blur(5px);
  padding: 5px 10px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(30, 30, 30, 0.5);
`;

const VSCodeTab = styled.div`
  padding: 5px 10px;
  background-color: rgba(45, 45, 45, 0.5);
  backdrop-filter: blur(5px);
  border-right: 1px solid rgba(37, 37, 38, 0.5);
  font-size: 12px;
`;

const VSCodeContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: 10px;
`;

const AboutMeContent: React.FC = () => {
  const { t } = useTranslation();
  
  const generateCodeFromTranslations = () => {
    const skills = t('aboutMe.skills', { returnObjects: true }) as string[];
    const interests = t('aboutMe.interests', { returnObjects: true }) as string[];
    const currentlyLearning = t('aboutMe.currentlyLearning', { returnObjects: true }) as string[];
    const aiTools = t('aboutMe.aiTools', { returnObjects: true }) as string[];
    const currentStack = t('aboutMe.currentStack', { returnObjects: true }) as {
      frontend: string[];
      styling: string[];
      stateManagement: string[];
      backend: string[];
      database: string[];
      deployment: string[];
    };

    const isSpanish = t('aboutMe.role') === 'Desarrollador para uso humano';

    return `
const ${isSpanish ? 'sobreAntonioGonzalez' : 'aboutAntonioGonzalez'} = {
  ${isSpanish ? 'nombre' : 'name'}: "${t('aboutMe.name')}",
  alias: "${t('aboutMe.alias')}",
  ${isSpanish ? 'rol' : 'role'}: "${t('aboutMe.role')}",
  ${isSpanish ? 'experiencia' : 'experience'}: {
    "${isSpanish ? 'Empresa' : 'Company'}": "${t('aboutMe.experience.company')}",
    "${isSpanish ? 'Por mi' : 'Personal'}": "${t('aboutMe.experience.personal')}"
  },
  ${isSpanish ? 'habilidades' : 'skills'}: [
    ${skills.map(skill => `"${skill}"`).join(', ')}
  ],
  ${isSpanish ? 'stackActual' : 'currentStack'}: {
    frontend: [${currentStack.frontend.map((tech: string) => `"${tech}"`).join(', ')}],
    ${isSpanish ? 'estilos' : 'styling'}: [${currentStack.styling.map((tech: string) => `"${tech}"`).join(', ')}],
    ${isSpanish ? 'gestionEstado' : 'stateManagement'}: [${currentStack.stateManagement.map((tech: string) => `"${tech}"`).join(', ')}],
    backend: [${currentStack.backend.map((tech: string) => `"${tech}"`).join(', ')}],
    ${isSpanish ? 'baseDeDatos' : 'database'}: [${currentStack.database.map((tech: string) => `"${tech}"`).join(', ')}],
    ${isSpanish ? 'despliegue' : 'deployment'}: [${currentStack.deployment.map((tech: string) => `"${tech}"`).join(', ')}]
  },
  ${isSpanish ? 'intereses' : 'interests'}: [
    ${interests.map(interest => `"${interest}"`).join(', ')}
  ],
  ${isSpanish ? 'aprendiendoActualmente' : 'currentlyLearning'}: [${currentlyLearning.map(tech => `"${tech}"`).join(', ')}],
  ${isSpanish ? 'herramientasIA' : 'aiTools'}: [
    ${aiTools.map(tool => `"${tool}"`).join(', ')}
  ]
};

console.log(JSON.stringify(${isSpanish ? 'sobreAntonioGonzalez' : 'aboutAntonioGonzalez'}, null, 2));
    `.trim();
  };

  return (
    <VSCodeContainer>
      <VSCodeHeader>
        <VSCodeTab>{t('aboutMe.fileName')}</VSCodeTab>
      </VSCodeHeader>
      <VSCodeContent>
        <SyntaxHighlighter
          language="typescript"
          style={vscDarkPlus}
          showLineNumbers
          wrapLines
          customStyle={{
            backgroundColor: 'transparent',
            padding: 0,
            margin: 0,
          }}
        >
          {generateCodeFromTranslations()}
        </SyntaxHighlighter>
      </VSCodeContent>
    </VSCodeContainer>
  );
};

export default AboutMeContent;