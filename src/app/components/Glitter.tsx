
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
    
    // No overlay needed - keep glitter simple

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createPixel = (isHover = false) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 25 + buttonPosition.width / 2 + 5; // Reduced radius to bring pixels closer
      const x = buttonPosition.x + buttonPosition.width / 2 + Math.cos(angle) * radius;
      const y = buttonPosition.y + buttonPosition.height / 2 + (Math.sin(angle) * radius * 0.5); // Reduced vertical spread
      // Bigger pixels when hovering
      const baseSize = isHover ? Math.floor(Math.random() * 3) + 6 : Math.floor(Math.random() * 2) + 5;
      const size = baseSize;
      const life = isHover ? Math.random() * 80 + 40 : Math.random() * 120 + 60; // Shorter life on hover for more dynamic effect
      return { x, y, size, life, initialLife: life };
    };

    let animationFrameId: number;
    const animate = () => {
      if (!canvasRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new pixels - much more active when hovering
      const maxPixels = isInteracting ? 15 : 5;
      const spawnRate = isInteracting ? 0.25 : 0.05;
      if (pixelsRef.current.length < maxPixels && Math.random() < spawnRate) {
        pixelsRef.current.push(createPixel(isInteracting));
      }

      // Animate existing pixels
      pixelsRef.current.forEach((pixel, index) => {
        pixel.life -= 1;
        if (pixel.life <= 0) {
          pixelsRef.current.splice(index, 1);
          return;
        }

        // Different glitter effects for hover vs normal
        const halfLife = pixel.initialLife / 2;
        const opacity = pixel.life > halfLife 
          ? 1 - (pixel.life - halfLife) / halfLife 
          : pixel.life / halfLife;
        
        if (isInteracting) {
          // On hover: brighter, more colorful glitter with glow effect
          const colors = [
            `rgba(255, 255, 255, ${opacity})`,
            `rgba(144, 238, 144, ${opacity * 0.8})`, // Light green
            `rgba(50, 205, 50, ${opacity * 0.6})`,   // Lime green
            `rgba(255, 255, 255, ${opacity * 0.9})`  // White
          ];
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          // Add glow effect
          ctx.shadowColor = '#90EE90';
          ctx.shadowBlur = 8;
          ctx.fillStyle = color;
          ctx.fillRect(Math.floor(pixel.x), Math.floor(pixel.y), pixel.size, pixel.size);
          
          // Reset shadow
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        } else {
          // Normal white glitter
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
          ctx.fillRect(Math.floor(pixel.x), Math.floor(pixel.y), pixel.size, pixel.size);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();
    
    // Clear pixels when revealing to avoid glitches
    if (isRevealing) {
      pixelsRef.current = [];
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [buttonPosition, isInteracting, isRevealing]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ 
    zIndex: 11,
    opacity: isRevealing ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out'
  }} />;
};

export default Glitter; 