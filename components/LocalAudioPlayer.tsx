import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LocalAudioPlayerProps {
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
  onError?: (error: string) => void;
}

export const LocalAudioPlayer: React.FC<LocalAudioPlayerProps> = ({
  onPlayStart,
  onPlayEnd,
  onError,
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Función para cargar y reproducir el audio
  const playAudio = async () => {
    try {
      setIsLoading(true);
      
      // Si ya hay un sonido cargado, lo liberamos primero
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      // Cargar el archivo MP3 local
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../assets/audio/dont_cry.mp3')
      );

      setSound(newSound);

      // Configurar el callback cuando termine la reproducción
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          onPlayEnd?.();
        }
      });

      // Reproducir el audio
      await newSound.playAsync();
      setIsPlaying(true);
      onPlayStart?.();

    } catch (error) {
      console.error('Error playing audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('Error', `No se pudo reproducir el audio: ${errorMessage}`);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para pausar/reanudar
  const togglePlayPause = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      Alert.alert('Error', 'No se pudo controlar la reproducción');
    }
  };

  // Función para detener
  const stopAudio = async () => {
    if (!sound) return;

    try {
      await sound.stopAsync();
      setIsPlaying(false);
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  // Limpiar recursos cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch(console.error);
      }
    };
  }, [sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reproductor de Audio Local</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.playButton]}
          onPress={playAudio}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Cargando...' : "Reproducir Don't Cry"}
          </Text>
        </TouchableOpacity>

        {sound && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.controlButton]}
              onPress={togglePlayPause}
            >
              <Text style={styles.buttonText}>
                {isPlaying ? 'Pausar' : 'Reanudar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={stopAudio}
            >
              <Text style={styles.buttonText}>Detener</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={styles.statusText}>
        Estado: {isLoading ? 'Cargando...' : isPlaying ? 'Reproduciendo' : 'Detenido'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#20B2AA',
  },
  controlButton: {
    backgroundColor: '#FF6B6B',
  },
  stopButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
  },
});
