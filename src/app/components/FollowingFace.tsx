'use client'

import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Valores posibles para pupil_x y pupil_y: -15 a 15 en pasos de 3
const PUPIL_VALUES = [-15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15];

// Array para almacenar las imágenes precargadas (evita garbage collection)
const preloadedImages: HTMLImageElement[] = [];
let imagesPreloaded = false;

/**
 * Precarga todas las imágenes de la cara para evitar carga lenta en despliegue.
 * Las imágenes se almacenan en memoria para estar disponibles instantáneamente.
 */
function preloadAllFaceImages(): void {
  if (imagesPreloaded) return;

  PUPIL_VALUES.forEach((px) => {
    PUPIL_VALUES.forEach((py) => {
      const filename = buildImageFilename(px, py);
      const img = new Image();
      img.src = `/face/${filename}`;
      preloadedImages.push(img);
    });
  });

  imagesPreloaded = true;
  console.log(`Preloaded ${preloadedImages.length} face images`);
}

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

const FollowingFace: React.FC<FollowingFaceProps> = ({ isVisible }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const currentPupilRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isVisible) return;

    // Precargar todas las imágenes al montar el componente
    preloadAllFaceImages();

    // Inicializar con posición central primero
    const initImage = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const { pupilX, pupilY } = mapCursorToPupilValues(centerX, centerY, centerX, centerY);
      currentPupilRef.current = { x: pupilX, y: pupilY };
      if (imgRef.current) {
        const filename = buildImageFilename(pupilX, pupilY);
        imgRef.current.src = `/face/${filename}`;
      }
    };

    // Inicializar después de un pequeño delay para asegurar que el DOM está listo
    const initTimeout = setTimeout(initImage, 10);

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

    return () => {
      clearTimeout(initTimeout);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible]);

  const filename = buildImageFilename(currentPupilRef.current.x, currentPupilRef.current.y);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="pointer-events-none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <img
            ref={imgRef}
            id="face-image"
            src={`/face/${filename}`}
            alt="Face following cursor"
            onError={() => {
              console.error('Error loading image:', `/face/${filename}`);
            }}
            onLoad={() => {
              console.log('Image loaded:', `/face/${filename}`);
            }}
            style={{
              width: '220px',
              height: '220px',
              imageRendering: 'crisp-edges',
              userSelect: 'none',
              pointerEvents: 'none',
              display: 'block',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FollowingFace;

