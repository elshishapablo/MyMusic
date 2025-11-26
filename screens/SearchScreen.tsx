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
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Shadows } from '../constants/Colors';
import { useAudio } from '../contexts/AudioProvider';
import { getLocalSongsByGenre, localSongs, searchLocalSongs } from '../data/localMusic';

const { width } = Dimensions.get('window');

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

// Función para obtener artistas únicos para búsquedas populares
const getPopularArtists = () => {
  const artistMap = new Map<string, string>();
  localSongs.forEach((song) => {
    const primaryArtist = song.artist.split(' ft.')[0].split(' &')[0].split(',')[0].trim();
    if (!artistMap.has(primaryArtist)) {
      artistMap.set(primaryArtist, primaryArtist);
    }
  });
  return Array.from(artistMap.values()).slice(0, 6);
};

export default function SearchScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { currentTrack, isPlaying, playNewSong } = useAudio();
  const insets = useSafeAreaInsets();

  const genres = getUniqueGenres();
  const popularArtists = getPopularArtists();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
    if (query.length > 0) {
      const searchResults = searchLocalSongs(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  const handleTrackPress = async (track: any) => {
    if (currentTrack?.id === track.id) {
      navigation.navigate('NowPlaying');
      return;
    }
    await playNewSong(track);
    navigation.navigate('NowPlaying');
  };

  const handleGenrePress = (genre: string) => {
    const genreSongs = getLocalSongsByGenre(genre);
    setSearchQuery(genre);
    setIsSearching(true);
    setResults(genreSongs);
  };

  const handleArtistPress = (artistName: string) => {
    handleSearch(artistName);
  };

  const renderSongResult = ({ item }: { item: any }) => {
    const isCurrentTrack = currentTrack?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.resultItem, isCurrentTrack && styles.currentResultItem]}
        onPress={() => handleTrackPress(item)}
        activeOpacity={0.7}
      >
        <Image source={item.coverImage} style={styles.resultImage} resizeMode="cover" />
        <View style={styles.resultInfo}>
          <Text style={[styles.resultTitle, isCurrentTrack && styles.currentResultTitle]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.resultArtist} numberOfLines={1}>
            {item.artist}
          </Text>
        </View>
        {isCurrentTrack && isPlaying && (
          <View style={styles.playingIndicator}>
            <Ionicons name="musical-notes" size={16} color={Colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSearchResults = () => {
    if (results.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color={Colors.textTertiary} />
           <Text style={styles.emptyText}>No se encontraron resultados</Text>
           <Text style={styles.emptySubtext}>
             Intenta buscar una canción, artista o álbum
           </Text>
        </View>
      );
    }

    return (
      <View style={styles.resultsContainer}>
         <Text style={styles.resultsTitle}>
           Resultados para "{searchQuery}"
         </Text>
        <FlatList
          data={results}
          renderItem={renderSongResult}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
        />
      </View>
    );
  };

  const renderBrowseContent = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.browseContent}
    >
      {/* Búsquedas populares */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="trending-up" size={20} color={Colors.primary} />
             <Text style={styles.sectionTitle}>Búsquedas Populares</Text>
          </View>
        </View>
        <View style={styles.trendingContainer}>
          {popularArtists.map((artist, index) => (
            <TouchableOpacity
              key={index}
              style={styles.trendingItem}
              onPress={() => handleArtistPress(artist)}
              activeOpacity={0.7}
            >
              <Text style={styles.trendingText}>{artist}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Géneros */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="grid" size={20} color={Colors.primary} />
             <Text style={styles.sectionTitle}>Explorar por Género</Text>
          </View>
        </View>
        <FlatList
          data={genres}
          renderItem={({ item }) => {
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
          }}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.genresList}
        />
      </View>

      {/* Espacio inferior */}
      <View style={{ height: 180 }} />
    </ScrollView>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header con búsqueda */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
             placeholder="Buscar canciones o artistas"
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => handleSearch('')}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Contenido */}
      {isSearching ? renderSearchResults() : renderBrowseContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
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
  browseContent: {
    paddingBottom: 20,
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
  trendingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  trendingItem: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    ...Shadows.small,
  },
  trendingText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  genresList: {
    paddingHorizontal: 20,
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
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
    marginTop: 10,
  },
  resultsList: {
    paddingBottom: 180,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  currentResultItem: {
    backgroundColor: Colors.overlayLight,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    paddingLeft: 16,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  resultImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 16,
    ...Shadows.small,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  currentResultTitle: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  resultArtist: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  playingIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
