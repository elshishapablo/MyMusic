import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LocalSongCard } from '../components/LocalSongCard';
import MiniPlayer from '../components/MiniPlayer';
import { Colors, Shadows } from '../constants/Colors';
import { localSongs } from '../data/localMusic';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

const { width } = Dimensions.get('window');

// Datos de ejemplo para la música
const featuredPlaylists = [
  {
    id: '1',
    title: 'Made for You',
    subtitle: 'Playlist personalizada',
    image: 'https://via.placeholder.com/200x200/20B2AA/FFFFFF?text=Made+for+You',
    songs: 25,
  },
  {
    id: '2',
    title: 'Recently Played',
    subtitle: 'Escuchado recientemente',
    image: 'https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=Recent',
    songs: 12,
  },
  {
    id: '3',
    title: 'Top Hits 2024',
    subtitle: 'Los más populares',
    image: 'https://via.placeholder.com/200x200/4ECDC4/FFFFFF?text=Top+Hits',
    songs: 50,
  },
];

const quickAccess = [
  { title: 'Tu música', icon: 'musical-notes', color: Colors.primary },
  { title: 'Descubrir', icon: 'compass', color: Colors.accent },
  { title: 'Radio', icon: 'radio', color: Colors.secondary },
  { title: 'Videos', icon: 'videocam', color: Colors.primaryLight },
];

export default function HomeScreen({ navigation }: any) {
  const { 
    playSong, 
    currentSong, 
    isPlaying, 
    isMiniPlayerVisible, 
    togglePlayPause, 
    stop, 
    hideMiniPlayer 
  } = useAudioPlayer();

  // Log para debuggear el estado del mini-player
  console.log('HomeScreen render - isMiniPlayerVisible:', isMiniPlayerVisible, 'currentSong:', currentSong?.title);

  // Función para manejar el clic en una canción local
  const handleLocalSongPress = async (song: any) => {
    // Solo navegar al reproductor
    navigation.navigate('NowPlaying', {
      song: song
    });
  };

  // Función para manejar el clic en el botón de play
  const handlePlayPress = async (song: any) => {
    console.log('HomeScreen: handlePlayPress called for:', song.title);
    console.log('Current song:', currentSong?.title, 'isPlaying:', isPlaying);
    
    // Si es la misma canción que ya está reproduciendo, solo navegar
    if (currentSong?.id === song.id && isPlaying) {
      console.log('Same song already playing, just navigating');
      navigation.navigate('NowPlaying', {
        song: song
      });
      return;
    }
    
    // Si es una canción diferente, reproducir y navegar
    console.log('Playing new song and navigating');
    await playSong(song);
    navigation.navigate('NowPlaying', {
      song: song
    });
  };

  // Función para navegar al reproductor completo desde el mini-player
  const handleMiniPlayerPress = () => {
    if (currentSong) {
      navigation.navigate('NowPlaying', {
        song: currentSong
      });
    }
  };

  // Funciones placeholder para los controles del mini-player
  const handleNext = () => {
    // TODO: Implementar siguiente canción
    console.log('Siguiente canción');
  };

  const handlePrevious = () => {
    // TODO: Implementar canción anterior
    console.log('Canción anterior');
  };

  const userTopTracks = [
    { id: '1', title: 'Bohemian Rhapsody', artist: 'Queen', image: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=BR' },
    { id: '2', title: 'Imagine', artist: 'John Lennon', image: 'https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=I' },
    { id: '3', title: 'Hotel California', artist: 'Eagles', image: 'https://via.placeholder.com/300x300/FFD700/FFFFFF?text=HC' },
    { id: '4', title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', image: 'https://via.placeholder.com/300x300/FF6347/FFFFFF?text=SCO' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={isMiniPlayerVisible ? styles.scrollContentWithMiniPlayer : styles.scrollContent}
      >
      {/* Header con saludo */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Hola!</Text>
          <Text style={styles.subGreeting}>¿Qué quieres escuchar hoy?</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Acceso rápido */}
      <View style={styles.quickAccessContainer}>
        <Text style={styles.sectionTitle}>Acceso rápido</Text>
        <View style={styles.quickAccessGrid}>
          {quickAccess.map((item, index) => (
            <TouchableOpacity key={index} style={styles.quickAccessItem}>
              <View style={[styles.quickAccessIcon, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={24} color="#fff" />
              </View>
              <Text style={styles.quickAccessText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

            {/* Todas las canciones locales */}
            {localSongs.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎵 Tu Biblioteca Local</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {localSongs.map((song) => (
                    <LocalSongCard
                      key={song.id}
                      song={song}
                      onPress={handleLocalSongPress}
                      onPlayPress={handlePlayPress}
                      showPlayButton={true}
                      isPlaying={currentSong?.id === song.id && isPlaying}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Top tracks del usuario */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎵 Tu Música Favorita</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {userTopTracks.map((track, index) => (
                  <TouchableOpacity
                    key={`userTop_${track.id}_${index}`}
                    style={styles.trackCard}
                  >
                    <Image source={{ uri: track.image }} style={styles.trackImage} />
                    <Text style={styles.trackTitle}>{track.title}</Text>
                    <Text style={styles.trackArtist}>{track.artist}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
      </ScrollView>

      {/* Mini Player */}
      {(() => {
        console.log('Mini-player render check - isMiniPlayerVisible:', isMiniPlayerVisible, 'currentSong:', currentSong?.title);
        return isMiniPlayerVisible && (
          <MiniPlayer />
        );
      })()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  scrollContentWithMiniPlayer: {
    paddingBottom: 120, // Espacio para el mini-player
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subGreeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    ...Shadows.small,
  },
  quickAccessContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAccessItem: {
    width: (width - 60) / 2,
    alignItems: 'center',
    marginBottom: 20,
  },
  quickAccessIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...Shadows.medium,
  },
  quickAccessText: {
    color: Colors.text,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  trackCard: {
    width: 140,
    marginRight: 15,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    ...Shadows.small,
  },
  trackImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  trackTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  trackArtist: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
});
