import type { DeckId } from './mixerMath';
import type { DeckState, DjMixerState, DjStateEvent } from './types';

function createEmptyDeck(id: DeckId): DeckState {
  return {
    id,
    status: 'empty',
    track: null,
    position: 0,
    duration: 0,
    cuePoint: 0,
    bpm: null,
    beatOffsetSec: 0,
    keyCamelot: null,
    tempoPercent: 0,
    nudge: 0,
    jogging: false,
    synced: false,
    hotCues: [null, null, null, null],
    loop: { enabled: false, beats: 4, start: null, end: null },
    waveform: [],
    eq: { low: 0, mid: 0, high: 0 },
    filter: 0,
    echo: { time: 0.22, wet: 0 },
    level: 1,
    peak: 0,
    error: null,
  };
}

export function createInitialDjState(): DjMixerState {
  return {
    isOpen: false,
    sessionActive: false,
    outputPaused: false,
    audioStatus: 'idle',
    focusedDeck: 'A',
    libraryDeck: null,
    masterDeck: null,
    decks: {
      A: createEmptyDeck('A'),
      B: createEmptyDeck('B'),
    },
    crossfader: -1,
    masterLevel: 0.82,
    masterPeak: 0,
    limiterReductionDb: 0,
  };
}

export function reduceDjState(state: DjMixerState, event: DjStateEvent): DjMixerState {
  if (event.type === 'mode.open') {
    return {
      ...state,
      isOpen: true,
      sessionActive: true,
      crossfader: state.sessionActive || state.decks.A.status === 'playing' ? state.crossfader : 0,
    };
  }

  if (event.type === 'mode.close') {
    return { ...state, isOpen: false };
  }

  if (event.type === 'mode.end') {
    return {
      ...state,
      isOpen: false,
      sessionActive: false,
      libraryDeck: null,
    };
  }

  if (event.type === 'deck.patch') {
    return {
      ...state,
      decks: {
        ...state.decks,
        [event.deck]: { ...state.decks[event.deck], ...event.patch },
      },
    };
  }

  if (event.type === 'deck.status') {
    const otherDeck: DeckId = event.deck === 'A' ? 'B' : 'A';
    let masterDeck = state.masterDeck;

    if (event.status === 'playing' && masterDeck === null) {
      masterDeck = event.deck;
    } else if (event.deck === masterDeck && event.status !== 'playing') {
      masterDeck = state.decks[otherDeck].status === 'playing' ? otherDeck : null;
    }

    return {
      ...state,
      focusedDeck: event.status === 'playing' ? event.deck : state.focusedDeck,
      masterDeck,
      outputPaused: false,
      decks: {
        ...state.decks,
        [event.deck]: { ...state.decks[event.deck], status: event.status },
      },
    };
  }

  return { ...state, ...event.patch };
}
