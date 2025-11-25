import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAudio } from '../contexts/AudioProvider';
import { Colors, Shadows } from '../constants/Colors';
import { localSongs } from '../data/localMusic';

const FavoritesScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { currentTrack, isPlaying, playNewSong } = useAudio();
  const [favorites, setFavorites] = useState<string[]>([]); // IDs de canciones favoritas
  const insets = useSafeAreaInsets();

  // Filtrar canciones favoritas
  const favoriteSongs = localSongs.filter(song => favorites.includes(song.id));

  const handleToggleFavorite = (songId: string) => {
    setFavorites(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

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

  const renderSongItem = ({ item }: { item: any }) => {
    const isCurrentTrack = currentTrack?.id === item.id;
    const isFavorite = favorites.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.songItem,
          isCurrentTrack && styles.currentSongItem
        ]}
        onPress={() => handleTrackPress(item)}
        activeOpacity={0.7}
      >
        <Image source={item.coverImage} style={styles.songImage} resizeMode="cover" />
        <View style={styles.songInfo}>
          <Text style={[
            styles.songTitle,
            isCurrentTrack && styles.currentSongTitle
          ]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.songArtist} numberOfLines={1}>
            {item.artist}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleToggleFavorite(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? Colors.primary : Colors.textSecondary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.headerSubtitle}>
          {favoriteSongs.length} {favoriteSongs.length === 1 ? 'song' : 'songs'}
        </Text>
      </View>

      {favoriteSongs.length > 0 ? (
        <FlatList
          data={favoriteSongs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color={Colors.textTertiary} />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the heart icon on any song to add it to favorites
          </Text>
        </View>
      )}

      {/* Espacio inferior para el mini player y navegación */}
      <View style={{ height: 180 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  currentSongItem: {
    backgroundColor: Colors.overlayLight,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    paddingLeft: 16,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  songImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 16,
    ...Shadows.small,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  currentSongTitle: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  songArtist: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  favoriteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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

export default FavoritesScreen;

