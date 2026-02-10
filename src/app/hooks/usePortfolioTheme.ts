'use client';

import { useCallback, useEffect, useState } from 'react';

export type PortfolioTheme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'portfolio-theme';

const isValidTheme = (value: string | null | undefined): value is PortfolioTheme => {
  return value === 'dark' || value === 'light';
};

const applyThemeToDocument = (theme: PortfolioTheme) => {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme;
  }
};

const getInitialTheme = (fallbackTheme: PortfolioTheme): PortfolioTheme => {
  if (typeof document === 'undefined') return fallbackTheme;

  const currentTheme = document.documentElement.dataset.theme;
  if (isValidTheme(currentTheme)) return currentTheme;

  return fallbackTheme;
};

export const usePortfolioTheme = (fallbackTheme: PortfolioTheme = 'dark') => {
  const [theme, setTheme] = useState<PortfolioTheme>(() => getInitialTheme(fallbackTheme));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (isValidTheme(savedTheme)) {
        setTheme(savedTheme);
        applyThemeToDocument(savedTheme);
        return;
      }
    } catch (_error) {
      // Ignore localStorage access issues and keep fallback theme.
    }

    applyThemeToDocument(fallbackTheme);
  }, [fallbackTheme]);

  const setPortfolioTheme = useCallback((nextTheme: PortfolioTheme) => {
    setTheme(nextTheme);
    applyThemeToDocument(nextTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (_error) {
      // Ignore localStorage access issues.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setPortfolioTheme(theme === 'dark' ? 'light' : 'dark');
  }, [setPortfolioTheme, theme]);

  return {
    theme,
    isLightMode: theme === 'light',
    setTheme: setPortfolioTheme,
    toggleTheme,
  };
};
