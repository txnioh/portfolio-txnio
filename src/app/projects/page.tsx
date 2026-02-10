'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin, ArrowUpRight } from 'lucide-react';
import '../../i18n/config';
import ThemeToggle from '../components/ThemeToggle';
import ThemeMotionContainer from '../components/ThemeMotionContainer';
import { usePortfolioTheme } from '../hooks/usePortfolioTheme';
import { useThemePixelWave } from '../hooks/useThemePixelWave';

interface Project {
  id: number;
  title: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
  imagePath: string;
}

const projects: Project[] = [
  {
    id: 9,
    title: "txniOS",
    description: "", // Will be populated from translations
    githubUrl: "https://github.com/txnioh/portfolio-txnio",
    demoUrl: "https://os.txnio.com",
    imagePath: "/projects-img/project-macold.png"
  },
  {
    id: 8,
    title: "Cubes",
    description: "", // Will be populated from translations
    githubUrl: "https://github.com/txnioh/cubes",
    demoUrl: "https://cubes-umber.vercel.app",
    imagePath: "/projects-img/project-cubes.png"
  },
  {
    id: 6,
    title: "Minder",
    description: "", // Will be populated from translations
    githubUrl: "https://github.com/txnioh/minder",
    demoUrl: "https://minder-txnio.vercel.app/",
    imagePath: "/projects-img/project-minder.png"
  },
  {
    id: 7,
    title: "Second Portfolio",
    description: "", // Will be populated from translations
    githubUrl: "https://github.com/txnioh/second-portfolio",
    demoUrl: "https://second-portfolio-txnio.vercel.app/",
    imagePath: "/projects-img/project-second-portfolio.png"
  },
  {
    id: 1,
    title: "3D Crystal Effect",
    description: "", // Will be populated from translations
    githubUrl: "https://github.com/txnioh/3d-cristal-effect",
    demoUrl: "https://3d-cristal-effect.vercel.app/",
    imagePath: "/projects-img/project-crystal-effect.png"
  },
  {
    id: 2,
    title: "Infinite Particles",
    description: "", // Will be populated from translations
    githubUrl: "https://github.com/txnioh/infinite-particles",
    demoUrl: "https://infinite-particles-txnio.vercel.app/",
    imagePath: "/projects-img/project-infinite-particles.png"
  },
  {
    id: 3,
    title: "Floating Images",
    description: "", // Will be populated from translations
    githubUrl: "https://github.com/txnioh/floating-images",
    demoUrl: "https://floating-images.vercel.app/",
    imagePath: "/projects-img/project-floating-images.png"
  },
  {
    id: 4,
    title: "Pixel Transition",
    description: "", // Will be populated from translations
    githubUrl: "https://github.com/txnioh/pixel-transition",
    demoUrl: "https://pixel-transition-eight.vercel.app/",
    imagePath: "/projects-img/project-pixel-transition.png"
  },
  {
    id: 5,
    title: "Gradient Generator",
    description: "", // Will be populated from translations
    githubUrl: "https://github.com/txnioh/gradient-generator",
    demoUrl: "https://gradient-generator-txnio.vercel.app/",
    imagePath: "/projects-img/project-gradient-generator.png"
  },
];

const availableFonts = [
  'font-chicago',
  'font-renogare',
  'font-geneva',
  'font-pixel',
];

const getRandomFont = () => {
  return availableFonts[Math.floor(Math.random() * availableFonts.length)];
};

// Fixed widths for accordion: only expanded + collapsed columns animate; total stays constant
const PROJECT_COUNT = projects.length;
const COLLAPSED_WIDTH_PCT = 8;
const EXPANDED_WIDTH_PCT = 100 - (PROJECT_COUNT - 1) * COLLAPSED_WIDTH_PCT;
const DEFAULT_WIDTH_PCT = 100 / PROJECT_COUNT;

const COLUMN_TRANSITION = {
  type: 'tween' as const,
  duration: 0.28,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

const ProjectsPage = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = usePortfolioTheme();
  const { canvasRef: themeWaveCanvasRef, triggerWaveToggle } = useThemePixelWave({
    theme,
    setTheme,
  });
  const [randomFont, setRandomFont] = useState('font-pixel');
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setRandomFont(getRandomFont());

    // Detectar móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLanguage = window.localStorage.getItem('lng');
        if (savedLanguage && savedLanguage !== i18n.language) {
          i18n.changeLanguage(savedLanguage);
        }
      } catch { }
    }
  }, [i18n]);

  const handleTitleClick = () => {
    setRandomFont(getRandomFont());
  };

  return (
    <ThemeMotionContainer theme={theme} className="min-h-screen flex flex-col portfolio-theme-surface">
      <canvas ref={themeWaveCanvasRef} className="fixed inset-0 z-[70] pointer-events-none" aria-hidden="true" />
      {/* Header - no encoger, más espacio y centrado */}
      <div className="shrink-0 text-center py-10 md:py-14 px-6 max-w-2xl mx-auto">
        <h1
          className={`text-3xl md:text-4xl lg:text-5xl font-bold ${randomFont} cursor-pointer hover:opacity-80 transition-opacity`}
          style={{ color: 'var(--portfolio-text)' }}
          onClick={handleTitleClick}
        >
          {t('projects.title')}
        </h1>
        <p className="text-base md:text-lg lg:text-xl font-pixel mt-3 md:mt-4" style={{ color: 'var(--portfolio-text-muted)' }}>
          {t('projects.subtitle')}
        </p>
      </div>

      {/* Accordion Pillars - altura fija, no encoger */}
      <div
        className={`shrink-0 mx-auto w-full px-4 md:px-8 pb-8 ${isMobile ? 'max-w-md' : 'max-w-7xl'}`}
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: isMobile ? undefined : 'nowrap',
          alignItems: 'stretch',
          minHeight: isMobile ? 'auto' : '65vh',
          height: isMobile ? 'auto' : '65vh',
          gap: isMobile ? '16px' : '8px',
        }}
        onMouseLeave={() => !isMobile && setHoveredId(null)}
      >
        {projects.map((project) => {
          const widthPct =
            isMobile
              ? undefined
              : hoveredId === null
                ? DEFAULT_WIDTH_PCT
                : hoveredId === project.id
                  ? EXPANDED_WIDTH_PCT
                  : COLLAPSED_WIDTH_PCT;
          return (
          <motion.div
            key={project.id}
            className="relative overflow-hidden cursor-pointer"
            style={{
              height: isMobile ? '200px' : '100%',
              borderRadius: '32px',
              minWidth: isMobile ? '100%' : undefined,
              ...(isMobile ? {} : { flexGrow: 0, flexShrink: 0 }),
            }}
            animate={
              isMobile
                ? undefined
                : { flexBasis: `${widthPct}%` }
            }
            transition={COLUMN_TRANSITION}
            onMouseEnter={() => !isMobile && setHoveredId(project.id)}
            onClick={() => window.open(project.demoUrl, '_blank')}
          >
            {/* Background Image */}
            <Image
              src={project.imagePath}
              alt={project.title}
              fill
              className="object-cover"
              sizes={isMobile ? "100vw" : "(max-width: 768px) 100vw, 20vw"}
            />

            {/* Dark overlay for text readability */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
              animate={{
                opacity: hoveredId === project.id || isMobile ? 1 : 0.4,
              }}
              transition={COLUMN_TRANSITION}
            />

            {/* Content - Title and description */}
            <AnimatePresence>
              {(hoveredId === project.id || isMobile) && (
                <motion.div
                  className="absolute inset-0 flex flex-col justify-end p-4 pointer-events-none"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{
                    duration: 0.22,
                    ease: [0.65, 0, 0.35, 1],
                  }}
                >
                  <h3
                    className="text-lg md:text-xl lg:text-2xl font-bold font-pixel mb-2"
                    style={{ color: '#FFA500' }}
                  >
                    {project.title}
                  </h3>

                  {!isMobile && (
                    <p
                      className="text-xs md:text-sm font-pixel line-clamp-2"
                      style={{ color: '#e0e0e0' }}
                    >
                      {t(`projectDescriptions.${project.title}`)}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          );
        })}
      </div>

      {/* Footer Links - mismo estilo que la página principal */}
      <div className="shrink-0 mt-auto py-4 text-center px-4">
        <div className={`flex items-center justify-between md:justify-center md:space-x-8 text-xs md:text-sm font-pixel`} style={{ color: 'var(--portfolio-text)' }}>
          <a
            href="/blog"
            className="hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center"
            style={{ color: 'var(--portfolio-text)' }}
          >
            {t('common.blog')}
          </a>
          <a
            href="/"
            className="hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center"
            style={{ color: 'var(--portfolio-text)' }}
          >
            {t('common.home')}
          </a>
          <a
            href="/projects"
            className="hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center"
            style={{ color: 'var(--portfolio-text)' }}
          >
            {t('common.projects')}
          </a>
          <a
            href="https://os.txnio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center gap-1"
            style={{ color: 'var(--portfolio-text)' }}
            title="txniOS"
          >
            {t('common.txniOS')}
            <ArrowUpRight size={14} className="inline shrink-0" />
          </a>
          <a
            href="https://www.linkedin.com/in/txnio/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center"
            style={{ color: 'var(--portfolio-text)' }}
            title="LinkedIn"
          >
            <Linkedin size={16} className="md:hidden" />
            <span className="hidden md:inline">{t('common.linkedin')}</span>
          </a>
          <a
            href="https://github.com/txnioh"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center"
            style={{ color: 'var(--portfolio-text)' }}
            title="GitHub"
          >
            <Github size={16} className="md:hidden" />
            <span className="hidden md:inline">{t('common.github')}</span>
          </a>
          <ThemeToggle
            theme={theme}
            onToggle={triggerWaveToggle}
            labelForLightMode={t('common.lightMode')}
            labelForDarkMode={t('common.darkMode')}
            iconOnly
            className="shrink-0"
          />
        </div>
      </div>

    </ThemeMotionContainer>
  );
};

export default ProjectsPage;
