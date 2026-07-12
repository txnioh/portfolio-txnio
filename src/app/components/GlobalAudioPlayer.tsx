'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { audioTracks, type AudioTrack } from '../music';

interface GlobalAudioPlayerContextValue {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isReady: boolean;
  tracks: readonly AudioTrack[];
  activeTrack: AudioTrack;
  activeTrackIndex: number;
  togglePlayback: () => void;
  seekTo: (seconds: number) => void;
  selectTrack: (index: number) => void;
}

const GlobalAudioPlayerContext = createContext<GlobalAudioPlayerContextValue | null>(null);

const INITIAL_PLAYBACK_STATE = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
};

export function GlobalAudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playback, setPlayback] = useState(INITIAL_PLAYBACK_STATE);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const shouldAutoplayTrackRef = useRef(false);
  const activeTrack = audioTracks[activeTrackIndex];
  const { currentTime, duration, isPlaying } = playback;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setPlayback((current) => ({ ...current, isPlaying: true }));
    };
    const handlePause = () => {
      setPlayback((current) => ({ ...current, isPlaying: false }));
    };
    const handleTimeUpdate = () => {
      setPlayback((current) => ({ ...current, currentTime: audio.currentTime }));
    };
    const handleDurationChange = () => {
      setPlayback((current) => ({
        ...current,
        duration: Number.isFinite(audio.duration) ? audio.duration : 0,
      }));
    };
    const handleEnded = () => {
      setPlayback((current) => ({
        ...current,
        isPlaying: false,
        currentTime: audio.currentTime,
      }));
    };
    const handleEmptied = () => {
      setPlayback(INITIAL_PLAYBACK_STATE);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleDurationChange);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('emptied', handleEmptied);

    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
      handleDurationChange();
      handleTimeUpdate();
    }

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleDurationChange);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('emptied', handleEmptied);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();

    if (!shouldAutoplayTrackRef.current) return;

    shouldAutoplayTrackRef.current = false;
    const playPromise = audio.play();
    playPromise?.catch(() => {
      setPlayback((current) => ({ ...current, isPlaying: false }));
    });
  }, [activeTrackIndex]);

  const togglePlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          setPlayback((current) => ({ ...current, isPlaying: false }));
        });
      }
      return;
    }

    audio.pause();
  }, []);

  const seekTo = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;

    const nextTime = Math.min(Math.max(seconds, 0), audio.duration);
    audio.currentTime = nextTime;
    setPlayback((current) => ({ ...current, currentTime: nextTime }));
  }, []);

  const selectTrack = useCallback((index: number) => {
    const audio = audioRef.current;
    const nextTrack = audioTracks[index];
    if (!audio || !nextTrack) return;

    if (index === activeTrackIndex) {
      const playPromise = audio.play();
      playPromise?.catch(() => {
        setPlayback((current) => ({ ...current, isPlaying: false }));
      });
      return;
    }

    shouldAutoplayTrackRef.current = true;
    setActiveTrackIndex(index);
  }, [activeTrackIndex]);

  const contextValue = useMemo(() => {
    return {
      isPlaying,
      currentTime,
      duration,
      isReady: duration > 0,
      tracks: audioTracks,
      activeTrack,
      activeTrackIndex,
      togglePlayback,
      seekTo,
      selectTrack,
    };
  }, [activeTrack, activeTrackIndex, currentTime, duration, isPlaying, seekTo, selectTrack, togglePlayback]);

  return (
    <GlobalAudioPlayerContext.Provider value={contextValue}>
      {children}
      <audio ref={audioRef} src={activeTrack.src} preload="metadata" />
    </GlobalAudioPlayerContext.Provider>
  );
}

export function useGlobalAudioPlayer() {
  const context = useContext(GlobalAudioPlayerContext);
  if (!context) {
    throw new Error('useGlobalAudioPlayer must be used within GlobalAudioPlayerProvider');
  }
  return context;
}
