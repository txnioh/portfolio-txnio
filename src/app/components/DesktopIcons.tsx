import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Image from 'next/image';

const DesktopIconsWrapper = styled.div`
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 1;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 10px;

  @media (max-width: 768px) {
    left: 10px;
    top: 70px;
    transform: none;
    max-height: calc(100vh - 140px);
  }

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const DesktopIcon = styled(motion.div)`
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    
    img {
      filter: contrast(1.3) brightness(1.2) saturate(1.3) drop-shadow(0 2px 4px rgba(0,0,0,0.9));
      transform: scale(1.05);
    }
  }

  &:active {
    transform: scale(0.95);
    
    img {
      transform: scale(1.0);
    }
  }
`;

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  position: relative;
  margin-bottom: 6px;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    margin-bottom: 4px;
  }
  
  img {
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    filter: contrast(1.2) brightness(1.1) saturate(1.2) drop-shadow(0 1px 2px rgba(0,0,0,0.8));
    transition: all 0.2s ease;
  }
`;

const DesktopIconLabel = styled.span`
  font-size: 12px;
  color: white;
  text-shadow: 0 0 4px rgba(0,0,0,0.8);
  text-align: center;
  max-width: 70px;
  overflow-wrap: break-word;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 11px;
    max-width: 55px;
  }
`;

interface DesktopIconsProps {
  icons: {
    id: string;
    name: string;
    icon: string;
    url: string;
  }[];
  openUrl: (url: string, id?: string) => void;
}

const DesktopIcons: React.FC<DesktopIconsProps> = ({ icons, openUrl }) => {
  return (
    <DesktopIconsWrapper>
      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openUrl(icon.url, icon.id)}
        >
          <IconWrapper>
            <Image 
              src={icon.icon} 
              alt={icon.id} 
              fill
              style={{ objectFit: 'contain' }}
              quality={100}
              className="mac-icon"
            />
          </IconWrapper>
          <DesktopIconLabel>{icon.name}</DesktopIconLabel>
        </DesktopIcon>
      ))}
    </DesktopIconsWrapper>
  );
};

export default DesktopIcons;