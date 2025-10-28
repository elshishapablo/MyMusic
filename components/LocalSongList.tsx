import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, Shadows } from '../constants/Colors';
import { LocalSong } from '../data/localMusic';

interface LocalSongListProps {
  songs: LocalSong[];
  onSongPress?: (song: LocalSong) => void;
  currentPlayingSongId?: string;
  showAlbumArt?: boolean;
  showDuration?: boolean;
}

export const LocalSongList: React.FC<LocalSongListProps> = ({
  songs,
  onSongPress,
  currentPlayingSongId,
  showAlbumArt = true,
  showDuration = true,
}) => {
  const renderSongItem = ({ item }: { item: LocalSong }) => {
    const isPlaying = currentPlayingSongId === item.id;

    return (
      <TouchableOpacity
        style={[styles.songItem, isPlaying && styles.playingSongItem]}
        onPress={() => onSongPress?.(item)}
        activeOpacity={0.7}
      >
        {showAlbumArt && (
          <Image source={item.coverImage} style={styles.albumArt} />
        )}
        
        <View style={styles.songInfo}>
          <Text style={[styles.title, isPlaying && styles.playingTitle]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {item.artist}
            {item.album && ` • ${item.album}`}
          </Text>
          {item.genre && (
            <Text style={styles.genre} numberOfLines={1}>
              {item.genre}
            </Text>
          )}
        </View>

        <View style={styles.songActions}>
          {showDuration && item.duration && (
            <Text style={styles.duration}>{item.duration}</Text>
          )}
          
          {isPlaying && (
            <View style={styles.playingIndicator}>
              <Ionicons name="musical-notes" size={16} color={Colors.primary} />
            </View>
          )}
          
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={songs}
      renderItem={renderSongItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  playingSongItem: {
    backgroundColor: Colors.overlayLight,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    paddingLeft: 17, // 20 - 3 para compensar el borde izquierdo
    borderRadius: 8,
    marginVertical: 2,
    ...Shadows.small,
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
    ...Shadows.small,
  },
  songInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  playingTitle: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  genre: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  songActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginRight: 15,
    minWidth: 40,
    textAlign: 'right',
  },
  playingIndicator: {
    marginRight: 10,
  },
  moreButton: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: Colors.surfaceSecondary,
    ...Shadows.small,
  },
});
