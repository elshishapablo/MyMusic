import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { LocalSong } from '../data/localMusic';

export interface AudioPlayerState {
  sound: Audio.Sound | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: string;
  totalTime: string;
  progress: number; // 0 a 1
  currentSong: LocalSong | null;
  isMiniPlayerVisible: boolean;
  position: number; // Posición actual en milisegundos
  duration: number; // Duración total en milisegundos
}

export interface AudioPlayerControls {
  playSong: (song: LocalSong) => Promise<void>;
  setCurrentSong: (song: LocalSong) => void;
  togglePlayPause: () => Promise<void>;
  stop: () => Promise<void>;
  seekToPosition: (position: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  hideMiniPlayer: () => void;
  showMiniPlayer: () => void;
  pauseCurrentSong: () => Promise<void>;
  resumeCurrentSong: () => Promise<void>;
}

export const useAudioPlayer = (): AudioPlayerState & AudioPlayerControls => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [totalTime, setTotalTime] = useState('0:00');
  const [progress, setProgress] = useState(0);
  const [currentSong, setCurrentSong] = useState<LocalSong | null>(null);
  const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // Función para establecer la canción actual sin reproducir
  const setCurrentSongOnly = (song: LocalSong) => {
    console.log('setCurrentSongOnly called for:', song.title);
    setCurrentSong(song);
    setIsMiniPlayerVisible(true); // Mostrar mini-player cuando se establece una canción
    console.log('setCurrentSongOnly: Mini-player should be visible for:', song.title);
    console.log('isMiniPlayerVisible state set to true');
  };

  // Función para formatear tiempo en milisegundos a formato MM:SS
  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Función para cargar y reproducir una canción
  const playSong = async (song: LocalSong): Promise<void> => {
    try {
      console.log('playSong called for:', song.title);
      console.log('Current sound exists:', !!sound, 'isPlaying:', isPlaying);
      setIsLoading(true);
      
      // Si hay un sonido cargado, siempre liberarlo antes de cargar uno nuevo
      if (sound) {
        console.log('Unloading current sound before playing new one');
        try {
          // Verificar si está cargado antes de intentar pausar
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            await sound.pauseAsync();
            console.log('Paused current song');
          }
        } catch (error) {
          console.log('Error pausing current song:', error);
        }
        
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }

      // Cargar el archivo de audio
      console.log('Creating new sound for:', song.title);
      const { sound: newSound } = await Audio.Sound.createAsync(song.audioFile);
      console.log('Sound created successfully for:', song.title);
      setSound(newSound);
      setCurrentSong(song);
      console.log('Sound state updated for:', song.title);

      // Configurar el callback cuando termine la reproducción
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime('0:00');
            setPosition(0);
          }
          
          // Actualizar tiempo actual y progreso
          if (status.positionMillis !== undefined && status.durationMillis !== undefined) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis);
            setCurrentTime(formatTime(status.positionMillis));
            setTotalTime(formatTime(status.durationMillis));
            
            // Calcular progreso (0 a 1)
            const progressValue = status.positionMillis / status.durationMillis;
            setProgress(progressValue);
          }
        }
      });

      // Reproducir el audio inmediatamente
      console.log('Starting playback for:', song.title);
      await newSound.playAsync();
      console.log('Playback started successfully for:', song.title);
      setIsPlaying(true);
      setIsMiniPlayerVisible(true); // Mostrar mini-player cuando se reproduce
      console.log('Mini-player should be visible now for:', song.title);
      console.log('isMiniPlayerVisible state set to true in playSong');

    } catch (error) {
      console.error('Error playing audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('Error', `No se pudo reproducir el audio: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para pausar/reanudar
  const togglePlayPause = async (): Promise<void> => {
    if (!sound) {
      console.log('No sound loaded, cannot toggle');
      return;
    }

    try {
      if (isPlaying) {
        await pauseCurrentSong();
      } else {
        await resumeCurrentSong();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      Alert.alert('Error', 'No se pudo controlar la reproducción');
    }
  };

  // Función para pausar la canción actual
  const pauseCurrentSong = async (): Promise<void> => {
    if (!sound) {
      console.log('No sound object to pause');
      return;
    }

    try {
      // Verificar si el sonido está cargado antes de pausar
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        await sound.pauseAsync();
        setIsPlaying(false);
        console.log('Song paused at position:', position);
      } else {
        console.log('Sound is not loaded, cannot pause');
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error pausing audio:', error);
      // Si hay error, asumir que no está reproduciendo
      setIsPlaying(false);
    }
  };

  // Función para reanudar la canción actual
  const resumeCurrentSong = async (): Promise<void> => {
    if (!sound) {
      console.log('No sound object to resume');
      return;
    }

    try {
      // Verificar si el sonido está cargado antes de reanudar
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        await sound.playAsync();
        setIsPlaying(true);
        console.log('Song resumed from position:', position);
      } else {
        console.log('Sound is not loaded, cannot resume');
      }
    } catch (error) {
      console.error('Error resuming audio:', error);
    }
  };

  // Función para detener
  const stop = async (): Promise<void> => {
    if (!sound) {
      console.log('No sound object to stop');
      return;
    }

    try {
      // Verificar si el sonido está cargado antes de detener
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        await sound.stopAsync();
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime('0:00');
        setIsMiniPlayerVisible(false); // Ocultar mini-player al detener
        console.log('Song stopped');
      } else {
        console.log('Sound is not loaded, cannot stop');
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime('0:00');
        setIsMiniPlayerVisible(false);
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
      // Si hay error, limpiar el estado
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime('0:00');
      setIsMiniPlayerVisible(false);
    }
  };

  // Función para saltar a una posición específica
  const seekToPosition = async (position: number): Promise<void> => {
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.durationMillis) {
        const targetPosition = position * status.durationMillis;
        await sound.setPositionAsync(targetPosition);
      }
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  // Función para ajustar el volumen
  const setVolume = async (volume: number): Promise<void> => {
    if (!sound) return;

    try {
      await sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  // Funciones para controlar el mini-player
  const hideMiniPlayer = () => {
    setIsMiniPlayerVisible(false);
  };

  const showMiniPlayer = () => {
    if (currentSong) {
      setIsMiniPlayerVisible(true);
    }
  };

  // Limpiar recursos cuando el componente se desmonte
  useEffect(() => {
    return () => {
      // Solo limpiar cuando el componente se desmonta completamente
      console.log('useAudioPlayer unmounting - cleaning up sound');
      if (sound) {
        sound.unloadAsync().catch(console.error);
      }
    };
  }, []); // Solo ejecutar al desmontar

  return {
    // Estado
    sound,
    isPlaying,
    isLoading,
    currentTime,
    totalTime,
    progress,
    currentSong,
    isMiniPlayerVisible,
    position,
    duration,
    
    // Controles
    playSong,
    setCurrentSong: setCurrentSongOnly,
    togglePlayPause,
    stop,
    seekToPosition,
    setVolume,
    hideMiniPlayer,
    showMiniPlayer,
    pauseCurrentSong,
    resumeCurrentSong,
  };
};
