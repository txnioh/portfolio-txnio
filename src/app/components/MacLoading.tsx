import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const LoadingContainer = styled.div<{ fullScreen?: boolean }>`
  position: ${props => props.fullScreen ? 'fixed' : 'absolute'};
  top: 0;
  left: 0;
  width: ${props => props.fullScreen ? '100vw' : '100%'};
  height: ${props => props.fullScreen ? '100vh' : '100%'};
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${fadeIn} 0.5s ease-in-out forwards;
`;

const LoadingText = styled.div`
  color: #fff;
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 20px;
`;

const LoadingBar = styled.div`
  width: 200px;
  height: 4px;
  background-color: #333;
  border-radius: 2px;
  overflow: hidden;
`;

const LoadingProgress = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  animation: loading 2s ease-in-out infinite;

  @keyframes loading {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

interface MacLoadingProps {
  fullScreen?: boolean;
  text?: string;
}

const MacLoading: React.FC<MacLoadingProps> = ({ fullScreen = true, text = "Bienvenido a TxniOS" }) => {
  return (
    <LoadingContainer fullScreen={fullScreen}>
      <LoadingText>{text}</LoadingText>
      <LoadingBar>
        <LoadingProgress />
      </LoadingBar>
    </LoadingContainer>
  );
};

export default MacLoading;