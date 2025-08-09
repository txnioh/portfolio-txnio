import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import '../../../i18n/config';

interface ThemeProps {
  isDarkMode: boolean;
}

const HomeContainer = styled.div<ThemeProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  background-color: ${props => props.isDarkMode ? '#121212' : '#f5f5f5'};
  color: ${props => props.isDarkMode ? '#e0e0e0' : '#333'};
  overflow: auto;
  padding: 20px;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const ImageWrapper = styled.div<ThemeProps>`
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
  position: relative;
  transform: rotate(-2deg);
  padding: 10px;
  background-color: ${props => props.isDarkMode ? '#1e1e1e' : '#fff'};
  box-shadow: 0 2px 4px ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const TextContent = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  text-align: left;
  max-width: 600px;
  white-space: pre-wrap;
  font-family: monospace;
`;

const UpdateText = styled.div<ThemeProps>`
  font-size: 0.8rem;
  color: ${props => props.isDarkMode ? '#888' : '#777'};
  margin-top: 20px;
  font-family: monospace;
  transition: color 0.3s ease;
`;

const ThemeToggle = styled.button<ThemeProps>`
  background: none;
  border: none;
  color: ${props => props.isDarkMode ? '#e0e0e0' : '#333'};
  font-family: monospace;
  cursor: pointer;
  margin-top: 20px;
  text-decoration: underline;
  transition: color 0.3s ease;
`;

const HomeContent: React.FC = () => {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <HomeContainer isDarkMode={isDarkMode}>
      <ImageWrapper isDarkMode={isDarkMode}>
        <ProfileImage src="/profile.jpeg" alt="Tony (txnio)" />
      </ImageWrapper>
      <TextContent>{t('home.introduction')}</TextContent>
      <UpdateText isDarkMode={isDarkMode}>{t('home.lastEdited')}</UpdateText>
      <ThemeToggle isDarkMode={isDarkMode} onClick={toggleTheme}>
        {isDarkMode ? t('home.toggleLights.turnOn') : t('home.toggleLights.turnOff')}
      </ThemeToggle>
    </HomeContainer>
  );
};

export default HomeContent;