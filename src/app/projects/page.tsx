'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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

// Matrix characters for animation
const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_+-=[]{}|;:,.<>?';

// Function to generate random matrix characters
const generateRandomChars = (length: number) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
  }
  return result;
};

const ProjectsPage = () => {
  const { t, i18n } = useTranslation();
  const [randomFont, setRandomFont] = useState('font-pixel');
  const currentLanguage = (i18n.language || 'en').split('-')[0] as 'en' | 'es';
  
  // Animation states for navigation
  const [isAnimatingNav, setIsAnimatingNav] = useState(false);
  const [navTexts, setNavTexts] = useState({
    home: '',
    macFolio: '',
    linkedin: '',
    github: ''
  });

  const setLanguage = (languageCode: 'en' | 'es') => {
    // Start matrix animation for navigation
    setIsAnimatingNav(true);
    
    // Get current texts to animate
    const currentTexts = {
      home: t('common.home') || 'Home',
      macFolio: t('common.macFolio') || 'Mac-Folio',
      linkedin: t('common.linkedin') || 'LinkedIn',
      github: t('common.github') || 'GitHub'
    };
    
    // Generate initial matrix text
    setNavTexts({
      home: generateRandomChars(currentTexts.home.length),
      macFolio: generateRandomChars(currentTexts.macFolio.length),
      linkedin: generateRandomChars(currentTexts.linkedin.length),
      github: generateRandomChars(currentTexts.github.length)
    });

    // Matrix animation loop
    let animationCount = 0;
    const maxAnimations = 2;
    const animationInterval = setInterval(() => {
      animationCount++;
      
      // Update matrix text with new random characters
      setNavTexts({
        home: generateRandomChars(currentTexts.home.length),
        macFolio: generateRandomChars(currentTexts.macFolio.length),
        linkedin: generateRandomChars(currentTexts.linkedin.length),
        github: generateRandomChars(currentTexts.github.length)
      });

      // Stop animation and change language
      if (animationCount >= maxAnimations) {
        clearInterval(animationInterval);
        setIsAnimatingNav(false);
        
        // Change language after animation
        i18n.changeLanguage(languageCode);
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem('lng', languageCode);
          } catch {}
        }
      }
    }, 50);
  };

  useEffect(() => {
    setRandomFont(getRandomFont());
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLanguage = window.localStorage.getItem('lng');
        if (savedLanguage && savedLanguage !== i18n.language) {
          i18n.changeLanguage(savedLanguage);
        }
      } catch {}
    }
  }, [i18n]);

  const handleTitleClick = () => {
    setRandomFont(getRandomFont());
  };

  return (
    <div className="min-h-screen bg-black text-white" style={{ backgroundColor: '#121212' }}>
      {/* Navbar */}
      <ProjectsNavbar 
        currentLanguage={currentLanguage}
        onLanguageChange={setLanguage}
        isAnimatingNav={isAnimatingNav}
        navTexts={navTexts}
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

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group cursor-pointer transition-all duration-300 hover:-translate-y-2"
            >
              {/* Project Image */}
              <div className="relative mb-4 rounded-lg overflow-hidden">
                <Image
                  src={project.imagePath}
                  alt={project.title}
                  width={400}
                  height={250}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
              </div>

              {/* Project Info */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-pixel group-hover:text-orange-400 transition-colors" style={{ color: '#FFA500' }}>
                  {project.title}
                </h3>
                <p className="text-sm font-pixel" style={{ color: '#e0e0e0', opacity: 0.9, lineHeight: 1.4 }}>
                  {t(`projectDescriptions.${project.title}`)}
                </p>
                
                {/* Links */}
                <div className="flex gap-4 pt-2">
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-pixel hover:opacity-80 transition-opacity underline"
                    style={{ color: '#90EE90' }}
                  >
                    {t('projects.liveDemo')} ↗
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-pixel hover:opacity-80 transition-opacity underline"
                    style={{ color: '#87CEEB' }}
                  >
                    {t('projects.github')} ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProjectsPage;