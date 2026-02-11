'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { PortfolioTheme } from './usePortfolioTheme';

interface ThemeWaveOrigin {
  x: number;
  y: number;
}

interface ThemeWaveState {
  origin: ThemeWaveOrigin;
  color: string;
  maxRadius: number;
  startTime: number;
}

interface UseThemePixelWaveParams {
  theme: PortfolioTheme;
  setTheme: (theme: PortfolioTheme) => void;
}

interface UseThemePixelWaveResult {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isAnimating: boolean;
  triggerWaveToggle: (origin: ThemeWaveOrigin) => void;
}

const PIXEL_SIZE = 70;
const WAVE_DURATION_MS = 850;

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const getMaxRadius = (origin: ThemeWaveOrigin, width: number, height: number) => {
  const d1 = Math.hypot(origin.x, origin.y);
  const d2 = Math.hypot(width - origin.x, origin.y);
  const d3 = Math.hypot(origin.x, height - origin.y);
  const d4 = Math.hypot(width - origin.x, height - origin.y);
  return Math.max(d1, d2, d3, d4);
};

export const useThemePixelWave = ({
  theme,
  setTheme,
}: UseThemePixelWaveParams): UseThemePixelWaveResult => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const waveStateRef = useRef<ThemeWaveState | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerWaveToggle = useCallback((origin: ThemeWaveOrigin) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (waveStateRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const clampedOrigin = {
      x: clamp(origin.x, 0, width),
      y: clamp(origin.y, 0, height),
    };

    const currentOverlayColor = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--portfolio-overlay')
      .trim() || '#121212';

    waveStateRef.current = {
      origin: clampedOrigin,
      color: currentOverlayColor,
      maxRadius: getMaxRadius(clampedOrigin, width, height),
      startTime: performance.now(),
    };

    setIsAnimating(true);
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [setTheme, theme]);

  useEffect(() => {
    if (!isAnimating) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      if (waveStateRef.current) {
        waveStateRef.current.maxRadius = getMaxRadius(waveStateRef.current.origin, width, height);
      }
    };

    const drawFrame = (timestamp: number) => {
      const waveState = waveStateRef.current;
      if (!waveState) return;

      const elapsed = timestamp - waveState.startTime;
      const progress = Math.min(elapsed / WAVE_DURATION_MS, 1);
      const radius = waveState.maxRadius * progress;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = waveState.color;
      ctx.fillRect(0, 0, width, height);

      const cols = Math.ceil(width / PIXEL_SIZE);
      const rows = Math.ceil(height / PIXEL_SIZE);
      const startCol = Math.floor(waveState.origin.x / PIXEL_SIZE);
      const startRow = Math.floor(waveState.origin.y / PIXEL_SIZE);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const distance = Math.hypot(col - startCol, row - startRow) * PIXEL_SIZE;
          if (distance <= radius) {
            ctx.clearRect(col * PIXEL_SIZE, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
          }
        }
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(drawFrame);
        return;
      }

      waveStateRef.current = null;
      setIsAnimating(false);
      ctx.clearRect(0, 0, width, height);
    };

    resizeCanvas();
    animationFrameRef.current = requestAnimationFrame(drawFrame);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isAnimating]);

  return {
    canvasRef,
    isAnimating,
    triggerWaveToggle,
  };
};
