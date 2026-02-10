'use client'

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin, ArrowUpRight } from 'lucide-react';
import '../../i18n/config';
import ThemeToggle from '../components/ThemeToggle';
import ThemeMotionContainer from '../components/ThemeMotionContainer';
import { usePortfolioTheme } from '../hooks/usePortfolioTheme';
import { useThemePixelWave } from '../hooks/useThemePixelWave';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
}

const posts: BlogPost[] = [
  {
    slug: 'bienvenida',
    title: '', // Will use translation key
    date: '2025-02-01',
    content: 'hola',
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

const BlogPage = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = usePortfolioTheme();
  const { canvasRef: themeWaveCanvasRef, triggerWaveToggle } = useThemePixelWave({
    theme,
    setTheme,
  });
  const [randomFont, setRandomFont] = useState('font-pixel');

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
      } catch { }
    }
  }, [i18n]);

  const handleTitleClick = () => {
    setRandomFont(getRandomFont());
  };

  return (
    <ThemeMotionContainer theme={theme} className="min-h-screen flex flex-col portfolio-theme-surface">
      <canvas ref={themeWaveCanvasRef} className="fixed inset-0 z-[70] pointer-events-none" aria-hidden="true" />
      {/* Header - alineado con proyectos (más espacio y centrado) */}
      <div className="shrink-0 text-center py-10 md:py-14 px-6 max-w-2xl mx-auto">
        <h1
          className={`text-3xl md:text-4xl lg:text-5xl font-bold ${randomFont} cursor-pointer hover:opacity-80 transition-opacity`}
          style={{ color: 'var(--portfolio-text)' }}
          onClick={handleTitleClick}
        >
          {t('blog.title')}
        </h1>
        <p className="text-base md:text-lg lg:text-xl font-pixel mt-3 md:mt-4" style={{ color: 'var(--portfolio-text-muted)' }}>
          {t('blog.subtitle')}
        </p>
      </div>

      {/* Content - single welcome entry */}
      <div className="flex-1 px-4 pb-8 max-w-2xl mx-auto w-full">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="font-pixel"
            style={{ color: 'var(--portfolio-text)' }}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: 'var(--portfolio-text)' }}>
              {t('blog.welcomeEntry')}
            </h2>
            <p className="text-sm opacity-80 mb-4" style={{ color: 'var(--portfolio-text-muted)' }}>
              {post.date}
            </p>
            <p className="text-base md:text-lg">{post.content}</p>
          </article>
        ))}
      </div>

      {/* Footer Links - mismo orden y estilo que proyectos */}
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

export default BlogPage;
