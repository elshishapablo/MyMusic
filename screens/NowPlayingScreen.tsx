import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAudio } from '../contexts/AudioProvider';

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose}>
          <Ionicons name="chevron-down" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>Reproduciendo desde</Text>
          <Text style={styles.headerSubtext}>Mi Biblioteca</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Carátula */}
        <View style={styles.albumContainer}>
          <Image source={currentTrack.coverImage} style={styles.albumArt} />
        </View>

        {/* Información de la canción */}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{currentTrack.title}</Text>
          <Text style={styles.songArtist}>{currentTrack.artist}</Text>
          <Text style={styles.songAlbum}>{currentTrack.album}</Text>
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
            <View 
              style={[
                styles.progressFill, 
                { width: `${getProgressPercentage()}%` }
              ]} 
            />
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
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="play-skip-back" size={32} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.playButton}
            onPress={togglePlayPause}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={48}
              color="#FF6B9D"
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.controlButton}
            onPress={skipToNext}
          >
            <Ionicons name="play-skip-forward" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#ccc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 14,
    color: '#ccc',
  },
  headerSubtext: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  albumContainer: {
    marginTop: 40,
    marginBottom: 40,
  },
  albumArt: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 20,
  },
  songInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  songArtist: {
    fontSize: 18,
    color: '#FF6B9D',
    textAlign: 'center',
    marginBottom: 4,
  },
  songAlbum: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
  },
  timeText: {
    fontSize: 12,
    color: '#ccc',
    minWidth: 40,
  },
  progressBar: {
    flex: 1,
    height: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    marginHorizontal: 15,
    justifyContent: 'center',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    padding: 20,
    marginHorizontal: 20,
  },
  playButton: {
    padding: 20,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 50,
    marginHorizontal: 20,
  },
});

export default NowPlayingScreen;