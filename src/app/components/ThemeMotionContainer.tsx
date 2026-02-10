'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { PortfolioTheme } from '../hooks/usePortfolioTheme';

type ThemeVars = {
  backgroundColor: string;
  color: string;
  '--portfolio-bg': string;
  '--portfolio-text': string;
  '--portfolio-text-muted': string;
  '--portfolio-overlay': string;
  '--portfolio-close-bg': string;
  '--portfolio-close-text': string;
  '--portfolio-link-grad-start': string;
  '--portfolio-link-grad-mid-soft': string;
  '--portfolio-link-grad-mid-strong': string;
  '--portfolio-toggle-bg': string;
  '--portfolio-toggle-bg-hover': string;
  '--portfolio-toggle-border': string;
};

const THEME_TARGETS: Record<PortfolioTheme, ThemeVars> = {
  dark: {
    backgroundColor: '#121212',
    color: '#edeced',
    '--portfolio-bg': '#121212',
    '--portfolio-text': '#edeced',
    '--portfolio-text-muted': 'rgba(237, 236, 237, 0.8)',
    '--portfolio-overlay': '#121212',
    '--portfolio-close-bg': '#000000',
    '--portfolio-close-text': '#ffffff',
    '--portfolio-link-grad-start': '#edeced',
    '--portfolio-link-grad-mid-soft': '#90ee90',
    '--portfolio-link-grad-mid-strong': '#32cd32',
    '--portfolio-toggle-bg': 'rgba(237, 236, 237, 0.08)',
    '--portfolio-toggle-bg-hover': 'rgba(237, 236, 237, 0.16)',
    '--portfolio-toggle-border': 'rgba(237, 236, 237, 0.25)',
  },
  light: {
    backgroundColor: '#f7f7f5',
    color: '#1d1d1f',
    '--portfolio-bg': '#f7f7f5',
    '--portfolio-text': '#1d1d1f',
    '--portfolio-text-muted': 'rgba(29, 29, 31, 0.75)',
    '--portfolio-overlay': '#f7f7f5',
    '--portfolio-close-bg': '#ffffff',
    '--portfolio-close-text': '#1d1d1f',
    '--portfolio-link-grad-start': '#1d1d1f',
    '--portfolio-link-grad-mid-soft': '#6fb86b',
    '--portfolio-link-grad-mid-strong': '#2f8f2f',
    '--portfolio-toggle-bg': 'rgba(29, 29, 31, 0.08)',
    '--portfolio-toggle-bg-hover': 'rgba(29, 29, 31, 0.16)',
    '--portfolio-toggle-border': 'rgba(29, 29, 31, 0.22)',
  },
};

type ThemeMotionContainerProps = Omit<HTMLMotionProps<'div'>, 'animate'> & {
  theme: PortfolioTheme;
};

export default function ThemeMotionContainer({
  theme,
  children,
  style,
  ...rest
}: ThemeMotionContainerProps) {
  return (
    <motion.div
      {...rest}
      initial={false}
      animate={THEME_TARGETS[theme] as never}
      transition={{ duration: 0.42, ease: [0.25, 0.1, 0.25, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}
