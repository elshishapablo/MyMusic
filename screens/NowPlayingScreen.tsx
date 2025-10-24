import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useMusic } from '../contexts/MusicContext';

const { width, height } = Dimensions.get('window');

// Datos de ejemplo de la canción actual
const currentSong = {
  id: '1',
  title: 'Blinding Lights',
  artist: 'The Weeknd',
  album: 'After Hours',
  duration: 200, // segundos
  image: 'https://via.placeholder.com/300x300/20B2AA/FFFFFF?text=BL',
  isLiked: false,
};

const relatedSongs = [
  {
    id: '2',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:35',
  },
  {
    id: '3',
    title: 'In Your Eyes',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:57',
  },
  {
    id: '4',
    title: 'Heartless',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:18',
  },
];

export default function NowPlayingScreen() {
  const navigation = useNavigation();
  const { state, pauseTrack, resumeTrack } = useMusic();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  
  // Usar la canción actual del contexto
  const currentSong = state.currentTrack || {
    id: '1',
    title: 'No hay canción seleccionada',
    artist: 'Selecciona una canción',
    album: '',
    duration: 200,
    image: 'https://via.placeholder.com/300x300/20B2AA/FFFFFF?text=SC',
    isLiked: false,
  };
  
  const progress = (currentTime / currentSong.duration) * 100;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRepeat = () => {
    const modes: ('off' | 'one' | 'all')[] = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  // Reproducir audio cuando se carga la pantalla
  useEffect(() => {
    const playAudio = async () => {
      if (currentSong.previewUrl) {
        try {
          // Detener audio anterior si existe
          if (sound) {
            await sound.unloadAsync();
          }

          // Crear nuevo audio
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: currentSong.previewUrl },
            { 
              shouldPlay: true,
              isLooping: false,
              volume: 1.0
            }
          );
          
          setSound(newSound);
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
    };

    playAudio();

    // Cleanup al desmontar
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentSong.id]);

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-down" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Reproduciendo desde</Text>
          <Text style={styles.headerSubtitle}>Tu biblioteca</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Álbum artwork */}
      <View style={styles.artworkContainer}>
        <Image source={{ uri: currentSong.image }} style={styles.artwork} />
      </View>

      {/* Información de la canción */}
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{currentSong.title}</Text>
        <Text style={styles.songArtist}>{currentSong.artist}</Text>
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
          <View style={[styles.progressThumb, { left: `${progress}%` }]} />
        </View>
        <Text style={styles.timeText}>{formatTime(currentSong.duration)}</Text>
      </View>

      {/* Controles principales */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setIsShuffled(!isShuffled)}
        >
          <Ionicons
            name="shuffle"
            size={24}
            color={isShuffled ? '#20B2AA' : '#ccc'}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="play-skip-back" size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlayPause}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={40}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="play-skip-forward" size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleRepeat}
        >
          <Ionicons
            name={repeatMode === 'off' ? 'repeat' : repeatMode === 'one' ? 'repeat' : 'repeat'}
            size={24}
            color={repeatMode === 'off' ? '#ccc' : '#20B2AA'}
          />
        </TouchableOpacity>
      </View>

      {/* Controles secundarios */}
      <View style={styles.secondaryControls}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setIsLiked(!isLiked)}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? '#FF6B6B' : '#ccc'}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Ionicons name="add" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Ionicons name="share-outline" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Ionicons name="list" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Lista de reproducción */}
      <View style={styles.playlistContainer}>
        <Text style={styles.playlistTitle}>Próximas canciones</Text>
        {relatedSongs.map((song, index) => (
          <TouchableOpacity key={song.id} style={styles.playlistItem}>
            <View style={styles.playlistItemInfo}>
              <Text style={styles.playlistItemTitle}>{song.title}</Text>
              <Text style={styles.playlistItemArtist}>{song.artist}</Text>
            </View>
            <Text style={styles.playlistItemDuration}>{song.duration}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerInfo: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    color: '#ccc',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888',
  },
  artworkContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  artwork: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  songInfo: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  songArtist: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  timeText: {
    fontSize: 12,
    color: '#ccc',
    minWidth: 40,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginHorizontal: 15,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#20B2AA',
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: '#20B2AA',
    borderRadius: 8,
    marginLeft: -8,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  controlButton: {
    padding: 10,
    marginHorizontal: 10,
  },
  playButton: {
    backgroundColor: '#20B2AA',
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#20B2AA',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  secondaryButton: {
    padding: 10,
  },
  playlistContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  playlistItemInfo: {
    flex: 1,
  },
  playlistItemTitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  playlistItemArtist: {
    fontSize: 12,
    color: '#888',
  },
  playlistItemDuration: {
    fontSize: 12,
    color: '#888',
  },
});
