import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Image from 'next/image';

const DockWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
`;

const DockIcon = styled(motion.div)`
  width: 60px;
  height: 60px;
  margin: 0 15px;
  cursor: pointer;
  border-radius: 10px;
  overflow: visible;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  position: relative;
`;

const IconLabel = styled.span`
  font-size: 12px;
  margin-top: 5px;
  color: white;
  text-shadow: 0 0 3px rgba(0,0,0,0.5);
`;

const OpenIndicator = styled.div`
  width: 5px;
  height: 5px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
`;

interface DockProps {
  windows: WindowState[];
  toggleWindow: (id: string) => void;
}

const Dock: React.FC<DockProps> = ({ windows, toggleWindow }) => {
  return (
    <DockWrapper>
      {windows.map((window) => (
        <DockIcon key={window.id} whileHover={{ scale: 1.2 }} onClick={() => toggleWindow(window.id)}>
          <Image src={window.icon} alt={window.id} width={40} height={40} />
          <IconLabel>{window.id}</IconLabel>
          {window.isOpen && <OpenIndicator />}
        </DockIcon>
      ))}
    </DockWrapper>
  );
};

export default Dock;