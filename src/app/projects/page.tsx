'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../../i18n/config';
import ProjectsNavbar from '../components/ProjectsNavbar';

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
    title: "txniOS Old",
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
const COLLAPSED_WIDTH_PCT = 5.5;
const EXPANDED_WIDTH_PCT = 100 - (PROJECT_COUNT - 1) * COLLAPSED_WIDTH_PCT;
const DEFAULT_WIDTH_PCT = 100 / PROJECT_COUNT;

const COLUMN_TRANSITION = {
  type: 'tween' as const,
  duration: 0.28,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

const ProjectsPage = () => {
  const { t, i18n } = useTranslation();
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
    <div className="min-h-screen bg-black text-white" style={{ backgroundColor: '#121212' }}>
      {/* Navbar */}
      <ProjectsNavbar
        isAnimatingNav={false}
        navTexts={{ home: '', macFolio: '', linkedin: '', github: '' }}
      />

      {/* Header */}
      <div className="text-center py-8 px-4 mt-4">
        <h1
          className={`text-3xl md:text-4xl lg:text-5xl font-bold ${randomFont} cursor-pointer hover:opacity-80 transition-opacity`}
          style={{ color: '#edeced' }}
          onClick={handleTitleClick}
        >
          {t('projects.title')}
        </h1>
        <p className="text-base md:text-lg lg:text-xl font-pixel mt-2" style={{ color: '#edeced', opacity: 0.8 }}>
          {t('projects.subtitle')}
        </p>
      </div>

      {/* Accordion Pillars */}
      <div
        className={`mx-auto px-4 md:px-8 pb-8 ${isMobile ? 'max-w-md' : 'max-w-7xl'}`}
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: isMobile ? undefined : 'nowrap',
          alignItems: 'stretch',
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

    </div>
  );
};

export default ProjectsPage;