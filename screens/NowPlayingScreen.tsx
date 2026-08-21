import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Shadows } from '../constants/Colors';
import { useAudio } from '../contexts/AudioProvider';

const { width, height } = Dimensions.get('window');

const NowPlayingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentTrack, isPlaying, playbackTime, togglePlayPause, skipToNext, skipToPrevious, seekTo, setNowPlayingScreenVisible } = useAudio();
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const insets = useSafeAreaInsets();

  if (!currentTrack) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No hay canción seleccionada</Text>
        </View>
      </View>
    );
  }

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatRemainingTime = (current: number, total: number): string => {
    const remaining = total - current;
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `-${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Función para parsear duración en formato "4:00" a milisegundos
  const parseDuration = (duration: string): number => {
    const parts = duration.split(':');
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    return (minutes * 60 + seconds) * 1000;
  };

  // Calcular el porcentaje de progreso
  const getProgressPercentage = () => {
    if (!currentTrack?.duration) return 0;
    const duration = typeof currentTrack.duration === 'string' 
      ? parseDuration(currentTrack.duration) 
      : currentTrack.duration;
    
    // Si estamos arrastrando, usar la posición de arrastre
    if (isDragging) {
      return Math.min(Math.max(dragPosition, 0), 100);
    }
    
    return Math.min((playbackTime / duration) * 100, 100);
  };

  const handleClose = () => {
    setNowPlayingScreenVisible(false);
    navigation.goBack();
  };

  // Detectar cuando se sale de la pantalla
  useFocusEffect(
    useCallback(() => {
      setNowPlayingScreenVisible(true);
      return () => {
        setNowPlayingScreenVisible(false);
      };
    }, [setNowPlayingScreenVisible])
  );

  // PanResponder para manejar el arrastre de la barra de progreso
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      setIsDragging(true);
      const progressBarWidth = width - 80; // Ancho de la barra (ancho total menos márgenes de tiempo)
      const touchX = event.nativeEvent.locationX;
      const percentage = (touchX / progressBarWidth) * 100;
      setDragPosition(Math.min(Math.max(percentage, 0), 100));
    },
    onPanResponderMove: (event) => {
      if (!isDragging) return;
      const progressBarWidth = width - 80;
      const touchX = event.nativeEvent.locationX;
      const percentage = (touchX / progressBarWidth) * 100;
      setDragPosition(Math.min(Math.max(percentage, 0), 100));
    },
    onPanResponderRelease: () => {
      if (!isDragging) return;
      setIsDragging(false);
      const duration = typeof currentTrack.duration === 'string' 
        ? parseDuration(currentTrack.duration) 
        : currentTrack.duration;
      const seekTime = (dragPosition / 100) * duration;
      seekTo(seekTime);
    },
  });

  const duration = typeof currentTrack.duration === 'string' 
    ? parseDuration(currentTrack.duration) 
    : currentTrack.duration || 240000;

  const currentTime = isDragging 
    ? (dragPosition / 100) * duration
    : playbackTime;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Fondo: portada con opacidad */}
      <ImageBackground 
        source={currentTrack.coverImage} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Overlay oscuro para dar efecto de opacidad */}
        <View style={styles.overlay} />
      </ImageBackground>
      
      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleClose}
            style={styles.headerButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
             <Text style={styles.headerTitle}>Now playing</Text>
          </View>
          <TouchableOpacity 
            style={styles.headerButton}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Portada grande centrada */}
        <View style={styles.albumArtWrapper}>
          <Image 
            source={currentTrack.coverImage} 
            style={styles.albumArt}
            resizeMode="cover"
          />
        </View>

        {/* Información de la canción centrada */}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <View style={styles.artistRow}>
            <Text style={styles.songArtist} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
            <View style={styles.artistIcon} />
          </View>
        </View>

        {/* Barra de progreso */}
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>
            {formatTime(currentTime)}
          </Text>
          <View 
            style={styles.progressBarWrapper}
            {...panResponder.panHandlers}
          >
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${getProgressPercentage()}%` }
                ]} 
              />
              <View 
                style={[
                  styles.progressThumb,
                  { left: `${getProgressPercentage()}%` }
                ]} 
              />
            </View>
          </View>
          <Text style={styles.timeText}>
            {formatRemainingTime(currentTime, duration)}
          </Text>
        </View>

        {/* Iconos de compartir y corazón */}
        <View style={styles.actionIcons}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="share-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="heart-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Controles de reproducción */}
        <View style={[styles.controlsContainer, { paddingBottom: insets.bottom + 40, marginTop: 10 }]}>
          <TouchableOpacity 
            style={styles.controlButton}
            activeOpacity={0.7}
          >
            <Ionicons name="shuffle-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            activeOpacity={0.7}
            onPress={skipToPrevious}
          >
            <Ionicons name="play-skip-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.playButton}
            onPress={togglePlayPause}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={32}
              color={Colors.background}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.controlButton}
            onPress={skipToNext}
            activeOpacity={0.7}
          >
            <Ionicons name="play-skip-forward" size={24} color={Colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            activeOpacity={0.7}
          >
            <Ionicons name="repeat-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(9, 9, 11, 0.62)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 12,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(247,244,239,0.08)',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  albumArtWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 8,
  },
  albumArt: {
    width: width - 72,
    height: width - 72,
    borderRadius: 28,
    ...Shadows.large,
  },
  songInfo: {
    alignItems: 'center',
    marginBottom: 28,
  },
  songTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  songArtist: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  artistIcon: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 18,
  },
  timeText: {
    fontSize: 12,
    color: Colors.textTertiary,
    minWidth: 40,
    fontVariant: ['tabular-nums'],
    fontWeight: '600',
  },
  progressBarWrapper: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  progressBarBackground: {
    height: 5,
    backgroundColor: 'rgba(247, 244, 239, 0.12)',
    borderRadius: 3,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressThumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.text,
    borderWidth: 3,
    borderColor: Colors.primary,
    top: -4.5,
    marginLeft: -7,
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(247,244,239,0.06)',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  controlButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.glow,
  },
});

export default NowPlayingScreen;