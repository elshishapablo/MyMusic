import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LocalAudioPlayer } from '../components/LocalAudioPlayer';

export default function AudioTestScreen() {
  const handlePlayStart = () => {
    console.log('Reproducción iniciada');
  };

  const handlePlayEnd = () => {
    console.log('Reproducción terminada');
  };

  const handleError = (error: string) => {
    console.error('Error en el reproductor:', error);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Prueba de Audio Local</Text>
        <Text style={styles.subtitle}>
          Componente para reproducir archivos MP3 locales
        </Text>
      </View>

      <LocalAudioPlayer
        onPlayStart={handlePlayStart}
        onPlayEnd={handlePlayEnd}
        onError={handleError}
      />

      <View style={styles.info}>
        <Text style={styles.infoTitle}>Instrucciones:</Text>
        <Text style={styles.infoText}>
          1. Coloca un archivo MP3 real en assets/audio/dont_cry.mp3
        </Text>
        <Text style={styles.infoText}>
          2. El componente cargará y reproducirá el audio
        </Text>
        <Text style={styles.infoText}>
          3. Usa los controles para pausar/reanudar/detener
        </Text>
        <Text style={styles.infoText}>
          4. El audio se libera automáticamente al desmontar
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  info: {
    margin: 20,
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
    lineHeight: 20,
  },
});
