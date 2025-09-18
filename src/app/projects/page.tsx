'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import '../../i18n/config';

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
    description: "Simulación interactiva de Mac OS 7 con ventanas funcionales y la estética clásica del sistema.",
    githubUrl: "https://github.com/txnioh/portfolio-txnio",
    demoUrl: "https://os.txnio.com",
    imagePath: "/projects-img/project-macold.png"
  },
  { 
    id: 8, 
    title: "Cubes", 
    description: "Una experiencia visual interactiva con cubos 3D utilizando Three.js y React Three Fiber.",
    githubUrl: "https://github.com/txnioh/cubes",
    demoUrl: "https://cubes-umber.vercel.app",
    imagePath: "/projects-img/project-cubes.png"
  },
  { 
    id: 6, 
    title: "Minder", 
    description: "Una aplicación para subir imágenes, comentarios y proyectos utilizando Firebase, React, TypeScript, Next.js y autenticación de Google.",
    githubUrl: "https://github.com/txnioh/minder",
    demoUrl: "https://minder-txnio.vercel.app/",
    imagePath: "/projects-img/project-minder.png"
  },
  { 
    id: 7, 
    title: "Second Portfolio", 
    description: "Un portafolio inspirado en el trabajo de Yihui Hu, con un diseño tipo pegatina.",
    githubUrl: "https://github.com/txnioh/second-portfolio",
    demoUrl: "https://second-portfolio-txnio.vercel.app/",
    imagePath: "/projects-img/project-second-portfolio.png"
  },
  { 
    id: 1, 
    title: "3D Crystal Effect", 
    description: "Un efecto visual de cristal 3D implementado con JavaScript.",
    githubUrl: "https://github.com/txnioh/3d-cristal-effect",
    demoUrl: "https://3d-cristal-effect.vercel.app/",
    imagePath: "/projects-img/project-crystal-effect.png"
  },
  { 
    id: 2, 
    title: "Infinite Particles", 
    description: "Una animación de partículas infinitas creada con JavaScript.",
    githubUrl: "https://github.com/txnioh/infinite-particles",
    demoUrl: "https://infinite-particles-txnio.vercel.app/",
    imagePath: "/projects-img/project-infinite-particles.png"
  },
  { 
    id: 3, 
    title: "Floating Images", 
    description: "Una galería mínima con interacción del mouse para imágenes flotantes.",
    githubUrl: "https://github.com/txnioh/floating-images",
    demoUrl: "https://floating-images.vercel.app/",
    imagePath: "/projects-img/project-floating-images.png"
  },
  { 
    id: 4, 
    title: "Pixel Transition", 
    description: "Una transición de píxeles simple para la barra de menú.",
    githubUrl: "https://github.com/txnioh/pixel-transition",
    demoUrl: "https://pixel-transition-eight.vercel.app/",
    imagePath: "/projects-img/project-pixel-transition.png"
  },
  { 
    id: 5, 
    title: "Gradient Generator", 
    description: "Un generador de gradientes implementado en JavaScript.",
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

const ProjectsPage = () => {
  const { t, i18n } = useTranslation();
  const [randomFont, setRandomFont] = useState('font-pixel');
  const currentLanguage = (i18n.language || 'en').split('-')[0] as 'en' | 'es';

  const setLanguage = (languageCode: 'en' | 'es') => {
    i18n.changeLanguage(languageCode);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('lng', languageCode);
      } catch {}
    }
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
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-3">
        <button
          onClick={() => setLanguage('en')}
          className={`px-4 py-2 text-sm font-pixel transition-opacity ${currentLanguage === 'en' ? 'text-white opacity-100' : 'text-white/60 hover:text-white/80'}`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('es')}
          className={`px-4 py-2 text-sm font-pixel transition-opacity ${currentLanguage === 'es' ? 'text-white opacity-100' : 'text-white/60 hover:text-white/80'}`}
        >
          ES
        </button>
      </div>

      {/* Top Navigation */}
      <div className="text-center py-4">
        <div className="flex justify-center space-x-8 text-sm font-pixel mb-6">
          <a
            href="/"
            className="hover:opacity-80 transition-opacity"
            style={{ color: '#edeced' }}
          >
            {t('common.home') || 'Home'}
          </a>
          <a
            href="/mac-folio"
            className="hover:opacity-80 transition-opacity"
            style={{ color: '#edeced' }}
          >
            {t('common.macFolio') || 'Mac-Folio'}
          </a>
          <a
            href="https://www.linkedin.com/in/txnio/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
            style={{ color: '#edeced' }}
          >
            {t('common.linkedin') || 'LinkedIn'}
          </a>
          <a
            href="https://github.com/txnioh"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
            style={{ color: '#edeced' }}
          >
            {t('common.github') || 'GitHub'}
          </a>
        </div>
      </div>

      {/* Header */}
      <div className="text-center py-4">
        <h1 
          className={`text-4xl md:text-5xl font-bold ${randomFont} cursor-pointer hover:opacity-80 transition-opacity`}
          style={{ color: '#edeced' }}
          onClick={handleTitleClick}
        >
          PROJECTS
        </h1>
        <p className="text-lg md:text-xl font-pixel mt-2" style={{ color: '#edeced', opacity: 0.8 }}>
          by TXNIO
        </p>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  {project.description}
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
                    Live Demo ↗
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-pixel hover:opacity-80 transition-opacity underline"
                    style={{ color: '#87CEEB' }}
                  >
                    GitHub ↗
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