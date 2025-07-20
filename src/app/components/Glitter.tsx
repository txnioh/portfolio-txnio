
import React, { useEffect, useRef } from 'react';

interface Pixel {
  x: number;
  y: number;
  size: number;
  life: number;
  initialLife: number;
}

interface GlitterProps {
  buttonPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  isInteracting: boolean;
  isRevealing: boolean;
}

const Glitter: React.FC<GlitterProps> = ({ buttonPosition, isInteracting, isRevealing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !buttonPosition) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createPixel = () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 25 + buttonPosition.width / 2 + 5; // Reduced radius to bring pixels closer
      const x = buttonPosition.x + buttonPosition.width / 2 + Math.cos(angle) * radius;
      const y = buttonPosition.y + buttonPosition.height / 2 + (Math.sin(angle) * radius * 0.5); // Reduced vertical spread
      const size = Math.floor(Math.random() * 2) + 5; // Pixels are now bigger (2px to 3px)
      const life = Math.random() * 120 + 60; // Live for 60 to 180 frames
      return { x, y, size, life, initialLife: life };
    };

    let animationFrameId: number;
    const animate = () => {
      if (!canvasRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new pixels slowly
      if (pixelsRef.current.length < 5 && Math.random() < 0.05) {
        pixelsRef.current.push(createPixel());
      }

      // Animate existing pixels
      pixelsRef.current.forEach((pixel, index) => {
        pixel.life -= 1;
        if (pixel.life <= 0) {
          pixelsRef.current.splice(index, 1);
          return;
        }

        // Fade in and out
        const halfLife = pixel.initialLife / 2;
        const opacity = pixel.life > halfLife 
          ? 1 - (pixel.life - halfLife) / halfLife 
          : pixel.life / halfLife;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
        ctx.fillRect(Math.floor(pixel.x), Math.floor(pixel.y), pixel.size, pixel.size);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [buttonPosition]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ 
    zIndex: 11,
    opacity: (isInteracting || isRevealing) ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out'
  }} />;
};

export default Glitter; 