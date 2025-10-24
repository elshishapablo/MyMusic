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
import { CustomButton } from '../components/CustomButton';

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
  // Función para manejar el clic en Don't Cry
  const handleDontCryPress = () => {
    navigation.navigate('NowPlaying');
  };

  // Datos de ejemplo estáticos
  const popularTracks = [
    { id: '1', title: 'Shape of You', artist: 'Ed Sheeran', image: 'https://via.placeholder.com/300x300/1DB954/FFFFFF?text=SO' },
    { id: '2', title: 'Blinding Lights', artist: 'The Weeknd', image: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=BL' },
    { id: '3', title: 'Bad Guy', artist: 'Billie Eilish', image: 'https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=BG' },
    { id: '4', title: 'Watermelon Sugar', artist: 'Harry Styles', image: 'https://via.placeholder.com/300x300/FFD700/FFFFFF?text=WS' },
    { id: '5', title: 'Levitating', artist: 'Dua Lipa', image: 'https://via.placeholder.com/300x300/9B59B6/FFFFFF?text=L' },
    { id: '6', title: 'Stay', artist: 'The Kid LAROI', image: 'https://via.placeholder.com/300x300/FF6347/FFFFFF?text=S' },
  ];

  // Canción especial de Don't Cry
  const dontCryTrack = {
    id: 'dont-cry',
    title: "Don't Cry",
    artist: 'Guns N\' Roses',
    image: require('../assets/images/dont_cry.jpg'),
    isLocal: true
  };

  const userTopTracks = [
    { id: '1', title: 'Bohemian Rhapsody', artist: 'Queen', image: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=BR' },
    { id: '2', title: 'Imagine', artist: 'John Lennon', image: 'https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=I' },
    { id: '3', title: 'Hotel California', artist: 'Eagles', image: 'https://via.placeholder.com/300x300/FFD700/FFFFFF?text=HC' },
    { id: '4', title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', image: 'https://via.placeholder.com/300x300/FF6347/FFFFFF?text=SCO' },
  ];

  const electronicTracks = [
    { id: '1', title: 'Strobe', artist: 'Deadmau5', image: 'https://via.placeholder.com/300x300/9B59B6/FFFFFF?text=S' },
    { id: '2', title: 'Levels', artist: 'Avicii', image: 'https://via.placeholder.com/300x300/1DB954/FFFFFF?text=L' },
    { id: '3', title: 'Titanium', artist: 'David Guetta', image: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=T' },
    { id: '4', title: 'Animals', artist: 'Martin Garrix', image: 'https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=A' },
  ];

  const hipHopTracks = [
    { id: '1', title: 'Lose Yourself', artist: 'Eminem', image: 'https://via.placeholder.com/300x300/FF6347/FFFFFF?text=LY' },
    { id: '2', title: 'In Da Club', artist: '50 Cent', image: 'https://via.placeholder.com/300x300/FFD700/FFFFFF?text=IDC' },
    { id: '3', title: 'Hotline Bling', artist: 'Drake', image: 'https://via.placeholder.com/300x300/1DB954/FFFFFF?text=HB' },
    { id: '4', title: 'Sicko Mode', artist: 'Travis Scott', image: 'https://via.placeholder.com/300x300/9B59B6/FFFFFF?text=SM' },
  ];
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

            {/* Canción especial Don't Cry */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎸 Tu Canción Local</Text>
              <TouchableOpacity
                style={styles.specialTrackCard}
                onPress={handleDontCryPress}
              >
                <Image source={{ uri: dontCryTrack.image }} style={styles.specialTrackImage} />
                <View style={styles.specialTrackInfo}>
                  <Text style={styles.specialTrackTitle}>{dontCryTrack.title}</Text>
                  <Text style={styles.specialTrackArtist}>{dontCryTrack.artist}</Text>
                  <Text style={styles.specialTrackSubtitle}>🎵 Archivo local • Toca para reproducir</Text>
                </View>
                <View style={styles.playIconContainer}>
                  <Ionicons name="play-circle" size={40} color="#20B2AA" />
                </View>
              </TouchableOpacity>
            </View>

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

            {/* Canciones populares de Spotify */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔥 Tendencias en Spotify</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {popularTracks.map((track, index) => (
                  <TouchableOpacity
                    key={`popular_${track.id}_${index}`}
                    style={styles.trackCard}
                  >
                    <Image source={{ uri: track.image }} style={styles.trackImage} />
                    <Text style={styles.trackTitle}>{track.title}</Text>
                    <Text style={styles.trackArtist}>{track.artist}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Botón de prueba de audio */}
            <View style={styles.nowPlayingContainer}>
              <CustomButton
                title="Prueba de Audio Local"
                onPress={() => navigation.navigate('AudioTest')}
                style={styles.continueButton}
              />
            </View>

      {/* Música Electrónica */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎵 Electronic</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {electronicTracks.map((track) => (
            <TouchableOpacity 
              key={track.id} 
              style={styles.trackCard}
            >
              <Image source={{ uri: track.image }} style={styles.trackImage} />
              <Text style={styles.trackTitle}>{track.title}</Text>
              <Text style={styles.trackArtist}>{track.artist}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Hip Hop */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎤 Hip Hop</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {hipHopTracks.map((track) => (
            <TouchableOpacity 
              key={track.id} 
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
  // Estilos para la tarjeta especial de Don't Cry
  specialTrackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  specialTrackImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  specialTrackInfo: {
    flex: 1,
  },
  specialTrackTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specialTrackArtist: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },
  specialTrackSubtitle: {
    color: '#20B2AA',
    fontSize: 12,
    fontWeight: '500',
  },
  playIconContainer: {
    marginLeft: 10,
  },
});
