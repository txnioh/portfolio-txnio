export type AudioTrack = {
  id: string;
  title: string;
  artist: string;
  album: string;
  src: string;
  cover: string;
};

export const audioTracks: readonly AudioTrack[] = [
  {
    id: 'birds-are-still',
    title: 'Birds Are Still',
    artist: 'Takashi Yoshimatsu',
    album: 'Memo Flora',
    src: '/music/birds-are-still.mp3',
    cover: '/yoshimatsu.png',
  },
  {
    id: 'feisty',
    title: 'FEISTY',
    artist: 'Fred again..',
    album: 'Unknown Album',
    src: '/music/feisty.mp3',
    cover: '/music/cover/feisty.jpg',
  },
  {
    id: 'bunker-schranz',
    title: 'bunker schranz',
    artist: 'Leonswork',
    album: 'bunker schranz',
    src: '/music/bunker-schranz.mp3',
    cover: '/music/cover/bunker-schranz.jpg',
  },
  {
    id: 'gurre-lieder-prelude',
    title: 'Gurre-Lieder, Pt. 1: Prelude. Mäßig bewegt',
    artist: 'Arnold Schoenberg',
    album: 'Unknown Album',
    src: '/music/gurre-lieder-prelude.mp3',
    cover: '/music/cover/gurre-lieder-prelude.jpg',
  },
  {
    id: 'rukiawaa-track',
    title: 'ੴঐਁ目ਁ੍覚ਁめৡ੍৾৾એીૐೡૹೖೀ૰௸',
    artist: 'rukiawaa',
    album: '௰.̴͐ .᭒̶̄.̵͆悪ୗᔇੴᬼᔇ魔の覚ᬼ.̴͐ .̶̄.̵͆醒ໟଷࡡ',
    src: '/music/rukiawaa-track.mp3',
    cover: '/music/cover/rukiawaa-track.jpg',
  },
  {
    id: 'red-dragonfly',
    title: 'Red Dragonfly',
    artist: 'spotdown.org',
    album: 'Unknown Album',
    src: '/music/red-dragonfly.mp3',
    cover: '/icons/cdrom.png',
  },
  {
    id: 'on-the-level',
    title: 'On the Level',
    artist: 'spotdown.org',
    album: 'Unknown Album',
    src: '/music/on-the-level.mp3',
    cover: '/icons/cdrom.png',
  },
  {
    id: 'funk-machine',
    title: 'Funk Machine',
    artist: 'spotdown.org',
    album: 'Unknown Album',
    src: '/music/funk-machine.mp3',
    cover: '/icons/cdrom.png',
  },
  {
    id: 'antarctica-echoes-remastered',
    title: 'Antarctica Echoes - Remastered',
    artist: 'spotdown.org',
    album: 'Unknown Album',
    src: '/music/antarctica-echoes-remastered.mp3',
    cover: '/icons/cdrom.png',
  },
];
