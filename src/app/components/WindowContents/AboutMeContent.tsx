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
  rol: "Desarrollador Frontend y Entusiasta de la IA",
  experiencia: {
    "Power Platform": "1.5 años",
    "Desarrollo Frontend": "3+ años"
  },
  habilidades: [
    "JavaScript", "TypeScript", "React", "NextJS",
    "Node.js", "Python", "HTML5", "CSS3",
    "Power Platform", "Integración de IA"
  ],
  stackActual: {
    frontend: ["React", "NextJS", "TypeScript"],
    estilos: ["Styled-Components", "TailwindCSS"],
    gestionEstado: ["Redux", "Context API"],
    backend: ["Node.js", "Express"],
    baseDeDatos: ["MongoDB", "PostgreSQL"],
    despliegue: ["Vercel", "Netlify", "Docker"]
  },
  intereses: [
    "Desarrollo Frontend", "Diseño impulsado por IA",
    "Integración de Machine Learning", "Código Abierto"
  ],
  aprendiendoActualmente: ["Swift", "NextJS Avanzado", "GraphQL"],
  herramientasIA: [
    "GPT-4 para optimización de código",
    "DALL-E para inspiración en UI/UX",
    "GitHub Copilot para mejorar la productividad"
  ],
  datosCuriosos: "Uso la IA para generar ideas creativas, ¡pero el toque final siempre es humano!"
};

console.log("¡Bienvenido a mi universo tecnológico!");
console.log(JSON.stringify(sobreAntonioGonzalez, null, 2));

// Objetivos Futuros
const objetivos2023 = [
  "Dominar NextJS 13 con App Router",
  "Contribuir a proyectos de IA de código abierto",
  "Lanzar una aplicación web mejorada con IA",
  "Hablar en una conferencia tecnológica"
];

console.log("Mis objetivos para 2023:", objetivos2023);
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