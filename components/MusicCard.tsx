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
            <Ionicons name="play" size={20} color="#fff" />
          </View>
        )}
        {type === 'artist' && (
          <View style={styles.typeIcon}>
            <Ionicons name={getIconName()} size={16} color="#20B2AA" />
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
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#20B2AA',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  typeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginTop: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
  },
});
