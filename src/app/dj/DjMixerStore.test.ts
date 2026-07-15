import { describe, expect, it, vi } from 'vitest';
import { DjMixerStore, getLocalAudioFileError } from './DjMixerStore';

describe('local audio validation', () => {
  it('rejects unsupported and oversized files before decoding', () => {
    expect(getLocalAudioFileError({ name: 'track.flac', type: 'audio/flac', size: 1 })).toBe('Choose an MP3 or WAV file.');
    expect(getLocalAudioFileError({ name: 'track.wav', type: 'audio/wav', size: (100 * 1024 * 1024) + 1 })).toBe(
      'Audio files must be 100 MB or smaller.',
    );
    expect(getLocalAudioFileError({ name: 'track.mp3', type: '', size: 1024 })).toBeNull();
  });
});

describe('DjMixerStore commands', () => {
  it('reactivates after the Strict Mode setup-cleanup-setup lifecycle', async () => {
    vi.stubGlobal('window', {
      setInterval: vi.fn(() => 1),
      clearInterval: vi.fn(),
    });
    const store = new DjMixerStore();

    store.destroy();
    store.initialize();
    await store.dispatch({ type: 'mixer.setMaster', value: 0.4 });

    expect(store.getSnapshot().masterLevel).toBe(0.4);
    store.destroy();
    vi.unstubAllGlobals();
  });

  it('clamps tempo, EQ, channel and master values at the public dispatch boundary', async () => {
    const store = new DjMixerStore();

    await store.dispatch({ type: 'deck.setTempo', deck: 'A', value: 30 });
    await store.dispatch({ type: 'deck.setEq', deck: 'A', band: 'low', value: -40 });
    await store.dispatch({ type: 'deck.setLevel', deck: 'A', value: 2 });
    await store.dispatch({ type: 'deck.setBpm', deck: 'A', value: 260 });
    await store.dispatch({ type: 'deck.setKey', deck: 'A', value: ' 8a ' });
    await store.dispatch({ type: 'mixer.setMaster', value: -1 });

    const snapshot = store.getSnapshot();
    expect(snapshot.decks.A.tempoPercent).toBe(16);
    expect(snapshot.decks.A.eq.low).toBe(-24);
    expect(snapshot.decks.A.level).toBe(1);
    expect(snapshot.decks.A.bpm).toBe(220);
    expect(snapshot.decks.A.keyCamelot).toBe('8A');
    expect(snapshot.decks.A.track?.bpmEstimated).toBe(false);
    expect(snapshot.masterLevel).toBe(0);
    store.destroy();
  });

  it('applies CUE as a paused seek to the saved cue point', async () => {
    const store = new DjMixerStore();
    await store.dispatch({ type: 'deck.cue', deck: 'A' });

    expect(store.getSnapshot().decks.A.status).toBe('paused');
    expect(store.getSnapshot().decks.A.position).toBe(0);
    store.destroy();
  });

  it('stores, recalls and clears four deck-local hot cues', async () => {
    const store = new DjMixerStore();

    await store.dispatch({ type: 'deck.hotCue', deck: 'A', index: 0 });
    expect(store.getSnapshot().decks.A.hotCues).toEqual([0, null, null, null]);

    await store.dispatch({ type: 'deck.hotCue', deck: 'A', index: 0 });
    await store.dispatch({ type: 'deck.clearHotCue', deck: 'A', index: 0 });
    expect(store.getSnapshot().decks.A.hotCues).toEqual([null, null, null, null]);
    store.destroy();
  });

  it('keeps performance controls bounded and deck-local', async () => {
    const store = new DjMixerStore();

    await store.dispatch({ type: 'deck.setLoopBeats', deck: 'B', value: 16 });
    await store.dispatch({ type: 'deck.setNudge', deck: 'B', value: 1 });
    await store.dispatch({ type: 'deck.setEcho', deck: 'B', time: 2, wet: 4 });

    expect(store.getSnapshot().decks.B.loop.beats).toBe(16);
    expect(store.getSnapshot().decks.B.nudge).toBe(1);
    expect(store.getSnapshot().decks.B.echo).toEqual({ time: 0.48, wet: 0.72 });
    expect(store.getSnapshot().decks.A.echo.wet).toBe(0);
    store.destroy();
  });

  it('tracks a platter grab without changing an idle deck transport', async () => {
    const store = new DjMixerStore();

    const startJog = store.dispatch({ type: 'deck.startJog', deck: 'A' });
    expect(store.getSnapshot().decks.A.jogging).toBe(true);
    await startJog;

    await store.dispatch({ type: 'deck.endJog', deck: 'A' });
    expect(store.getSnapshot().decks.A.jogging).toBe(false);
    expect(store.getSnapshot().decks.A.status).toBe('empty');
    store.destroy();
  });
});
