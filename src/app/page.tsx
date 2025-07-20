'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Glitter from './components/Glitter';

// Available fonts for random selection
const availableFonts = [
  'font-chicago',
  'font-renogare', 
  'font-geneva',
  'font-pixel',
];

// Available emojis for random selection
const availableEmojis = [
  '🚀', '💻', '⚡', '🔥', '✨', '🌟', '🌌', '🌊', '🐍', '👨‍💻', '😎', '😇', '🫧', '🪐', '🥶','👀', '👍', '🤓', '👌', '☀️', '🌙', '🌍'
];

// Emoji to image file mapping for mobile
const emojiToImageMap: { [key: string]: string } = {
  '🚀': 'U+1F680.png',
  '💻': 'U+1F4BB.png',
  '⚡': 'U+26A1.png',
  '🔥': 'U+1F525.png',
  '✨': 'U+2728.png',
  '🌟': 'U+1F31F.png',
  '🌌': 'U+1F30C.png',
  '🌊': 'U+1F30A.png',
  '🐍': 'U+1F40D.png',
  '👨‍💻': 'U+1F468_U+200D_U+1F4BB.png',
  '😎': 'U+1F60E.png',
  '😇': 'U+1F607.png',
  '🫧': 'U+1FAE7.png',
  '🪐': 'U+1FA90.png',
  '🥶': 'U+1F976.png',
  '👀': 'U+1F440.png',
  '👍': 'U+1F44D.png',
  '🤓': 'U+1F913.png',
  '👌': 'U+1F44C.png',
  '☀️': 'U+2600_U+FE0F.png',
  '🌙': 'U+1F319.png',
  '🌍': 'U+1F30D.png'
};

// Function to detect mobile devices
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
};

// Matrix characters for animation
const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_+-=[]{}|;:,.<>?';

// Function to get multiple random fonts (ensuring variety)
const getRandomFonts = (count: number) => {
  const shuffled = [...availableFonts].sort(() => 0.5 - Math.random());
  // If we need more fonts than available, cycle through them
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(shuffled[i % shuffled.length]);
  }
  return result;
};

// Function to get multiple random emojis
const getRandomEmojis = (count: number) => {
  const shuffled = [...availableEmojis].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Function to generate random matrix characters
const generateRandomChars = (length: number) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
  }
  return result;
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
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Matrix animation states
  const [isAnimatingText, setIsAnimatingText] = useState(false);
  const [matrixText, setMatrixText] = useState({
    name: '',
    nickname: '',
    title: '',
    subtitle: '',
    company: ''
  });
  const [originalText] = useState({
    name: 'ANTONIO GONZALEZ',
    nickname: '(TXNIO)',
    title: 'a FRONTEND DEVELOPER',
    subtitle: 'CURRENTLY DESIGNING IN',
    company: 'CEMOSA'
  });

  // Random font and emoji assignments for this session
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

  const [buttonPosition, setButtonPosition] = useState<{ x: number, y: number, width: number, height: number } | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (linkRef.current) {
        const rect = linkRef.current.getBoundingClientRect();
        setButtonPosition({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        });
      }
    }
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  const [randomEmojis, setRandomEmojis] = useState({
    name: '',
    nickname: '',
    title: '',
    subtitle: '',
    company: ''
  });

  // Generate emojis only on client side to avoid hydration mismatch
  useEffect(() => {
    const generateEmojis = () => {
      const emojiCount = Math.random() < 0.5 ? 1 : 2; // 50% chance for 1 or 2 emojis
      const emojis = getRandomEmojis(emojiCount);
      const positions = ['name', 'nickname', 'title', 'subtitle', 'company'];
      const shuffledPositions = positions.sort(() => 0.5 - Math.random()).slice(0, emojiCount);
      
      setRandomEmojis({
        name: shuffledPositions.includes('name') ? emojis[shuffledPositions.indexOf('name')] : '',
        nickname: shuffledPositions.includes('nickname') ? emojis[shuffledPositions.indexOf('nickname')] : '',
        title: shuffledPositions.includes('title') ? emojis[shuffledPositions.indexOf('title')] : '',
        subtitle: shuffledPositions.includes('subtitle') ? emojis[shuffledPositions.indexOf('subtitle')] : '',
        company: shuffledPositions.includes('company') ? emojis[shuffledPositions.indexOf('company')] : ''
      });
    };

    generateEmojis();
  }, []);

  // Detect mobile device on mount and handle resize
  useEffect(() => {
    const checkMobile = () => setIsMobileDevice(isMobile());
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Component to render emoji (text or image based on device)
  const EmojiRenderer = ({ emoji }: { emoji: string }) => {
    const [imageError, setImageError] = useState(false);
    
    if (!emoji) return null;
    
    if (isMobileDevice && emojiToImageMap[emoji] && !imageError) {
      return (
        <Image 
          src={`/emojis/${emojiToImageMap[emoji]}`}
          alt={emoji}
          width={24}
          height={24}
          className="inline-block mr-2 emoji-image"
          style={{ verticalAlign: 'middle' }}
          onError={() => setImageError(true)}
        />
      );
    }
    
    return <span className="font-emoji mr-2">{emoji}</span>;
  };

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
    // Use button position if available, otherwise center top of screen
    const origin = buttonPosition ? {
      x: buttonPosition.x + buttonPosition.width / 2,
      y: buttonPosition.y + buttonPosition.height / 2,
    } : {
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

  const handleInteractionEnd = () => {
    setIsHoveringLink(false);
  }

  const handleTextClick = () => {
    // Start Matrix animation
    setIsAnimatingText(true);
    
    // Generate initial matrix text
    setMatrixText({
      name: generateRandomChars(originalText.name.length),
      nickname: generateRandomChars(originalText.nickname.length),
      title: generateRandomChars(originalText.title.length),
      subtitle: generateRandomChars(originalText.subtitle.length),
      company: generateRandomChars(originalText.company.length)
    });

    // Matrix animation loop
    let animationCount = 0;
    const maxAnimations = 2; // 6 frames over 300ms (50ms each)
    const animationInterval = setInterval(() => {
      animationCount++;
      
      // Update matrix text with new random characters
      setMatrixText({
        name: generateRandomChars(originalText.name.length),
        nickname: generateRandomChars(originalText.nickname.length),
        title: generateRandomChars(originalText.title.length),
        subtitle: generateRandomChars(originalText.subtitle.length),
        company: generateRandomChars(originalText.company.length)
      });

      // Stop animation after 300ms
      if (animationCount >= maxAnimations) {
        clearInterval(animationInterval);
        setIsAnimatingText(false);
        
        // Generate new random fonts
        const newFonts = getRandomFonts(5);
        const newRandomFonts = {
          name: newFonts[0],
          nickname: newFonts[1], 
          title: newFonts[2],
          subtitle: newFonts[3],
          company: newFonts[4]
        };
        
        // Generate new random emojis (1-2 emojis in random positions)
        const emojiCount = Math.random() < 0.5 ? 1 : 2; // 50% chance for 1 or 2 emojis
        const newEmojis = getRandomEmojis(emojiCount);
        const positions = ['name', 'nickname', 'title', 'subtitle', 'company'];
        const shuffledPositions = positions.sort(() => 0.5 - Math.random()).slice(0, emojiCount);
        
        const newRandomEmojis = {
          name: shuffledPositions.includes('name') ? newEmojis[shuffledPositions.indexOf('name')] : '',
          nickname: shuffledPositions.includes('nickname') ? newEmojis[shuffledPositions.indexOf('nickname')] : '',
          title: shuffledPositions.includes('title') ? newEmojis[shuffledPositions.indexOf('title')] : '',
          subtitle: shuffledPositions.includes('subtitle') ? newEmojis[shuffledPositions.indexOf('subtitle')] : '',
          company: shuffledPositions.includes('company') ? newEmojis[shuffledPositions.indexOf('company')] : ''
        };
        
        // Force re-render with new fonts and emojis by updating state
        setRandomFonts(newRandomFonts);
        setRandomEmojis(newRandomEmojis);
      }
    }, 50); // 50ms interval for smooth animation
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
      const isAnimatingReveal = isHoveringLink || radiusRef.current > 0;

      if (isAnimatingReveal && revealOrigin) {
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
      close: "Close",
      comingSoon: "Coming Soon!"
    },
    es: {
      blog: "Blog",
      social: "Social",
      linkedin: "LinkedIn",
      github: "GitHub",
      blogDesc: "Pensamientos, perspectivas y experiencias de mi recorrido en tecnología y fotografía.",
      close: "Cerrar",
      comingSoon: "¡Próximamente!"
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen relative" onMouseMove={() => !hasInteracted && setHasInteracted(true)}>
      <Glitter buttonPosition={buttonPosition} isInteracting={isInteracting} isRevealing={isHoveringLink} />
      {/* Background iframe */}
      <iframe
        src="https://os.txnio.com"
        className="fixed inset-0 w-full h-full border-0"
        style={{ zIndex: isInteracting ? 25 : 1 }}
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
          <div 
            className="relative z-20 min-h-screen flex flex-col pointer-events-auto transition-opacity duration-300"
            style={{ opacity: (isHoveringLink || isRevealing) ? 0 : 1 }}
          >


            {/* Top Link */}
            <div className="text-center py-6">
              <button
                ref={linkRef}
                onMouseEnter={handleInteractionStart}
                onMouseLeave={handleInteractionEnd}
                onClick={() => {
                  if (!isRevealing) {
                    handleInteractionStart();
                    setIsRevealing(true);
                  }
                }}
                className="hover:opacity-80 transition-all duration-300 ease-in-out cursor-pointer font-pixel text-lg md:text-sm shimmer-green px-4 py-2 rounded-lg"
                style={{
                  background: 'linear-gradient(90deg, #edeced 0%, #90EE90 25%, #32CD32 50%, #90EE90 75%, #edeced 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 10s ease-in-out infinite',
                  opacity: isInteracting ? 0 : 1,
                  transform: isInteracting ? 'translateY(-20px)' : 'translateY(0)',
                  pointerEvents: isInteracting ? 'none' : 'auto',
                  minHeight: '44px',
                  minWidth: '200px'
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
                    <EmojiRenderer emoji={randomEmojis.name} />
                    {isAnimatingText ? matrixText.name : originalText.name}
                  </h1>
                  <h2 className={`text-2xl md:text-4xl ${randomFonts.nickname} hover:opacity-80 transition-opacity`} style={{color: '#edeced'}}>
                    <EmojiRenderer emoji={randomEmojis.nickname} />
                    {isAnimatingText ? matrixText.nickname : originalText.nickname}
                  </h2>
                  <h3 className={`text-xl md:text-4xl ${randomFonts.title} hover:opacity-80 transition-opacity`} style={{color: '#edeced', opacity: 0.9}}>
                    <EmojiRenderer emoji={randomEmojis.title} />
                    {isAnimatingText ? matrixText.title : originalText.title}
                  </h3>
                  <h4 className={`text-lg md:text-xl ${randomFonts.subtitle} hover:opacity-80 transition-opacity`} style={{color: '#edeced', opacity: 0.8}}>
                    <EmojiRenderer emoji={randomEmojis.subtitle} />
                    {isAnimatingText ? matrixText.subtitle : originalText.subtitle}
                  </h4>
                  <h5 className={`text-2xl md:text-4xl ${randomFonts.company} font-bold hover:opacity-80 transition-opacity`} style={{color: '#edeced'}}>
                    <EmojiRenderer emoji={randomEmojis.company} />
                    {isAnimatingText ? matrixText.company : originalText.company}
                  </h5>
                </div>

              </div>
            </div>

            {/* Footer Links */}
            <div className="py-4 text-center">
              <div className={`flex justify-center space-x-8 text-sm ${randomFonts.subtitle}`}>
                <button
                  onClick={() => {
                    setShowComingSoon(true);
                    setTimeout(() => setShowComingSoon(false), 2000);
                  }}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  style={{color: '#edeced', background: 'none', border: 'none', padding: 0, font: 'inherit'}}
                >
                  {t.blog}
                </button>
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

      {/* Coming Soon Message */}
      {showComingSoon && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black text-white px-6 py-3 rounded-lg font-pixel text-lg">
            {t.comingSoon}
          </div>
        </div>
      )}

      {/* Close Button - Always present but with visibility control */}
      <button
        onClick={() => {
          setIsInteracting(false);
          setIsHoveringLink(false);
          setIsRevealing(false);
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