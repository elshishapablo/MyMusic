import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAudio } from '../contexts/AudioProvider';
import { Colors, Shadows } from '../constants/Colors';

const { width } = Dimensions.get('window');

const MiniPlayer: React.FC = () => {
  const { currentTrack, isPlaying, togglePlayPause, skipToNext, isNowPlayingScreenVisible, setNowPlayingScreenVisible } = useAudio();
  const navigation = useNavigation();

  // Solo renderizar si hay una canción actual
  if (!currentTrack) {
    return null;
  }

  // Si la pantalla NowPlaying está visible, ocultar el mini player
  if (isNowPlayingScreenVisible) {
    return null;
  }

  const handleCoverPress = () => {
    console.log('MiniPlayer: Cover pressed, navigating to NowPlaying');
    setNowPlayingScreenVisible(true);
    navigation.navigate('NowPlaying');
  };

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Carátula */}
        <TouchableOpacity 
          onPress={handleCoverPress}
          activeOpacity={0.8}
          style={styles.coverContainer}
        >
          <Image source={currentTrack.coverImage} style={styles.coverImage} />
        </TouchableOpacity>
        
        {/* Información de la canción */}
        <TouchableOpacity 
          style={styles.trackInfo} 
          onPress={handleCoverPress}
          activeOpacity={0.8}
        >
          <Text style={styles.trackTitle} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </TouchableOpacity>
        
        {/* Controles */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, isPlaying && styles.controlButtonActive]}
            onPress={togglePlayPause}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={22}
              color={isPlaying ? Colors.text : Colors.primary}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.controlButton}
            onPress={skipToNext}
            activeOpacity={0.7}
          >
            <Ionicons
              name="play-skip-forward"
              size={22}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 96,
    left: 14,
    right: 14,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.medium,
    zIndex: 1000,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  coverContainer: {
    position: 'relative',
    marginRight: 12,
  },
  coverImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  trackInfo: {
    flex: 1,
    marginRight: 10,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  controlButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: Colors.primary,
  },
});

export default MiniPlayer;