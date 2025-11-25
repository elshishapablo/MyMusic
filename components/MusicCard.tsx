import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, Shadows } from './../constants/Colors';

const { width } = Dimensions.get('window');

interface MusicCardProps {
  title: string;
  subtitle?: string;
  image: string;
  onPress?: () => void;
  showPlayButton?: boolean;
  size?: 'small' | 'medium' | 'large';
  type?: 'playlist' | 'album' | 'artist' | 'song';
}

export const MusicCard: React.FC<MusicCardProps> = ({
  title,
  subtitle,
  image,
  onPress,
  showPlayButton = false,
  size = 'medium',
  type = 'playlist',
}) => {
  const getCardDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 120, height: 120 };
      case 'large':
        return { width: width * 0.7, height: width * 0.7 };
      default:
        return { width: 160, height: 160 };
    }
  };

  const getIconName = () => {
    switch (type) {
      case 'playlist':
        return 'list';
      case 'album':
        return 'albums';
      case 'artist':
        return 'person';
      case 'song':
        return 'musical-notes';
      default:
        return 'musical-notes';
    }
  };

  const dimensions = getCardDimensions();

  return (
    <TouchableOpacity
      style={[styles.container, { width: dimensions.width }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.imageContainer, { height: dimensions.height }]}>
        <Image source={{ uri: image }} style={styles.image} />
        {showPlayButton && (
          <View style={styles.playButton}>
            <Ionicons name="play" size={18} color={Colors.text} />
          </View>
        )}
        {type === 'artist' && (
          <View style={styles.typeIcon}>
            <Ionicons name={getIconName()} size={16} color={Colors.primary} />
          </View>
        )}
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
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
  playButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
  typeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  textContainer: {
    marginTop: 10,
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
