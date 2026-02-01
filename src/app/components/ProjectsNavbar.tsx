'use client'

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin, ArrowUpRight } from 'lucide-react';

interface ProjectsNavbarProps {

  isAnimatingNav: boolean;
  navTexts: {
    home: string;
    txniOS: string;
    linkedin: string;
    github: string;
  };
}

const FALLBACK = { home: 'Home', txniOS: 'txniOS', linkedin: 'LinkedIn', github: 'GitHub' };

const ProjectsNavbar: React.FC<ProjectsNavbarProps> = ({

  isAnimatingNav,
  navTexts
}) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const label = (key: keyof typeof FALLBACK) =>
    isAnimatingNav ? navTexts[key] : (mounted ? (t(`common.${key}`) || FALLBACK[key]) : FALLBACK[key]);

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
              {label('home')}
            </a>
            <a
              href="https://os.txnio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors duration-200 text-xs md:text-sm font-pixel flex items-center gap-1"
              title="txniOS"
            >
              {label('txniOS')}
              <ArrowUpRight size={14} className="inline shrink-0" />
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
                {label('linkedin')}
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
                {label('github')}
              </span>
            </a>
          </div>


        </div>
      </div>
    </nav>
  );
};

export default ProjectsNavbar;