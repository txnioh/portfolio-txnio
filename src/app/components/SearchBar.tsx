import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { WindowState, DesktopIcon } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const SearchOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const SearchContainer = styled.div<{ isMobile: boolean }>`
  width: ${props => props.isMobile ? '90%' : '600px'};
  max-width: 600px;
  background-color: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 10px;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 18px;
  outline: none;
  margin-left: 10px;
`;

const SearchResults = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 10px 0 0 0;
`;

const SearchResultItem = styled.li<{ isSelected: boolean }>`
  padding: 10px;
  cursor: pointer;
  background-color: ${props => props.isSelected ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  border-radius: 5px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ItemIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 10px;
  position: relative;
`;

const ItemName = styled.span`
  flex-grow: 1;
`;

interface SearchBarProps {
  windows: WindowState[];
  desktopIcons: DesktopIcon[];
  toggleWindow: (id: string) => void;
  openUrl: (url: string) => void;
  onClose: () => void;
  isMobile: boolean;
}

interface SearchItem {
  id: string;
  icon: string;
  type: 'window' | 'desktopIcon';
  url?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  windows, 
  desktopIcons, 
  toggleWindow, 
  openUrl, 
  onClose,
  isMobile 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Limpiar al desmontar
    return () => {
      setSearchTerm('');
      setFilteredItems([]);
      setSelectedIndex(0);
    };
  }, []);

  useEffect(() => {
    const allItems: SearchItem[] = [
      ...windows.map(w => ({ id: w.id, icon: w.icon, type: 'window' as const })),
      ...desktopIcons.map(d => ({ id: d.id, icon: d.icon, type: 'desktopIcon' as const, url: d.url }))
    ];

    // Eliminar duplicados basados en el id
    const uniqueItems = allItems.reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, [] as SearchItem[]);

    if (searchTerm.trim() === '') {
      setFilteredItems([]);
    } else {
      const filtered = uniqueItems.filter(item =>
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
    setSelectedIndex(0);
  }, [searchTerm, windows, desktopIcons]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      if (filteredItems[selectedIndex]) {
        handleItemClick(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  const handleItemClick = (item: SearchItem) => {
    if (item.type === 'window') {
      toggleWindow(item.id);
    } else if (item.type === 'desktopIcon' && item.url) {
      openUrl(item.url);
    }
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setFilteredItems([]);
    setSelectedIndex(0);
    onClose();
  };

  return (
    <AnimatePresence>
      <SearchOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleClose}
      >
        <SearchContainer isMobile={isMobile} onClick={(e) => e.stopPropagation()}>
          <SearchInputContainer>
            <FaSearch color="white" />
            <SearchInput
              ref={inputRef}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar aplicaciones..."
            />
            <FaTimes color="white" onClick={handleClose} style={{ cursor: 'pointer' }} />
          </SearchInputContainer>
          <SearchResults>
            <AnimatePresence>
              {filteredItems.slice(0, 4).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <SearchResultItem
                    isSelected={index === selectedIndex}
                    onClick={() => handleItemClick(item)}
                  >
                    <ItemIcon>
                      <Image src={item.icon} alt={item.id} layout="fill" objectFit="contain" />
                    </ItemIcon>
                    <ItemName>{item.id}</ItemName>
                  </SearchResultItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </SearchResults>
        </SearchContainer>
      </SearchOverlay>
    </AnimatePresence>
  );
};

export default SearchBar;