 import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// Datos de ejemplo para la biblioteca
const demoPlaylists = [
  {
    id: '1',
    name: 'Mi Playlist Favorita',
    songs: 25,
    image: 'https://via.placeholder.com/100x100/20B2AA/FFFFFF?text=MPF',
    owner: 'Usuario',
  },
  {
    id: '2',
    name: 'Rock Clásico',
    songs: 18,
    image: 'https://via.placeholder.com/100x100/FF6B6B/FFFFFF?text=RC',
    owner: 'Usuario',
  },
  {
    id: '3',
    name: 'Pop Hits 2024',
    songs: 32,
    image: 'https://via.placeholder.com/100x100/4ECDC4/FFFFFF?text=PH',
    owner: 'Usuario',
  },
];

const demoAlbums = [
  {
    id: '1',
    name: 'Thriller',
    artist: 'Michael Jackson',
    year: 1982,
    image: 'https://via.placeholder.com/100x100/1DB954/FFFFFF?text=T',
  },
  {
    id: '2',
    name: 'Abbey Road',
    artist: 'The Beatles',
    year: 1969,
    image: 'https://via.placeholder.com/100x100/FFD700/FFFFFF?text=AR',
  },
  {
    id: '3',
    name: 'Dark Side of the Moon',
    artist: 'Pink Floyd',
    year: 1973,
    image: 'https://via.placeholder.com/100x100/9B59B6/FFFFFF?text=DS',
  },
];

const demoArtists = [
  {
    id: '1',
    name: 'Michael Jackson',
    followers: '50M',
    image: 'https://via.placeholder.com/100x100/1DB954/FFFFFF?text=MJ',
  },
  {
    id: '2',
    name: 'The Beatles',
    followers: '45M',
    image: 'https://via.placeholder.com/100x100/FFD700/FFFFFF?text=TB',
  },
  {
    id: '3',
    name: 'Queen',
    followers: '40M',
    image: 'https://via.placeholder.com/100x100/FF6B6B/FFFFFF?text=Q',
  },
];

const demoMusic = [
  {
    id: '1',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    album: 'Thriller',
    duration: 294,
    image: 'https://via.placeholder.com/50x50/1DB954/FFFFFF?text=BJ',
  },
  {
    id: '2',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: 355,
    image: 'https://via.placeholder.com/50x50/FF6B6B/FFFFFF?text=BR',
  },
  {
    id: '3',
    title: 'Imagine',
    artist: 'John Lennon',
    album: 'Imagine',
    duration: 183,
    image: 'https://via.placeholder.com/50x50/4ECDC4/FFFFFF?text=I',
  },
];

// Datos de ejemplo
const userPlaylists = [
  {
    id: '1',
    name: 'Mi Playlist Favorita',
    songs: 25,
    image: 'https://via.placeholder.com/100x100/20B2AA/FFFFFF?text=MPF',
    lastPlayed: 'Hace 2 horas',
  },
  {
    id: '2',
    name: 'Música para trabajar',
    songs: 15,
    image: 'https://via.placeholder.com/100x100/FF6B6B/FFFFFF?text=MT',
    lastPlayed: 'Ayer',
  },
  {
    id: '3',
    name: 'Gym Session',
    songs: 30,
    image: 'https://via.placeholder.com/100x100/4ECDC4/FFFFFF?text=GS',
    lastPlayed: 'Hace 3 días',
  },
];

const recentAlbums = [
  {
    id: '1',
    title: 'Album Favorito',
    artist: 'Artista Favorito',
    year: '2024',
    image: 'https://via.placeholder.com/100x100/45B7D1/FFFFFF?text=AF',
  },
  {
    id: '2',
    title: 'Nuevo Lanzamiento',
    artist: 'Nuevo Artista',
    year: '2024',
    image: 'https://via.placeholder.com/100x100/96CEB4/FFFFFF?text=NL',
  },
];

const librarySections = [
  { title: 'Playlists', icon: 'list', count: userPlaylists.length },
  { title: 'Álbumes', icon: 'albums', count: recentAlbums.length },
  { title: 'Artistas', icon: 'people', count: 45 },
  { title: 'Canciones', icon: 'musical-notes', count: 234 },
  { title: 'Descargadas', icon: 'download', count: 12 },
  { title: 'Historial', icon: 'time', count: 89 },
];

export default function LibraryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('Playlists');
  const [userPlaylistsData] = useState(demoPlaylists);
  const [userAlbumsData] = useState(demoAlbums);
  const [userArtistsData] = useState(demoArtists);
  const [userSongsData] = useState(demoMusic);

  const renderPlaylists = () => (
    <View style={styles.contentSection}>
      {userPlaylistsData.map((playlist) => (
        <TouchableOpacity key={playlist.id} style={styles.playlistItem}>
          <Image source={{ uri: playlist.image }} style={styles.playlistImage} />
          <View style={styles.playlistInfo}>
            <Text style={styles.playlistName}>{playlist.name}</Text>
            <Text style={styles.playlistDetails}>
              {playlist.songs} canciones • {playlist.owner}
            </Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#ccc" />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAlbums = () => (
    <View style={styles.contentSection}>
      {userAlbumsData.map((album) => (
        <TouchableOpacity key={album.id} style={styles.albumItem}>
          <Image source={{ uri: album.image }} style={styles.albumImage} />
          <View style={styles.albumInfo}>
            <Text style={styles.albumTitle}>{album.name}</Text>
            <Text style={styles.albumArtist}>{album.artist} • {album.year}</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#ccc" />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
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
          <Ionicons name="swap-vertical" size={24} color="#20B2AA" />
        </TouchableOpacity>
      </View>

      {/* Secciones de la biblioteca */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sectionsContainer}>
        {librarySections.map((section) => (
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
              color={selectedSection === section.title ? '#20B2AA' : '#ccc'}
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

      {/* Contenido según la sección seleccionada */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedSection === 'Playlists' && renderPlaylists()}
        {selectedSection === 'Álbumes' && renderAlbums()}
        
        {selectedSection === 'Artistas' && (
          <View style={styles.contentSection}>
            <Text style={styles.emptyText}>Artistas aparecerán aquí</Text>
          </View>
        )}
        
        {selectedSection === 'Canciones' && (
          <View style={styles.contentSection}>
            <Text style={styles.emptyText}>Tus canciones aparecerán aquí</Text>
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 15,
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
  sortButton: {
    padding: 8,
  },
  sectionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedSectionButton: {
    backgroundColor: '#20B2AA',
  },
  sectionText: {
    color: '#ccc',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedSectionText: {
    color: '#fff',
  },
  sectionCount: {
    color: '#888',
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
    borderBottomColor: '#333',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  playlistDetails: {
    color: '#888',
    fontSize: 14,
  },
  albumItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
  moreButton: {
    padding: 8,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
  },
});
