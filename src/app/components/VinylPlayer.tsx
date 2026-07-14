'use client';

import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  type PanInfo,
  useReducedMotion,
} from 'framer-motion';
import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDjMixer } from '../dj/DjMixerContext';
import { InlineDjDeck } from './DjMixer';
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

const TIMELINE_TRANSITION = {
  duration: 0.16,
  ease: [0.22, 1, 0.36, 1] as const,
};

const VINYL_ROTATION_TRANSITION = {
  duration: 0.32,
  ease: 'linear' as const,
};

const VINYL_SCRUB_TRANSITION = {
  duration: 0.08,
  ease: [0.22, 1, 0.36, 1] as const,
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
  const [previewPercent, setPreviewPercent] = useState<number | null>(null);
  const [seekPercent, setSeekPercent] = useState<number | null>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const libraryRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lastPanXRef = useRef<number | null>(null);
  const isDraggingCollectionRef = useRef(false);
  const dragReleaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [djSessionActive, djDispatch] = useDjMixer((snapshot) => snapshot.sessionActive);
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
    if (djSessionActive) setScreen('player');
  }, [djSessionActive]);

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
  const visibleProgressPercent = seekPercent ?? progressPercent;
  const visiblePreviewPercent = previewPercent === null
    ? visibleProgressPercent
    : Math.max(previewPercent, visibleProgressPercent);
  const selectedIndex = Math.min(
    Math.max(Math.round(collectionPosition), 0),
    tracks.length - 1,
  );
  const selectedTrack = tracks[selectedIndex] ?? activeTrack;
  const screenTransition = shouldReduceMotion
    ? { duration: 0 }
    : SCREEN_TRANSITION;
  const timelineTransition = shouldReduceMotion
    ? { duration: 0 }
    : TIMELINE_TRANSITION;
  const timelineHeight = isSeeking ? 8 : 4;
  const visibleTime = seekPercent === null
    ? currentTime
    : (seekPercent / 100) * duration;
  const vinylRotation = visibleTime * 180;
  const vinylRotationTransition = shouldReduceMotion
    ? { duration: 0 }
    : isSeeking
      ? VINYL_SCRUB_TRANSITION
      : VINYL_ROTATION_TRANSITION;

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

  const getTimelinePercent = useCallback((clientX: number) => {
    const timeline = timelineRef.current;
    if (!timeline) return 0;

    const rect = timeline.getBoundingClientRect();
    if (rect.width <= 0) return 0;

    return Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100);
  }, []);

  const seekToPercent = useCallback((percent: number) => {
    if (!isReady) return;
    const nextTime = (percent / 100) * duration;
    setSeekPercent(percent);
    seekTo(nextTime);
  }, [duration, isReady, seekTo]);

  const handleTimelinePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isReady) return;

    const nextPercent = getTimelinePercent(event.clientX);
    setPreviewPercent(nextPercent);

    if (isSeeking) {
      seekToPercent(nextPercent);
    }
  }, [getTimelinePercent, isReady, isSeeking, seekToPercent]);

  const handleTimelinePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isReady) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    const nextPercent = getTimelinePercent(event.clientX);
    setIsSeeking(true);
    setPreviewPercent(nextPercent);
    seekToPercent(nextPercent);
  }, [getTimelinePercent, isReady, seekToPercent]);

  const handleTimelinePointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isSeeking) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    const nextPercent = getTimelinePercent(event.clientX);
    seekToPercent(nextPercent);
    setIsSeeking(false);
    setSeekPercent(null);
  }, [getTimelinePercent, isSeeking, seekToPercent]);

  const handleTimelinePointerLeave = useCallback(() => {
    if (isSeeking) return;
    setPreviewPercent(null);
  }, [isSeeking]);

  const handleTimelineKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!isReady) return;

    const currentSeconds = Math.min(currentTime, duration);
    let nextTime: number | null = null;

    if (event.key === 'ArrowLeft') {
      nextTime = currentSeconds - 5;
    } else if (event.key === 'ArrowRight') {
      nextTime = currentSeconds + 5;
    } else if (event.key === 'Home') {
      nextTime = 0;
    } else if (event.key === 'End') {
      nextTime = duration;
    }

    if (nextTime === null) return;

    event.preventDefault();
    seekTo(nextTime);
  }, [currentTime, duration, isReady, seekTo]);

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
      className={`minimal-inline-player minimal-reveal-line${djSessionActive ? ' is-dj-mode' : ''}`}
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
            {djSessionActive ? (
              <InlineDjDeck />
            ) : (
              <>
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
                <motion.span
                  className="minimal-release-vinyl"
                >
                  <motion.span
                    className="minimal-release-vinyl-disc"
                    initial={false}
                    animate={{ rotate: vinylRotation }}
                    transition={vinylRotationTransition}
                    style={{
                      '--vinyl-dominant-color': dominantColor,
                    } as CSSProperties}
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
                  </motion.span>
                </motion.span>
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
                <div
                  ref={timelineRef}
                  className={`minimal-timeline${isSeeking ? ' is-seeking' : ''}${!isReady ? ' is-disabled' : ''}`}
                  role="slider"
                  tabIndex={isReady ? 0 : -1}
                  aria-disabled={!isReady}
                  aria-label="Track progress"
                  aria-valuemin={0}
                  aria-valuemax={isReady ? Math.round(duration) : 0}
                  aria-valuenow={isReady ? Math.round(Math.min(currentTime, duration)) : 0}
                  aria-valuetext={isReady ? `${formatTime(currentTime)} of ${formatTime(duration)}` : undefined}
                  onPointerDown={handleTimelinePointerDown}
                  onPointerMove={handleTimelinePointerMove}
                  onPointerUp={handleTimelinePointerUp}
                  onPointerCancel={handleTimelinePointerUp}
                  onPointerLeave={handleTimelinePointerLeave}
                  onKeyDown={handleTimelineKeyDown}
                >
                  <motion.span
                    className="minimal-timeline-track"
                    initial={false}
                    animate={{ height: timelineHeight }}
                    transition={timelineTransition}
                  />
                  <motion.span
                    className="minimal-timeline-preview"
                    initial={false}
                    animate={{
                      width: `${visiblePreviewPercent}%`,
                      height: timelineHeight,
                      opacity: previewPercent !== null || isSeeking ? 1 : 0,
                    }}
                    transition={timelineTransition}
                  />
                  <motion.span
                    className="minimal-timeline-progress"
                    initial={false}
                    animate={{
                      width: `${visibleProgressPercent}%`,
                      height: timelineHeight,
                    }}
                    transition={timelineTransition}
                  />
                </div>
                <span className="minimal-inline-time">
                  {isReady
                    ? `${formatTime(currentTime)} / ${formatTime(duration)}`
                    : '--:-- / --:--'}
                </span>
              </div>
              <div className="minimal-player-links">
                <button
                  type="button"
                  className="minimal-collection-label"
                  onClick={openLibrary}
                >
                  Browse {tracks.length} records ↗
                </button>
                <button
                  type="button"
                  className="minimal-mix-label"
                  onClick={() => void djDispatch({ type: 'mode.open' })}
                >
                  mix ↗
                </button>
              </div>
            </div>
              </>
            )}
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
            initial={{ x: 20 }}
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
