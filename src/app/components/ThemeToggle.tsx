'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import type { PortfolioTheme } from '../hooks/usePortfolioTheme';

interface ThemeToggleProps {
  theme: PortfolioTheme;
  onToggle: (origin: { x: number; y: number }) => void;
  labelForLightMode: string;
  labelForDarkMode: string;
  iconOnly?: boolean;
  className?: string;
}

export default function ThemeToggle({
  theme,
  onToggle,
  labelForLightMode,
  labelForDarkMode,
  iconOnly = false,
  className = '',
}: ThemeToggleProps) {
  const switchLabel = theme === 'dark' ? labelForLightMode : labelForDarkMode;
  const buttonClasses = iconOnly
    ? 'inline-flex h-11 w-11 items-center justify-center bg-transparent border-0 rounded-none p-0 text-[color:var(--portfolio-text)] transition-opacity hover:opacity-80'
    : 'theme-toggle-button inline-flex items-center justify-center gap-2 rounded-full font-pixel text-xs md:text-sm min-h-[44px] px-4 py-2';
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const hasPointerPosition = event.clientX !== 0 || event.clientY !== 0;
    onToggle({
      x: hasPointerPosition ? event.clientX : rect.left + rect.width / 2,
      y: hasPointerPosition ? event.clientY : rect.top + rect.height / 2,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${buttonClasses} ${className}`}
      aria-label={switchLabel}
      title={switchLabel}
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      {!iconOnly && <span>{switchLabel}</span>}
    </button>
  );
}
