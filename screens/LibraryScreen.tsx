import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { LocalSongList } from '../components/LocalSongList';
import MiniPlayer from '../components/MiniPlayer';
import { Colors, Shadows } from '../constants/Colors';
import { artistImages } from '../data/artists';
import { localSongs, searchLocalSongs } from '../data/localMusic';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
// Derivaciones simples de tu música local

const buildAlbumsFromLocal = () => {
  const map = new Map<string, { id: string; name: string; artist: string; year?: number; cover: any }>();
  localSongs.forEach((s) => {
    if (!s.album) return;
    const key = s.album;
    if (!map.has(key)) {
      const primaryArtist = getPrimaryArtist(s.artist);
      map.set(key, { id: key, name: s.album, artist: primaryArtist, year: s.year, cover: s.coverImage });
    }
  });
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
};

const allowedArtists = new Set([
  'Dua Lipa',
  'Imagine Dragons',
  'Sam Smith',
  "Guns N' Roses",
]);

const getPrimaryArtist = (artistField: string): string => {
  const normalized = artistField
    .replace(/\s+ft\.?\s+/i, ' & ')
    .replace(/\s+feat\.?\s+/i, ' & ')
    .replace(/\s+featuring\s+/i, ' & ');
  const separators = [',', '&'];
  let primary = normalized;
  for (const sep of separators) {
    if (primary.includes(sep)) {
      primary = primary.split(sep)[0];
    }
  }
  return primary.trim();
};

const buildArtistsFromLocal = () => {
  const map = new Map<string, { id: string; name: string }>();
  localSongs.forEach((s) => {
    const primary = getPrimaryArtist(s.artist);
    if (allowedArtists.has(primary) && !map.has(primary)) {
      map.set(primary, { id: primary, name: primary });
    }
  });
  return Array.from(map.values());
};

const getFallbackArtistCover = (artistName: string) => {
  for (const s of localSongs) {
    if (getPrimaryArtist(s.artist) === artistName) {
      return s.coverImage;
    }
  }
  return undefined;
};

export default function LibraryScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('Canciones');
  const albums = buildAlbumsFromLocal();
  const artists = buildArtistsFromLocal();
  
  const { 
    playSong, 
    currentSong, 
    isPlaying, 
    isMiniPlayerVisible, 
    togglePlayPause, 
    hideMiniPlayer 
  } = useAudioPlayer();

  // Función para manejar el clic en una canción local
  const handleLocalSongPress = async (song: any) => {
    // Solo navegar al reproductor
    navigation.navigate('NowPlaying', {
      song: song
    });
  };

  // Función para manejar el clic en el botón de play
  const handlePlayPress = async (song: any) => {
    // Si es la misma canción que ya está reproduciendo, solo navegar
    if (currentSong?.id === song.id && isPlaying) {
      navigation.navigate('NowPlaying', {
        song: song
      });
      return;
    }
    
    // Si es una canción diferente, reproducir y navegar
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
    console.log('Siguiente canción');
  };

  const handlePrevious = () => {
    console.log('Canción anterior');
  };

  // Filtrar canciones locales según la búsqueda
  const filteredLocalSongs = searchQuery 
    ? searchLocalSongs(searchQuery)
    : localSongs;

  const renderSongs = () => (
    <View style={styles.contentSection}>
      {filteredLocalSongs.length > 0 ? (
        <LocalSongList
          songs={filteredLocalSongs}
          onSongPress={handleLocalSongPress}
          currentPlayingSongId={currentSong?.id}
          showAlbumArt={true}
          showDuration={true}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.emptyText}>
          {searchQuery ? 'No se encontraron canciones' : 'No tienes canciones locales'}
        </Text>
      )}
    </View>
  );

  const renderAlbums = () => (
    <View style={styles.contentSection}>
      <FlatList
        data={albums}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.albumColumn}
        contentContainerStyle={styles.albumList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.albumGridItem} activeOpacity={0.8}>
            <Image source={item.cover} style={styles.albumGridImage} resizeMode="cover" />
            <Text style={styles.albumGridTitle} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
            <Text style={styles.albumGridSubtitle} numberOfLines={1} ellipsizeMode="tail">{item.artist}{item.year ? ` • ${item.year}` : ''}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header con búsqueda */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en tu biblioteca"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="swap-vertical" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Secciones de la biblioteca */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sectionsContainer}>
        {[
          { title: 'Canciones', icon: 'musical-notes', count: localSongs.length },
          { title: 'Artistas', icon: 'people', count: artists.length },
          { title: 'Álbumes', icon: 'albums', count: albums.length },
        ].map((section) => (
          <TouchableOpacity
            key={section.title}
            style={[
              styles.sectionButton,
              selectedSection === section.title && styles.selectedSectionButton,
            ]}
            onPress={() => setSelectedSection(section.title)}
          >
            <Ionicons
              name={section.icon as any}
              size={20}
              color={selectedSection === section.title ? Colors.primary : Colors.textTertiary}
            />
            <Text
              style={[
                styles.sectionText,
                selectedSection === section.title && styles.selectedSectionText,
              ]}
            >
              {section.title}
            </Text>
            <Text style={styles.sectionCount}>{section.count}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contenido según la sección seleccionada: un SOLO scroller por sección */}
      {selectedSection === 'Canciones' && (
        <View style={styles.content}>
          {filteredLocalSongs.length > 0 ? (
            <LocalSongList
              songs={filteredLocalSongs}
              onSongPress={handleLocalSongPress}
              currentPlayingSongId={currentSong?.id}
              showAlbumArt={true}
              showDuration={true}
              scrollEnabled={true}
              bottomSpacing={isMiniPlayerVisible ? 200 : 100}
            />
          ) : (
            <View style={styles.contentSection}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No se encontraron canciones' : 'No tienes canciones locales'}
              </Text>
            </View>
          )}
        </View>
      )}

      {selectedSection === 'Álbumes' && (
        <View style={styles.content}>
          <View style={styles.contentSection}>
            <FlatList
              data={albums}
              keyExtractor={(item) => item.id}
              numColumns={4}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={styles.albumColumn}
              contentContainerStyle={styles.albumList}
              ListFooterComponent={() => <View style={{ height: isMiniPlayerVisible ? 200 : 100 }} />}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.albumGridItem} activeOpacity={0.8}>
                  <Image source={item.cover} style={styles.albumGridImage} resizeMode="cover" />
                  <Text style={styles.albumGridTitle} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                  <Text style={styles.albumGridSubtitle} numberOfLines={1} ellipsizeMode="tail">{item.artist}{item.year ? ` • ${item.year}` : ''}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}

      {selectedSection === 'Artistas' && (
        <View style={styles.content}>
          <FlatList
            data={artists}
            keyExtractor={(item) => item.id}
            numColumns={6}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.artistColumn}
            contentContainerStyle={styles.artistList}
            ListFooterComponent={() => <View style={{ height: isMiniPlayerVisible ? 120 : 20 }} />}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.artistGridItem} activeOpacity={0.8}>
                {artistImages[item.name]
                  ? <Image source={artistImages[item.name]} style={styles.artistImage} resizeMode="cover" />
                  : getFallbackArtistCover(item.name)
                    ? <Image source={getFallbackArtistCover(item.name) as any} style={styles.artistImage} resizeMode="cover" />
                    : <View style={styles.artistAvatar}><Ionicons name="person" size={18} color={Colors.text} /></View>
                }
                <Text style={styles.artistTitle} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Mini Player */}
      {isMiniPlayerVisible && (
        <MiniPlayer />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  scrollContentWithMiniPlayer: {
    paddingBottom: 120, // Espacio para el mini-player
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 15,
    ...Shadows.small,
  },
  searchIcon: {
    marginRight: 10,
    color: Colors.textSecondary,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    paddingVertical: 12,
  },
  sortButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    ...Shadows.small,
  },
  sectionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    ...Shadows.small,
  },
  selectedSectionButton: {
    backgroundColor: Colors.primary,
    ...Shadows.glow,
  },
  sectionText: {
    color: Colors.textSecondary,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedSectionText: {
    color: Colors.text,
  },
  sectionCount: {
    color: Colors.textTertiary,
    marginLeft: 5,
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  contentSection: {
    paddingHorizontal: 20,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  playlistImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  playlistDetails: {
    color: Colors.textTertiary,
    fontSize: 14,
  },
  albumItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  albumImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  albumInfo: {
    flex: 1,
  },
  albumTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  albumArtist: {
    color: Colors.textTertiary,
    fontSize: 14,
  },
  moreButton: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: Colors.surfaceSecondary,
  },
  sectionHeading: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  playlistsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  playlistCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    ...Shadows.small,
  },
  playlistThumbRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  playlistThumb: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 8,
    marginRight: '4%',
    marginBottom: '4%',
  },
  playlistCardTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },
  playlistCardMeta: {
    color: Colors.textTertiary,
    fontSize: 12,
    marginTop: 2,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
  },
  recentCard: {
    width: 120,
    marginRight: 12,
  },
  recentImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    ...Shadows.small,
  },
  recentTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 6,
  },
  recentArtist: {
    color: Colors.textTertiary,
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  },
  gridImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
    ...Shadows.small,
  },
  gridTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  gridSubtitle: {
    color: Colors.textTertiary,
    fontSize: 12,
  },
  // Álbumes (3 columnas, más compacto)
  albumGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  albumList: {
    paddingHorizontal: 20,
  },
  albumColumn: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  albumGridItem: {
    flexBasis: '23%',
    maxWidth: '23%',
  },
  albumGridImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 6,
    marginBottom: 3,
  },
  albumGridTitle: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: '500',
  },
  albumGridSubtitle: {
    color: Colors.textTertiary,
    fontSize: 9,
  },
  // Artistas (3 columnas)
  artistList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  artistColumn: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  artistGridItem: {
    flexBasis: '15.5%',
    maxWidth: '15.5%',
    marginBottom: 6,
  },
  artistAvatar: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  artistImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 2,
  },
  artistTitle: {
    color: Colors.text,
    fontSize: 9,
    fontWeight: '500',
  },
  
  emptyText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
  },
});
