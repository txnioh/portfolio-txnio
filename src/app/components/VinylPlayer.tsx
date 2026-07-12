'use client';

import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  type PanInfo,
  useReducedMotion,
} from 'framer-motion';
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useGlobalAudioPlayer } from './GlobalAudioPlayer';

const SCREEN_TRANSITION = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1] as const,
};

const COVER_SPRING = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 48,
};

const DRAG_STEP = 20;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '--:--';

  const wholeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(wholeSeconds / 60);
  const remainingSeconds = String(wholeSeconds % 60).padStart(2, '0');

  return `${minutes}:${remainingSeconds}`;
}

function getCoverPose(position: number) {
  if (position === 0) {
    return {
      x: 0,
      rotateY: 0,
      z: 0,
      scale: 1,
      opacity: 1,
      zIndex: 10,
    };
  }

  const distance = Math.abs(position);
  const direction = position > 0 ? 1 : -1;

  return {
    x: direction * (68 + (distance - 1) * 26),
    rotateY: direction * -60,
    z: -50 - distance * 20,
    scale: 1,
    opacity: distance === 1 ? 1 : Math.max(0.25, 1 - (distance - 1) * 0.3),
    zIndex: 5 - distance,
  };
}

export function VinylPlayer() {
  const [screen, setScreen] = useState<'player' | 'library'>('player');
  const [collectionPosition, setCollectionPosition] = useState(0);
  const [dominantColor, setDominantColor] = useState<string>('#1a1a1a');
  const libraryRef = useRef<HTMLDivElement>(null);
  const lastPanXRef = useRef<number | null>(null);
  const isDraggingCollectionRef = useRef(false);
  const dragReleaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const {
    activeTrack,
    activeTrackIndex,
    currentTime,
    duration,
    isPlaying,
    isReady,
    seekTo,
    selectTrack,
    togglePlayback,
    tracks,
  } = useGlobalAudioPlayer();

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = activeTrack.cover;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 50;
      canvas.height = 50;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 50, 50);
      const data = ctx.getImageData(0, 0, 50, 50).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 16) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      setDominantColor(`rgb(${r}, ${g}, ${b})`);
    };
  }, [activeTrack.cover]);
  const progressPercent = isReady
    ? Math.min(currentTime / duration, 1) * 100
    : 0;
  const selectedIndex = Math.min(
    Math.max(Math.round(collectionPosition), 0),
    tracks.length - 1,
  );
  const selectedTrack = tracks[selectedIndex] ?? activeTrack;
  const screenTransition = shouldReduceMotion
    ? { duration: 0 }
    : SCREEN_TRANSITION;

  const navigateBy = useCallback((direction: -1 | 1) => {
    setCollectionPosition((currentPosition) => (
      Math.min(
        Math.max(Math.round(currentPosition) + direction, 0),
        tracks.length - 1,
      )
    ));
  }, [tracks.length]);

  const openLibrary = useCallback(() => {
    setCollectionPosition(activeTrackIndex);
    setScreen('library');
  }, [activeTrackIndex]);

  const chooseTrack = useCallback((index: number) => {
    selectTrack(index);
    setScreen('player');
  }, [selectTrack]);

  const selectNextTrack = useCallback(() => {
    selectTrack((activeTrackIndex + 1) % tracks.length);
  }, [activeTrackIndex, tracks.length, selectTrack]);

  const selectPrevTrack = useCallback(() => {
    selectTrack((activeTrackIndex - 1 + tracks.length) % tracks.length);
  }, [activeTrackIndex, tracks.length, selectTrack]);

  useEffect(() => {
    if (screen !== 'library') return;

    const frame = window.requestAnimationFrame(() => libraryRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [screen]);

  useEffect(() => {
    return () => {
      if (dragReleaseTimerRef.current) {
        clearTimeout(dragReleaseTimerRef.current);
      }
    };
  }, []);

  const handlePanStart = useCallback((_: PointerEvent, info: PanInfo) => {
    lastPanXRef.current = info.point.x;
    isDraggingCollectionRef.current = false;
  }, []);

  const handlePan = useCallback((_: PointerEvent, info: PanInfo) => {
    if (lastPanXRef.current === null) return;

    const delta = info.point.x - lastPanXRef.current;
    if (Math.abs(delta) < DRAG_STEP) return;

    navigateBy(delta < 0 ? 1 : -1);
    lastPanXRef.current = info.point.x;
    isDraggingCollectionRef.current = true;
  }, [navigateBy]);

  const handlePanEnd = useCallback(() => {
    lastPanXRef.current = null;
    if (dragReleaseTimerRef.current) {
      clearTimeout(dragReleaseTimerRef.current);
    }
    dragReleaseTimerRef.current = setTimeout(() => {
      isDraggingCollectionRef.current = false;
    }, 60);
  }, []);

  const handleLibraryKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLInputElement) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigateBy(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      navigateBy(1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      chooseTrack(selectedIndex);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setScreen('player');
    }
  }, [chooseTrack, navigateBy, selectedIndex]);

  return (
    <motion.section
      layout
      className="minimal-inline-player minimal-reveal-line"
      aria-label={screen === 'player' ? 'Now playing' : 'Choose a record'}
      transition={screenTransition}
    >
      <AnimatePresence initial={false} mode="wait">
        {screen === 'player' ? (
          <motion.div
            key="player"
            className="minimal-player-screen"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={screenTransition}
          >
            <div className="minimal-release-picker">
              <button
                type="button"
                className={`minimal-release-trigger${isPlaying ? ' is-playing' : ''}`}
                onClick={openLibrary}
                aria-label="Browse record collection"
              >
                <span className="minimal-release-cover">
                  <Image
                    src={activeTrack.cover}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 72px, 96px"
                    draggable={false}
                    className="minimal-vinyl-cover"
                  />
                </span>
                <span
                  className="minimal-release-vinyl"
                  style={{
                    animationPlayState: isPlaying ? 'running' : 'paused',
                    '--vinyl-dominant-color': dominantColor,
                  } as React.CSSProperties}
                >
                  <span className="minimal-release-vinyl-label">
                    <Image
                      src={activeTrack.cover}
                      alt=""
                      fill
                      sizes="30px"
                      draggable={false}
                      className="minimal-vinyl-cover"
                    />
                  </span>
                </span>
              </button>
            </div>

            <div className="minimal-inline-player-content">
              <p className="minimal-inline-track">
                <strong>{activeTrack.title}</strong>
                <span aria-hidden="true">—</span>
                <span>{activeTrack.artist}</span>
              </p>

              <div className="minimal-inline-controls">
                <div className="minimal-transport">
                  <button
                    type="button"
                    onClick={selectPrevTrack}
                    aria-label="Previous track"
                  >
                    prev
                  </button>
                  <button
                    type="button"
                    onClick={togglePlayback}
                    aria-label={isPlaying ? `Pause ${activeTrack.title}` : `Play ${activeTrack.title}`}
                  >
                    {isPlaying ? 'pause' : 'play'}
                  </button>
                  <button
                    type="button"
                    onClick={selectNextTrack}
                    aria-label="Next track"
                  >
                    next
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max={isReady ? duration : 0}
                  step="0.1"
                  value={isReady ? Math.min(currentTime, duration) : 0}
                  onChange={(event) => seekTo(Number(event.currentTarget.value))}
                  disabled={!isReady}
                  aria-label="Track progress"
                  style={{
                    background: `linear-gradient(to right, #111111 0%, #111111 ${progressPercent}%, #dededb ${progressPercent}%, #dededb 100%)`,
                  }}
                />
                <span className="minimal-inline-time">
                  {isReady
                    ? `${formatTime(currentTime)} / ${formatTime(duration)}`
                    : '--:-- / --:--'}
                </span>
              </div>
              <button
                type="button"
                className="minimal-collection-label"
                onClick={openLibrary}
              >
                Browse {tracks.length} records ↗
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="library"
            ref={libraryRef}
            className="minimal-library-screen"
            tabIndex={0}
            role="region"
            aria-label="Record collection"
            onKeyDown={handleLibraryKeyDown}
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={screenTransition}
          >
            <button
              type="button"
              className="minimal-library-back"
              onClick={() => setScreen('player')}
            >
              ← Playing
            </button>

            <motion.div
              className="minimal-coverflow-stage"
              onPanStart={handlePanStart}
              onPan={handlePan}
              onPanEnd={handlePanEnd}
              style={{ touchAction: 'none' }}
            >
              {tracks.map((track, index) => {
                const position = index - collectionPosition;
                if (Math.abs(position) > 3) return null;

                const pose = getCoverPose(position);
                return (
                  <motion.button
                    type="button"
                    key={track.id}
                    className="minimal-coverflow-card"
                    onClick={() => {
                      if (isDraggingCollectionRef.current) return;
                      if (position === 0) {
                        chooseTrack(index);
                      } else {
                        setCollectionPosition(index);
                      }
                    }}
                    aria-label={position === 0
                      ? `Play ${track.title} by ${track.artist}`
                      : `Focus ${track.title} by ${track.artist}`}
                    tabIndex={position === 0 ? 0 : -1}
                    initial={false}
                    animate={pose}
                    transition={shouldReduceMotion ? { duration: 0 } : COVER_SPRING}
                  >
                    <Image
                      src={track.cover}
                      alt={`${track.album} cover`}
                      fill
                      sizes="96px"
                      draggable={false}
                      className="minimal-vinyl-cover"
                    />
                  </motion.button>
                );
              })}
            </motion.div>

            <div className="minimal-coverflow-meta" aria-live="polite">
              <strong>{selectedTrack.title}</strong>
              <span>{selectedTrack.artist} · {selectedTrack.album}</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
