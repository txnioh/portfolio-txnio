import type { DjTrack } from './types';

export type LibraryFilter = 'all' | 'available' | 'pending';
export type LibrarySort = 'set' | 'artist';

export function getLibraryTracks(
  tracks: readonly DjTrack[],
  query: string,
  filter: LibraryFilter,
  sort: LibrarySort,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visible = tracks.filter((track) => {
    if (filter === 'available' && !track.available) return false;
    if (filter === 'pending' && track.available) return false;
    if (!normalizedQuery) return true;
    return `${track.artist} ${track.title} ${track.setPhase}`
      .toLocaleLowerCase()
      .includes(normalizedQuery);
  });

  return visible.toSorted((left, right) => {
    if (sort === 'artist') {
      return left.artist.localeCompare(right.artist) || left.setOrder - right.setOrder;
    }
    return left.setOrder - right.setOrder;
  });
}
