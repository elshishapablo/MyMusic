import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { useMusic } from '../contexts/MusicContext';

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
  { title: 'Tu música', icon: 'musical-notes', color: '#20B2AA' },
  { title: 'Descubrir', icon: 'compass', color: '#FF6B6B' },
  { title: 'Radio', icon: 'radio', color: '#4ECDC4' },
  { title: 'Videos', icon: 'videocam', color: '#45B7D1' },
];

export default function HomeScreen({ navigation }: any) {
  const { getPopularTracks, getTracksByGenre, playTrack, state } = useMusic();
  const [popularTracks, setPopularTracks] = useState<any[]>([]);
  const [electronicTracks, setElectronicTracks] = useState<any[]>([]);
  const [hipHopTracks, setHipHopTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar canciones populares
      const popular = await getPopularTracks();
      setPopularTracks(popular.slice(0, 6));
      
      // Cargar música electrónica
      const electronic = await getTracksByGenre('Electronic');
      setElectronicTracks(electronic.slice(0, 4));
      
      // Cargar hip hop
      const hipHop = await getTracksByGenre('Hip Hop');
      setHipHopTracks(hipHop.slice(0, 4));
      
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayTrack = async (track: any) => {
    // Validar que el track existe
    if (!track) {
      console.log('Track no válido');
      return;
    }

    try {
      console.log('Reproduciendo:', track.title, 'de', track.artist);
      
      // Actualizar estado global
      playTrack(track);
      
      // Navegar directamente a la pantalla de reproducción
      navigation.navigate('NowPlaying');
      
    } catch (error) {
      console.error('Error playing track:', error);
      Alert.alert('Error', 'No se pudo reproducir la canción.');
    }
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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

             {/* Canciones populares de Spotify */}
             <View style={styles.section}>
               <Text style={styles.sectionTitle}>🔥 Tendencias en Spotify</Text>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#20B2AA" />
            <Text style={styles.loadingText}>Cargando música...</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularTracks.map((track) => (
              <TouchableOpacity 
                key={track.id} 
                style={styles.trackCard}
                onPress={() => handlePlayTrack(track)}
              >
                <Image source={{ uri: track.image }} style={styles.trackImage} />
                <Text style={styles.trackTitle}>{track.title}</Text>
                <Text style={styles.trackArtist}>{track.artist}</Text>
                       <Text style={styles.trackStats}>
                         Popularidad: {track.playCount || 0}/100 • {track.year}
                       </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Botón de reproducción actual */}
      <View style={styles.nowPlayingContainer}>
        <CustomButton
          title="Continuar reproduciendo"
          onPress={() => navigation.navigate('NowPlaying')}
          style={styles.continueButton}
        />
      </View>

      {/* Música Electrónica */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎵 Electronic</Text>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#20B2AA" />
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {electronicTracks.map((track) => (
              <TouchableOpacity 
                key={track.id} 
                style={styles.trackCard}
                onPress={() => handlePlayTrack(track)}
              >
                <Image source={{ uri: track.image }} style={styles.trackImage} />
                <Text style={styles.trackTitle}>{track.title}</Text>
                <Text style={styles.trackArtist}>{track.artist}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Hip Hop */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎤 Hip Hop</Text>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#20B2AA" />
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hipHopTracks.map((track) => (
              <TouchableOpacity 
                key={track.id} 
                style={styles.trackCard}
                onPress={() => handlePlayTrack(track)}
              >
                <Image source={{ uri: track.image }} style={styles.trackImage} />
                <Text style={styles.trackTitle}>{track.title}</Text>
                <Text style={styles.trackArtist}>{track.artist}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
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
    color: '#fff',
  },
  subGreeting: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
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
    color: '#fff',
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
  },
  quickAccessText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  playlistCard: {
    width: 160,
    marginRight: 15,
  },
  playlistImage: {
    width: 160,
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  playlistTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  playlistSubtitle: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 2,
  },
  playlistSongs: {
    color: '#888',
    fontSize: 12,
  },
  nowPlayingContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  continueButton: {
    backgroundColor: '#20B2AA',
    borderRadius: 25,
    paddingVertical: 15,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  genreCard: {
    width: (width - 60) / 2,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  genreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: '#ccc',
    marginTop: 10,
    fontSize: 14,
  },
  trackCard: {
    width: 140,
    marginRight: 15,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
  },
  trackImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  trackArtist: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  trackStats: {
    color: '#666',
    fontSize: 10,
  },
});
