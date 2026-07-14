import type { AudioTrack } from '../music';
import type { DeckId } from './mixerMath';

export type { DeckId } from './mixerMath';

export type DeckStatus =
  | 'empty'
  | 'loading'
  | 'ready'
  | 'paused'
  | 'playing'
  | 'error';

export type SetPhase = 'opener' | 'build' | 'peak' | 'release';
export type LoopBeats = 1 | 2 | 4 | 8 | 16;

export type DjTrack = AudioTrack & {
  available: boolean;
  bpm: number | null;
  beatOffsetSec: number;
  keyCamelot: string | null;
  setOrder: number;
  setPhase: SetPhase;
};

export type LoadedDjTrack = {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string | null;
  kind: 'catalog' | 'local';
  catalogIndex: number | null;
  bpmEstimated: boolean;
};

export type DeckState = {
  id: DeckId;
  status: DeckStatus;
  track: LoadedDjTrack | null;
  position: number;
  duration: number;
  cuePoint: number;
  bpm: number | null;
  beatOffsetSec: number;
  keyCamelot: string | null;
  tempoPercent: number;
  nudge: -1 | 0 | 1;
  jogging: boolean;
  synced: boolean;
  hotCues: readonly [number | null, number | null, number | null, number | null];
  loop: {
    enabled: boolean;
    beats: LoopBeats;
    start: number | null;
    end: number | null;
  };
  waveform: readonly number[];
  eq: {
    low: number;
    mid: number;
    high: number;
  };
  filter: number;
  echo: {
    time: number;
    wet: number;
  };
  level: number;
  peak: number;
  error: string | null;
};

export type DjMixerState = {
  isOpen: boolean;
  sessionActive: boolean;
  outputPaused: boolean;
  audioStatus: 'idle' | 'ready' | 'blocked' | 'error';
  focusedDeck: DeckId;
  libraryDeck: DeckId | null;
  masterDeck: DeckId | null;
  decks: Record<DeckId, DeckState>;
  crossfader: number;
  masterLevel: number;
  masterPeak: number;
  limiterReductionDb: number;
};

export type DjStateEvent =
  | { type: 'mode.open' }
  | { type: 'mode.close' }
  | { type: 'mode.end' }
  | { type: 'deck.status'; deck: DeckId; status: DeckStatus }
  | { type: 'deck.patch'; deck: DeckId; patch: Partial<DeckState> }
  | { type: 'mixer.patch'; patch: Partial<Omit<DjMixerState, 'decks'>> };

export type DjCommand =
  | { type: 'mode.open' }
  | { type: 'mode.close' }
  | { type: 'mode.end' }
  | { type: 'library.open'; deck: DeckId }
  | { type: 'library.close' }
  | { type: 'deck.loadCatalog'; deck: DeckId; trackId: string; autoplay?: boolean }
  | { type: 'deck.loadAudioTrack'; deck: DeckId; trackIndex: number; autoplay?: boolean }
  | { type: 'deck.loadFile'; deck: DeckId; file: File }
  | { type: 'deck.toggle'; deck: DeckId }
  | { type: 'deck.cue'; deck: DeckId }
  | { type: 'deck.setCue'; deck: DeckId }
  | { type: 'deck.seek'; deck: DeckId; seconds: number }
  | { type: 'deck.startJog'; deck: DeckId }
  | { type: 'deck.endJog'; deck: DeckId }
  | { type: 'deck.setTempo'; deck: DeckId; value: number }
  | { type: 'deck.setNudge'; deck: DeckId; value: -1 | 0 | 1 }
  | { type: 'deck.toggleSync'; deck: DeckId }
  | { type: 'deck.hotCue'; deck: DeckId; index: 0 | 1 | 2 | 3 }
  | { type: 'deck.clearHotCue'; deck: DeckId; index: 0 | 1 | 2 | 3 }
  | { type: 'deck.setLoopBeats'; deck: DeckId; value: LoopBeats }
  | { type: 'deck.toggleLoop'; deck: DeckId }
  | { type: 'deck.setBpm'; deck: DeckId; value: number }
  | { type: 'deck.setBeatOffset'; deck: DeckId; value: number }
  | { type: 'deck.setKey'; deck: DeckId; value: string | null }
  | { type: 'deck.setEq'; deck: DeckId; band: 'low' | 'mid' | 'high'; value: number }
  | { type: 'deck.setFilter'; deck: DeckId; value: number }
  | { type: 'deck.setEcho'; deck: DeckId; time: number; wet: number }
  | { type: 'deck.setLevel'; deck: DeckId; value: number }
  | { type: 'mixer.setCrossfader'; value: number }
  | { type: 'mixer.setMaster'; value: number }
  | { type: 'mixer.toggleOutput' };

export type DjDispatch = (command: DjCommand) => void | Promise<void>;
