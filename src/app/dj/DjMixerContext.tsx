'use client';

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { DjMixerStore } from './DjMixerStore';
import type { DjDispatch, DjMixerState } from './types';

const DjMixerContext = createContext<DjMixerStore | null>(null);

export function DjMixerProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<DjMixerStore | null>(null);
  if (storeRef.current === null) storeRef.current = new DjMixerStore();
  const store = storeRef.current;

  useEffect(() => {
    store.initialize();
    return () => store.destroy();
  }, [store]);

  return <DjMixerContext.Provider value={store}>{children}</DjMixerContext.Provider>;
}

export function useDjMixer<T>(selector: (state: DjMixerState) => T): readonly [T, DjDispatch] {
  const store = useContext(DjMixerContext);
  if (!store) throw new Error('useDjMixer must be used within DjMixerProvider');

  const selectedRef = useRef<{ hasValue: boolean; value: T | undefined }>({
    hasValue: false,
    value: undefined,
  });
  const getSelectedSnapshot = useCallback(() => {
    const nextValue = selector(store.getSnapshot());
    if (!selectedRef.current.hasValue || !Object.is(selectedRef.current.value, nextValue)) {
      selectedRef.current = { hasValue: true, value: nextValue };
    }
    return selectedRef.current.value as T;
  }, [selector, store]);

  const snapshot = useSyncExternalStore(
    store.subscribe,
    getSelectedSnapshot,
    getSelectedSnapshot,
  );

  return [snapshot, store.dispatch] as const;
}
