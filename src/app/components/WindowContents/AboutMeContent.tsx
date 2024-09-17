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
const aboutTxnio = {
  name: "Txnio",
  role: "Full Stack Developer",
  skills: [
    "JavaScript", "TypeScript", "React",
    "Node.js", "Python", "SQL", "NoSQL"
  ],
  interests: [
    "Web Development", "Machine Learning",
    "Blockchain", "Open Source"
  ],
  currentlyLearning: "Next.js and GraphQL",
  funFact: "I can solve a Rubik's cube in under 2 minutes!"
};

console.log("Welcome to my portfolio!");
console.log(aboutTxnio);
  `.trim();

  return (
    <VSCodeContainer>
      <VSCodeHeader>
        <VSCodeTab>aboutMe.js</VSCodeTab>
      </VSCodeHeader>
      <VSCodeContent>
        <SyntaxHighlighter
          language="javascript"
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