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
  z-index: 1; // Cambiamos el z-index a un valor bajo
`;

const DesktopIcon = styled(motion.div)`
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 40px;
`;

const DesktopIconLabel = styled.span`
  font-size: 12px;
  margin-top: 5px;
  color: white;
  text-shadow: 0 0 3px rgba(0,0,0,0.5);
  text-align: center;
`;

interface DesktopIcon {
  id: string;
  icon: string;
  url: string;
}

interface DesktopIconsProps {
  icons: DesktopIcon[];
  openUrl: (url: string) => void;
}

const DesktopIcons: React.FC<DesktopIconsProps> = ({ icons, openUrl }) => {
  return (
    <DesktopIconsWrapper>
      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openUrl(icon.url)}
        >
          <Image src={icon.icon} alt={icon.id} width={60} height={60} />
          <DesktopIconLabel>{icon.id}</DesktopIconLabel>
        </DesktopIcon>
      ))}
    </DesktopIconsWrapper>
  );
};

export default DesktopIcons;