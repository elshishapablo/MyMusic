import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Datos de ejemplo
const trendingSearches = [
  'Bad Bunny', 'Taylor Swift', 'The Weeknd', 'Billie Eilish', 'Drake', 'Ariana Grande'
];

const categories = [
  { title: 'Pop', color: '#FF6B6B', icon: 'musical-notes' },
  { title: 'Rock', color: '#4ECDC4', icon: 'guitar' },
  { title: 'Hip Hop', color: '#45B7D1', icon: 'mic' },
  { title: 'Jazz', color: '#96CEB4', icon: 'piano' },
  { title: 'Clásica', color: '#FECA57', icon: 'musical-note' },
  { title: 'Electrónica', color: '#FF9FF3', icon: 'radio' },
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

const searchResults = [
  {
    type: 'song',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
  },
  {
    type: 'song',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: '3:23',
  },
  {
    type: 'artist',
    name: 'Billie Eilish',
    followers: '50M seguidores',
    image: 'https://via.placeholder.com/60x60/20B2AA/FFFFFF?text=BE',
  },
  {
    type: 'album',
    title: 'folklore',
    artist: 'Taylor Swift',
    year: '2020',
    image: 'https://via.placeholder.com/60x60/FF6B6B/FFFFFF?text=TS',
  },
];

export default function SearchScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
    
    if (query.length > 0) {
      // Datos de ejemplo para búsqueda
      const exampleResults = [
        { id: '1', title: 'Shape of You', artist: 'Ed Sheeran', album: '÷ (Divide)', image: 'https://via.placeholder.com/300x300/1DB954/FFFFFF?text=SO' },
        { id: '2', title: 'Perfect', artist: 'Ed Sheeran', album: '÷ (Divide)', image: 'https://via.placeholder.com/300x300/1DB954/FFFFFF?text=P' },
        { id: '3', title: 'Thinking Out Loud', artist: 'Ed Sheeran', album: 'x', image: 'https://via.placeholder.com/300x300/1DB954/FFFFFF?text=TOL' },
      ];
      setSearchResults(exampleResults);
    } else {
      setSearchResults([]);
    }
  };

  const renderSearchResults = () => {
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Resultados para "{searchQuery}"</Text>

        {searchResults.length === 0 ? (
          <View style={styles.emptyResults}>
            <Ionicons name="search" size={48} color="#666" />
            <Text style={styles.emptyText}>No se encontraron resultados</Text>
          </View>
        ) : (
          searchResults.map((result, index) => (
            <TouchableOpacity
              key={`search_${result.id}_${index}`}
              style={styles.resultItem}
            >
              <Image source={{ uri: result.image }} style={styles.trackImage} />
              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle}>{result.title}</Text>
                <Text style={styles.trackArtist}>{result.artist} • {result.album}</Text>
              </View>
              <View style={styles.trackActions}>
                <TouchableOpacity style={styles.playButton}>
                  <Ionicons name="play" size={20} color="#1DB954" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
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
              <Ionicons name="trending-up" size={16} color="#1DB954" />
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
                  <Ionicons name="musical-notes" size={24} color="#fff" />
                </View>
                <Text style={styles.genreName}>{genre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Spotify destacado */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spotify</Text>
        <View style={styles.spotifyInfo}>
          <Ionicons name="logo-spotify" size={48} color="#1DB954" />
          <Text style={styles.spotifyTitle}>Descubre música con derechos</Text>
          <Text style={styles.spotifySubtitle}>
            Millones de canciones oficiales de artistas reconocidos
          </Text>
          <View style={styles.demoInfo}>
            <Ionicons name="information-circle" size={20} color="#FFA500" />
            <Text style={styles.demoText}>
              Modo Demo: Configura Spotify para reproducción real
            </Text>
          </View>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => handleSearch('popular')}
          >
            <Text style={styles.exploreButtonText}>Explorar Música</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="¿Qué quieres escuchar?"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
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
    backgroundColor: '#1a1a1a',
  },
  searchHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  trendingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  trendingText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 60) / 2,
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  playlistCard: {
    width: 150,
    marginRight: 15,
  },
  playlistImage: {
    width: 150,
    height: 150,
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
  },
  resultsContainer: {
    paddingHorizontal: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  songArtist: {
    color: '#888',
    fontSize: 14,
  },
  songDuration: {
    color: '#888',
    fontSize: 14,
  },
  artistImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  artistFollowers: {
    color: '#888',
    fontSize: 14,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  albumArtist: {
    color: '#888',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    color: '#ccc',
    marginTop: 10,
    fontSize: 16,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 50,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1DB954',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  searchTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#333',
    borderRadius: 25,
    padding: 4,
  },
  searchTypeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeSearchType: {
    backgroundColor: '#20B2AA',
  },
  searchTypeText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '500',
  },
  activeSearchTypeText: {
    color: '#fff',
  },
  emptyResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginTop: 10,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  trackArtist: {
    color: '#888',
    fontSize: 14,
  },
  trackDuration: {
    color: '#888',
    fontSize: 14,
    minWidth: 40,
    textAlign: 'right',
  },
  albumTracks: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  artistGenres: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  trackStats: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  trackActions: {
    alignItems: 'flex-end',
  },
  playButton: {
    marginTop: 5,
    padding: 5,
  },
  artistStats: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
        spotifyInfo: {
          alignItems: 'center',
          paddingVertical: 30,
          paddingHorizontal: 20,
        },
        spotifyTitle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#fff',
          marginTop: 15,
          marginBottom: 8,
          textAlign: 'center',
        },
        spotifySubtitle: {
          fontSize: 14,
          color: '#ccc',
          textAlign: 'center',
          marginBottom: 20,
          lineHeight: 20,
        },
        exploreButton: {
          backgroundColor: '#1DB954',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 20,
        },
        exploreButtonText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
        },
        demoInfo: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#2A2A2A',
          paddingHorizontal: 15,
          paddingVertical: 8,
          borderRadius: 20,
          marginBottom: 15,
        },
        demoText: {
          color: '#FFA500',
          fontSize: 12,
          marginLeft: 8,
          textAlign: 'center',
        },
});
