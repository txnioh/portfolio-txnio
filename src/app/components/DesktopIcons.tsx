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
`;

const DesktopIcon = styled(motion.div)`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  position: relative;
  margin-bottom: 8px;
`;

const DesktopIconLabel = styled.span`
  font-size: 13px;
  color: white;
  text-shadow: 0 0 4px rgba(0,0,0,0.8);
  text-align: center;
  max-width: 90px;
  overflow-wrap: break-word;
  line-height: 1.2;
`;

interface DesktopIconsProps {
  icons: {
    id: string;
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
            />
          </IconWrapper>
          <DesktopIconLabel>{icon.id}</DesktopIconLabel>
        </DesktopIcon>
      ))}
    </DesktopIconsWrapper>
  );
};

export default DesktopIcons;