'use client';

import {
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDjMixer } from '../dj/DjMixerContext';
import { getEffectiveBpm } from '../dj/mixerMath';
import type { DeckId, DeckState, DjDispatch, LoopBeats } from '../dj/types';
import { djTracks } from '../music';

const LOOP_LENGTHS: readonly LoopBeats[] = [1, 2, 4, 8, 16];
const HOT_CUE_SLOTS = [
  { id: 'one', index: 0 },
  { id: 'two', index: 1 },
  { id: 'three', index: 2 },
  { id: 'four', index: 3 },
] as const;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '--:--';
  const safeSeconds = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, '0')}`;
}

function CompactWaveform({ deck, dispatch }: { deck: DeckState; dispatch: DjDispatch }) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const bars = useMemo(() => {
    if (deck.waveform.length <= 72) return deck.waveform;
    const stride = deck.waveform.length / 72;
    return Array.from({ length: 72 }, (_, index) => deck.waveform[Math.floor(index * stride)] ?? 0);
  }, [deck.waveform]);
  const progress = deck.duration > 0 ? Math.min(deck.position / deck.duration, 1) : 0;

  const seekFromClientX = (clientX: number) => {
    const waveform = waveformRef.current;
    if (!waveform || deck.duration <= 0) return;
    const rect = waveform.getBoundingClientRect();
    const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    void dispatch({ type: 'deck.seek', deck: deck.id, seconds: percent * deck.duration });
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    seekFromClientX(event.clientX);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) seekFromClientX(event.clientX);
  };

  const releasePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let nextPosition: number | null = null;
    if (event.key === 'ArrowLeft') nextPosition = deck.position - 4;
    if (event.key === 'ArrowRight') nextPosition = deck.position + 4;
    if (event.key === 'Home') nextPosition = 0;
    if (event.key === 'End') nextPosition = deck.duration;
    if (nextPosition === null) return;
    event.preventDefault();
    void dispatch({ type: 'deck.seek', deck: deck.id, seconds: nextPosition });
  };

  const visibleBars = bars.length > 0 ? bars : Array.from({ length: 56 }, (_, index) => (
    0.12 + ((index * 7) % 11) / 55
  ));

  return (
    <div
      ref={waveformRef}
      className={`inline-dj-waveform${deck.status === 'loading' ? ' is-loading' : ''}`}
      role="slider"
      tabIndex={deck.duration > 0 ? 0 : -1}
      aria-label={`Deck ${deck.id} track position`}
      aria-valuemin={0}
      aria-valuemax={Math.round(deck.duration)}
      aria-valuenow={Math.round(deck.position)}
      aria-valuetext={`${formatTime(deck.position)} of ${formatTime(deck.duration)}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={releasePointer}
      onPointerCancel={releasePointer}
      onKeyDown={onKeyDown}
    >
      <div className="inline-dj-waveform-bars" aria-hidden="true">
        {visibleBars.map((peak, index) => (
          <i
            key={`${deck.id}-${index}`}
            className={index / Math.max(visibleBars.length - 1, 1) <= progress ? 'is-played' : ''}
            style={{ height: `${Math.max(12, peak * 100)}%` }}
          />
        ))}
      </div>
      <span className="inline-dj-playhead" aria-hidden="true" style={{ left: `${progress * 100}%` }} />
    </div>
  );
}

function InlineKnob({
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
  const gestureRef = useRef({ pointerId: -1, originX: 0, originY: 0, originValue: value });
  const rotation = -135 + ((value - min) / (max - min)) * 270;
  const updateValue = (nextValue: number) => {
    const clamped = Math.min(Math.max(nextValue, min), max);
    const stepped = Number((Math.round(clamped / step) * step).toFixed(4));
    onChange(stepped);
  };
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    gestureRef.current = {
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      originValue: value,
    };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const vertical = gestureRef.current.originY - event.clientY;
    const horizontal = (event.clientX - gestureRef.current.originX) * 0.35;
    updateValue(gestureRef.current.originValue + ((vertical + horizontal) / 140) * (max - min));
  };
  const releasePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let nextValue: number | null = null;
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') nextValue = value + step;
    else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') nextValue = value - step;
    else if (event.key === 'PageUp') nextValue = value + step * 5;
    else if (event.key === 'PageDown') nextValue = value - step * 5;
    else if (event.key === 'Home') nextValue = min;
    else if (event.key === 'End') nextValue = max;
    if (nextValue === null) return;
    event.preventDefault();
    updateValue(nextValue);
  };
  const neutralValue = resetValue ?? (min <= 0 && max >= 0 ? 0 : min);

  return (
    <div className="inline-dj-knob">
      <span>{label}</span>
      <div
        className="inline-dj-knob-dial"
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={display}
        title="Drag up/down · double-click to reset"
        style={{ '--knob-rotation': `${rotation}deg` } as CSSProperties}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={releasePointer}
        onPointerCancel={releasePointer}
        onDoubleClick={() => updateValue(neutralValue)}
        onKeyDown={onKeyDown}
      >
        <b aria-hidden="true" />
      </div>
      <output>{display}</output>
    </div>
  );
}

function EchoPad({ deck, dispatch }: { deck: DeckState; dispatch: DjDispatch }) {
  const padRef = useRef<HTMLDivElement>(null);
  const x = (deck.echo.time - 0.06) / 0.42;
  const y = 1 - deck.echo.wet / 0.72;

  const setFromPointer = (clientX: number, clientY: number) => {
    const pad = padRef.current;
    if (!pad) return;
    const rect = pad.getBoundingClientRect();
    const nextX = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const nextY = Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);
    void dispatch({
      type: 'deck.setEcho',
      deck: deck.id,
      time: 0.06 + nextX * 0.42,
      wet: (1 - nextY) * 0.72,
    });
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setFromPointer(event.clientX, event.clientY);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      setFromPointer(event.clientX, event.clientY);
    }
  };
  const releasePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
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
    <div className="inline-dj-echo-control">
      <span>ECHO PAD</span>
      <div
        ref={padRef}
        className="inline-dj-echo-pad"
        role="slider"
        tabIndex={0}
        aria-label={`Deck ${deck.id} echo pad. Horizontal controls delay time, vertical controls amount`}
        aria-valuemin={0}
        aria-valuemax={72}
        aria-valuenow={Math.round(deck.echo.wet * 100)}
        aria-valuetext={`${Math.round(deck.echo.wet * 100)} percent at ${Math.round(deck.echo.time * 1000)} milliseconds`}
        style={{ '--echo-x': `${x * 100}%`, '--echo-y': `${y * 100}%` } as CSSProperties}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={releasePointer}
        onPointerCancel={releasePointer}
        onKeyDown={onKeyDown}
      >
        <i aria-hidden="true" />
      </div>
      <output>{Math.round(deck.echo.wet * 100)} · {Math.round(deck.echo.time * 1000)} ms</output>
    </div>
  );
}

function PerformanceControls({ deck, dispatch }: { deck: DeckState; dispatch: DjDispatch }) {
  const loopIndex = LOOP_LENGTHS.indexOf(deck.loop.beats);
  const changeLoopLength = (direction: -1 | 1) => {
    const nextIndex = Math.min(Math.max(loopIndex + direction, 0), LOOP_LENGTHS.length - 1);
    void dispatch({ type: 'deck.setLoopBeats', deck: deck.id, value: LOOP_LENGTHS[nextIndex] });
  };
  const setNudge = (value: -1 | 0 | 1) => {
    void dispatch({ type: 'deck.setNudge', deck: deck.id, value });
  };
  const nudgeKeyDown = (event: KeyboardEvent<HTMLButtonElement>, value: -1 | 1) => {
    if (event.key !== ' ' && event.key !== 'Enter') return;
    event.preventDefault();
    setNudge(value);
  };

  return (
    <div className="inline-dj-performance" aria-label={`Deck ${deck.id} performance controls`}>
      <div className="inline-dj-hot-cues" aria-label="Hot cues">
        {HOT_CUE_SLOTS.map((slot) => {
          const cue = deck.hotCues[slot.index];
          return (
          <button
            type="button"
            key={slot.id}
            className={cue === null ? '' : 'is-set'}
            disabled={deck.duration <= 0}
            aria-label={cue === null
              ? `Set hot cue ${slot.index + 1} on deck ${deck.id}`
              : `Jump to hot cue ${slot.index + 1} at ${formatTime(cue)} on deck ${deck.id}`}
            onClick={() => void dispatch({
              type: 'deck.hotCue',
              deck: deck.id,
              index: slot.index,
            })}
          >
            <span>{slot.index + 1}</span>
            <small>{cue === null ? 'set' : formatTime(cue)}</small>
          </button>
          );
        })}
      </div>
      <div className="inline-dj-performance-tools">
        <div className="inline-dj-loop-controls" aria-label="Beat loop">
          <button type="button" disabled={loopIndex === 0} aria-label="Shorter loop" onClick={() => changeLoopLength(-1)}>−</button>
          <button
            type="button"
            className={deck.loop.enabled ? 'is-active' : ''}
            disabled={!deck.bpm || deck.duration <= 0}
            aria-pressed={deck.loop.enabled}
            onClick={() => void dispatch({ type: 'deck.toggleLoop', deck: deck.id })}
          >
            loop <strong>{deck.loop.beats}</strong>
          </button>
          <button type="button" disabled={loopIndex === LOOP_LENGTHS.length - 1} aria-label="Longer loop" onClick={() => changeLoopLength(1)}>+</button>
        </div>
        <div className="inline-dj-nudge-controls" aria-label="Pitch bend">
          {([-1, 1] as const).map((direction) => (
            <button
              type="button"
              key={direction}
              className={deck.nudge === direction ? 'is-active' : ''}
              aria-label={`${direction < 0 ? 'Slow down' : 'Speed up'} deck ${deck.id} while held`}
              onPointerDown={() => setNudge(direction)}
              onPointerUp={() => setNudge(0)}
              onPointerCancel={() => setNudge(0)}
              onPointerLeave={() => setNudge(0)}
              onKeyDown={(event) => nudgeKeyDown(event, direction)}
              onKeyUp={() => setNudge(0)}
              onBlur={() => setNudge(0)}
            >
              {direction < 0 ? '−' : '+'}<small>bend</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function HardwareDeck({
  deck,
  isMaster,
  dispatch,
  onOpenTone,
}: {
  deck: DeckState;
  isMaster: boolean;
  dispatch: DjDispatch;
  onOpenTone: () => void;
}) {
  const jogRef = useRef({ pointerId: -1, originX: 0, originPosition: 0, dragged: false, lastUpdate: 0 });
  const progress = deck.duration > 0 ? Math.min(deck.position / deck.duration, 1) : 0;
  const effectiveBpm = getEffectiveBpm(deck.bpm, deck.tempoPercent);
  const isPlaying = deck.status === 'playing';

  const onJogPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    jogRef.current = {
      pointerId: event.pointerId,
      originX: event.clientX,
      originPosition: deck.position,
      dragged: false,
      lastUpdate: 0,
    };
  };
  const onJogPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const movement = event.clientX - jogRef.current.originX;
    if (Math.abs(movement) < 4) return;
    if (!jogRef.current.dragged) {
      jogRef.current.dragged = true;
      void dispatch({ type: 'deck.startJog', deck: deck.id });
    }
    if (event.timeStamp - jogRef.current.lastUpdate < 28) return;
    jogRef.current.lastUpdate = event.timeStamp;
    void dispatch({
      type: 'deck.seek',
      deck: deck.id,
      seconds: jogRef.current.originPosition + movement * 0.025,
    });
  };
  const onJogPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const wasDragged = jogRef.current.dragged;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (wasDragged) {
      void dispatch({
        type: 'deck.seek',
        deck: deck.id,
        seconds: jogRef.current.originPosition + (event.clientX - jogRef.current.originX) * 0.025,
      });
      void dispatch({ type: 'deck.endJog', deck: deck.id });
    } else {
      void dispatch({ type: 'deck.toggle', deck: deck.id });
    }
  };
  const onJogKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.repeat || (event.key !== ' ' && event.key !== 'Enter')) return;
    event.preventDefault();
    void dispatch({ type: 'deck.toggle', deck: deck.id });
  };

  return (
    <section className={`inline-dj-channel is-${deck.id.toLowerCase()}`} aria-label={`Deck ${deck.id}`}>
      <button
        type="button"
        className={`inline-dj-platter${isPlaying ? ' is-playing' : ''}${deck.jogging ? ' is-grabbed' : ''}`}
        disabled={!deck.track || deck.status === 'loading'}
        aria-label={`${isPlaying ? 'Pause' : 'Play'} deck ${deck.id}: ${deck.track?.title ?? 'empty deck'}`}
        style={{
          '--deck-progress': `${progress * 360}deg`,
          '--disc-angle': `${deck.position * 88}deg`,
        } as CSSProperties}
        onPointerDown={onJogPointerDown}
        onPointerMove={onJogPointerMove}
        onPointerUp={onJogPointerUp}
        onPointerCancel={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          if (jogRef.current.dragged) void dispatch({ type: 'deck.endJog', deck: deck.id });
        }}
        onKeyDown={onJogKeyDown}
      >
        <span className="inline-dj-disc">
          <i>{deck.jogging ? 'HAND' : isPlaying ? 'Ⅱ' : '▶'}</i>
        </span>
      </button>

      <div className="inline-dj-track">
        <header>
          <span>
            {deck.status === 'loading'
              ? `AUDIO ${deck.id} · LOADING`
              : isMaster ? `AUDIO ${deck.id} · MASTER` : `AUDIO ${deck.id}`}
          </span>
          <button type="button" onClick={() => void dispatch({ type: 'library.open', deck: deck.id })}>
            load
          </button>
        </header>
        <p title={deck.track ? `${deck.track.title} — ${deck.track.artist}` : undefined}>
          <strong>{deck.track?.title ?? 'No track loaded'}</strong>
          <span>{deck.track?.artist ?? 'Choose from the set'}</span>
        </p>
        <CompactWaveform deck={deck} dispatch={dispatch} />
        <div className="inline-dj-readout">
          <span>{formatTime(deck.position)} · −{formatTime(Math.max(0, deck.duration - deck.position))}</span>
          <span>
            {effectiveBpm ? `${effectiveBpm.toFixed(1)} BPM${deck.track?.bpmEstimated ? ' ~' : ''}` : 'BPM —'} · {deck.keyCamelot ?? 'KEY —'}
          </span>
        </div>
        <div className="inline-dj-actions">
          <button
            type="button"
            disabled={deck.duration <= 0}
            onClick={() => void dispatch({ type: 'deck.cue', deck: deck.id })}
          >
            cue
          </button>
          <button
            type="button"
            className={deck.synced ? 'is-active' : ''}
            disabled={!deck.bpm}
            onClick={() => void dispatch({ type: 'deck.toggleSync', deck: deck.id })}
          >
            sync
          </button>
          <button type="button" onClick={onOpenTone}>adjust</button>
        </div>
        <p className="inline-dj-error" aria-live="polite" title={deck.error ?? undefined}>{deck.error}</p>
      </div>

      <div className="inline-dj-deck-controls" aria-label={`Deck ${deck.id} mixer controls`}>
        {(['low', 'mid', 'high'] as const).map((band) => (
          <InlineKnob
            key={band}
            label={band.toUpperCase()}
            value={deck.eq[band]}
            min={-24}
            max={6}
            step={1}
            display={`${deck.eq[band] > 0 ? '+' : ''}${deck.eq[band]}`}
            onChange={(value) => void dispatch({ type: 'deck.setEq', deck: deck.id, band, value })}
          />
        ))}
        <InlineKnob
          label="FILTER"
          value={deck.filter}
          min={-1}
          max={1}
          step={0.01}
          display={deck.filter === 0 ? 'OPEN' : deck.filter < 0 ? 'LP' : 'HP'}
          onChange={(value) => void dispatch({ type: 'deck.setFilter', deck: deck.id, value })}
        />
        <div className="inline-dj-tempo-control">
          <InlineRange
            label="TEMPO"
            value={deck.tempoPercent}
            min={-16}
            max={16}
            step={0.1}
            display={`${deck.tempoPercent >= 0 ? '+' : ''}${deck.tempoPercent.toFixed(1)}%`}
            onChange={(value) => void dispatch({ type: 'deck.setTempo', deck: deck.id, value })}
          />
        </div>
      </div>
      <PerformanceControls deck={deck} dispatch={dispatch} />
    </section>
  );
}

function InlineRange({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="inline-dj-range">
      <span>{label}<output>{display}</output></span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  );
}

function TonePanel({ deck, dispatch, onClose }: { deck: DeckState; dispatch: DjDispatch; onClose: () => void }) {
  return (
    <section className="inline-dj-panel is-deck-adjust" role="dialog" aria-modal="true" aria-label={`Deck ${deck.id} tone and beat controls`}>
      <header>
        <div><span>DECK {deck.id}</span><strong>{deck.track?.title ?? 'No track loaded'}</strong></div>
        <button type="button" onClick={onClose}>done</button>
      </header>
      <div className="inline-dj-panel-controls">
        <InlineRange
          label="TEMPO"
          value={deck.tempoPercent}
          min={-16}
          max={16}
          step={0.1}
          display={`${deck.tempoPercent >= 0 ? '+' : ''}${deck.tempoPercent.toFixed(1)}%`}
          onChange={(value) => void dispatch({ type: 'deck.setTempo', deck: deck.id, value })}
        />
        {(['low', 'mid', 'high'] as const).map((band) => (
          <InlineRange
            key={band}
            label={band.toUpperCase()}
            value={deck.eq[band]}
            min={-24}
            max={6}
            step={1}
            display={`${deck.eq[band] > 0 ? '+' : ''}${deck.eq[band]} dB`}
            onChange={(value) => void dispatch({ type: 'deck.setEq', deck: deck.id, band, value })}
          />
        ))}
        <InlineRange
          label="FILTER"
          value={deck.filter}
          min={-1}
          max={1}
          step={0.01}
          display={deck.filter === 0 ? 'OPEN' : deck.filter < 0 ? 'LP' : 'HP'}
          onChange={(value) => void dispatch({ type: 'deck.setFilter', deck: deck.id, value })}
        />
        <InlineRange
          label="LEVEL"
          value={deck.level}
          min={0}
          max={1}
          step={0.01}
          display={`${Math.round(deck.level * 100)}%`}
          onChange={(value) => void dispatch({ type: 'deck.setLevel', deck: deck.id, value })}
        />
        <EchoPad deck={deck} dispatch={dispatch} />
      </div>
      <div className="inline-dj-adjust-controls">
        <label>
          <span>BPM</span>
          <input
            type="number"
            min={60}
            max={220}
            step={0.1}
            value={deck.bpm ?? ''}
            onChange={(event) => {
              const value = Number(event.currentTarget.value);
              if (value > 0) void dispatch({ type: 'deck.setBpm', deck: deck.id, value });
            }}
          />
        </label>
        <label>
          <span>FIRST BEAT</span>
          <input
            type="number"
            min={0}
            max={Math.max(0, deck.duration)}
            step={0.01}
            value={deck.beatOffsetSec}
            onChange={(event) => void dispatch({
              type: 'deck.setBeatOffset',
              deck: deck.id,
              value: Number(event.currentTarget.value),
            })}
          />
        </label>
        <label>
          <span>KEY</span>
          <input
            type="text"
            maxLength={4}
            placeholder="8A"
            value={deck.keyCamelot ?? ''}
            onChange={(event) => void dispatch({ type: 'deck.setKey', deck: deck.id, value: event.currentTarget.value })}
          />
        </label>
        <button type="button" onClick={() => void dispatch({ type: 'deck.setCue', deck: deck.id })}>
          set cue · {formatTime(deck.position)}
        </button>
        <div className="inline-dj-clear-cues">
          <span>CLEAR HOT CUES</span>
          <div>
            {HOT_CUE_SLOTS.map((slot) => {
              const cue = deck.hotCues[slot.index];
              return (
              <button
                type="button"
                key={slot.id}
                disabled={cue === null}
                aria-label={`Clear hot cue ${slot.index + 1} on deck ${deck.id}`}
                onClick={() => void dispatch({
                  type: 'deck.clearHotCue',
                  deck: deck.id,
                  index: slot.index,
                })}
              >
                ×{slot.index + 1}
              </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function MixerPanel({
  dispatch,
  onClose,
}: {
  dispatch: DjDispatch;
  onClose: () => void;
}) {
  const [state] = useDjMixer((snapshot) => snapshot);
  const endSet = () => {
    const isPlaying = state.decks.A.status === 'playing' || state.decks.B.status === 'playing';
    if (isPlaying && !window.confirm('End the DJ set and return to the vinyl player?')) return;
    void dispatch({ type: 'mode.end' });
  };

  return (
    <section className="inline-dj-panel" role="dialog" aria-modal="true" aria-label="Master mixer controls">
      <header>
        <div><span>MASTER MIXER</span><strong>GROOVY HARD TECHNO</strong></div>
        <button type="button" onClick={onClose}>done</button>
      </header>
      <div className="inline-dj-panel-controls is-mixer">
        <InlineRange
          label="CHANNEL A"
          value={state.decks.A.level}
          min={0}
          max={1}
          step={0.01}
          display={`${Math.round(state.decks.A.level * 100)}%`}
          onChange={(value) => void dispatch({ type: 'deck.setLevel', deck: 'A', value })}
        />
        <InlineRange
          label="CROSSFADER"
          value={state.crossfader}
          min={-1}
          max={1}
          step={0.01}
          display={state.crossfader === 0 ? 'A / B' : state.crossfader < 0 ? 'A' : 'B'}
          onChange={(value) => void dispatch({ type: 'mixer.setCrossfader', value })}
        />
        <InlineRange
          label="CHANNEL B"
          value={state.decks.B.level}
          min={0}
          max={1}
          step={0.01}
          display={`${Math.round(state.decks.B.level * 100)}%`}
          onChange={(value) => void dispatch({ type: 'deck.setLevel', deck: 'B', value })}
        />
        <InlineRange
          label="MASTER"
          value={state.masterLevel}
          min={0}
          max={1}
          step={0.01}
          display={`${Math.round(state.masterLevel * 100)}%`}
          onChange={(value) => void dispatch({ type: 'mixer.setMaster', value })}
        />
        <button type="button" className="inline-dj-panel-button" onClick={() => void dispatch({ type: 'mixer.toggleOutput' })}>
          {state.outputPaused ? 'resume mix' : 'pause mix'}
        </button>
        <button type="button" className="inline-dj-panel-button" onClick={endSet}>return to vinyl</button>
      </div>
    </section>
  );
}

function InlineLibrary({ deck, dispatch }: { deck: DeckId; dispatch: DjDispatch }) {
  const [state] = useDjMixer((snapshot) => snapshot);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isPlaying = state.decks[deck].status === 'playing';
  const confirmReplace = () => !isPlaying || window.confirm(`Deck ${deck} is playing. Replace its track?`);

  const loadCatalog = (trackId: string) => {
    if (!confirmReplace()) return;
    void dispatch({ type: 'deck.loadCatalog', deck, trackId });
    void dispatch({ type: 'library.close' });
  };

  const loadFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file || !confirmReplace()) return;
    void dispatch({ type: 'deck.loadFile', deck, file });
    void dispatch({ type: 'library.close' });
  };

  return (
    <section className="inline-dj-library" role="dialog" aria-modal="true" aria-label={`Load a track into deck ${deck}`}>
      <header>
        <div><span>SET CRATE / DECK {deck}</span><strong>Choose a track</strong></div>
        <button type="button" onClick={() => void dispatch({ type: 'library.close' })}>done</button>
      </header>
      <div className="inline-dj-crate">
        <button type="button" className="inline-dj-file" onClick={() => fileInputRef.current?.click()}>
          <span>LOCAL</span><strong>MP3 / WAV</strong><small>max 100 MB · 8 min</small>
        </button>
        <input ref={fileInputRef} hidden type="file" accept=".mp3,.wav,audio/mpeg,audio/wav" onChange={loadFile} />
        {djTracks.map((track) => (
          <button
            type="button"
            key={track.id}
            disabled={!track.available}
            onClick={() => loadCatalog(track.id)}
          >
            <span>{String(track.setOrder).padStart(2, '0')} · {track.setPhase}</span>
            <strong>{track.title}</strong>
            <small>{track.available ? track.artist : `${track.artist} · asset pending`}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

export function InlineDjDeck() {
  const [state, dispatch] = useDjMixer((snapshot) => snapshot);
  const [panel, setPanel] = useState<DeckId | 'mixer' | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const overlayKey = state.libraryDeck ? `library-${state.libraryDeck}` : panel;

  useEffect(() => {
    if (!overlayKey) return;
    const board = boardRef.current;
    const overlay = board?.querySelector<HTMLElement>('[role="dialog"]');
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusableSelector = 'button:not([disabled]), input:not([disabled]):not([hidden]), [tabindex="0"]';
    const frame = window.requestAnimationFrame(() => {
      overlay?.querySelector<HTMLElement>(focusableSelector)?.focus();
    });

    const closeOverlay = () => {
      if (state.libraryDeck) void dispatch({ type: 'library.close' });
      else setPanel(null);
    };

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeOverlay();
        return;
      }
      if (event.key !== 'Tab' || !overlay) return;
      const focusable = Array.from(overlay.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, [dispatch, overlayKey, state.libraryDeck]);

  return (
    <div ref={boardRef} className="inline-dj-board" aria-label="Groovy hard techno DJ deck">
      <div className="inline-dj-surface" inert={overlayKey ? true : undefined}>
      <HardwareDeck
        deck={state.decks.A}
        isMaster={state.masterDeck === 'A'}
        dispatch={dispatch}
        onOpenTone={() => setPanel('A')}
      />

      <aside className="inline-dj-mixer" aria-label="Mixer">
        <div className="inline-dj-mixer-head">
          <button type="button" className="inline-dj-mix-button" onClick={() => setPanel('mixer')}>
            <span>MIX</span>
            <i className={state.masterPeak > 0.98 ? 'is-limiting' : ''} aria-hidden="true">
              <b style={{ height: `${Math.min(100, state.decks.A.peak * 100)}%` }} />
              <b style={{ height: `${Math.min(100, state.decks.B.peak * 100)}%` }} />
            </i>
            <small>{state.audioStatus === 'blocked' ? 'blocked' : state.outputPaused ? 'paused' : 'adjust'}</small>
          </button>
          <InlineKnob
            label="MASTER"
            value={state.masterLevel}
            min={0}
            max={1}
            step={0.01}
            display={`${Math.round(state.masterLevel * 100)}%`}
            resetValue={0.82}
            onChange={(value) => void dispatch({ type: 'mixer.setMaster', value })}
          />
        </div>
        <div className="inline-dj-channel-faders" aria-label="Channel faders">
          {(['A', 'B'] as const).map((deck) => (
            <label key={deck}>
              <span>{deck}</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={state.decks[deck].level}
                aria-label={`Deck ${deck} channel fader`}
                onChange={(event) => void dispatch({
                  type: 'deck.setLevel',
                  deck,
                  value: Number(event.currentTarget.value),
                })}
              />
            </label>
          ))}
        </div>
        <label className="inline-dj-crossfader">
          <span><i>A</i><i>B</i></span>
          <input
            type="range"
            min={-1}
            max={1}
            step={0.01}
            value={state.crossfader}
            aria-label="Crossfader"
            onChange={(event) => void dispatch({
              type: 'mixer.setCrossfader',
              value: Number(event.currentTarget.value),
            })}
          />
        </label>
      </aside>

      <HardwareDeck
        deck={state.decks.B}
        isMaster={state.masterDeck === 'B'}
        dispatch={dispatch}
        onOpenTone={() => setPanel('B')}
      />
      </div>

      {panel === 'A' && <TonePanel deck={state.decks.A} dispatch={dispatch} onClose={() => setPanel(null)} />}
      {panel === 'B' && <TonePanel deck={state.decks.B} dispatch={dispatch} onClose={() => setPanel(null)} />}
      {panel === 'mixer' && <MixerPanel dispatch={dispatch} onClose={() => setPanel(null)} />}
      {state.libraryDeck && <InlineLibrary deck={state.libraryDeck} dispatch={dispatch} />}
      {state.audioStatus === 'blocked' && (
        <p className="dj-visually-hidden" aria-live="polite">Audio is blocked — press a deck to resume.</p>
      )}
    </div>
  );
}
