import { describe, expect, it } from 'vitest';
import { djTracks } from '../music';
import { getLibraryTracks } from './libraryView';

describe('DJ library view', () => {
  it('filters the crate without changing set order', () => {
    const tracks = getLibraryTracks(djTracks, '', 'available', 'set');

    expect(tracks.map((track) => track.id)).toEqual([
      'bunker-schranz',
      'funk-machine',
    ]);
  });

  it('searches artist, title and set phase case-insensitively', () => {
    expect(getLibraryTracks(djTracks, 'DJANGO', 'all', 'set')).toHaveLength(1);
    expect(getLibraryTracks(djTracks, 'peak', 'all', 'set')).toHaveLength(4);
  });

  it('can sort the filtered crate by artist', () => {
    const tracks = getLibraryTracks(djTracks, '', 'available', 'artist');

    expect(tracks.map((track) => track.artist)).toEqual(['DJANGO', 'Leonswork']);
  });
});
