export type AudioTrack = {
  id: string;
  title: string;
  artist: string;
  album: string;
  src: string;
  cover: string;
  isPreview?: boolean;
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
    id: 'quiet-rain',
    title: 'Canticle of Quiet Rain',
    artist: 'Kyoko Tabe',
    album: 'Pleiades Dances IV',
    src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/e2/2b/5c/e22b5c01-c2dc-5310-0c71-c9b90a818bbf/mzaf_6399700893349790066.plus.aac.p.m4a',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music/ab/93/5b/mzi.xhaqsrmm.jpg/600x600bb.jpg',
    isPreview: true,
  },
  {
    id: 'winter-pastoral',
    title: 'Winter Pastoral',
    artist: 'Stanford Cheung',
    album: 'Folios of Light',
    src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/72/ce/10/72ce1093-4e76-5587-84a7-5e6dd96a4f9c/mzaf_3512781660497097450.plus.aac.p.m4a',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/2c/42/29/2c4229a8-2574-dcd9-ae7d-66fbd661b9cc/cover.jpg/600x600bb.jpg',
    isPreview: true,
  },
  {
    id: 'water-color-scalor',
    title: 'Water Color Scalor: Prelude',
    artist: 'Kaori Muraji',
    album: 'Lumieres',
    src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/9c/cb/3d/9ccb3dc3-ff07-2738-9544-136528fa7e78/mzaf_7909410936445035688.plus.aac.p.m4a',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/10/36/d9/1036d9b2-8dd8-0fdf-5ba2-dffb6e127421/00028947574774.rgb.jpg/600x600bb.jpg',
    isPreview: true,
  },
  {
    id: 'bird-in-colors',
    title: 'Bird in Colors',
    artist: 'Nobuya Sugawa',
    album: 'Cyber-bird Concerto',
    src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/29/f5/af/29f5af99-bf2b-efca-b294-4e6dd4e43960/mzaf_14348327959006435498.plus.aac.p.m4a',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1c/96/d7/1c96d702-38b8-c8d9-1ec5-5f0d186f5fc7/5059864973734.png/600x600bb.jpg',
    isPreview: true,
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
];
