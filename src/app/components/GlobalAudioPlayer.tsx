'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { DjMixerProvider, useDjMixer } from '../dj/DjMixerContext';
import { getDominantDeck } from '../dj/mixerMath';
import type { LoadedDjTrack } from '../dj/types';
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

function toAudioTrack(track: LoadedDjTrack | null): AudioTrack {
  if (!track) return audioTracks[0];
  const catalogTrack = track.catalogIndex === null ? null : audioTracks[track.catalogIndex];
  return catalogTrack ?? {
    id: track.id,
    title: track.title,
    artist: track.artist,
    album: track.album,
    src: '',
    cover: track.cover ?? '/icons/cdrom.png',
  };
}

function GlobalAudioPlayerAdapter({ children }: { children: ReactNode }) {
  const [mixer, dispatch] = useDjMixer((snapshot) => snapshot);
  const dominantDeck = getDominantDeck(
    mixer.crossfader,
    mixer.decks.A.level,
    mixer.decks.B.level,
    mixer.focusedDeck,
  );
  const activeDeckId = mixer.sessionActive ? dominantDeck : mixer.focusedDeck;
  const activeDeck = mixer.decks[activeDeckId];
  const activeTrack = useMemo(() => toAudioTrack(activeDeck.track), [activeDeck.track]);
  const activeTrackIndex = activeDeck.track?.catalogIndex ?? 0;
  const isPlaying = mixer.decks.A.status === 'playing' || mixer.decks.B.status === 'playing';

  const togglePlayback = useCallback(() => {
    if (mixer.sessionActive) {
      void dispatch({ type: 'mixer.toggleOutput' });
      return;
    }
    void dispatch({ type: 'deck.toggle', deck: activeDeckId });
  }, [activeDeckId, dispatch, mixer.sessionActive]);

  const seekTo = useCallback((seconds: number) => {
    void dispatch({ type: 'deck.seek', deck: activeDeckId, seconds });
  }, [activeDeckId, dispatch]);

  const selectTrack = useCallback((index: number) => {
    if (!audioTracks[index]) return;
    if (activeDeck.track?.catalogIndex === index) {
      if (activeDeck.status !== 'playing') void dispatch({ type: 'deck.toggle', deck: activeDeckId });
      return;
    }
    void dispatch({ type: 'deck.loadAudioTrack', deck: activeDeckId, trackIndex: index, autoplay: true });
  }, [activeDeck.status, activeDeck.track?.catalogIndex, activeDeckId, dispatch]);

  const contextValue = useMemo(() => ({
    isPlaying,
    currentTime: activeDeck.position,
    duration: activeDeck.duration,
    isReady: activeDeck.duration > 0,
    tracks: audioTracks,
    activeTrack,
    activeTrackIndex,
    togglePlayback,
    seekTo,
    selectTrack,
  }), [
    activeDeck.duration,
    activeDeck.position,
    activeTrack,
    activeTrackIndex,
    isPlaying,
    seekTo,
    selectTrack,
    togglePlayback,
  ]);

  return (
    <GlobalAudioPlayerContext.Provider value={contextValue}>
      {children}
    </GlobalAudioPlayerContext.Provider>
  );
}

export function GlobalAudioPlayerProvider({ children }: { children: ReactNode }) {
  return (
    <DjMixerProvider>
      <GlobalAudioPlayerAdapter>{children}</GlobalAudioPlayerAdapter>
    </DjMixerProvider>
  );
}

export function useGlobalAudioPlayer() {
  const context = useContext(GlobalAudioPlayerContext);
  if (!context) {
    throw new Error('useGlobalAudioPlayer must be used within GlobalAudioPlayerProvider');
  }
  return context;
}
