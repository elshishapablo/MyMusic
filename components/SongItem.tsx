import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, Shadows } from '../constants/Colors';

interface SongItemProps {
  title: string;
  artist: string;
  album?: string;
  duration?: string;
  image?: string;
  isPlaying?: boolean;
  isLiked?: boolean;
  onPress?: () => void;
  onLike?: () => void;
  onMore?: () => void;
}

export const SongItem: React.FC<SongItemProps> = ({
  title,
  artist,
  album,
  duration,
  image,
  isPlaying = false,
  isLiked = false,
  onPress,
  onLike,
  onMore,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isPlaying && styles.playingContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}
      
      <View style={styles.infoContainer}>
        <Text style={[styles.title, isPlaying && styles.playingTitle]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {artist}
          {album && ` • ${album}`}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        {duration && (
          <Text style={styles.duration}>{duration}</Text>
        )}
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onLike}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={20}
            color={isLiked ? Colors.primary : Colors.textTertiary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onMore}
          activeOpacity={0.7}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  playingContainer: {
    backgroundColor: Colors.overlayLight,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    paddingLeft: 16,
    borderRadius: 0,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 16,
    ...Shadows.small,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 5,
    letterSpacing: 0.2,
  },
  playingTitle: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  duration: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginRight: 12,
    minWidth: 42,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSecondary,
  },
});
