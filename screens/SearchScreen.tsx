import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { LocalSongList } from '../components/LocalSongList';
import { MiniPlayer } from '../components/MiniPlayer';
import { Colors, Shadows } from '../constants/Colors';
import { LocalSong, searchLocalSongs } from '../data/localMusic';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

const { width } = Dimensions.get('window');

// Datos de ejemplo
const trendingSearches = [
  'Bad Bunny', 'Taylor Swift', 'The Weeknd', 'Billie Eilish', 'Drake', 'Ariana Grande'
];

const categories = [
  { title: 'Pop', color: Colors.primary, icon: 'musical-notes' },
  { title: 'Rock', color: Colors.accent, icon: 'guitar' },
  { title: 'Hip Hop', color: Colors.secondary, icon: 'mic' },
  { title: 'Jazz', color: Colors.primaryLight, icon: 'piano' },
  { title: 'Clásica', color: Colors.accentLight, icon: 'musical-note' },
  { title: 'Electrónica', color: Colors.secondaryLight, icon: 'radio' },
];

const featuredPlaylists = [
  {
    id: '1',
    title: 'Top Global',
    subtitle: 'Las más escuchadas',
    image: 'https://via.placeholder.com/150x150/20B2AA/FFFFFF?text=TG',
  },
  {
    id: '2',
    title: 'Nuevos Lanzamientos',
    subtitle: 'Lo último en música',
    image: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=NL',
  },
  {
    id: '3',
    title: 'Música Relajante',
    subtitle: 'Para estudiar y trabajar',
    image: 'https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=MR',
  },
];

// Resultados de ejemplo eliminados: se usarán canciones locales

export default function SearchScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<LocalSong[]>([]);

  const { 
    currentSong, 
    isPlaying, 
    isMiniPlayerVisible, 
    togglePlayPause, 
    hideMiniPlayer 
  } = useAudioPlayer();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
    if (query.length > 0) {
      setResults(searchLocalSongs(query));
    } else {
      setResults([]);
    }
  };

  const renderSearchResults = () => {
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Resultados para "{searchQuery}"</Text>
        {results.length === 0 ? (
          <View style={styles.emptyResults}>
            <Ionicons name="search" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>No se encontraron resultados</Text>
          </View>
        ) : (
          <LocalSongList
            songs={results}
            onSongPress={(song) => {
              navigation.navigate('NowPlaying', { song });
            }}
            showAlbumArt={true}
            showDuration={true}
          />
        )}
      </View>
    );
  };

  const renderBrowseContent = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Búsquedas populares */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Búsquedas populares</Text>
        <View style={styles.trendingContainer}>
          {['Queen', 'The Beatles', 'Ed Sheeran', 'Taylor Swift', 'Drake', 'Billie Eilish'].map((search, index) => (
            <TouchableOpacity
              key={index}
              style={styles.trendingItem}
              onPress={() => handleSearch(search)}
            >
              <Ionicons name="trending-up" size={16} color={Colors.primary} />
              <Text style={styles.trendingText}>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Géneros de Spotify */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explorar por género</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.genresContainer}>
            {['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'Country', 'R&B'].map((genre, index) => (
              <TouchableOpacity
                key={index}
                style={styles.genreCard}
                onPress={() => handleSearch(genre)}
              >
                <View style={styles.genreIcon}>
                  <Ionicons name="musical-notes" size={24} color={Colors.text} />
                </View>
                <Text style={styles.genreName}>{genre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="¿Qué quieres escuchar?"
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Contenido */}
      {isSearching ? renderSearchResults() : renderBrowseContent()}

      {/* Mini Player */}
      {isMiniPlayerVisible && (
        <MiniPlayer
          song={currentSong}
          isPlaying={isPlaying}
          onPress={() => navigation.navigate('NowPlaying', { song: currentSong })}
          onPlayPause={togglePlayPause}
          onNext={() => {}}
          onPrevious={() => {}}
          onClose={hideMiniPlayer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 25,
    paddingHorizontal: 15,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  trendingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
    ...Shadows.small,
  },
  trendingText: {
    color: Colors.text,
    marginLeft: 6,
    fontSize: 14,
  },
  genresContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  genreCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 18,
    marginRight: 16,
    alignItems: 'center',
    minWidth: 110,
    ...Shadows.medium,
  },
  genreIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    ...Shadows.medium,
  },
  genreName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  resultsContainer: {
    paddingHorizontal: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  trackArtist: {
    color: Colors.textTertiary,
    fontSize: 14,
  },
  trackActions: {
    alignItems: 'flex-end',
  },
  playButton: {
    marginTop: 5,
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    ...Shadows.small,
  },
  emptyResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginTop: 10,
  },
});
