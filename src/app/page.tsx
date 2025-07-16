'use client'

import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [showPreview, setShowPreview] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const holesRef = useRef<{ x: number; y: number; timestamp: number }[]>([]);
  const animationFrameId = useRef<number>();
  const linkRef = useRef<HTMLButtonElement>(null);
  const radiusRef = useRef(0);
  const maxRadiusRef = useRef(0);
  
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [revealOrigin, setRevealOrigin] = useState<{ x: number, y: number } | null>(null);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'es' : 'en'));
  };

  useEffect(() => {
    if (!hasInteracted) return;

    const pixelSize = 70;
    const holeDuration = 300; // 1 second in ms

    const handleMouseMove = (e: MouseEvent) => {
      // Prevent single pixel effect during full reveal/hide animation
      if (isHoveringLink || radiusRef.current > 0) return;

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
        }

      } else {
        const now = Date.now();
        holesRef.current = holesRef.current.filter(
          h => now - h.timestamp < holeDuration
        );

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        holesRef.current.forEach(hole => {
          const px = Math.floor(hole.x / pixelSize) * pixelSize;
          const py = Math.floor(hole.y / pixelSize) * pixelSize;
          ctx.clearRect(px, py, pixelSize, pixelSize);
        });
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
  }, [hasInteracted, isHoveringLink, revealOrigin]);

  const content = {
    en: {
      blog: "Blog",
      social: "Social",
      linkedin: "LinkedIn",
      github: "GitHub",
      blogDesc: "Thoughts, insights, and experiences from my journey in tech and photography.",
      previewTitle: "txniOS Preview",
      previewDesc: "Try the full experience",
      closePreview: "Close Preview"
    },
    es: {
      blog: "Blog",
      social: "Social",
      linkedin: "LinkedIn",
      github: "GitHub",
      blogDesc: "Pensamientos, perspectivas y experiencias de mi recorrido en tecnología y fotografía.",
      previewTitle: "Vista previa de txniOS",
      previewDesc: "Prueba la experiencia completa",
      closePreview: "Cerrar Vista Previa"
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
      
      {/* Mouse capture layer */}
      <div className="fixed inset-0 pointer-events-auto" style={{ backgroundColor: 'transparent', zIndex: 5 }} />
      
      {/* Dark overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-10 pointer-events-none"
      />

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <div className="w-full h-full relative">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 z-10 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold transition-colors"
            >
              {t.closePreview}
            </button>
            <iframe
              src="https://os.txnio.com"
              className="w-full h-full border-0"
              title="txniOS Preview"
            />
          </div>
        </div>
      )}

      {/* Content Layer */}
      <div className="relative z-20 min-h-screen flex flex-col pointer-events-auto">
        {/* Language Toggle */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded text-sm transition-colors font-pixel"
            style={{backgroundColor: '#2a2a2a', color: '#edeced'}}
          >
            {language === 'en' ? 'ES' : 'EN'}
          </button>
        </div>

        {/* Top Link */}
        <div className="text-center py-4">
          <button
            ref={linkRef}
            onMouseEnter={() => {
              if (linkRef.current) {
                const rect = linkRef.current.getBoundingClientRect();
                const origin = {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
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
              }
              setIsHoveringLink(true);
            }}
            onMouseLeave={() => {
              setIsHoveringLink(false);
            }}
            onClick={() => setShowPreview(true)}
            className="hover:opacity-80 transition-opacity cursor-pointer font-pixel text-sm"
            style={{color: '#edeced'}}
          >
            os.txnio.com
          </button>
        </div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-6xl font-bold font-renogare" style={{color: '#edeced'}}>
                ANTONIO GONZALEZ
              </h1>
              <h2 className="text-2xl md:text-3xl font-chicago" style={{color: '#edeced'}}>
                (TXNIO)
              </h2>
              <h3 className="text-xl md:text-2xl font-geneva" style={{color: '#edeced', opacity: 0.9}}>
                FRONTEND DEVELOPER
              </h3>
              <h4 className="text-lg md:text-xl font-geneva" style={{color: '#edeced', opacity: 0.8}}>
                COOKING AT
              </h4>
              <h5 className="text-2xl md:text-3xl font-pixel font-bold" style={{color: '#edeced'}}>
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
    </div>
  );
}