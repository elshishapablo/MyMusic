// Configuración de música local
// Para agregar nuevas canciones, simplemente añade un nuevo objeto al array localSongs

export interface LocalSong {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: string;
  audioFile: any; // require() del archivo de audio
  coverImage: any; // require() de la imagen de portada
  genre?: string;
  year?: number;
}

export const localSongs: LocalSong[] = [
  {
    id: 'dont-cry',
    title: "Don't Cry",
    artist: 'Guns N\' Roses',
    album: 'Use Your Illusion I',
    duration: '3:53',
    audioFile: require('../assets/audio/dont_cry.mp3'),
    coverImage: require('../assets/images/portadas/dont_cry.jpg'),
    genre: 'Rock',
    year: 1991
  },
  {
    id: 'desire',
    title: 'Desire',
    artist: 'Calvin Harris, Sam Smith',
    album: 'Desire',
    duration: '3:30',
    audioFile: require('../assets/audio/Calvin Harris, Sam Smith - Desire (Lyrics).mp3'),
    coverImage: require('../assets/images/portadas/Desire.jpg'),
    genre: 'Electronic',
    year: 2023
  },
  {
    id: 'latch',
    title: 'Latch',
    artist: 'Disclosure ft. Sam Smith',
    album: 'Settle',
    duration: '4:30',
    audioFile: require('../assets/audio/Disclosure - Latch ft. Sam Smith (Lyrics).mp3'),
    coverImage: require('../assets/images/portadas/latch.jpg'),
    genre: 'Electronic',
    year: 2013
  },
  {
    id: 'fever',
    title: 'Fever',
    artist: 'Dua Lipa & Angèle',
    album: 'Future Nostalgia',
    duration: '2:36',
    audioFile: require('../assets/audio/Dua Lipa & Angèle - Fever (Lyrics).mp3'),
    coverImage: require('../assets/images/portadas/fever.jpg'),
    genre: 'Pop',
    year: 2020
  },
  {
    id: 'fire-on-fire',
    title: 'Fire On Fire',
    artist: 'Sam Smith',
    album: 'Fire On Fire',
    duration: '4:06',
    audioFile: require('../assets/audio/Fire On Fire - Sam Smith (Lyrics).mp3'),
    coverImage: require('../assets/images/portadas/fire_on_fire.jpg'),
    genre: 'Pop',
    year: 2018
  },
  {
    id: 'november-rain',
    title: 'November Rain',
    artist: 'Guns N\' Roses',
    album: 'Use Your Illusion I',
    duration: '8:57',
    audioFile: require('../assets/audio/Guns N\' Roses - November Rain (Lyrics).mp3'),
    coverImage: require('../assets/images/portadas/november_rain.jpg'),
    genre: 'Rock',
    year: 1991
  },
  {
    id: 'next-to-me',
    title: 'Next To Me',
    artist: 'Imagine Dragons',
    album: 'Evolve',
    duration: '3:50',
    audioFile: require('../assets/audio/Imagine Dragons - Next To Me (Audio).mp3'),
    coverImage: require('../assets/images/portadas/next_to_me.jpg'),
    genre: 'Alternative Rock',
    year: 2017
  },
  {
    id: 'la-la-la',
    title: 'La La La',
    artist: 'Naughty Boy ft. Sam Smith',
    album: 'Hotel Cabana',
    duration: '3:40',
    audioFile: require('../assets/audio/Naughty Boy - La la la ft. Sam Smith (Lyrics).mp3'),
    coverImage: require('../assets/images/portadas/lalala.png'),
    genre: 'Pop',
    year: 2013
  },
  {
    id: 'my-oasis',
    title: 'My Oasis',
    artist: 'Sam Smith ft. Burna Boy',
    album: 'Love Goes',
    duration: '2:59',
    audioFile: require('../assets/audio/Sam Smith - My Oasis (Lyric Video) ft. Burna Boy.mp3'),
    coverImage: require('../assets/images/portadas/myoasis.jpg'),
    genre: 'Pop',
    year: 2020
  },
  {
    id: 'dancing-with-a-stranger',
    title: 'Dancing With A Stranger',
    artist: 'Sam Smith, Normani',
    album: 'Love Goes',
    duration: '2:51',
    audioFile: require('../assets/audio/Sam Smith, Normani - Dancing With A Stranger (Lyrics).mp3'),
    coverImage: require('../assets/images/portadas/dancing.jpg'),
    genre: 'Pop',
    year: 2019
  },
];

// Función helper para obtener una canción por ID
export const getLocalSongById = (id: string): LocalSong | undefined => {
  return localSongs.find(song => song.id === id);
};

// Función helper para obtener todas las canciones de un artista
export const getLocalSongsByArtist = (artist: string): LocalSong[] => {
  return localSongs.filter(song => 
    song.artist.toLowerCase().includes(artist.toLowerCase())
  );
};

// Función helper para obtener todas las canciones de un género
export const getLocalSongsByGenre = (genre: string): LocalSong[] => {
  return localSongs.filter(song => 
    song.genre?.toLowerCase().includes(genre.toLowerCase())
  );
};

// Función helper para buscar canciones por título o artista
export const searchLocalSongs = (query: string): LocalSong[] => {
  const lowerQuery = query.toLowerCase();
  return localSongs.filter(song => 
    song.title.toLowerCase().includes(lowerQuery) ||
    song.artist.toLowerCase().includes(lowerQuery) ||
    song.album?.toLowerCase().includes(lowerQuery)
  );
};
