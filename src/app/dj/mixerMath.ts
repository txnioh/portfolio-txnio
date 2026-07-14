export type DeckId = 'A' | 'B';

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function getCrossfadeGains(value: number): Record<DeckId, number> {
  const position = clamp(value, -1, 1);
  if (position === -1) return { A: 1, B: 0 };
  if (position === 1) return { A: 0, B: 1 };

  const angle = ((position + 1) * Math.PI) / 4;
  return {
    A: Math.cos(angle),
    B: Math.sin(angle),
  };
}

export function getDominantDeck(
  crossfader: number,
  levelA: number,
  levelB: number,
  fallback: DeckId,
): DeckId {
  const gains = getCrossfadeGains(crossfader);
  const audibleA = gains.A * clamp(levelA, 0, 1);
  const audibleB = gains.B * clamp(levelB, 0, 1);
  if (Math.abs(audibleA - audibleB) < 0.000001) return fallback;
  return audibleA > audibleB ? 'A' : 'B';
}

export function getSyncedTempoPercent(sourceBpm: number, targetBpm: number) {
  if (sourceBpm <= 0 || targetBpm <= 0) return 0;
  return clamp(((targetBpm / sourceBpm) - 1) * 100, -16, 16);
}

export function getEffectiveBpm(bpm: number | null, tempoPercent: number) {
  if (!bpm || bpm <= 0) return null;
  return bpm * (1 + clamp(tempoPercent, -16, 16) / 100);
}

export function secondsUntilNextBeat(
  position: number,
  bpm: number | null,
  beatOffset: number,
) {
  if (!bpm || bpm <= 0) return 0;
  const beatLength = 60 / bpm;
  const elapsedFromGrid = Math.max(0, position - beatOffset);
  const remainder = elapsedFromGrid % beatLength;
  if (remainder < 0.0001 || beatLength - remainder < 0.0001) return 0;
  return beatLength - remainder;
}

export function contextSecondsUntilNextBeat(
  position: number,
  bpm: number | null,
  beatOffset: number,
  playbackRate: number,
) {
  if (playbackRate <= 0) return 0;
  return secondsUntilNextBeat(position, bpm, beatOffset) / playbackRate;
}

export function getNextBeatPosition(
  position: number,
  bpm: number | null,
  beatOffset: number,
) {
  if (!bpm || bpm <= 0) return Math.max(position, beatOffset);
  if (position <= beatOffset) return beatOffset;
  const beatLength = 60 / bpm;
  const elapsedFromGrid = position - beatOffset;
  const beatIndex = Math.ceil((elapsedFromGrid - 0.0001) / beatLength);
  return beatOffset + beatIndex * beatLength;
}

export type LoopBounds = { start: number; end: number };

function roundGridValue(value: number) {
  return Math.round(value * 1000000) / 1000000;
}

export function getBeatAlignedLoop(
  position: number,
  bpm: number | null,
  beatOffset: number,
  beats: number,
  duration: number,
): LoopBounds | null {
  if (!bpm || bpm <= 0 || beats <= 0 || duration <= 0) return null;
  const beatLength = 60 / bpm;
  const safePosition = clamp(position, 0, duration);
  const beatIndex = Math.max(0, Math.floor(((safePosition - beatOffset) / beatLength) + 0.0001));
  const start = clamp(beatOffset + beatIndex * beatLength, 0, duration);
  const end = clamp(start + beats * beatLength, start, duration);
  if (end - start < 0.01) return null;
  return { start: roundGridValue(start), end: roundGridValue(end) };
}

export function wrapLoopPosition(position: number, loop: LoopBounds | null) {
  if (!loop || loop.end <= loop.start || position < loop.end) return position;
  const length = loop.end - loop.start;
  return loop.start + ((position - loop.start) % length);
}
