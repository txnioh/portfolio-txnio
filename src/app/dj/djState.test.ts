import { describe, expect, it } from 'vitest';
import { createInitialDjState, reduceDjState } from './djState';

describe('DJ session state', () => {
  it('centres a new idle mix but keeps the playing vinyl deck fully audible', () => {
    const idleOpen = reduceDjState(createInitialDjState(), { type: 'mode.open' });
    const playing = reduceDjState(createInitialDjState(), { type: 'deck.status', deck: 'A', status: 'playing' });
    const playingOpen = reduceDjState(playing, { type: 'mode.open' });

    expect(idleOpen.crossfader).toBe(0);
    expect(playingOpen.crossfader).toBe(-1);
  });

  it('collapses the console without stopping either deck', () => {
    const initial = createInitialDjState();
    const playing = reduceDjState(initial, { type: 'deck.status', deck: 'A', status: 'playing' });
    const mixed = reduceDjState(playing, { type: 'deck.status', deck: 'B', status: 'playing' });
    const open = reduceDjState(mixed, { type: 'mode.open' });
    const collapsed = reduceDjState(open, { type: 'mode.close' });

    expect(collapsed.isOpen).toBe(false);
    expect(collapsed.sessionActive).toBe(true);
    expect(collapsed.decks.A.status).toBe('playing');
    expect(collapsed.decks.B.status).toBe('playing');
  });

  it('hands master tempo to the other playing deck', () => {
    const initial = createInitialDjState();
    const deckAPlaying = reduceDjState(initial, { type: 'deck.status', deck: 'A', status: 'playing' });
    const bothPlaying = reduceDjState(deckAPlaying, { type: 'deck.status', deck: 'B', status: 'playing' });
    const deckAPaused = reduceDjState(bothPlaying, { type: 'deck.status', deck: 'A', status: 'paused' });

    expect(deckAPlaying.masterDeck).toBe('A');
    expect(bothPlaying.masterDeck).toBe('A');
    expect(deckAPaused.masterDeck).toBe('B');
  });

  it('does not focus a deck merely because it is preloading', () => {
    const initial = createInitialDjState();
    const loadingB = reduceDjState(initial, { type: 'deck.status', deck: 'B', status: 'loading' });
    const readyB = reduceDjState(loadingB, { type: 'deck.status', deck: 'B', status: 'paused' });
    const playingB = reduceDjState(readyB, { type: 'deck.status', deck: 'B', status: 'playing' });

    expect(loadingB.focusedDeck).toBe('A');
    expect(readyB.focusedDeck).toBe('A');
    expect(playingB.focusedDeck).toBe('B');
  });

  it('stores cue and seek positions without changing the focused deck', () => {
    const initial = { ...createInitialDjState(), focusedDeck: 'B' as const };
    const seeked = reduceDjState(initial, {
      type: 'deck.patch',
      deck: 'A',
      patch: { position: 42, cuePoint: 16 },
    });

    expect(seeked.decks.A.position).toBe(42);
    expect(seeked.decks.A.cuePoint).toBe(16);
    expect(seeked.focusedDeck).toBe('B');
  });

  it('ends the session while preserving the dominant deck state for vinyl mode', () => {
    const initial = createInitialDjState();
    const playing = reduceDjState(initial, { type: 'deck.status', deck: 'A', status: 'playing' });
    const open = reduceDjState(playing, { type: 'mode.open' });
    const ended = reduceDjState(open, { type: 'mode.end' });

    expect(ended.sessionActive).toBe(false);
    expect(ended.isOpen).toBe(false);
    expect(ended.decks.A.status).toBe('playing');
  });
});
