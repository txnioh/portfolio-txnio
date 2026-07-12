'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin, ArrowUpRight } from 'lucide-react';
import '../../i18n/config';
import ThemeToggle from '../components/ThemeToggle';
import ThemeMotionContainer from '../components/ThemeMotionContainer';
import GlobalVinylControl from '../components/GlobalVinylControl';
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
    imagePath: "/projects-img/project-txnios-main.webp"
  },
  {
    id: 8,
    title: "Spacio",
    description: "", // Will be populated from translations
    githubUrl: "https://github.com/txnioh/spacio",
    demoUrl: "https://spacio.txnio.com/",
    imagePath: "/projects-img/project-spacio-bim.gif"
  },
  {
    id: 6,
    title: "Minder",
    description: "", // Will be populated from translations
    githubUrl: "https://github.com/txnioh/minder",
    demoUrl: "https://minder-txnio.vercel.app/",
    imagePath: "/projects-img/project-minder-main.gif"
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

const MOBILE_FOOTER_HEIGHT = 68;

const ProjectsPage = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = usePortfolioTheme();
  const { canvasRef: themeWaveCanvasRef, triggerWaveToggle } = useThemePixelWave({
    theme,
    setTheme,
  });
  const [randomFont, setRandomFont] = useState('font-pixel');
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(true);
  const [hasMeasuredViewport, setHasMeasuredViewport] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setRandomFont(getRandomFont());

    // Detectar móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setHasMeasuredViewport(true);
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

  const safeT = (key: string): string => {
    if (mounted) return t(key);

    const fallbacks: Record<string, string> = {
      'common.blog': 'Blog',
      'common.home': 'Home',
      'common.projects': 'Projects',
      'common.txniOS': 'txniOS',
      'common.linkedin': 'LinkedIn',
      'common.github': 'GitHub',
      'common.lightMode': 'Light mode',
      'common.darkMode': 'Dark mode',
      'projects.title': 'PROJECTS',
      'projects.subtitle': 'by TXNIO',
    };

    return fallbacks[key] || key;
  };

  const renderFooter = (fixedToViewport: boolean) => {
    const footerTextColor = theme === 'dark' ? '#edeced' : '#1d1d1f';
    const footerSurface = theme === 'dark' ? 'rgba(18, 18, 18, 0.82)' : 'rgba(247, 247, 245, 0.82)';
    const footerBorder = theme === 'dark' ? 'rgba(237, 236, 237, 0.14)' : 'rgba(29, 29, 31, 0.14)';

    return (
      <div
        className="shrink-0 mt-auto py-4 text-center px-4"
        style={{
          position: fixedToViewport ? 'fixed' : 'relative',
          left: fixedToViewport ? 0 : undefined,
          right: fixedToViewport ? 0 : undefined,
          bottom: fixedToViewport ? 0 : undefined,
          zIndex: fixedToViewport ? 60 : undefined,
          background: fixedToViewport ? footerSurface : undefined,
          backdropFilter: fixedToViewport ? 'blur(12px)' : undefined,
          borderTop: fixedToViewport ? `1px solid ${footerBorder}` : undefined,
          paddingBottom: fixedToViewport ? 'max(0.75rem, env(safe-area-inset-bottom))' : undefined,
        }}
      >
        <div className={`flex items-center justify-between md:justify-center md:space-x-8 text-xs md:text-sm font-pixel`} style={{ color: fixedToViewport ? footerTextColor : 'var(--portfolio-text)' }}>
          <Link
            href="/blog"
            className="hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center"
            style={{ color: fixedToViewport ? footerTextColor : 'var(--portfolio-text)' }}
          >
            {safeT('common.blog')}
          </Link>
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center"
            style={{ color: fixedToViewport ? footerTextColor : 'var(--portfolio-text)' }}
          >
            {safeT('common.home')}
          </Link>
          <Link
            href="/projects"
            className="hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center"
            style={{ color: fixedToViewport ? footerTextColor : 'var(--portfolio-text)' }}
          >
            {safeT('common.projects')}
          </Link>
          <a
            href="https://os.txnio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center gap-1"
            style={{ color: fixedToViewport ? footerTextColor : 'var(--portfolio-text)' }}
            title="txniOS"
          >
            {safeT('common.txniOS')}
            <ArrowUpRight size={14} className="inline shrink-0" />
          </a>
          <a
            href="https://www.linkedin.com/in/txnio/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center"
            style={{ color: fixedToViewport ? footerTextColor : 'var(--portfolio-text)' }}
            title="LinkedIn"
          >
            <Linkedin size={16} className="md:hidden" />
            <span className="hidden md:inline">{safeT('common.linkedin')}</span>
          </a>
          <a
            href="https://github.com/txnioh"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center"
            style={{ color: fixedToViewport ? footerTextColor : 'var(--portfolio-text)' }}
            title="GitHub"
          >
            <Github size={16} className="md:hidden" />
            <span className="hidden md:inline">{safeT('common.github')}</span>
          </a>
          <ThemeToggle
            theme={theme}
            onToggle={triggerWaveToggle}
            labelForLightMode={safeT('common.lightMode')}
            labelForDarkMode={safeT('common.darkMode')}
            iconOnly
            className="shrink-0"
          />
        </div>
      </div>
    );
  };

  return (
    <>
    <ThemeMotionContainer theme={theme} className="min-h-screen flex flex-col portfolio-theme-surface">
      <canvas ref={themeWaveCanvasRef} className="fixed inset-0 z-[70] pointer-events-none" aria-hidden="true" />
      <GlobalVinylControl />
      {/* Header - no encoger, más espacio y centrado */}
      <div className="shrink-0 text-center py-8 md:py-14 px-6 max-w-2xl mx-auto">
        <h1
          className={`text-3xl md:text-4xl lg:text-5xl font-bold ${randomFont} cursor-pointer hover:opacity-80 transition-opacity`}
          style={{ color: 'var(--portfolio-text)' }}
          onClick={handleTitleClick}
        >
          {safeT('projects.title')}
        </h1>
        <p className="text-base md:text-lg lg:text-xl font-pixel mt-3 md:mt-4" style={{ color: 'var(--portfolio-text-muted)' }}>
          {safeT('projects.subtitle')}
        </p>
      </div>

      {/* Accordion Pillars - altura fija, no encoger */}
      <div
        className={`shrink-0 mx-auto w-full px-4 md:px-8 ${isMobile ? 'max-w-md' : 'max-w-7xl'}`}
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: isMobile ? undefined : 'nowrap',
          alignItems: 'stretch',
          minHeight: isMobile ? 'auto' : '65vh',
          height: isMobile ? 'auto' : '65vh',
          gap: isMobile ? '10px' : '8px',
          paddingBottom: isMobile ? `${MOBILE_FOOTER_HEIGHT + 16}px` : '2rem',
        }}
        onMouseLeave={() => !isMobile && setHoveredId(null)}
      >
        {projects.map((project) => {
          const widthPct =
            isMobile || !hasMeasuredViewport
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
              height: isMobile ? '82px' : '100%',
              borderRadius: isMobile ? '14px' : '32px',
              minWidth: isMobile ? '100%' : undefined,
              ...(isMobile || !hasMeasuredViewport ? {} : { flexBasis: `${widthPct}%`, flexGrow: 0, flexShrink: 0 }),
            }}
            animate={
              isMobile || !hasMeasuredViewport
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
              draggable={false}
              className="object-cover"
              sizes={isMobile ? "(max-width: 768px) 100vw" : "(max-width: 768px) 100vw, 20vw"}
              unoptimized={project.imagePath.endsWith('.gif')}
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
                  className="absolute inset-0 flex flex-col justify-end pointer-events-none"
                  style={{ padding: isMobile ? '12px 14px' : '1rem' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{
                    duration: 0.22,
                    ease: [0.65, 0, 0.35, 1],
                  }}
                >
                  <h3
                    className="text-lg md:text-xl lg:text-2xl font-bold font-pixel"
                    style={{
                      color: '#FFA500',
                      lineHeight: isMobile ? 1.05 : undefined,
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.85)',
                    }}
                  >
                    {project.title}
                  </h3>

                  {!isMobile && (
                    <p
                      className="text-xs md:text-sm font-pixel line-clamp-2"
                      style={{ color: '#e0e0e0' }}
                    >
                      {safeT(`projectDescriptions.${project.title}`)}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          );
        })}
      </div>

      {!isMobile && renderFooter(false)}

    </ThemeMotionContainer>
    {mounted && isMobile && createPortal(renderFooter(true), document.body)}
    </>
  );
};

export default ProjectsPage;
