import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Shadows } from '../constants/Colors';
import { useAudio } from '../contexts/AudioProvider';
import { useUser } from '../contexts/UserProvider';
import { artistImages } from '../data/artists';
import { getLocalSongsByGenre, localSongs } from '../data/localMusic';

const { width } = Dimensions.get('window');

// Función para obtener el saludo según la hora
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
};

// Función para obtener artistas únicos
const getUniqueArtists = () => {
  const artistMap = new Map<string, { name: string; cover: any }>();
  localSongs.forEach((song) => {
    const primaryArtist = song.artist.split(' ft.')[0].split(' &')[0].split(',')[0].trim();
    if (!artistMap.has(primaryArtist)) {
      // Usar la imagen del artista si está disponible, sino usar la portada de la canción
      let coverImage = artistImages[primaryArtist] || song.coverImage;
      artistMap.set(primaryArtist, {
        name: primaryArtist,
        cover: coverImage,
      });
    }
  });
  return Array.from(artistMap.values());
};

// Función para obtener géneros únicos
const getUniqueGenres = () => {
  const genreSet = new Set<string>();
  localSongs.forEach((song) => {
    if (song.genre) {
      genreSet.add(song.genre);
    }
  });
  return Array.from(genreSet);
};

// Función para obtener playlists (basadas en álbumes)
const getPlaylists = () => {
  const playlistMap = new Map<string, { id: string; name: string; artist: string; cover: any; songCount: number }>();
  localSongs.forEach((song) => {
    if (song.album) {
      if (!playlistMap.has(song.album)) {
        const primaryArtist = song.artist.split(' ft.')[0].split(' &')[0].split(',')[0].trim();
        const songsInAlbum = localSongs.filter(s => s.album === song.album);
        // Para "Un Verano Sin Ti", usar la portada de Aguacero
        let coverImage = song.coverImage;
        if (song.album === 'Un Verano Sin Ti') {
          const aguaceroSong = localSongs.find(s => s.id === 'aguacero');
          if (aguaceroSong) {
            coverImage = aguaceroSong.coverImage; // Ya usa aguacero.jpg
          }
        }
        playlistMap.set(song.album, {
          id: song.album,
          name: song.album,
          artist: primaryArtist,
          cover: coverImage,
          songCount: songsInAlbum.length,
        });
      }
    }
  });
  return Array.from(playlistMap.values());
};

const TrackListScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { currentTrack, isPlaying, playNewSong } = useAudio();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();
  
  const greeting = getGreeting();
  const topSongs = localSongs.slice(0, 15);
  const artists = getUniqueArtists();
  const genres = getUniqueGenres();
  const playlists = getPlaylists();

  const handleTrackPress = async (track: any) => {
    if (currentTrack?.id === track.id) {
      if (navigation) {
        navigation.navigate('NowPlaying');
      }
      return;
    }
    await playNewSong(track);
    if (navigation) {
      navigation.navigate('NowPlaying');
    }
  };

  const handleArtistPress = (artistName: string) => {
    // Navegar a vista de artista o filtrar canciones
    console.log('Artist pressed:', artistName);
  };

  const handleGenrePress = (genre: string) => {
    // Filtrar canciones por género
    console.log('Genre pressed:', genre);
  };

  const handlePlaylistPress = (playlist: any) => {
    // Navegar a vista de playlist
    console.log('Playlist pressed:', playlist.name);
  };

  const renderSongCard = ({ item }: { item: any }) => {
    const isCurrentTrack = currentTrack?.id === item.id;
    
    return (
      <TouchableOpacity
        style={styles.songCard}
        onPress={() => handleTrackPress(item)}
        activeOpacity={0.8}
      >
        <Image source={item.coverImage} style={styles.songCardImage} resizeMode="cover" />
        <Text style={styles.songCardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.songCardArtist} numberOfLines={1}>
          {item.artist}
        </Text>
        {isCurrentTrack && isPlaying && (
          <View style={styles.playingIndicator}>
            <Ionicons name="musical-notes" size={12} color={Colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderArtistCard = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.artistCard}
        onPress={() => handleArtistPress(item.name)}
        activeOpacity={0.8}
      >
        <Image source={item.cover} style={styles.artistCardImage} resizeMode="cover" />
        <Text style={styles.artistCardName} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderGenreCard = ({ item }: { item: string }) => {
    const genreSongs = getLocalSongsByGenre(item);
    
    return (
      <TouchableOpacity
        style={styles.genreCard}
        onPress={() => handleGenrePress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.genreCardContent}>
          <Ionicons name="musical-notes" size={24} color={Colors.primary} />
          <Text style={styles.genreCardName}>{item}</Text>
          <Text style={styles.genreCardCount}>{genreSongs.length} canciones</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPlaylistCard = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.playlistCard}
        onPress={() => handlePlaylistPress(item)}
        activeOpacity={0.8}
      >
        <Image source={item.cover} style={styles.playlistCardImage} resizeMode="cover" />
        <Text style={styles.playlistCardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.playlistCardArtist} numberOfLines={1}>
          {item.artist}
        </Text>
        <Text style={styles.playlistCardCount}>{item.songCount} songs</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sección de Perfil */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={32} color={Colors.text} />
                </View>
              </View>
              <View style={styles.profileText}>
                <Text style={styles.greeting}>{greeting},</Text>
                <Text style={styles.userName}>{user?.username || 'User'}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={24} color={Colors.text} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Buscador */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar canciones o playlists"
              placeholderTextColor={Colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Sección: Tus Canciones (Top 15) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Tu Música</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={topSongs}
            renderItem={renderSongCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Sección: Top Artists */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="people" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Top Artists</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={artists}
            renderItem={renderArtistCard}
            keyExtractor={(item) => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Sección: Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="grid" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Categorías</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={genres}
            renderItem={renderGenreCard}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Sección: Playlists */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="list" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Playlists</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={playlists}
            renderItem={renderPlaylistCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Espacio inferior para el mini player y navegación */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  profileText: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 25,
    paddingHorizontal: 18,
    height: 50,
    ...Shadows.small,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    paddingVertical: 0,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  songCard: {
    width: 140,
    marginRight: 16,
    position: 'relative',
  },
  songCardImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 10,
    ...Shadows.small,
  },
  songCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  songCardArtist: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  playingIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  artistCard: {
    width: 100,
    marginRight: 16,
    alignItems: 'center',
  },
  artistCardImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    ...Shadows.small,
  },
  artistCardName: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
  genreCard: {
    width: 140,
    height: 100,
    marginRight: 16,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 16,
    ...Shadows.small,
  },
  genreCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  genreCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  genreCardCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  playlistCard: {
    width: 160,
    marginRight: 16,
  },
  playlistCardImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    marginBottom: 10,
    ...Shadows.small,
  },
  playlistCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  playlistCardArtist: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  playlistCardCount: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
});

export default TrackListScreen;
