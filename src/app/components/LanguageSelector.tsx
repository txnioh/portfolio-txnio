'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  onLanguageChange: (languageCode: 'en' | 'es') => void;
  currentLanguage: 'en' | 'es';
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  onLanguageChange, 
  currentLanguage, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const languages = [
    { code: 'en' as const, label: 'English', flag: '🇺🇸' },
    { code: 'es' as const, label: 'Español', flag: '🇪🇸' }
  ];

  const handleLanguageSelect = (languageCode: 'en' | 'es') => {
    onLanguageChange(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-pixel transition-opacity hover:opacity-80 text-white/80 hover:text-white min-h-[36px] md:min-h-[44px]"
        aria-label="Select language"
      >
        <Globe size={16} />
        <span className="uppercase">{currentLanguage}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg py-1 min-w-[120px] z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`w-full px-3 py-2 text-left text-sm font-pixel transition-colors hover:bg-white/10 flex items-center gap-2 ${
                currentLanguage === language.code 
                  ? 'text-white bg-white/5' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="text-base">{language.flag}</span>
              <span>{language.label}</span>
              {currentLanguage === language.code && (
                <span className="ml-auto text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;