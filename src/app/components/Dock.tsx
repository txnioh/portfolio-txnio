import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { WindowState } from '../types';

const DockWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const DockIcon = styled(motion.div)`
  width: 50px;
  height: 50px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 10px;
  overflow: visible;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const IconLabel = styled(motion.span)`
  position: absolute;
  top: -30px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
`;

const OpenIndicator = styled.div`
  width: 4px;
  height: 4px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
`;

interface DockProps {
  windows: WindowState[];
  toggleWindow: (id: string) => void;
}

const Dock: React.FC<DockProps> = ({ windows, toggleWindow }) => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  return (
    <DockWrapper>
      {windows.map((window) => (
        <DockIcon
          key={window.id}
          whileHover={{ y: -10, scale: 1.1 }}
          onClick={() => toggleWindow(window.id)}
          onHoverStart={() => setHoveredIcon(window.id)}
          onHoverEnd={() => setHoveredIcon(null)}
        >
          <Image src={window.icon} alt={window.id} width={40} height={40} />
          {window.isOpen && <OpenIndicator />}
          <AnimatePresence>
            {hoveredIcon === window.id && (
              <IconLabel
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.1 }}
              >
                {window.id}
              </IconLabel>
            )}
          </AnimatePresence>
        </DockIcon>
      ))}
    </DockWrapper>
  );
};

export default Dock;