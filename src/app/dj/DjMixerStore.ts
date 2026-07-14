import { audioTracks, djTracks, type AudioTrack } from '../music';
import { createInitialDjState, reduceDjState } from './djState';
import {
  clamp,
  contextSecondsUntilNextBeat,
  getBeatAlignedLoop,
  getCrossfadeGains,
  getDominantDeck,
  getEffectiveBpm,
  getNextBeatPosition,
  getSyncedTempoPercent,
  wrapLoopPosition,
  type DeckId,
} from './mixerMath';
import type {
  DjCommand,
  DjDispatch,
  DjMixerState,
  DjTrack,
  LoadedDjTrack,
} from './types';

const MAX_FILE_BYTES = 100 * 1024 * 1024;
const MAX_DURATION_SECONDS = 8 * 60;
const POSITION_UPDATE_MS = 100;
const WAVEFORM_BUCKETS = 320;

type Listener = () => void;

type DeckRuntime = {
  buffer: AudioBuffer | null;
  source: AudioBufferSourceNode | null;
  startedAt: number;
  startOffset: number;
  playbackRate: number;
  loadToken: number;
  resumeAfterJog: boolean;
  lowEq: BiquadFilterNode | null;
  midEq: BiquadFilterNode | null;
  highEq: BiquadFilterNode | null;
  lowPass: BiquadFilterNode | null;
  highPass: BiquadFilterNode | null;
  dryGain: GainNode | null;
  delay: DelayNode | null;
  feedbackGain: GainNode | null;
  wetGain: GainNode | null;
  channelGain: GainNode | null;
  crossfadeGain: GainNode | null;
  analyser: AnalyserNode | null;
};

function createDeckRuntime(): DeckRuntime {
  return {
    buffer: null,
    source: null,
    startedAt: 0,
    startOffset: 0,
    playbackRate: 1,
    loadToken: 0,
    resumeAfterJog: false,
    lowEq: null,
    midEq: null,
    highEq: null,
    lowPass: null,
    highPass: null,
    dryGain: null,
    delay: null,
    feedbackGain: null,
    wetGain: null,
    channelGain: null,
    crossfadeGain: null,
    analyser: null,
  };
}

function toLoadedTrack(
  track: Pick<AudioTrack, 'id' | 'title' | 'artist' | 'album' | 'cover'>,
  options: {
    kind: 'catalog' | 'local';
    catalogIndex: number | null;
    bpmEstimated: boolean;
  },
): LoadedDjTrack {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    album: track.album,
    cover: track.cover || null,
    ...options,
  };
}

function makeWaveform(buffer: AudioBuffer) {
  const buckets = Math.min(WAVEFORM_BUCKETS, Math.max(80, Math.floor(buffer.duration * 8)));
  const samplesPerBucket = Math.max(1, Math.floor(buffer.length / buckets));
  const peaks = new Array<number>(buckets).fill(0);

  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let bucket = 0; bucket < buckets; bucket += 1) {
      const start = bucket * samplesPerBucket;
      const end = Math.min(data.length, start + samplesPerBucket);
      let peak = 0;
      const stride = Math.max(1, Math.floor((end - start) / 48));
      for (let sample = start; sample < end; sample += stride) {
        peak = Math.max(peak, Math.abs(data[sample]));
      }
      peaks[bucket] = Math.max(peaks[bucket], peak);
    }
  }

  const maximum = Math.max(...peaks, 0.001);
  return peaks.map((peak) => peak / maximum);
}

function getPeak(analyser: AnalyserNode | null) {
  if (!analyser) return 0;
  const values = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(values);
  let peak = 0;
  for (const value of values) peak = Math.max(peak, Math.abs(value));
  return peak;
}

function isSupportedAudioFile(file: Pick<File, 'type' | 'name'>) {
  const typeIsSupported = file.type === 'audio/mpeg' || file.type === 'audio/wav' || file.type === 'audio/x-wav';
  const nameIsSupported = /\.(mp3|wav)$/i.test(file.name);
  return typeIsSupported || nameIsSupported;
}

export function getLocalAudioFileError(file: Pick<File, 'type' | 'name' | 'size'>) {
  if (!isSupportedAudioFile(file)) return 'Choose an MP3 or WAV file.';
  if (file.size > MAX_FILE_BYTES) return 'Audio files must be 100 MB or smaller.';
  return null;
}

function otherDeck(deck: DeckId): DeckId {
  return deck === 'A' ? 'B' : 'A';
}

function delay(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export class DjMixerStore {
  private snapshot: DjMixerState;
  private readonly listeners = new Set<Listener>();
  private readonly runtimes: Record<DeckId, DeckRuntime> = {
    A: createDeckRuntime(),
    B: createDeckRuntime(),
  };
  private audioContext: AudioContext | null = null;
  private headroomGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private masterAnalyser: AnalyserNode | null = null;
  private ticker: number | null = null;
  private destroyed = false;
  private pausedByMaster = new Set<DeckId>();

  constructor() {
    const initialTrack = audioTracks[0];
    this.snapshot = reduceDjState(createInitialDjState(), {
      type: 'deck.patch',
      deck: 'A',
      patch: {
        track: toLoadedTrack(initialTrack, {
          kind: 'catalog',
          catalogIndex: 0,
          bpmEstimated: true,
        }),
      },
    });
  }

  getSnapshot = () => this.snapshot;

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  initialize = () => {
    this.destroyed = false;
    if (this.ticker !== null) return;
    this.ticker = window.setInterval(this.tick, POSITION_UPDATE_MS);
  };

  destroy = () => {
    this.destroyed = true;
    if (this.ticker !== null) window.clearInterval(this.ticker);
    this.ticker = null;
    this.stopRuntime('A');
    this.stopRuntime('B');
    void this.audioContext?.close();
    this.audioContext = null;
    this.listeners.clear();
  };

  dispatch: DjDispatch = async (command: DjCommand) => {
    if (this.destroyed) return;

    switch (command.type) {
      case 'mode.open':
        this.update({ type: 'mode.open' });
        await this.ensureDeckLoaded('A');
        if (this.snapshot.decks.B.status === 'empty') {
          const deckATrackId = this.snapshot.decks.A.track?.id;
          const firstAvailable = djTracks.find((track) => track.available && track.id !== deckATrackId)
            ?? djTracks.find((track) => track.available);
          if (firstAvailable) await this.loadCatalogTrack('B', firstAvailable, false);
        }
        return;
      case 'mode.close':
        this.update({ type: 'mode.close' });
        return;
      case 'mode.end':
        await this.endSet();
        return;
      case 'library.open':
        this.update({ type: 'mixer.patch', patch: { libraryDeck: command.deck, focusedDeck: command.deck } });
        return;
      case 'library.close':
        this.update({ type: 'mixer.patch', patch: { libraryDeck: null } });
        return;
      case 'deck.loadCatalog': {
        const track = djTracks.find((candidate) => candidate.id === command.trackId);
        if (!track) return;
        await this.loadCatalogTrack(command.deck, track, command.autoplay ?? false);
        return;
      }
      case 'deck.loadAudioTrack':
        await this.loadAudioTrack(command.deck, command.trackIndex, command.autoplay ?? false);
        return;
      case 'deck.loadFile':
        await this.loadLocalFile(command.deck, command.file);
        return;
      case 'deck.toggle':
        await this.toggleDeck(command.deck);
        return;
      case 'deck.cue':
        this.cueDeck(command.deck);
        return;
      case 'deck.setCue':
        this.update({
          type: 'deck.patch',
          deck: command.deck,
          patch: { cuePoint: this.getPosition(command.deck) },
        });
        return;
      case 'deck.seek':
        await this.seekDeck(command.deck, command.seconds);
        return;
      case 'deck.startJog':
        this.startJog(command.deck);
        return;
      case 'deck.endJog':
        await this.endJog(command.deck);
        return;
      case 'deck.setTempo':
        await this.setTempo(command.deck, command.value);
        return;
      case 'deck.setNudge':
        this.setNudge(command.deck, command.value);
        return;
      case 'deck.toggleSync':
        await this.toggleSync(command.deck);
        return;
      case 'deck.hotCue':
        await this.hotCue(command.deck, command.index);
        return;
      case 'deck.clearHotCue':
        this.clearHotCue(command.deck, command.index);
        return;
      case 'deck.setLoopBeats':
        this.setLoopBeats(command.deck, command.value);
        return;
      case 'deck.toggleLoop':
        this.toggleLoop(command.deck);
        return;
      case 'deck.setBpm': {
        const track = this.snapshot.decks[command.deck].track;
        const position = this.getPosition(command.deck);
        this.update({
          type: 'deck.patch',
          deck: command.deck,
          patch: {
            bpm: clamp(command.value, 60, 220),
            synced: false,
            track: track
              ? { ...track, bpmEstimated: false }
              : null,
          },
        });
        this.rebaseActiveLoop(command.deck, position);
        return;
      }
      case 'deck.setBeatOffset': {
        const position = this.getPosition(command.deck);
        this.update({
          type: 'deck.patch',
          deck: command.deck,
          patch: { beatOffsetSec: clamp(command.value, 0, this.snapshot.decks[command.deck].duration) },
        });
        this.rebaseActiveLoop(command.deck, position);
        return;
      }
      case 'deck.setKey':
        this.update({
          type: 'deck.patch',
          deck: command.deck,
          patch: { keyCamelot: command.value?.trim().toUpperCase().slice(0, 4) || null },
        });
        return;
      case 'deck.setEq':
        this.setEq(command.deck, command.band, command.value);
        return;
      case 'deck.setFilter':
        this.setFilter(command.deck, command.value);
        return;
      case 'deck.setEcho':
        this.setEcho(command.deck, command.time, command.wet);
        return;
      case 'deck.setLevel':
        this.setLevel(command.deck, command.value);
        return;
      case 'mixer.setCrossfader':
        this.setCrossfader(command.value);
        return;
      case 'mixer.setMaster':
        this.setMaster(command.value);
        return;
      case 'mixer.toggleOutput':
        await this.toggleOutput();
        return;
    }
  };

  private emit() {
    for (const listener of this.listeners) listener();
  }

  private update(event: Parameters<typeof reduceDjState>[1]) {
    this.snapshot = reduceDjState(this.snapshot, event);
    this.emit();
  }

  private ensureAudioGraph() {
    if (this.audioContext) return this.audioContext;

    const context = new AudioContext();
    this.audioContext = context;
    this.headroomGain = context.createGain();
    this.masterGain = context.createGain();
    this.compressor = context.createDynamicsCompressor();
    this.masterAnalyser = context.createAnalyser();

    this.headroomGain.gain.value = 0.5;
    this.masterGain.gain.value = this.snapshot.masterLevel;
    this.compressor.threshold.value = -3;
    this.compressor.knee.value = 3;
    this.compressor.ratio.value = 20;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.12;
    this.masterAnalyser.fftSize = 1024;

    this.headroomGain
      .connect(this.masterGain)
      .connect(this.compressor)
      .connect(this.masterAnalyser)
      .connect(context.destination);

    for (const deck of ['A', 'B'] as const) this.createDeckGraph(deck, context);
    this.applyCrossfade();
    this.update({ type: 'mixer.patch', patch: { audioStatus: context.state === 'running' ? 'ready' : 'idle' } });
    return context;
  }

  private createDeckGraph(deck: DeckId, context: AudioContext) {
    const runtime = this.runtimes[deck];
    runtime.lowEq = context.createBiquadFilter();
    runtime.midEq = context.createBiquadFilter();
    runtime.highEq = context.createBiquadFilter();
    runtime.lowPass = context.createBiquadFilter();
    runtime.highPass = context.createBiquadFilter();
    runtime.dryGain = context.createGain();
    runtime.delay = context.createDelay(0.8);
    runtime.feedbackGain = context.createGain();
    runtime.wetGain = context.createGain();
    runtime.channelGain = context.createGain();
    runtime.crossfadeGain = context.createGain();
    runtime.analyser = context.createAnalyser();

    runtime.lowEq.type = 'lowshelf';
    runtime.lowEq.frequency.value = 250;
    runtime.midEq.type = 'peaking';
    runtime.midEq.frequency.value = 1000;
    runtime.midEq.Q.value = 0.8;
    runtime.highEq.type = 'highshelf';
    runtime.highEq.frequency.value = 4000;
    runtime.lowPass.type = 'lowpass';
    runtime.lowPass.frequency.value = 22000;
    runtime.highPass.type = 'highpass';
    runtime.highPass.frequency.value = 20;
    runtime.dryGain.gain.value = 1;
    runtime.delay.delayTime.value = this.snapshot.decks[deck].echo.time;
    runtime.feedbackGain.gain.value = 0.32;
    runtime.wetGain.gain.value = this.snapshot.decks[deck].echo.wet;
    runtime.channelGain.gain.value = this.snapshot.decks[deck].level;
    runtime.analyser.fftSize = 1024;

    runtime.lowEq
      .connect(runtime.midEq)
      .connect(runtime.highEq)
      .connect(runtime.lowPass)
      .connect(runtime.highPass);
    runtime.highPass.connect(runtime.dryGain).connect(runtime.channelGain);
    runtime.highPass.connect(runtime.delay).connect(runtime.wetGain).connect(runtime.channelGain);
    runtime.delay.connect(runtime.feedbackGain).connect(runtime.delay);
    runtime.channelGain
      .connect(runtime.crossfadeGain)
      .connect(runtime.analyser)
      .connect(this.headroomGain!);
  }

  private async resumeAudioContext() {
    const context = this.ensureAudioGraph();
    if (context.state !== 'running') {
      try {
        await Promise.race([context.resume(), delay(1200)]);
      } catch {
        this.update({ type: 'mixer.patch', patch: { audioStatus: 'blocked' } });
        return false;
      }
    }
    if (context.state !== 'running') {
      this.update({ type: 'mixer.patch', patch: { audioStatus: 'blocked' } });
      return false;
    }
    this.update({ type: 'mixer.patch', patch: { audioStatus: 'ready' } });
    return true;
  }

  private async ensureDeckLoaded(deck: DeckId) {
    if (this.runtimes[deck].buffer) return true;
    const trackIndex = this.snapshot.decks[deck].track?.catalogIndex;
    if (trackIndex === null || trackIndex === undefined) return false;
    await this.loadAudioTrack(deck, trackIndex, false);
    return Boolean(this.runtimes[deck].buffer);
  }

  private async loadAudioTrack(deck: DeckId, trackIndex: number, autoplay: boolean) {
    const track = audioTracks[trackIndex];
    if (!track) return;
    await this.loadTrackBuffer({
      deck,
      source: track.src,
      track: toLoadedTrack(track, {
        kind: 'catalog',
        catalogIndex: trackIndex,
        bpmEstimated: true,
      }),
      bpm: null,
      beatOffsetSec: 0,
      keyCamelot: null,
      autoplay,
    });
  }

  private async loadCatalogTrack(deck: DeckId, track: DjTrack, autoplay: boolean) {
    if (!track.available || !track.src) {
      this.update({
        type: 'deck.patch',
        deck,
        patch: { error: 'This catalog slot is waiting for its licensed audio file.' },
      });
      return;
    }

    const audioTrackIndex = audioTracks.findIndex((candidate) => candidate.id === track.id);
    await this.loadTrackBuffer({
      deck,
      source: track.src,
      track: toLoadedTrack(track, {
        kind: 'catalog',
        catalogIndex: audioTrackIndex >= 0 ? audioTrackIndex : null,
        bpmEstimated: track.bpm === null,
      }),
      bpm: track.bpm,
      beatOffsetSec: track.beatOffsetSec,
      keyCamelot: track.keyCamelot,
      autoplay,
    });
  }

  private async loadLocalFile(deck: DeckId, file: File) {
    const validationError = getLocalAudioFileError(file);
    if (validationError) {
      this.update({ type: 'deck.patch', deck, patch: { error: validationError } });
      return;
    }

    await this.loadTrackBuffer({
      deck,
      source: file,
      track: {
        id: `local-${Date.now()}-${file.name}`,
        title: file.name.replace(/\.(mp3|wav)$/i, ''),
        artist: 'Local file',
        album: 'This device',
        cover: null,
        kind: 'local',
        catalogIndex: null,
        bpmEstimated: true,
      },
      bpm: null,
      beatOffsetSec: 0,
      keyCamelot: null,
      autoplay: false,
    });
  }

  private async loadTrackBuffer(options: {
    deck: DeckId;
    source: string | File;
    track: LoadedDjTrack;
    bpm: number | null;
    beatOffsetSec: number;
    keyCamelot: string | null;
    autoplay: boolean;
  }) {
    const { deck } = options;
    const runtime = this.runtimes[deck];
    runtime.loadToken += 1;
    const loadToken = runtime.loadToken;
    this.stopRuntime(deck);
    runtime.buffer = null;
    this.update({ type: 'deck.status', deck, status: 'loading' });
    this.update({
      type: 'deck.patch',
      deck,
      patch: {
        track: options.track,
        position: 0,
        duration: 0,
        waveform: [],
        bpm: options.bpm,
        beatOffsetSec: options.beatOffsetSec,
        keyCamelot: options.keyCamelot,
        cuePoint: options.beatOffsetSec,
        nudge: 0,
        jogging: false,
        hotCues: [null, null, null, null],
        loop: { enabled: false, beats: 4, start: null, end: null },
        echo: { ...this.snapshot.decks[deck].echo, wet: 0 },
        error: null,
        synced: false,
      },
    });

    try {
      const context = this.ensureAudioGraph();
      this.resetEchoGraph(deck, context);
      const arrayBuffer = typeof options.source === 'string'
        ? await this.fetchAudio(options.source)
        : await options.source.arrayBuffer();
      const buffer = await context.decodeAudioData(arrayBuffer);
      if (buffer.duration > MAX_DURATION_SECONDS) {
        throw new Error('Audio files must be eight minutes or shorter.');
      }
      if (loadToken !== runtime.loadToken || this.destroyed) return;

      let bpm = options.bpm;
      let beatOffsetSec = options.beatOffsetSec;
      if (bpm === null) {
        try {
          const { guess } = await import('web-audio-beat-detector');
          const estimate = await guess(buffer, { minTempo: 130, maxTempo: 165 });
          bpm = estimate.bpm;
          beatOffsetSec = estimate.offset;
        } catch {
          bpm = null;
          beatOffsetSec = 0;
        }
      }
      if (loadToken !== runtime.loadToken || this.destroyed) return;

      runtime.buffer = buffer;
      runtime.startOffset = 0;
      const waveform = makeWaveform(buffer);
      this.update({ type: 'deck.status', deck, status: 'paused' });
      this.update({
        type: 'deck.patch',
        deck,
        patch: {
          duration: buffer.duration,
          position: 0,
          bpm,
          beatOffsetSec,
          cuePoint: beatOffsetSec,
          waveform,
          error: bpm === null ? 'BPM could not be detected. Open adjust to enter it manually.' : null,
        },
      });

      if (options.autoplay) await this.playDeck(deck);
    } catch (error) {
      if (loadToken !== runtime.loadToken || this.destroyed) return;
      runtime.buffer = null;
      this.setDeckError(deck, error instanceof Error ? error.message : 'The audio file could not be decoded.');
    }
  }

  private async fetchAudio(source: string) {
    const response = await fetch(source);
    if (!response.ok) throw new Error('The audio file could not be loaded.');
    return response.arrayBuffer();
  }

  private setDeckError(deck: DeckId, message: string) {
    this.update({ type: 'deck.status', deck, status: 'error' });
    this.update({
      type: 'deck.patch',
      deck,
      patch: { error: message },
    });
  }

  private async toggleDeck(deck: DeckId) {
    const state = this.snapshot.decks[deck];
    if (state.status === 'playing') {
      this.pauseDeck(deck);
      return;
    }
    if (!(await this.ensureDeckLoaded(deck))) return;
    await this.playDeck(deck);
  }

  private async playDeck(deck: DeckId) {
    const contextReady = await this.resumeAudioContext();
    const runtime = this.runtimes[deck];
    if (!contextReady || !runtime.buffer || !this.audioContext) return;

    let startAt = this.audioContext.currentTime;
    let offset = clamp(this.snapshot.decks[deck].position, 0, Math.max(0, runtime.buffer.duration - 0.01));
    const other = otherDeck(deck);
    const otherState = this.snapshot.decks[other];
    const thisState = this.snapshot.decks[deck];

    if (thisState.synced && otherState.status === 'playing' && otherState.bpm) {
      const masterBpm = getEffectiveBpm(otherState.bpm, otherState.tempoPercent);
      if (masterBpm && thisState.bpm) {
        const tempoPercent = getSyncedTempoPercent(thisState.bpm, masterBpm);
        this.update({ type: 'deck.patch', deck, patch: { tempoPercent } });
        const masterPlaybackRate = 1 + otherState.tempoPercent / 100;
        const wait = contextSecondsUntilNextBeat(
          this.getPosition(other),
          otherState.bpm,
          otherState.beatOffsetSec,
          masterPlaybackRate,
        );
        startAt += wait;
        offset = Math.min(
          getNextBeatPosition(offset, thisState.bpm, thisState.beatOffsetSec),
          Math.max(0, runtime.buffer.duration - 0.01),
        );
      }
    }

    this.startSource(deck, offset, startAt);
  }

  private startSource(deck: DeckId, offset: number, startAt: number, preserveCurrentUntilStart = false) {
    const context = this.audioContext;
    const runtime = this.runtimes[deck];
    const buffer = runtime.buffer;
    const input = runtime.lowEq;
    if (!context || !buffer || !input) return;

    const previousSource = runtime.source;
    if (previousSource && preserveCurrentUntilStart && startAt > context.currentTime) {
      previousSource.onended = null;
      try {
        previousSource.stop(startAt);
      } catch {
        // The previous one-shot source may already have ended.
      }
      window.setTimeout(() => previousSource.disconnect(), ((startAt - context.currentTime) * 1000) + 50);
    } else {
      this.stopRuntime(deck);
    }
    const source = context.createBufferSource();
    const playbackRate = 1 + this.snapshot.decks[deck].tempoPercent / 100;
    const loop = this.snapshot.decks[deck].loop;
    source.buffer = buffer;
    source.playbackRate.value = playbackRate;
    if (loop.enabled && loop.start !== null && loop.end !== null) {
      source.loop = true;
      source.loopStart = loop.start;
      source.loopEnd = loop.end;
    }
    source.connect(input);
    source.onended = () => {
      if (runtime.source !== source) return;
      const position = this.getPosition(deck);
      runtime.source = null;
      runtime.startOffset = Math.min(position, buffer.duration);
      this.update({
        type: 'deck.status',
        deck,
        status: 'paused',
      });
      this.update({
        type: 'deck.patch',
        deck,
        patch: { position: Math.min(position, buffer.duration) },
      });
    };

    runtime.source = source;
    runtime.startedAt = startAt;
    runtime.startOffset = offset;
    runtime.playbackRate = playbackRate;
    source.start(startAt, offset);
    this.update({ type: 'deck.status', deck, status: 'playing' });
    this.update({ type: 'deck.patch', deck, patch: { position: offset, error: null } });
  }

  private pauseDeck(deck: DeckId) {
    const position = this.getPosition(deck);
    this.stopRuntime(deck);
    this.runtimes[deck].startOffset = position;
    this.update({ type: 'deck.status', deck, status: 'paused' });
    this.update({ type: 'deck.patch', deck, patch: { position } });
  }

  private stopRuntime(deck: DeckId) {
    const runtime = this.runtimes[deck];
    if (!runtime.source) return;
    runtime.source.onended = null;
    try {
      runtime.source.stop();
    } catch {
      // The one-shot source may already have ended.
    }
    runtime.source.disconnect();
    runtime.source = null;
  }

  private getPosition(deck: DeckId) {
    const state = this.snapshot.decks[deck];
    const runtime = this.runtimes[deck];
    if (state.status !== 'playing' || !this.audioContext) return state.position;
    if (this.audioContext.currentTime < runtime.startedAt) return runtime.startOffset;
    const elapsed = (this.audioContext.currentTime - runtime.startedAt) * runtime.playbackRate;
    const loop = state.loop.enabled && state.loop.start !== null && state.loop.end !== null
      ? { start: state.loop.start, end: state.loop.end }
      : null;
    return clamp(wrapLoopPosition(runtime.startOffset + elapsed, loop), 0, state.duration);
  }

  private cueDeck(deck: DeckId) {
    const cuePoint = clamp(this.snapshot.decks[deck].cuePoint, 0, this.snapshot.decks[deck].duration);
    this.pauseDeck(deck);
    this.runtimes[deck].startOffset = cuePoint;
    this.update({ type: 'deck.patch', deck, patch: { position: cuePoint } });
  }

  private async seekDeck(deck: DeckId, seconds: number) {
    const state = this.snapshot.decks[deck];
    const position = clamp(seconds, 0, state.duration);
    const wasPlaying = state.status === 'playing';
    this.stopRuntime(deck);
    this.runtimes[deck].startOffset = position;
    this.update({ type: 'deck.patch', deck, patch: { position } });
    if (wasPlaying && this.audioContext) this.startSource(deck, position, this.audioContext.currentTime);
  }

  private startJog(deck: DeckId) {
    const runtime = this.runtimes[deck];
    if (this.snapshot.decks[deck].jogging) return;
    runtime.resumeAfterJog = this.snapshot.decks[deck].status === 'playing';
    if (runtime.resumeAfterJog) this.pauseDeck(deck);
    this.update({ type: 'deck.patch', deck, patch: { jogging: true } });
  }

  private async endJog(deck: DeckId) {
    const runtime = this.runtimes[deck];
    const shouldResume = runtime.resumeAfterJog;
    runtime.resumeAfterJog = false;
    this.update({ type: 'deck.patch', deck, patch: { jogging: false } });
    if (shouldResume) await this.playDeck(deck);
  }

  private async setTempo(deck: DeckId, value: number) {
    const state = this.snapshot.decks[deck];
    const position = this.getPosition(deck);
    const tempoPercent = clamp(value, -16, 16);
    const wasPlaying = state.status === 'playing';
    this.stopRuntime(deck);
    this.update({ type: 'deck.patch', deck, patch: { tempoPercent, nudge: 0, synced: false, position } });
    if (wasPlaying && this.audioContext) this.startSource(deck, position, this.audioContext.currentTime + 0.01);
  }

  private setNudge(deck: DeckId, value: -1 | 0 | 1) {
    const state = this.snapshot.decks[deck];
    const runtime = this.runtimes[deck];
    if (state.nudge === value) return;
    const position = this.getPosition(deck);
    const playbackRate = (1 + state.tempoPercent / 100) * (1 + value * 0.04);
    if (state.status === 'playing' && runtime.source && this.audioContext) {
      runtime.startOffset = position;
      runtime.startedAt = this.audioContext.currentTime;
      runtime.playbackRate = playbackRate;
      runtime.source.playbackRate.setTargetAtTime(playbackRate, this.audioContext.currentTime, 0.015);
    }
    this.update({ type: 'deck.patch', deck, patch: { nudge: value, position } });
  }

  private async hotCue(deck: DeckId, index: 0 | 1 | 2 | 3) {
    const state = this.snapshot.decks[deck];
    const savedPosition = state.hotCues[index];
    if (savedPosition !== null) {
      const wasPlaying = state.status === 'playing';
      await this.seekDeck(deck, savedPosition);
      if (!wasPlaying && this.runtimes[deck].buffer) await this.playDeck(deck);
      return;
    }
    const hotCues = [...state.hotCues] as [number | null, number | null, number | null, number | null];
    hotCues[index] = this.getPosition(deck);
    this.update({ type: 'deck.patch', deck, patch: { hotCues } });
  }

  private clearHotCue(deck: DeckId, index: 0 | 1 | 2 | 3) {
    const hotCues = [...this.snapshot.decks[deck].hotCues] as [number | null, number | null, number | null, number | null];
    hotCues[index] = null;
    this.update({ type: 'deck.patch', deck, patch: { hotCues } });
  }

  private setLoopBeats(deck: DeckId, beats: 1 | 2 | 4 | 8 | 16) {
    const state = this.snapshot.decks[deck];
    if (!state.loop.enabled) {
      this.update({ type: 'deck.patch', deck, patch: { loop: { ...state.loop, beats } } });
      return;
    }
    const position = this.getPosition(deck);
    const bounds = getBeatAlignedLoop(position, state.bpm, state.beatOffsetSec, beats, state.duration);
    if (!bounds) return;
    this.update({ type: 'deck.patch', deck, patch: { loop: { enabled: true, beats, ...bounds } } });
    this.reanchorSource(deck, position);
  }

  private toggleLoop(deck: DeckId) {
    const state = this.snapshot.decks[deck];
    if (state.loop.enabled) {
      const position = this.getPosition(deck);
      this.update({
        type: 'deck.patch',
        deck,
        patch: { loop: { ...state.loop, enabled: false }, position },
      });
      this.reanchorSource(deck, position);
      return;
    }
    const bounds = getBeatAlignedLoop(
      this.getPosition(deck),
      state.bpm,
      state.beatOffsetSec,
      state.loop.beats,
      state.duration,
    );
    if (!bounds) {
      this.update({ type: 'deck.patch', deck, patch: { error: 'Set a BPM before enabling a beat loop.' } });
      return;
    }
    this.update({
      type: 'deck.patch',
      deck,
      patch: { loop: { ...state.loop, enabled: true, ...bounds }, error: null },
    });
    this.applyLoopToSource(deck);
  }

  private rebaseActiveLoop(deck: DeckId, position: number) {
    const state = this.snapshot.decks[deck];
    if (!state.loop.enabled) return;
    const bounds = getBeatAlignedLoop(
      position,
      state.bpm,
      state.beatOffsetSec,
      state.loop.beats,
      state.duration,
    );
    if (!bounds) return;
    this.update({ type: 'deck.patch', deck, patch: { loop: { ...state.loop, ...bounds }, position } });
    this.reanchorSource(deck, position);
  }

  private reanchorSource(deck: DeckId, position: number) {
    const runtime = this.runtimes[deck];
    runtime.startOffset = position;
    if (this.snapshot.decks[deck].status === 'playing' && this.audioContext) {
      this.startSource(deck, position, this.audioContext.currentTime + 0.005);
    } else {
      this.update({ type: 'deck.patch', deck, patch: { position } });
    }
  }

  private applyLoopToSource(deck: DeckId) {
    const source = this.runtimes[deck].source;
    if (!source) return;
    const loop = this.snapshot.decks[deck].loop;
    source.loop = loop.enabled && loop.start !== null && loop.end !== null;
    if (source.loop && loop.start !== null && loop.end !== null) {
      source.loopStart = loop.start;
      source.loopEnd = loop.end;
    }
  }

  private async toggleSync(deck: DeckId) {
    const state = this.snapshot.decks[deck];
    const other = otherDeck(deck);
    const otherState = this.snapshot.decks[other];
    if (!state.bpm) {
      this.update({ type: 'deck.patch', deck, patch: { error: 'Set a BPM before enabling sync.' } });
      return;
    }

    if (state.synced) {
      this.update({ type: 'deck.patch', deck, patch: { synced: false } });
      return;
    }

    let tempoPercent = state.tempoPercent;
    if (otherState.status === 'playing' && otherState.bpm) {
      const targetBpm = getEffectiveBpm(otherState.bpm, otherState.tempoPercent);
      if (targetBpm) tempoPercent = getSyncedTempoPercent(state.bpm, targetBpm);
    }
    this.update({ type: 'deck.patch', deck, patch: { synced: true, tempoPercent, error: null } });

    if (state.status === 'playing' && this.audioContext) {
      const position = this.getPosition(deck);
      const masterPlaybackRate = 1 + otherState.tempoPercent / 100;
      const wait = otherState.status === 'playing' && otherState.bpm
        ? contextSecondsUntilNextBeat(
          this.getPosition(other),
          otherState.bpm,
          otherState.beatOffsetSec,
          masterPlaybackRate,
        )
        : 0;
      const alignedPosition = Math.min(
        getNextBeatPosition(position, state.bpm, state.beatOffsetSec),
        Math.max(0, state.duration - 0.01),
      );
      this.startSource(
        deck,
        alignedPosition,
        this.audioContext.currentTime + wait,
        wait > 0,
      );
    }
  }

  private setEq(deck: DeckId, band: 'low' | 'mid' | 'high', value: number) {
    const nextValue = clamp(value, -24, 6);
    const runtime = this.runtimes[deck];
    const node = band === 'low' ? runtime.lowEq : band === 'mid' ? runtime.midEq : runtime.highEq;
    if (node && this.audioContext) node.gain.setTargetAtTime(nextValue, this.audioContext.currentTime, 0.01);
    this.update({
      type: 'deck.patch',
      deck,
      patch: { eq: { ...this.snapshot.decks[deck].eq, [band]: nextValue } },
    });
  }

  private setFilter(deck: DeckId, value: number) {
    const filter = clamp(value, -1, 1);
    const runtime = this.runtimes[deck];
    if (this.audioContext && runtime.lowPass && runtime.highPass) {
      const now = this.audioContext.currentTime;
      const lowPassFrequency = filter < 0 ? 22000 * Math.pow(250 / 22000, Math.abs(filter)) : 22000;
      const highPassFrequency = filter > 0 ? 20 * Math.pow(5000 / 20, filter) : 20;
      runtime.lowPass.frequency.setTargetAtTime(lowPassFrequency, now, 0.015);
      runtime.highPass.frequency.setTargetAtTime(highPassFrequency, now, 0.015);
    }
    this.update({ type: 'deck.patch', deck, patch: { filter } });
  }

  private setEcho(deck: DeckId, time: number, wet: number) {
    const echo = {
      time: clamp(time, 0.06, 0.48),
      wet: clamp(wet, 0, 0.72),
    };
    const runtime = this.runtimes[deck];
    if (this.audioContext && runtime.delay && runtime.wetGain && runtime.feedbackGain) {
      const now = this.audioContext.currentTime;
      runtime.delay.delayTime.setTargetAtTime(echo.time, now, 0.015);
      runtime.wetGain.gain.setTargetAtTime(echo.wet, now, 0.015);
      runtime.feedbackGain.gain.setTargetAtTime(0.24 + echo.wet * 0.48, now, 0.02);
    }
    this.update({ type: 'deck.patch', deck, patch: { echo } });
  }

  private resetEchoGraph(deck: DeckId, context: AudioContext) {
    const runtime = this.runtimes[deck];
    if (!runtime.highPass || !runtime.channelGain || !runtime.delay || !runtime.feedbackGain || !runtime.wetGain) return;

    try {
      runtime.highPass.disconnect(runtime.delay);
    } catch {
      // The effect branch may not have been connected yet.
    }
    runtime.delay.disconnect();
    runtime.feedbackGain.disconnect();
    runtime.wetGain.disconnect();

    runtime.delay = context.createDelay(0.8);
    runtime.feedbackGain = context.createGain();
    runtime.wetGain = context.createGain();
    runtime.delay.delayTime.value = this.snapshot.decks[deck].echo.time;
    runtime.feedbackGain.gain.value = 0.24;
    runtime.wetGain.gain.value = 0;
    runtime.highPass.connect(runtime.delay).connect(runtime.wetGain).connect(runtime.channelGain);
    runtime.delay.connect(runtime.feedbackGain).connect(runtime.delay);
  }

  private setLevel(deck: DeckId, value: number) {
    const level = clamp(value, 0, 1);
    const runtime = this.runtimes[deck];
    if (runtime.channelGain && this.audioContext) {
      runtime.channelGain.gain.setTargetAtTime(level, this.audioContext.currentTime, 0.01);
    }
    this.update({ type: 'deck.patch', deck, patch: { level } });
  }

  private setCrossfader(value: number) {
    this.update({ type: 'mixer.patch', patch: { crossfader: clamp(value, -1, 1) } });
    this.applyCrossfade();
  }

  private applyCrossfade() {
    const gains = getCrossfadeGains(this.snapshot.crossfader);
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    for (const deck of ['A', 'B'] as const) {
      this.runtimes[deck].crossfadeGain?.gain.setTargetAtTime(gains[deck], now, 0.01);
    }
  }

  private setMaster(value: number) {
    const masterLevel = clamp(value, 0, 1);
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.setTargetAtTime(masterLevel, this.audioContext.currentTime, 0.01);
    }
    this.update({ type: 'mixer.patch', patch: { masterLevel } });
  }

  private async toggleOutput() {
    const playingDecks = (['A', 'B'] as const).filter((deck) => this.snapshot.decks[deck].status === 'playing');
    if (playingDecks.length > 0) {
      this.pausedByMaster = new Set(playingDecks);
      for (const deck of playingDecks) this.pauseDeck(deck);
      this.update({ type: 'mixer.patch', patch: { outputPaused: true } });
      return;
    }

    const decksToResume = this.pausedByMaster.size > 0
      ? [...this.pausedByMaster]
      : [this.snapshot.focusedDeck];
    this.pausedByMaster.clear();
    await Promise.all(decksToResume.map((deck) => this.playDeck(deck)));
    this.update({ type: 'mixer.patch', patch: { outputPaused: false } });
  }

  private getDominantDeck(): DeckId {
    return getDominantDeck(
      this.snapshot.crossfader,
      this.snapshot.decks.A.level,
      this.snapshot.decks.B.level,
      this.snapshot.focusedDeck,
    );
  }

  private async endSet() {
    const deckAPlaying = this.snapshot.decks.A.status === 'playing';
    const deckBPlaying = this.snapshot.decks.B.status === 'playing';
    const dominant = deckAPlaying && !deckBPlaying
      ? 'A'
      : deckBPlaying && !deckAPlaying
        ? 'B'
        : deckAPlaying && deckBPlaying
          ? this.getDominantDeck()
          : 'A';
    const muted = otherDeck(dominant);
    this.setCrossfader(dominant === 'A' ? -1 : 1);
    await delay(160);
    if (this.snapshot.decks[muted].status === 'playing') this.pauseDeck(muted);
    this.update({ type: 'mixer.patch', patch: { focusedDeck: dominant, masterDeck: this.snapshot.decks[dominant].status === 'playing' ? dominant : null } });
    this.update({ type: 'mode.end' });
  }

  private tick = () => {
    if (this.destroyed) return;
    for (const deck of ['A', 'B'] as const) {
      const state = this.snapshot.decks[deck];
      if (state.status !== 'playing') continue;
      const position = this.getPosition(deck);
      const peak = getPeak(this.runtimes[deck].analyser);
      if (position >= state.duration && state.duration > 0) {
        this.pauseDeck(deck);
      } else {
        this.update({ type: 'deck.patch', deck, patch: { position, peak } });
      }
    }

    const masterPeak = getPeak(this.masterAnalyser);
    const limiterReductionDb = Math.abs(this.compressor?.reduction ?? 0);
    if (masterPeak !== this.snapshot.masterPeak || limiterReductionDb !== this.snapshot.limiterReductionDb) {
      this.update({ type: 'mixer.patch', patch: { masterPeak, limiterReductionDb } });
    }
  };
}
