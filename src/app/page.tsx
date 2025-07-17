'use client'

import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
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

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'es' : 'en'));
  };

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

  useEffect(() => {
    const pixelSize = 70;
    const holeDuration = 300; // 1 second in ms

    const handleMouseMove = (e: MouseEvent) => {
      // Only add holes after first interaction
      if (!hasInteracted) return;
      // Prevent single pixel effect during full reveal/hide animation
      if (isHoveringLink || radiusRef.current > 0) return;

      // Exclude top and bottom areas where buttons and links are
      const topExclusionZone = 100; // Top area height
      const bottomExclusionZone = 100; // Bottom area height
      
      if (e.clientY < topExclusionZone || e.clientY > window.innerHeight - bottomExclusionZone) {
        return;
      }

      holesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      });
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
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isHoveringLink, revealOrigin, hasInteracted, isRevealing]);

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
                className="hover:opacity-80 transition-opacity cursor-pointer font-pixel text-sm shimmer-green"
                style={{
                  background: 'linear-gradient(90deg, #edeced 0%, #90EE90 25%, #32CD32 50%, #90EE90 75%, #edeced 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 10s ease-in-out infinite'
                }}
              >
                os.txnio.com
              </button>
            </div>

            {/* Main Content - Centered */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="space-y-1">
                  <h1 className="text-4xl md:text-3xl font-bold font-renogare" style={{color: '#edeced'}}>
                    ANTONIO GONZALEZ
                  </h1>
                  <h2 className="text-2xl md:text-4xl font-chicago" style={{color: '#edeced'}}>
                    (TXNIO)
                  </h2>
                  <h3 className="text-xl md:text-4xl font-geneva" style={{color: '#edeced', opacity: 0.9}}>
                    a FRONTEND DEVELOPER
                  </h3>
                  <h4 className="text-lg md:text-xl font-geneva" style={{color: '#edeced', opacity: 0.8}}>
                    CURRENTLY DESIGNING IN
                  </h4>
                  <h5 className="text-2xl md:text-4xl font-pixel font-bold" style={{color: '#edeced'}}>
                    CEMOSA
                  </h5>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="py-4 text-center">
              <div className="flex justify-center space-x-8 text-sm font-geneva">
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

      {isInteracting && (
        <button
          onClick={() => {
            setIsInteracting(false);
            setIsHoveringLink(false);
          }}
          className="fixed top-0 left-1/2 transform -translate-x-1/2 z-30 px-20 py-1 rounded-b-xl text-sm transition-colors font-pixel hover:opacity-90"
          style={{
            backgroundColor: '#000000',
            color: '#ffffff',
          }}
        >
          X
        </button>
      )}
    </div>
  );
}