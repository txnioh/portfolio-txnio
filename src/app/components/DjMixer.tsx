'use client';

import {
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDjMixer } from '../dj/DjMixerContext';
import {
  getLibraryTracks,
  type LibraryFilter,
  type LibrarySort,
} from '../dj/libraryView';
import { getEffectiveBpm } from '../dj/mixerMath';
import type { DeckId, DeckState, DjDispatch, LoopBeats } from '../dj/types';
import { djTracks } from '../music';

const LOOP_LENGTHS: readonly LoopBeats[] = [1, 2, 4, 8, 16];
const DECK_IDS: readonly DeckId[] = ['A', 'B'];
type FxMode = 'echo' | 'filter';

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '--:--';
  const safeSeconds = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, '0')}`;
}

function releaseCapturedPointer<T extends HTMLElement>(event: PointerEvent<T>) {
  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }
}

function pointerAngle(event: PointerEvent<HTMLButtonElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  return Math.atan2(
    event.clientY - (rect.top + rect.height / 2),
    event.clientX - (rect.left + rect.width / 2),
  );
}

function Waveform({ deck, dispatch }: { deck: DeckState; dispatch: DjDispatch }) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const bars = useMemo(() => {
    if (deck.waveform.length <= 96) return deck.waveform;
    const stride = deck.waveform.length / 96;
    return Array.from({ length: 96 }, (_, index) => deck.waveform[Math.floor(index * stride)] ?? 0);
  }, [deck.waveform]);
  const progress = deck.duration > 0 ? Math.min(deck.position / deck.duration, 1) : 0;
  const visibleBars = bars.length > 0
    ? bars
    : Array.from({ length: 72 }, (_, index) => 0.1 + ((index * 7) % 13) / 18);

  const seekFromClientX = (clientX: number) => {
    const waveform = waveformRef.current;
    if (!waveform || deck.duration <= 0) return;
    const rect = waveform.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    void dispatch({ type: 'deck.seek', deck: deck.id, seconds: ratio * deck.duration });
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (event.key === 'ArrowLeft') next = deck.position - 4;
    else if (event.key === 'ArrowRight') next = deck.position + 4;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = deck.duration;
    if (next === null) return;
    event.preventDefault();
    void dispatch({ type: 'deck.seek', deck: deck.id, seconds: next });
  };

  return (
    <div
      ref={waveformRef}
      className={`ydj-waveform${deck.status === 'loading' ? ' is-loading' : ''}`}
      role="slider"
      tabIndex={deck.duration > 0 ? 0 : -1}
      aria-label={`Deck ${deck.id} track position`}
      aria-valuemin={0}
      aria-valuemax={Math.round(deck.duration)}
      aria-valuenow={Math.round(deck.position)}
      aria-valuetext={`${formatTime(deck.position)} of ${formatTime(deck.duration)}`}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        seekFromClientX(event.clientX);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) seekFromClientX(event.clientX);
      }}
      onPointerUp={releaseCapturedPointer}
      onPointerCancel={releaseCapturedPointer}
      onKeyDown={onKeyDown}
    >
      <span className="ydj-waveform-start" aria-hidden="true" />
      <div className="ydj-waveform-bars" aria-hidden="true">
        {visibleBars.map((peak, index) => (
          <i
            key={`${deck.id}-${index}`}
            className={index / Math.max(visibleBars.length - 1, 1) <= progress ? 'is-played' : ''}
            style={{ height: `${Math.max(12, peak * 100)}%` }}
          />
        ))}
      </div>
      <span className="ydj-playhead" aria-hidden="true" style={{ left: `${progress * 100}%` }} />
    </div>
  );
}

function Knob({
  label,
  value,
  min,
  max,
  step,
  display,
  resetValue,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  resetValue?: number;
  onChange: (value: number) => void;
}) {
  const gestureRef = useRef({ originX: 0, originY: 0, originValue: value });
  const rotation = -135 + ((value - min) / (max - min)) * 270;
  const updateValue = (nextValue: number) => {
    const clamped = Math.min(Math.max(nextValue, min), max);
    const stepped = Number((Math.round(clamped / step) * step).toFixed(4));
    onChange(stepped);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') next = value + step;
    else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') next = value - step;
    else if (event.key === 'PageUp') next = value + step * 5;
    else if (event.key === 'PageDown') next = value - step * 5;
    else if (event.key === 'Home') next = min;
    else if (event.key === 'End') next = max;
    if (next === null) return;
    event.preventDefault();
    updateValue(next);
  };

  return (
    <div className="ydj-knob">
      <div
        className="ydj-knob-dial"
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={display}
        title={`${label}: ${display}. Drag up or down; double-click to reset.`}
        style={{ '--knob-rotation': `${rotation}deg` } as CSSProperties}
        onPointerDown={(event) => {
          event.currentTarget.focus();
          event.currentTarget.setPointerCapture(event.pointerId);
          gestureRef.current = {
            originX: event.clientX,
            originY: event.clientY,
            originValue: value,
          };
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
          const vertical = gestureRef.current.originY - event.clientY;
          const horizontal = (event.clientX - gestureRef.current.originX) * 0.35;
          updateValue(gestureRef.current.originValue + ((vertical + horizontal) / 140) * (max - min));
        }}
        onPointerUp={releaseCapturedPointer}
        onPointerCancel={releaseCapturedPointer}
        onDoubleClick={() => updateValue(resetValue ?? (min <= 0 && max >= 0 ? 0 : min))}
        onKeyDown={onKeyDown}
      >
        <i aria-hidden="true" />
      </div>
      <span>{label}</span>
    </div>
  );
}

function FxPad({ deck, mode, dispatch }: { deck: DeckState; mode: FxMode; dispatch: DjDispatch }) {
  const padRef = useRef<HTMLDivElement>(null);
  const x = mode === 'echo' ? (deck.echo.time - 0.06) / 0.42 : (deck.filter + 1) / 2;
  const y = mode === 'echo' ? 1 - deck.echo.wet / 0.72 : 0.5;

  const update = (clientX: number, clientY: number) => {
    const pad = padRef.current;
    if (!pad) return;
    const rect = pad.getBoundingClientRect();
    const nextX = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const nextY = Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);
    if (mode === 'echo') {
      void dispatch({
        type: 'deck.setEcho',
        deck: deck.id,
        time: 0.06 + nextX * 0.42,
        wet: (1 - nextY) * 0.72,
      });
    } else {
      void dispatch({ type: 'deck.setFilter', deck: deck.id, value: nextX * 2 - 1 });
    }
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (mode === 'filter') {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home') return;
      event.preventDefault();
      const value = event.key === 'Home' ? 0 : deck.filter + (event.key === 'ArrowRight' ? 0.05 : -0.05);
      void dispatch({ type: 'deck.setFilter', deck: deck.id, value });
      return;
    }
    let time = deck.echo.time;
    let wet = deck.echo.wet;
    if (event.key === 'ArrowLeft') time -= 0.02;
    else if (event.key === 'ArrowRight') time += 0.02;
    else if (event.key === 'ArrowUp') wet += 0.05;
    else if (event.key === 'ArrowDown') wet -= 0.05;
    else if (event.key === 'Home') wet = 0;
    else return;
    event.preventDefault();
    void dispatch({ type: 'deck.setEcho', deck: deck.id, time, wet });
  };

  return (
    <div
      ref={padRef}
      className="ydj-fx-pad"
      role="slider"
      tabIndex={0}
      aria-label={`Deck ${deck.id} ${mode} touch pad`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(x * 100)}
      aria-valuetext={mode === 'echo'
        ? `${Math.round(deck.echo.time * 1000)} milliseconds, ${Math.round(deck.echo.wet * 100)} percent wet`
        : deck.filter === 0 ? 'Filter open' : deck.filter < 0 ? 'Low-pass filter' : 'High-pass filter'}
      style={{ '--fx-x': `${x * 100}%`, '--fx-y': `${y * 100}%` } as CSSProperties}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        update(event.clientX, event.clientY);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) update(event.clientX, event.clientY);
      }}
      onPointerUp={releaseCapturedPointer}
      onPointerCancel={releaseCapturedPointer}
      onKeyDown={onKeyDown}
    >
      <span aria-hidden="true" />
    </div>
  );
}

function Platter({ deck, dispatch }: { deck: DeckState; dispatch: DjDispatch }) {
  const gestureRef = useRef({
    active: false,
    lastAngle: 0,
    accumulated: 0,
    pendingDelta: 0,
    originPosition: 0,
    lastUpdate: 0,
    lastPointerAt: 0,
  });
  const progress = deck.duration > 0 ? Math.min(deck.position / deck.duration, 1) : 0;
  const isPlaying = deck.status === 'playing';
  const movePlatter = (event: PointerEvent<HTMLButtonElement>) => {
    if (!gestureRef.current.active || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const angle = pointerAngle(event);
    let delta = angle - gestureRef.current.lastAngle;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;
    gestureRef.current.lastAngle = angle;
    gestureRef.current.accumulated += delta;
    gestureRef.current.pendingDelta += delta;
    if (event.timeStamp - gestureRef.current.lastUpdate < 24) return;
    const elapsedSeconds = Math.max(0.016, (event.timeStamp - gestureRef.current.lastPointerAt) / 1000);
    const scratchRate = (gestureRef.current.pendingDelta / (Math.PI * 2)) * 1.8 / elapsedSeconds;
    gestureRef.current.pendingDelta = 0;
    gestureRef.current.lastUpdate = event.timeStamp;
    gestureRef.current.lastPointerAt = event.timeStamp;
    void dispatch({
      type: 'deck.scratch',
      deck: deck.id,
      seconds: gestureRef.current.originPosition + (gestureRef.current.accumulated / (Math.PI * 2)) * 1.8,
      rate: scratchRate,
    });
  };
  const finishGesture = (event: PointerEvent<HTMLButtonElement>) => {
    if (!gestureRef.current.active) return;
    movePlatter(event);
    gestureRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    void dispatch({ type: 'deck.endJog', deck: deck.id });
  };

  return (
    <button
      type="button"
      className={`ydj-platter${isPlaying ? ' is-playing' : ''}${deck.jogging ? ' is-grabbed' : ''}`}
      disabled={!deck.track || deck.status === 'loading'}
      aria-label={`Deck ${deck.id} record. Touch and turn to scratch.`}
      style={{
        '--deck-progress': `${progress * 360}deg`,
        '--disc-angle': `${deck.position * 92}deg`,
      } as CSSProperties}
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        gestureRef.current = {
          active: true,
          lastAngle: pointerAngle(event),
          accumulated: 0,
          pendingDelta: 0,
          originPosition: deck.position,
          lastUpdate: 0,
          lastPointerAt: event.timeStamp,
        };
        void dispatch({ type: 'deck.startJog', deck: deck.id });
      }}
      onPointerMove={movePlatter}
      onPointerUp={finishGesture}
      onPointerCancel={finishGesture}
      onKeyDown={(event) => {
        if (event.repeat || (event.key !== ' ' && event.key !== 'Enter')) return;
        event.preventDefault();
        void dispatch({ type: 'deck.toggle', deck: deck.id });
      }}
    >
      <span className="ydj-record">
        <span
          className="ydj-record-label"
          style={deck.track?.cover ? { backgroundImage: `url(${deck.track.cover})` } : undefined}
        >
          <i>{deck.id}</i>
        </span>
      </span>
      <span className="ydj-hand" aria-hidden="true">GRAB</span>
    </button>
  );
}

function DeckStrip({
  deck,
  isMaster,
  isTarget,
  dispatch,
  onSelectTarget,
}: {
  deck: DeckState;
  isMaster: boolean;
  isTarget: boolean;
  dispatch: DjDispatch;
  onSelectTarget: () => void;
}) {
  const effectiveBpm = getEffectiveBpm(deck.bpm, deck.tempoPercent);
  return (
    <div className="ydj-track-strip">
      <div className="ydj-track-line">
        <button type="button" className={isTarget ? 'is-target' : ''} onClick={onSelectTarget}>
          DECK {deck.id}{isMaster ? ' · MASTER' : ''}
        </button>
        <strong title={deck.track ? `${deck.track.artist} — ${deck.track.title}` : undefined}>
          {deck.status === 'loading' ? 'Loading audio…' : deck.track ? `${deck.track.artist} — ${deck.track.title}` : 'Load a song from the library below'}
        </strong>
        <span>{formatTime(deck.position)} / {formatTime(deck.duration)}</span>
        <i className={deck.status === 'playing' ? 'is-live' : ''} aria-hidden="true" />
      </div>
      <Waveform deck={deck} dispatch={dispatch} />
      <p className="ydj-track-error" aria-live="polite" title={deck.error ?? undefined}>
        {deck.error && (
          <><span aria-hidden="true">!</span><span className="dj-visually-hidden">{deck.error}</span></>
        )}
      </p>
      <span className="ydj-track-bpm">{effectiveBpm ? `${effectiveBpm.toFixed(1)} BPM` : 'BPM —'}</span>
    </div>
  );
}

function DeckTransport({
  deck,
  mode,
  dispatch,
  onModeChange,
}: {
  deck: DeckState;
  mode: FxMode;
  dispatch: DjDispatch;
  onModeChange: (mode: FxMode) => void;
}) {
  const loopIndex = LOOP_LENGTHS.indexOf(deck.loop.beats);
  const changeLoop = (direction: -1 | 1) => {
    const index = Math.min(Math.max(loopIndex + direction, 0), LOOP_LENGTHS.length - 1);
    void dispatch({ type: 'deck.setLoopBeats', deck: deck.id, value: LOOP_LENGTHS[index] });
  };

  return (
    <div className="ydj-transport" data-slot="button-group">
      <button
        type="button"
        className={`ydj-sync-button${deck.synced ? ' is-active' : ''}`}
        data-slot="toggle"
        disabled={!deck.bpm}
        aria-pressed={deck.synced}
        onClick={() => void dispatch({ type: 'deck.toggleSync', deck: deck.id })}
      >SYNC</button>
      <div className="ydj-fx-select" data-slot="toggle-group" role="group" aria-label={`Deck ${deck.id} effect`}>
        <button type="button" data-slot="toggle-group-item" className={mode === 'echo' ? 'is-active' : ''} aria-pressed={mode === 'echo'} onClick={() => onModeChange('echo')}>ECHO</button>
        <button type="button" data-slot="toggle-group-item" className={mode === 'filter' ? 'is-active' : ''} aria-pressed={mode === 'filter'} onClick={() => onModeChange('filter')}>FILTER</button>
      </div>
      <div className="ydj-loop" data-slot="button-group" aria-label={`Deck ${deck.id} beat loop`}>
        <button type="button" disabled={loopIndex === 0} aria-label="Shorter loop" onClick={() => changeLoop(-1)}>−</button>
        <button
          type="button"
          className={deck.loop.enabled ? 'is-active' : ''}
          disabled={!deck.bpm || deck.duration <= 0}
          aria-pressed={deck.loop.enabled}
          onClick={() => void dispatch({ type: 'deck.toggleLoop', deck: deck.id })}
        >
          ↻ <strong>{deck.loop.beats}</strong>
        </button>
        <button type="button" disabled={loopIndex === LOOP_LENGTHS.length - 1} aria-label="Longer loop" onClick={() => changeLoop(1)}>+</button>
      </div>
      <button
        type="button"
        className={`ydj-play${deck.status === 'playing' ? ' is-playing' : ''}`}
        disabled={!deck.track || deck.status === 'loading'}
        aria-label={`${deck.status === 'playing' ? 'Pause' : 'Play'} deck ${deck.id}`}
        onClick={() => void dispatch({ type: 'deck.toggle', deck: deck.id })}
      >
        {deck.status === 'playing' ? 'Ⅱ' : '▶'}
      </button>
    </div>
  );
}

function Deck({
  deck,
  isMaster,
  isTarget,
  mode,
  dispatch,
  onSelectTarget,
  onModeChange,
}: {
  deck: DeckState;
  isMaster: boolean;
  isTarget: boolean;
  mode: FxMode;
  dispatch: DjDispatch;
  onSelectTarget: () => void;
  onModeChange: (mode: FxMode) => void;
}) {
  return (
    <section className={`ydj-deck is-${deck.id.toLowerCase()}`} data-slot="card" data-surface="secondary" aria-label={`Deck ${deck.id}`}>
      <DeckStrip deck={deck} isMaster={isMaster} isTarget={isTarget} dispatch={dispatch} onSelectTarget={onSelectTarget} />
      <div className="ydj-deck-body">
        <FxPad deck={deck} mode={mode} dispatch={dispatch} />
        <Platter deck={deck} dispatch={dispatch} />
      </div>
      <DeckTransport
        deck={deck}
        mode={mode}
        dispatch={dispatch}
        onModeChange={onModeChange}
      />
    </section>
  );
}

function ChannelFader({ deck, value, peak, onChange }: { deck: DeckId; value: number; peak: number; onChange: (value: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const update = (clientY: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    onChange(Math.min(Math.max(1 - (clientY - rect.top) / rect.height, 0), 1));
  };

  return (
    <div className="ydj-channel-fader">
      <span>{deck}</span>
      <div
        ref={trackRef}
        className="ydj-channel-fader-track"
        role="slider"
        tabIndex={0}
        aria-label={`Deck ${deck} channel fader`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          update(event.clientY);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) update(event.clientY);
        }}
        onPointerUp={releaseCapturedPointer}
        onPointerCancel={releaseCapturedPointer}
        onDoubleClick={() => onChange(0.82)}
        onKeyDown={(event) => {
          if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          onChange(event.key === 'Home' ? 0 : event.key === 'End' ? 1 : value + (event.key === 'ArrowUp' ? 0.05 : -0.05));
        }}
      >
        <b style={{ top: `${6.5 + (1 - value) * 81}px` }} aria-hidden="true" />
      </div>
      <i className={peak > 0.96 ? 'is-hot' : ''} aria-hidden="true">
        <b style={{ height: `${Math.max(2, Math.min(100, peak * 100))}%` }} />
      </i>
    </div>
  );
}

function Mixer({ dispatch }: { dispatch: DjDispatch }) {
  const [state] = useDjMixer((snapshot) => snapshot);
  const masterBpm = state.masterDeck
    ? getEffectiveBpm(state.decks[state.masterDeck].bpm, state.decks[state.masterDeck].tempoPercent)
    : null;

  return (
    <aside className="ydj-mixer" data-slot="card" data-surface="card" aria-label="Mixer">
      <div className="ydj-bpm" aria-label={`${masterBpm ? masterBpm.toFixed(0) : 'Unknown'} master BPM`}>
        <span>{masterBpm ? masterBpm.toFixed(0) : '—'}</span> BPM
      </div>
      <div className="ydj-mixer-body">
        {DECK_IDS.map((deckId) => (
          <div key={deckId} className={`ydj-channel-strip is-${deckId.toLowerCase()}`}>
            <div className="ydj-channel-tone">
              <Knob
                label="Mid"
                value={state.decks[deckId].eq.mid}
                min={-24}
                max={6}
                step={1}
                display={`${state.decks[deckId].eq.mid} dB`}
                onChange={(value) => void dispatch({ type: 'deck.setEq', deck: deckId, band: 'mid', value })}
              />
              <Knob
                label="Bass"
                value={state.decks[deckId].eq.low}
                min={-24}
                max={6}
                step={1}
                display={`${state.decks[deckId].eq.low} dB`}
                onChange={(value) => void dispatch({ type: 'deck.setEq', deck: deckId, band: 'low', value })}
              />
              <Knob
                label="Filter"
                value={state.decks[deckId].filter}
                min={-1}
                max={1}
                step={0.01}
                display={state.decks[deckId].filter === 0 ? 'Open' : state.decks[deckId].filter < 0 ? 'Low-pass' : 'High-pass'}
                onChange={(value) => void dispatch({ type: 'deck.setFilter', deck: deckId, value })}
              />
            </div>
            <ChannelFader
              deck={deckId}
              value={state.decks[deckId].level}
              peak={state.decks[deckId].peak}
              onChange={(value) => void dispatch({ type: 'deck.setLevel', deck: deckId, value })}
            />
          </div>
        ))}
      </div>
      <div className="ydj-crossfader">
        <CrossfaderPad value={state.crossfader} onChange={(value) => void dispatch({ type: 'mixer.setCrossfader', value })} />
      </div>
    </aside>
  );
}

function CrossfaderPad({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const padRef = useRef<HTMLDivElement>(null);
  const update = (clientX: number) => {
    const pad = padRef.current;
    if (!pad) return;
    const rect = pad.getBoundingClientRect();
    onChange(Math.min(Math.max(((clientX - rect.left) / rect.width) * 2 - 1, -1), 1));
  };

  return (
    <div className="ydj-performance-crossfader">
      <span>A</span>
      <div
        ref={padRef}
        role="slider"
        tabIndex={0}
        aria-label="Performance crossfader"
        aria-valuemin={-1}
        aria-valuemax={1}
        aria-valuenow={value}
        aria-valuetext={value === 0 ? 'A and B' : value < 0 ? 'Toward A' : 'Toward B'}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          update(event.clientX);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) update(event.clientX);
        }}
        onPointerUp={releaseCapturedPointer}
        onPointerCancel={releaseCapturedPointer}
        onDoubleClick={() => onChange(0)}
        onKeyDown={(event) => {
          if (!['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) return;
          event.preventDefault();
          onChange(event.key === 'Home' ? 0 : value + (event.key === 'ArrowRight' ? 0.05 : -0.05));
        }}
      >
        <i style={{ left: `${((value + 1) / 2) * 100}%` }} aria-hidden="true" />
      </div>
      <span>B</span>
    </div>
  );
}

function Library({
  target,
  dispatch,
  onTargetChange,
}: {
  target: DeckId;
  dispatch: DjDispatch;
  onTargetChange: (deck: DeckId) => void;
}) {
  const [state] = useDjMixer((snapshot) => snapshot);
  const [filter, setFilter] = useState<LibraryFilter>('all');
  const [sort, setSort] = useState<LibrarySort>('set');
  const [query, setQuery] = useState('');
  const [dense, setDense] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileDeckRef = useRef<DeckId>(target);
  const tracks = useMemo(() => getLibraryTracks(djTracks, query, filter, sort), [filter, query, sort]);

  const confirmReplace = (deck: DeckId) => (
    state.decks[deck].status !== 'playing' || window.confirm(`Deck ${deck} is playing. Replace its track?`)
  );
  const loadCatalog = (deck: DeckId, trackId: string) => {
    if (!confirmReplace(deck)) return;
    onTargetChange(deck);
    void dispatch({ type: 'deck.loadCatalog', deck, trackId });
  };
  const openFile = (deck: DeckId) => {
    if (!confirmReplace(deck)) return;
    fileDeckRef.current = deck;
    onTargetChange(deck);
    fileInputRef.current?.click();
  };
  const loadFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    void dispatch({ type: 'deck.loadFile', deck: fileDeckRef.current, file });
  };

  return (
    <section className={`ydj-library${dense ? ' is-dense' : ''}`} data-slot="card" data-surface="muted" aria-label="DJ set library">
      <nav className="ydj-library-rail" data-slot="toggle-group" aria-label="Library filters">
        {([
          ['all', '★', 'SET'],
          ['available', '▶', 'READY'],
          ['pending', '+', 'ADD'],
        ] as const).map(([value, icon, label]) => (
          <button type="button" data-slot="toggle-group-item" key={value} className={filter === value ? 'is-active' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)} title={label}>
            <span>{icon}</span><small>{label}</small>
          </button>
        ))}
      </nav>
      <div className="ydj-library-main">
        <header className="ydj-library-toolbar">
          <div className="ydj-library-target" data-slot="toggle-group" aria-label="Default load target">
            {DECK_IDS.map((deck) => <button type="button" data-slot="toggle-group-item" key={deck} className={target === deck ? 'is-active' : ''} aria-pressed={target === deck} onClick={() => onTargetChange(deck)}>DECK {deck}</button>)}
          </div>
          <label className="ydj-search"><span>⌕</span><input type="search" value={query} placeholder="Search set" aria-label="Search the set" onChange={(event) => setQuery(event.currentTarget.value)} /></label>
          <button type="button" className="ydj-toolbar-button" onClick={() => setSort(sort === 'set' ? 'artist' : 'set')}>SORT · {sort === 'set' ? 'SET' : 'A–Z'}</button>
          <button type="button" className="ydj-toolbar-button is-icon" aria-label="Toggle library density" onClick={() => setDense((value) => !value)}>{dense ? '☷' : '▦'}</button>
          <button type="button" className="ydj-local-button" onClick={() => openFile(target)}>+ LOCAL AUDIO</button>
          <input ref={fileInputRef} hidden type="file" accept=".mp3,.wav,audio/mpeg,audio/wav" onChange={loadFile} />
        </header>
        <table className="ydj-track-table" aria-label={`${tracks.length} tracks`}>
          <tbody>
          {tracks.length === 0 ? <tr><td className="ydj-empty-library" colSpan={7}>No tracks match this view.</td></tr> : tracks.map((track) => (
            <tr className="ydj-track-row" key={track.id}>
              <td className="ydj-load-cell">
                {DECK_IDS.map((deck) => (
                  <button
                    type="button"
                    key={deck}
                    aria-label={`${track.available ? 'Load' : 'Choose a local file for'} ${track.artist} ${track.title} on deck ${deck}`}
                    title={`${track.available ? 'Load' : 'Add file to'} deck ${deck}`}
                    onClick={() => track.available ? loadCatalog(deck, track.id) : openFile(deck)}
                  >{deck === 'A' ? '▶' : '▷'}</button>
                ))}
              </td>
              <td className="ydj-order">{String(track.setOrder).padStart(2, '0')}</td>
              <td><strong>{track.artist}</strong></td>
              <td className="ydj-title">{track.title}</td>
              <td className="ydj-phase">{track.setPhase}</td>
              <td className="ydj-row-bpm">{track.bpm ? track.bpm.toFixed(1) : '—'}</td>
              <td className={track.available ? 'ydj-ready' : 'ydj-pending'}>{track.available ? 'READY' : 'ADD'}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function InlineDjDeck() {
  const [state, dispatch] = useDjMixer((snapshot) => snapshot);
  const [target, setTarget] = useState<DeckId>('A');
  const [fxModes, setFxModes] = useState<Record<DeckId, FxMode>>({ A: 'echo', B: 'echo' });

  const endSet = () => {
    const playing = state.decks.A.status === 'playing' || state.decks.B.status === 'playing';
    if (playing && !window.confirm('End the DJ set and return to the vinyl player?')) return;
    void dispatch({ type: 'mode.end' });
  };

  return (
    <div className="inline-dj-board ydj-board" data-slot="card" aria-label="Groovy hard techno DJ console">
      <div className="ydj-surface">
        <header className="ydj-appbar" data-slot="card-header">
          <div className="ydj-brand"><strong>TXN<span>DJ</span></strong><small>groovy hard techno console</small></div>
          <div className="ydj-app-status">
            <button type="button" className={state.outputPaused ? '' : 'is-live'} onClick={() => void dispatch({ type: 'mixer.toggleOutput' })}>
              <i aria-hidden="true" />{state.outputPaused ? 'RESUME' : 'LIVE'}
            </button>
            <button type="button" onClick={endSet}>END SET</button>
          </div>
          <div className="ydj-app-meta"><span>{state.audioStatus}</span><strong>{Math.round(state.masterLevel * 100)}</strong><small>MASTER</small></div>
        </header>
        <div className="ydj-console" data-slot="card-content">
          <Deck
            deck={state.decks.A}
            isMaster={state.masterDeck === 'A'}
            isTarget={target === 'A'}
            mode={fxModes.A}
            dispatch={dispatch}
            onSelectTarget={() => setTarget('A')}
            onModeChange={(mode) => setFxModes((current) => ({ ...current, A: mode }))}
          />
          <Mixer dispatch={dispatch} />
          <Deck
            deck={state.decks.B}
            isMaster={state.masterDeck === 'B'}
            isTarget={target === 'B'}
            mode={fxModes.B}
            dispatch={dispatch}
            onSelectTarget={() => setTarget('B')}
            onModeChange={(mode) => setFxModes((current) => ({ ...current, B: mode }))}
          />
        </div>
        <Library target={target} dispatch={dispatch} onTargetChange={setTarget} />
      </div>
      {state.audioStatus === 'blocked' && <p className="dj-visually-hidden" aria-live="polite">Audio is blocked. Press a deck control to resume.</p>}
    </div>
  );
}
