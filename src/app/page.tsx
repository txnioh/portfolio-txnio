'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Available fonts for random selection
const availableFonts = [
  'font-chicago',
  'font-renogare', 
  'font-geneva',
  'font-pixel',
  'font-geist'
];

// Function to get random font
const getRandomFont = () => {
  return availableFonts[Math.floor(Math.random() * availableFonts.length)];
};

// Function to get multiple random fonts (ensuring variety)
const getRandomFonts = (count: number) => {
  const shuffled = [...availableFonts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function Home() {
  const [language] = useState<'en' | 'es'>('en');
  const [isInteracting, setIsInteracting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const holesRef = useRef<{ x: number; y: number; timestamp: number }[]>([]);
  const animationFrameId = useRef<number>();
  const linkRef = useRef<HTMLButtonElement>(null);
  const radiusRef = useRef(0);
  const maxRadiusRef = useRef(0);
  
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [revealOrigin, setRevealOrigin] = useState<{ x: number, y: number } | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  // Random font assignments for this session
  const [randomFonts, setRandomFonts] = useState(() => {
    const fonts = getRandomFonts(5); // Get 5 random fonts for different elements (link is always pixel)
    return {
      name: fonts[0],
      nickname: fonts[1], 
      title: fonts[2],
      subtitle: fonts[3],
      company: fonts[4]
    };
  });

  const addHole = useCallback((clientX: number, clientY: number) => {
    // Only add holes after first interaction
    if (!hasInteracted) return;
    // Prevent single pixel effect during full reveal/hide animation
    if (isHoveringLink || radiusRef.current > 0) return;

    // Exclude top and bottom areas where buttons and links are
    const topExclusionZone = 100; // Top area height
    const bottomExclusionZone = 100; // Bottom area height
    
    if (clientY < topExclusionZone || clientY > window.innerHeight - bottomExclusionZone) {
      return;
    }

    holesRef.current.push({
      x: clientX,
      y: clientY,
      timestamp: Date.now(),
    });
  }, [hasInteracted, isHoveringLink]);

  const handleInteractionStart = () => {
    // Set origin to center top of screen
    const origin = {
      x: window.innerWidth / 2,
      y: 0,
    };

    if (!revealOrigin) {
      setRevealOrigin(origin);
    }
    
    const w = window.innerWidth;
    const h = window.innerHeight;
    const x = origin.x;
    const y = origin.y;
    const d1 = Math.sqrt(x * x + y * y);
    const d2 = Math.sqrt(Math.pow(w - x, 2) + y * y);
    const d3 = Math.sqrt(x * x + Math.pow(h - y, 2));
    const d4 = Math.sqrt(Math.pow(w - x, 2) + Math.pow(h - y, 2));
    maxRadiusRef.current = Math.max(d1, d2, d3, d4);
    
    setIsHoveringLink(true);
  };

  const handleTextClick = () => {
    // Generate new random fonts
    const newFonts = getRandomFonts(5);
    const newRandomFonts = {
      name: newFonts[0],
      nickname: newFonts[1], 
      title: newFonts[2],
      subtitle: newFonts[3],
      company: newFonts[4]
    };
    
    // Force re-render with new fonts by updating state
    setRandomFonts(newRandomFonts);
  };

  useEffect(() => {
    const pixelSize = 70;
    const holeDuration = 300; // 1 second in ms

    const handleMouseMove = (e: MouseEvent) => {
      addHole(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      // Check if touching an interactive element
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"]');
      
      if (isInteractive) {
        // Don't prevent default for interactive elements
        return;
      }
      
      e.preventDefault();
      setHasInteracted(true);
      
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        addHole(touch.clientX, touch.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Check if touching an interactive element
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"]');
      
      if (isInteractive) {
        // Don't prevent default for interactive elements
        return;
      }
      
      e.preventDefault();
      
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        addHole(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Check if touching an interactive element
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"]');
      
      if (isInteractive) {
        // Don't prevent default for interactive elements
        return;
      }
      
      e.preventDefault();
    };

    let lastTime = 0;
    const throttledMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime >= 16) {
        handleMouseMove(e);
        lastTime = now;
      }
    };

    document.addEventListener('mousemove', throttledMouseMove);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    const animate = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (!canvas || !ctx) {
        animationFrameId.current = requestAnimationFrame(animate);
        return;
      }
      
      ctx.imageSmoothingEnabled = false;
      const isAnimating = isHoveringLink || radiusRef.current > 0;

      if (isAnimating && revealOrigin) {
        const revealSpeed = 25;
        
        if (isHoveringLink) {
          radiusRef.current = Math.min(radiusRef.current + revealSpeed, maxRadiusRef.current);
        } else {
          radiusRef.current = Math.max(radiusRef.current - revealSpeed, 0);
        }

        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const gridCols = Math.ceil(canvas.width / pixelSize);
        const gridRows = Math.ceil(canvas.height / pixelSize);
        const startCol = Math.floor(revealOrigin.x / pixelSize);
        const startRow = Math.floor(revealOrigin.y / pixelSize);

        for (let r = 0; r < gridRows; r++) {
          for (let c = 0; c < gridCols; c++) {
            const dist = Math.sqrt(Math.pow(c - startCol, 2) + Math.pow(r - startRow, 2));
            if (dist * pixelSize < radiusRef.current) {
              ctx.clearRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
            }
          }
        }
        
        if (radiusRef.current >= maxRadiusRef.current && isHoveringLink) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (isRevealing) {
            setIsInteracting(true);
            setIsRevealing(false);
          }
        }

      } else {
        const now = Date.now();
        holesRef.current = holesRef.current.filter(
          h => now - h.timestamp < holeDuration
        );

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (hasInteracted) {
          holesRef.current.forEach(hole => {
            const px = Math.floor(hole.x / pixelSize) * pixelSize;
            const py = Math.floor(hole.y / pixelSize) * pixelSize;
            ctx.clearRect(px, py, pixelSize, pixelSize);
          });
        }
      }
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        if (revealOrigin) {
          const w = canvas.width;
          const h = canvas.height;
          const x = revealOrigin.x;
          const y = revealOrigin.y;
          const d1 = Math.sqrt(x * x + y * y);
          const d2 = Math.sqrt(Math.pow(w - x, 2) + y * y);
          const d3 = Math.sqrt(x * x + Math.pow(h - y, 2));
          const d4 = Math.sqrt(Math.pow(w - x, 2) + Math.pow(h - y, 2));
          maxRadiusRef.current = Math.max(d1, d2, d3, d4);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    animate();

    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isHoveringLink, revealOrigin, hasInteracted, isRevealing, addHole]);

  const content = {
    en: {
      blog: "Blog",
      social: "Social",
      linkedin: "LinkedIn",
      github: "GitHub",
      blogDesc: "Thoughts, insights, and experiences from my journey in tech and photography.",
      close: "Close"
    },
    es: {
      blog: "Blog",
      social: "Social",
      linkedin: "LinkedIn",
      github: "GitHub",
      blogDesc: "Pensamientos, perspectivas y experiencias de mi recorrido en tecnología y fotografía.",
      close: "Cerrar"
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen relative" onMouseMove={() => !hasInteracted && setHasInteracted(true)}>
      {/* Background iframe */}
      <iframe
        src="https://os.txnio.com"
        className="fixed inset-0 w-full h-full border-0 z-0"
        title="txniOS Background"
      />
      
      {!isInteracting && (
        <>
          <div className="fixed inset-0 pointer-events-auto" style={{ backgroundColor: 'transparent', zIndex: 5 }} />
          
          <canvas
            ref={canvasRef}
            className="fixed inset-0 z-10 pointer-events-none"
          />

          {/* Content Layer */}
          <div className="relative z-20 min-h-screen flex flex-col pointer-events-auto">


            {/* Top Link */}
            <div className="text-center py-1">
              <button
                ref={linkRef}
                onMouseEnter={handleInteractionStart}
                onMouseLeave={() => {
                  if (!isRevealing) {
                    setIsHoveringLink(false);
                  }
                }}
                onClick={() => {
                  if (!isRevealing) {
                    handleInteractionStart();
                    setIsRevealing(true);
                  }
                }}
                className="hover:opacity-80 transition-all duration-300 ease-in-out cursor-pointer font-pixel text-sm shimmer-green"
                style={{
                  background: 'linear-gradient(90deg, #edeced 0%, #90EE90 25%, #32CD32 50%, #90EE90 75%, #edeced 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 10s ease-in-out infinite',
                  opacity: isInteracting ? 0 : 1,
                  transform: isInteracting ? 'translateY(-20px)' : 'translateY(0)',
                  pointerEvents: isInteracting ? 'none' : 'auto'
                }}
              >
                os.txnio.com
              </button>
            </div>

            {/* Main Content - Centered */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="space-y-1 cursor-pointer" onClick={handleTextClick}>
                  <h1 className={`text-4xl md:text-3xl font-bold ${randomFonts.name} hover:opacity-80 transition-opacity`} style={{color: '#edeced'}}>
                    ANTONIO GONZALEZ
                  </h1>
                  <h2 className={`text-2xl md:text-4xl ${randomFonts.nickname} hover:opacity-80 transition-opacity`} style={{color: '#edeced'}}>
                    (TXNIO)
                  </h2>
                  <h3 className={`text-xl md:text-4xl ${randomFonts.title} hover:opacity-80 transition-opacity`} style={{color: '#edeced', opacity: 0.9}}>
                    a FRONTEND DEVELOPER
                  </h3>
                  <h4 className={`text-lg md:text-xl ${randomFonts.subtitle} hover:opacity-80 transition-opacity`} style={{color: '#edeced', opacity: 0.8}}>
                    CURRENTLY DESIGNING IN
                  </h4>
                  <h5 className={`text-2xl md:text-4xl ${randomFonts.company} font-bold hover:opacity-80 transition-opacity`} style={{color: '#edeced'}}>
                    CEMOSA
                  </h5>
                </div>

              </div>
            </div>

            {/* Footer Links */}
            <div className="py-4 text-center">
              <div className={`flex justify-center space-x-8 text-sm ${randomFonts.subtitle}`}>
                <a
                  href="https://blog.txnio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  style={{color: '#edeced'}}
                >
                  {t.blog}
                </a>
                <a
                  href="https://www.linkedin.com/in/txnio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  style={{color: '#edeced'}}
                >
                  {t.linkedin}
                </a>
                <a
                  href="https://github.com/txnioh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  style={{color: '#edeced'}}
                >
                  {t.github}
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Close Button - Always present but with visibility control */}
      <button
        onClick={() => {
          setIsInteracting(false);
          setIsHoveringLink(false);
        }}
        className="fixed top-0 left-1/2 transform -translate-x-1/2 z-30 px-20 py-1 rounded-b-xl text-sm transition-all duration-300 ease-in-out font-pixel hover:opacity-90"
        style={{
          backgroundColor: '#000000',
          color: '#ffffff',
          opacity: isInteracting ? 1 : 0,
          transform: isInteracting ? 'translate(-50%, 0)' : 'translate(-50%, -20px)',
          pointerEvents: isInteracting ? 'auto' : 'none'
        }}
      >
        X
      </button>
    </div>
  );
}