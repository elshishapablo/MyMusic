import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAudio } from '../contexts/AudioProvider';
import { Colors, Shadows } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const NowPlayingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentTrack, isPlaying, playbackTime, togglePlayPause, skipToNext, seekTo, setNowPlayingScreenVisible } = useAudio();
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

  const handleSeek = (position: number) => {
    const seekTime = (position / 100) * (currentTrack.duration || 240000); // 4 min default
    seekTo(seekTime);
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

  // Función para parsear duración en formato "4:00" a milisegundos
  const parseDuration = (duration: string): number => {
    const parts = duration.split(':');
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    return (minutes * 60 + seconds) * 1000;
  };

  const handleClose = () => {
    setNowPlayingScreenVisible(false);
    navigation.goBack();
  };

  // Detectar cuando se sale de la pantalla (incluyendo gesto de retroceso de Android)
  useFocusEffect(
    useCallback(() => {
      // Cuando la pantalla se enfoca (entra), establecer visibilidad en true
      setNowPlayingScreenVisible(true);
      
      // Función de limpieza que se ejecuta cuando se sale de la pantalla
      return () => {
        console.log('NowPlayingScreen: Screen lost focus, hiding mini player');
        setNowPlayingScreenVisible(false);
      };
    }, [setNowPlayingScreenVisible])
  );

  // Manejar el inicio del arrastre
  const handlePanStart = (event: any) => {
    setIsDragging(true);
    const { locationX } = event.nativeEvent;
    const progressBarWidth = width - 120; // Ancho aproximado de la barra
    const percentage = (locationX / progressBarWidth) * 100;
    setDragPosition(Math.min(Math.max(percentage, 0), 100));
  };

  // Manejar el movimiento durante el arrastre
  const handlePanMove = (event: any) => {
    if (!isDragging) return;
    const { locationX } = event.nativeEvent;
    const progressBarWidth = width - 120; // Ancho aproximado de la barra
    const percentage = (locationX / progressBarWidth) * 100;
    setDragPosition(Math.min(Math.max(percentage, 0), 100));
  };

  // Manejar el final del arrastre
  const handlePanEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const duration = typeof currentTrack.duration === 'string' 
      ? parseDuration(currentTrack.duration) 
      : currentTrack.duration;
    const seekTime = (dragPosition / 100) * duration;
    seekTo(seekTime);
  };


  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Imagen de fondo a pantalla completa */}
      <ImageBackground 
        source={currentTrack.coverImage} 
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={0}
      >
        {/* Gradiente de desvanecimiento hacia abajo */}
        <View style={styles.gradientOverlay}>
          <View style={styles.gradientLayer1} />
          <View style={styles.gradientLayer2} />
          <View style={styles.gradientLayer3} />
        </View>
        
        {/* Contenido sobre la imagen */}
        <View style={styles.contentOverlay}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={handleClose}
              style={styles.headerButton}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-down" size={28} color={Colors.text} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerText}>Reproduciendo desde</Text>
              <Text style={styles.headerSubtext}>Mi Biblioteca</Text>
            </View>
            <TouchableOpacity 
              style={styles.headerButton}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-horizontal" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {/* Información de la canción */}
          <View style={styles.songInfo}>
            <Text style={styles.songTitle} numberOfLines={2}>
              {currentTrack.title}
            </Text>
            <Text style={styles.songArtist} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
            {currentTrack.album && (
              <Text style={styles.songAlbum} numberOfLines={1}>
                {currentTrack.album}
              </Text>
            )}
          </View>

          {/* Barra de progreso */}
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>
              {isDragging 
                ? formatTime((dragPosition / 100) * (typeof currentTrack.duration === 'string' 
                    ? parseDuration(currentTrack.duration) 
                    : currentTrack.duration || 240000))
                : formatTime(playbackTime)
              }
            </Text>
            <TouchableOpacity 
              style={styles.progressBar}
              onPressIn={handlePanStart}
              onPressOut={handlePanEnd}
              activeOpacity={1}
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
            </TouchableOpacity>
            <Text style={styles.timeText}>
              {typeof currentTrack.duration === 'string' 
                ? currentTrack.duration 
                : formatTime(currentTrack.duration || 240000)
              }
            </Text>
          </View>

          {/* Controles */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={styles.controlButton}
              activeOpacity={0.7}
            >
              <Ionicons name="play-skip-back" size={32} color={Colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.playButton, isPlaying && styles.playButtonActive]}
              onPress={togglePlayPause}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={36}
                color={Colors.text}
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.controlButton}
              onPress={skipToNext}
              activeOpacity={0.7}
            >
              <Ionicons name="play-skip-forward" size={32} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {/* Controles secundarios */}
          <View style={styles.secondaryControls}>
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
              <Ionicons name="heart-outline" size={24} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
              <Ionicons name="add-circle-outline" size={24} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
              <Ionicons name="list-outline" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  gradientLayer1: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: Colors.background,
    opacity: 0.95,
  },
  gradientLayer2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    backgroundColor: Colors.background,
    opacity: 0.7,
  },
  gradientLayer3: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: Colors.background,
    opacity: 0.4,
  },
  contentOverlay: {
    flex: 1,
    paddingBottom: 40,
    paddingHorizontal: 24,
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingVertical: 12,
    marginBottom: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  headerSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  songInfo: {
    alignItems: 'flex-start',
    marginBottom: 32,
    width: '100%',
  },
  songTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'left',
    marginBottom: 8,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  songArtist: {
    fontSize: 20,
    color: Colors.text,
    textAlign: 'left',
    marginBottom: 4,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  songAlbum: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'left',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,
  },
  timeText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    minWidth: 50,
    fontVariant: ['tabular-nums'],
    fontWeight: '500',
  },
  progressBar: {
    flex: 1,
    height: 50,
    marginHorizontal: 12,
    justifyContent: 'center',
  },
  progressBarBackground: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.text,
    borderRadius: 2,
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
    top: -5.5,
    marginLeft: -7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 32,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  playButtonActive: {
    backgroundColor: Colors.text,
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingTop: 8,
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
});

export default NowPlayingScreen;