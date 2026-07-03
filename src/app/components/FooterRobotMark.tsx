'use client';

import type { CSSProperties } from 'react';
import { useEffect, useRef } from 'react';

const neutralPointerVars = {
  '--robot-pointer-x': 0,
  '--robot-pointer-y': 0,
  '--robot-attention': 0,
} as CSSProperties;

function clamp(value: number) {
  return Math.max(-1, Math.min(1, value));
}

function resetMark(mark: HTMLElement) {
  mark.style.setProperty('--robot-pointer-x', '0');
  mark.style.setProperty('--robot-pointer-y', '0');
  mark.style.setProperty('--robot-attention', '0');
}

export default function FooterRobotMark() {
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const rootElement = rootRef.current;
    if (!rootElement) return;

    let animationFrame: number | null = null;
    let pointerPosition: { x: number; y: number } | null = null;
    let isProjectHovering = false;

    const updateMarks = () => {
      animationFrame = null;
      const marks = rootElement.querySelectorAll<HTMLElement>('.minimal-robot-option');

      marks.forEach((mark) => {
        if (!pointerPosition) {
          resetMark(mark);
          return;
        }

        const bounds = mark.getBoundingClientRect();
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;
        const deltaX = pointerPosition.x - centerX;
        const deltaY = pointerPosition.y - centerY;
        const distance = Math.hypot(deltaX, deltaY);
        const proximityRadius = 360;
        const proximityAttention = Math.max(0, 1 - distance / proximityRadius);
        const attention = isProjectHovering
          ? Math.max(0.78, proximityAttention)
          : proximityAttention;
        const lookX = isProjectHovering && proximityAttention < 0.12
          ? clamp((pointerPosition.x - window.innerWidth / 2) / (window.innerWidth * 0.42))
          : clamp(deltaX / 135);
        const lookY = isProjectHovering && proximityAttention < 0.12
          ? -0.9
          : clamp(deltaY / 120);

        mark.style.setProperty('--robot-pointer-x', (lookX * attention).toFixed(3));
        mark.style.setProperty('--robot-pointer-y', (lookY * attention).toFixed(3));
        mark.style.setProperty('--robot-attention', attention.toFixed(3));
      });
    };

    const scheduleUpdate = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(updateMarks);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerPosition = {
        x: event.clientX,
        y: event.clientY,
      };
      scheduleUpdate();
    };

    const handleProjectStateChange = () => {
      isProjectHovering = Boolean(
        document.querySelector('.minimal-row-link:hover, .minimal-row-link:focus-visible'),
      );
      rootElement.dataset.projectHover = String(isProjectHovering);
      scheduleUpdate();
    };

    const handlePointerOut = (event: PointerEvent) => {
      if ((event.target as Element | null)?.closest?.('.minimal-row-link')) {
        window.requestAnimationFrame(handleProjectStateChange);
      }
    };

    const handlePointerOver = (event: PointerEvent) => {
      if ((event.target as Element | null)?.closest?.('.minimal-row-link')) {
        isProjectHovering = true;
        rootElement.dataset.projectHover = 'true';
        scheduleUpdate();
      }
    };

    const handleFocusOut = () => {
      window.requestAnimationFrame(handleProjectStateChange);
    };

    const handleWindowBlur = () => {
      pointerPosition = null;
      isProjectHovering = false;
      rootElement.dataset.projectHover = 'false';
      rootElement
        .querySelectorAll<HTMLElement>('.minimal-robot-option')
        .forEach(resetMark);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('pointerout', handlePointerOut);
    document.addEventListener('focusin', handleProjectStateChange);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
      document.removeEventListener('focusin', handleProjectStateChange);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  return (
    <span ref={rootRef} className="minimal-footer-robot-gallery" aria-hidden="true">
      <span className="minimal-robot-option" style={neutralPointerVars}>
        <svg viewBox="0 0 48 36" focusable="false">
          <g className="minimal-robot-head-follow">
            <rect className="minimal-robot-shell" x="7" y="8" width="34" height="23" rx="10" />
            <rect className="minimal-robot-screen" x="12" y="12" width="24" height="14" rx="6" />
            <g className="minimal-robot-eyes">
              <rect x="18" y="16" width="3.6" height="6.8" rx="1.8" />
              <rect x="26.4" y="16" width="3.6" height="6.8" rx="1.8" />
            </g>
          </g>
        </svg>
      </span>
    </span>
  );
}
