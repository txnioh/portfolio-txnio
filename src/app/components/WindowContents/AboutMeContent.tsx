import React from 'react';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  const aboutMeCode = `
const sobreAntonioGonzalez = {
  nombre: "Antonio J. González",
  alias: "Txnio",
  rol: "Desarrollador para uso humano",
  experiencia: {
    "Empresa": "1.5+ años",
    "Por mi": "2+ años"
  },
  habilidades: [
    "JavaScript", "TypeScript", ".NET", "NextJS",
    "Node.js", "Python", "HTML5", "CSS3",
    "Power Platform", "Integración de IA"
  ],
  stackActual: {
    frontend: ["React", "NextJS", "TypeScript"],
    estilos: ["Framer-Motion", "TailwindCSS"],
    gestionEstado: ["Redux", "Context API"],
    backend: ["Node.js", "Express", "Firebase"],
    baseDeDatos: ["MongoDB", "GraphQL"],
    despliegue: ["Vercel", "Netlify", "Docker"]
  },
  intereses: [
    "Desarrollo Frontend", "Diseño minimalista",
    "Integración de Machine Learning"
  ],
  aprendiendoActualmente: ["Swift", "NextJS Avanzado", "GraphQL"],
  herramientasIA: [
    "ChatGPT, Claude para optimización de código",
    "Midjourney para inspiración en UI/UX"
  ]
};

console.log(JSON.stringify(sobreAntonioGonzalez, null, 2));
  `.trim();

  return (
    <VSCodeContainer>
      <VSCodeHeader>
        <VSCodeTab>sobreTxnio.ts</VSCodeTab>
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
          {aboutMeCode}
        </SyntaxHighlighter>
      </VSCodeContent>
    </VSCodeContainer>
  );
};

export default AboutMeContent;