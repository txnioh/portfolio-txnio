'use client'

import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Valores posibles para pupil_x y pupil_y: -15 a 15 en pasos de 3
const PUPIL_VALUES = [-15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15];

/**
 * Redondea un valor al valor más cercano en PUPIL_VALUES
 */
function roundToNearestPupilValue(value: number): number {
  return PUPIL_VALUES.reduce((prev, curr) => {
    return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
  });
}

/**
 * Construye el nombre del archivo según el formato:
 * gaze_px[X]p0_py[Y]p0_256.webp para valores positivos
 * gaze_px[X]p0_pym[Y]p0_256.webp para valores negativos
 */
function buildImageFilename(pupilX: number, pupilY: number): string {
  const formatValue = (value: number): string => {
    if (value < 0) {
      return `m${Math.abs(value)}p0`;
    }
    return `${value}p0`;
  };
  
  return `gaze_px${formatValue(pupilX)}_py${formatValue(pupilY)}_256.webp`;
}

/**
 * Mapea la posición del cursor a valores de pupil_x y pupil_y
 */
function mapCursorToPupilValues(
  mouseX: number,
  mouseY: number,
  centerX: number,
  centerY: number
): { pupilX: number; pupilY: number } {
  // Calcular sensibilidad dinámica basada en el tamaño de la ventana
  // Queremos que el cursor en los bordes de la pantalla mapee aproximadamente a -15 o 15
  const maxDistance = Math.min(centerX, centerY);
  const sensitivity = 15 / maxDistance;
  
  // Calcular posición relativa al centro
  const relativeX = (mouseX - centerX) * sensitivity;
  const relativeY = (centerY - mouseY) * sensitivity; // Invertir Y porque en pantalla Y aumenta hacia abajo
  
  // Limitar al rango de -15 a 15
  const clampedX = Math.max(-15, Math.min(15, relativeX));
  const clampedY = Math.max(-15, Math.min(15, relativeY));
  
  // Redondear a los valores disponibles
  const pupilX = roundToNearestPupilValue(clampedX);
  const pupilY = roundToNearestPupilValue(clampedY);
  
  return { pupilX, pupilY };
}

interface FollowingFaceProps {
  isVisible: boolean;
  className?: string;
}

const FollowingFace: React.FC<FollowingFaceProps> = ({ isVisible, className }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const currentPupilRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isVisible) return;

    // Handler RAW sin throttling, debouncing ni limitaciones
    const handleMouseMove = (event: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Calcular nuevos valores de pupil directamente
      const { pupilX, pupilY } = mapCursorToPupilValues(
        event.clientX,
        event.clientY,
        centerX,
        centerY
      );
      
      // Solo actualizar si cambió (evitar recargas innecesarias de imagen)
      if (pupilX !== currentPupilRef.current.x || pupilY !== currentPupilRef.current.y) {
        currentPupilRef.current.x = pupilX;
        currentPupilRef.current.y = pupilY;
        
        // Actualizar src directamente en el DOM - RAW sin React state
        if (imgRef.current) {
          const filename = buildImageFilename(pupilX, pupilY);
          imgRef.current.src = `/face/${filename}`;
        }
      }
    };

    // Event listener RAW con passive para máximo rendimiento
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Inicializar con posición central
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const { pupilX, pupilY } = mapCursorToPupilValues(centerX, centerY, centerX, centerY);
    currentPupilRef.current = { x: pupilX, y: pupilY };
    if (imgRef.current) {
      const filename = buildImageFilename(pupilX, pupilY);
      imgRef.current.src = `/face/${filename}`;
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible]);

  const filename = buildImageFilename(currentPupilRef.current.x, currentPupilRef.current.y);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`w-full flex items-center justify-center pointer-events-none ${className ?? ''}`}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <img
            ref={imgRef}
            id="face-image"
            src={`/face/${filename}`}
            alt="Face following cursor"
            style={{
              width: '220px',
              height: '220px',
              imageRendering: 'crisp-edges',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FollowingFace;

