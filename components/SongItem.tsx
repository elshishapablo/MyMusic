import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

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
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={20}
            color={isLiked ? '#FF6B6B' : '#ccc'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onMore}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  playingContainer: {
    backgroundColor: 'rgba(32, 178, 170, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#20B2AA',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  playingTitle: {
    color: '#20B2AA',
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 14,
    color: '#ccc',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 14,
    color: '#888',
    marginRight: 15,
    minWidth: 40,
    textAlign: 'right',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
});
