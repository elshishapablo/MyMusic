import { Audio } from 'expo-av';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

// Definir la interfaz del contexto
interface AudioContextType {
  // Estado
  currentTrack: any | null;
  soundObject: Audio.Sound | null;
  isPlaying: boolean;
  playbackTime: number;
  isNowPlayingScreenVisible: boolean;
  
  // Funciones
  playNewSong: (track: any) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  skipToNext: () => void;
  seekTo: (time: number) => Promise<void>;
  setNowPlayingScreenVisible: (visible: boolean) => void;
}

// Crear el contexto
const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

// Componente Provider
export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estados
  const [currentTrack, setCurrentTrack] = useState<any | null>(null);
  const [soundObject, setSoundObject] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isNowPlayingScreenVisible, setIsNowPlayingScreenVisible] = useState(false);
  
  // Referencias
  const playbackStatusInterval = useRef<NodeJS.Timeout | null>(null);

  // Función para cargar y reproducir una nueva canción
  const playNewSong = async (track: any) => {
    try {
      console.log('AudioProvider: playNewSong called for:', track.title);
      
      // Si hay una canción reproduciéndose, detenerla primero
      if (soundObject) {
        console.log('AudioProvider: Stopping current song');
        await soundObject.stopAsync();
        await soundObject.unloadAsync();
        setSoundObject(null);
        setIsPlaying(false);
      }

      // Cargar el archivo de audio
      console.log('AudioProvider: Creating new sound for:', track.title);
      const { sound } = await Audio.Sound.createAsync(track.audioFile);
      
      // Configurar el callback de estado
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPlaybackTime(status.positionMillis || 0);
          
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPlaybackTime(0);
          }
        }
      });

      // Establecer la nueva canción y reproducir
      setCurrentTrack(track);
      setSoundObject(sound);
      
      await sound.playAsync();
      setIsPlaying(true);
      
      console.log('AudioProvider: Song started playing:', track.title);
      
    } catch (error) {
      console.error('AudioProvider: Error playing song:', error);
    }
  };

  // Función para alternar entre reproducir y pausar
  const togglePlayPause = async () => {
    if (!soundObject) return;

    try {
      if (isPlaying) {
        await soundObject.pauseAsync();
        setIsPlaying(false);
        console.log('AudioProvider: Song paused');
      } else {
        await soundObject.playAsync();
        setIsPlaying(true);
        console.log('AudioProvider: Song resumed');
      }
    } catch (error) {
      console.error('AudioProvider: Error toggling playback:', error);
    }
  };

  // Función placeholder para saltar a la siguiente canción
  const skipToNext = () => {
    console.log('AudioProvider: skipToNext called (placeholder)');
    // TODO: Implementar lógica de siguiente canción
  };

  // Función para adelantar/retroceder en la canción
  const seekTo = async (time: number) => {
    if (!soundObject) return;

    try {
      await soundObject.setPositionAsync(time);
      setPlaybackTime(time);
      console.log('AudioProvider: Seeked to:', time);
    } catch (error) {
      console.error('AudioProvider: Error seeking:', error);
    }
  };

  // Función para controlar la visibilidad de la pantalla NowPlaying
  const setNowPlayingScreenVisible = (visible: boolean) => {
    setIsNowPlayingScreenVisible(visible);
    console.log('AudioProvider: NowPlaying screen visibility set to:', visible);
  };


  // Configurar controles de auriculares
  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('Error configuring audio mode:', error);
      }
    };

    configureAudio();
  }, []);

  // Detectar eventos de auriculares y controles remotos
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && soundObject) {
        // Reconfigurar el audio cuando la app vuelve a estar activa
        Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [soundObject]);

  // Limpiar recursos al desmontar
  useEffect(() => {
    return () => {
      if (soundObject) {
        soundObject.unloadAsync().catch(console.error);
      }
    };
  }, [soundObject]);

  // Valor del contexto
  const contextValue: AudioContextType = {
    currentTrack,
    soundObject,
    isPlaying,
    playbackTime,
    isNowPlayingScreenVisible,
    playNewSong,
    togglePlayPause,
    skipToNext,
    seekTo,
    setNowPlayingScreenVisible,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};
