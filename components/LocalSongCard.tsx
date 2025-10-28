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
import { LocalSong } from '../data/localMusic';

interface LocalSongCardProps {
  song: LocalSong;
  onPress?: (song: LocalSong) => void;
  onPlayPress?: (song: LocalSong) => void;
  showPlayButton?: boolean;
  size?: 'small' | 'medium' | 'large';
  isPlaying?: boolean;
}

export const LocalSongCard: React.FC<LocalSongCardProps> = ({
  song,
  onPress,
  onPlayPress,
  showPlayButton = false,
  size = 'medium',
  isPlaying = false,
}) => {
  const getCardDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 120, height: 120 };
      case 'large':
        return { width: 200, height: 200 };
      default:
        return { width: 160, height: 160 };
    }
  };

  const dimensions = getCardDimensions();

  const handlePress = () => {
    onPress?.(song);
  };

  const handlePlayPress = (e: any) => {
    e.stopPropagation(); // Evitar que se ejecute el onPress de la tarjeta
    onPlayPress?.(song);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width: dimensions.width }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={[styles.imageContainer, { height: dimensions.height }]}>
        <Image source={song.coverImage} style={styles.image} />
        
        {/* Overlay cuando está reproduciendo */}
        {isPlaying && (
          <View style={styles.playingOverlay}>
            <View style={styles.playingIndicator}>
              <Ionicons name="musical-notes" size={16} color="#20B2AA" />
            </View>
          </View>
        )}
        
        {/* Botón de play */}
        {showPlayButton && (
          <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={20} 
              color="#fff" 
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {song.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {song.artist}
        </Text>
        {song.album && (
          <Text style={styles.album} numberOfLines={1}>
            {song.album}
          </Text>
        )}
        {song.duration && (
          <Text style={styles.duration}>
            {song.duration}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 15,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  playingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playingIndicator: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.glow,
  },
  playButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
  textContainer: {
    marginTop: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  album: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 2,
  },
  duration: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
