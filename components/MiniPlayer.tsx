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
        <TouchableOpacity onPress={handleCoverPress}>
          <Image source={currentTrack.coverImage} style={styles.coverImage} />
        </TouchableOpacity>
        
        {/* Información de la canción */}
        <TouchableOpacity style={styles.trackInfo} onPress={handleCoverPress}>
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
            style={styles.controlButton}
            onPress={togglePlayPause}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={24}
              color="#FF6B9D"
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.controlButton}
            onPress={skipToNext}
          >
            <Ionicons
              name="play-skip-forward"
              size={24}
              color="#FF6B9D"
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
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2a1a2a',
    borderTopWidth: 1,
    borderTopColor: '#FF6B9D',
    paddingBottom: 34, // Para el safe area en iOS
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  coverImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: 14,
    color: '#ccc',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
  },
});

export default MiniPlayer;