'use client'

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin } from 'lucide-react';
import '../../i18n/config';

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
    <div className="min-h-screen bg-black text-white flex flex-col" style={{ backgroundColor: '#121212' }}>
      {/* Header */}
      <div className="shrink-0 text-center py-8 px-4 pt-4">
        <h1
          className={`text-3xl md:text-4xl lg:text-5xl font-bold ${randomFont} cursor-pointer hover:opacity-80 transition-opacity`}
          style={{ color: '#edeced' }}
          onClick={handleTitleClick}
        >
          {t('blog.title')}
        </h1>
        <p className="text-base md:text-lg lg:text-xl font-pixel mt-2" style={{ color: '#edeced', opacity: 0.8 }}>
          {t('blog.subtitle')}
        </p>
      </div>

      {/* Content - single welcome entry */}
      <div className="flex-1 px-4 pb-8 max-w-2xl mx-auto w-full">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="font-pixel"
            style={{ color: '#edeced' }}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#edeced' }}>
              {t('blog.welcomeEntry')}
            </h2>
            <p className="text-sm opacity-80 mb-4" style={{ color: '#edeced', opacity: 0.8 }}>
              {post.date}
            </p>
            <p className="text-base md:text-lg">{post.content}</p>
          </article>
        ))}
      </div>

      {/* Footer Links - mismo estilo que la página principal */}
      <div className="shrink-0 mt-auto py-4 text-center px-4">
        <div className={`flex items-center justify-between md:justify-center md:space-x-8 text-xs md:text-sm font-pixel`} style={{ color: '#edeced' }}>
          <a
            href="/"
            className="hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center"
            style={{ color: '#edeced' }}
          >
            {t('common.home')}
          </a>
          <a
            href="/blog"
            className="hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center"
            style={{ color: '#edeced' }}
          >
            {t('common.blog')}
          </a>
          <a
            href="/projects"
            className="hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center"
            style={{ color: '#edeced' }}
          >
            {t('common.projects')}
          </a>
          <a
            href="/mac-folio"
            className="hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center"
            style={{ color: '#edeced' }}
          >
            {t('common.macFolio')}
          </a>
          <a
            href="https://www.linkedin.com/in/txnio/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center"
            style={{ color: '#edeced' }}
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
            style={{ color: '#edeced' }}
            title="GitHub"
          >
            <Github size={16} className="md:hidden" />
            <span className="hidden md:inline">{t('common.github')}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
