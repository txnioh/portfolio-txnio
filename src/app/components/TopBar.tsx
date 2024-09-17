import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCompass, FaCog } from 'react-icons/fa';

const TopBarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 25px;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  color: white;
  font-size: 12px;
  z-index: 1000;
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
`;

const TopBarIcon = styled.div`
  margin: 0 5px;
  cursor: pointer;
`;

const TopBarText = styled.div`
  margin: 0 5px;
`;

const TopBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <TopBarWrapper>
      <TopBarLeft>
        <TopBarIcon><FaCompass /></TopBarIcon>
        <TopBarIcon><FaCog /></TopBarIcon>
      </TopBarLeft>
      <TopBarRight>
        <TopBarText>{formatDate(currentTime)}</TopBarText>
        <TopBarText>{formatTime(currentTime)}</TopBarText>
      </TopBarRight>
    </TopBarWrapper>
  );
};

export default TopBar;