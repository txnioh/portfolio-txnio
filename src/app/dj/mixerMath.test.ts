import { describe, expect, it } from 'vitest';
import {
  contextSecondsUntilNextBeat,
  getBeatAlignedLoop,
  getCrossfadeGains,
  getDominantDeck,
  getNextBeatPosition,
  getSyncedTempoPercent,
  secondsUntilNextBeat,
  wrapLoopPosition,
} from './mixerMath';

describe('getCrossfadeGains', () => {
  it('keeps full power at the edges and equal power in the centre', () => {
    expect(getCrossfadeGains(-1)).toEqual({ A: 1, B: 0 });
    expect(getCrossfadeGains(1)).toEqual({ A: 0, B: 1 });

    const centre = getCrossfadeGains(0);
    expect(centre.A).toBeCloseTo(Math.SQRT1_2, 6);
    expect(centre.B).toBeCloseTo(Math.SQRT1_2, 6);
  });
});

describe('getDominantDeck', () => {
  it('adapts the compact player to the audible side of the mix', () => {
    expect(getDominantDeck(-0.8, 1, 1, 'B')).toBe('A');
    expect(getDominantDeck(0.8, 1, 1, 'A')).toBe('B');
    expect(getDominantDeck(0, 1, 1, 'B')).toBe('B');
    expect(getDominantDeck(-1, 0, 1, 'B')).toBe('B');
  });
});

describe('getSyncedTempoPercent', () => {
  it('matches the target BPM and clamps the pitch range to sixteen percent', () => {
    expect(getSyncedTempoPercent(140, 147)).toBeCloseTo(5, 6);
    expect(getSyncedTempoPercent(100, 165)).toBe(16);
    expect(getSyncedTempoPercent(165, 100)).toBe(-16);
  });
});

describe('secondsUntilNextBeat', () => {
  it('schedules a follower on the master beat grid', () => {
    expect(secondsUntilNextBeat(1.2, 120, 0.1)).toBeCloseTo(0.4, 6);
    expect(secondsUntilNextBeat(1.1, 120, 0.1)).toBeCloseTo(0, 6);
  });

  it('converts the master buffer grid to AudioContext time at changed tempo', () => {
    expect(contextSecondsUntilNextBeat(1.2, 120, 0.1, 1.1)).toBeCloseTo(0.4 / 1.1, 6);
  });

  it('moves a running follower to its next source-grid beat', () => {
    expect(getNextBeatPosition(1.33, 150, 0.12)).toBeCloseTo(1.72, 6);
    expect(getNextBeatPosition(1.72, 150, 0.12)).toBeCloseTo(1.72, 6);
  });
});

describe('performance loops', () => {
  it('creates a quantized four-beat loop around the current playhead', () => {
    expect(getBeatAlignedLoop(3.37, 150, 0.12, 4, 8)).toEqual({
      start: 3.32,
      end: 4.92,
    });
  });

  it('keeps loop bounds inside the decoded track and wraps playback', () => {
    expect(getBeatAlignedLoop(7.9, 150, 0.12, 8, 8)).toEqual({
      start: 7.72,
      end: 8,
    });
    expect(wrapLoopPosition(8.13, { start: 7.72, end: 8 })).toBeCloseTo(7.85, 6);
    expect(wrapLoopPosition(7.9, { start: 7.72, end: 8 })).toBe(7.9);
  });
});
