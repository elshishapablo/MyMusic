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
  const [favorites, setFavorites] = useState<string[]>(() =>
    localSongs.slice(0, 5).map((s) => s.id)
  ); // demo: primeras canciones favoritas
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
        <Text style={styles.headerTitle}>Favoritos</Text>
        <Text style={styles.headerSubtitle}>
          {favoriteSongs.length} {favoriteSongs.length === 1 ? 'canción' : 'canciones'}
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
          <Text style={styles.emptyText}>Aún no tienes favoritos</Text>
          <Text style={styles.emptySubtext}>
            Toca el ícono de corazón en cualquier canción para agregarla a favoritos
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
    fontWeight: '800',
    letterSpacing: -0.6,
    color: Colors.text,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
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
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currentSongItem: {
    backgroundColor: Colors.overlayLight,
    borderColor: Colors.primary + '66',
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  songImage: {
    width: 54,
    height: 54,
    borderRadius: 12,
    marginRight: 14,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 3,
  },
  currentSongTitle: {
    color: Colors.primary,
  },
  songArtist: {
    fontSize: 13,
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
    fontWeight: '700',
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

