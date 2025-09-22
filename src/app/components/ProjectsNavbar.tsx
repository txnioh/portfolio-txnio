'use client'

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface ProjectsNavbarProps {
  currentLanguage: 'en' | 'es';
  onLanguageChange: (languageCode: 'en' | 'es') => void;
  isAnimatingNav: boolean;
  navTexts: {
    home: string;
    macFolio: string;
    linkedin: string;
    github: string;
  };
}

const ProjectsNavbar: React.FC<ProjectsNavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  isAnimatingNav,
  navTexts
}) => {
  const { t } = useTranslation();

  return (
    <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Navigation Links */}
          <div className="flex items-center justify-between md:justify-start md:space-x-6 flex-1 pr-4">
            <a
              href="/"
              className="text-white/70 hover:text-white transition-colors duration-200 text-xs md:text-sm font-pixel"
            >
              {isAnimatingNav ? navTexts.home : (t('common.home') || 'Home')}
            </a>
            <a
              href="/mac-folio"
              className="text-white/70 hover:text-white transition-colors duration-200 text-xs md:text-sm font-pixel"
            >
              {isAnimatingNav ? navTexts.macFolio : (t('common.macFolio') || 'Mac-Folio')}
            </a>
            <a
              href="https://www.linkedin.com/in/txnio/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-1"
              title="LinkedIn"
            >
              <Linkedin size={16} className="md:hidden" />
              <span className="hidden md:inline text-xs md:text-sm font-pixel">
                {isAnimatingNav ? navTexts.linkedin : (t('common.linkedin') || 'LinkedIn')}
              </span>
            </a>
            <a
              href="https://github.com/txnioh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-1"
              title="GitHub"
            >
              <Github size={16} className="md:hidden" />
              <span className="hidden md:inline text-xs md:text-sm font-pixel">
                {isAnimatingNav ? navTexts.github : (t('common.github') || 'GitHub')}
              </span>
            </a>
          </div>

          {/* Language Selector */}
          <div className="flex items-center">
            <LanguageSelector 
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ProjectsNavbar;