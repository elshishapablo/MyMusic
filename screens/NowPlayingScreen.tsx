import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function NowPlayingScreen({ navigation, route }: any) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [totalTime, setTotalTime] = useState('3:53');
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  // Datos de la canción actual (pueden venir del route.params)
  const currentSong = route?.params?.song || {
    title: "Don't Cry",
    artist: 'Guns N\' Roses',
    album: 'Use Your Illusion I',
    image: require('../assets/images/dont_cry.jpg'),
    duration: '3:53'
  };

  // Próximas canciones
  const upcomingSongs = [
    { title: 'Save Your Tears', artist: 'The Weeknd', duration: '3:35' },
    { title: 'In Your Eyes', artist: 'The Weeknd', duration: '3:58' },
    { title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20' },
  ];

  // Función para cargar y reproducir el audio
  const loadAndPlayAudio = async () => {
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
        if (status.isLoaded) {
          if (status.didJustFinish) {
            setIsPlaying(false);
            // Si está en modo repeat, reiniciar
            if (isRepeating) {
              newSound.setPositionAsync(0);
              newSound.playAsync();
              setIsPlaying(true);
            }
          }
          
          // Actualizar tiempo actual
          if (status.positionMillis !== undefined) {
            const minutes = Math.floor(status.positionMillis / 60000);
            const seconds = Math.floor((status.positionMillis % 60000) / 1000);
            setCurrentTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
          }
        }
      });

      // Reproducir el audio
      await newSound.playAsync();
      setIsPlaying(true);

    } catch (error) {
      console.error('Error playing audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('Error', `No se pudo reproducir el audio: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) {
      await loadAndPlayAudio();
      return;
    }

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

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  // Limpiar recursos cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch(console.error);
      }
    };
  }, [sound]);

  // Cargar audio automáticamente cuando se abre la pantalla
  useEffect(() => {
    loadAndPlayAudio();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-down" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>Reproduciendo desde</Text>
          <Text style={styles.headerSubtext}>Tu biblioteca</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Album Art */}
        <View style={styles.albumContainer}>
          <Image source={currentSong.image} style={styles.albumArt} />
        </View>

        {/* Song Info */}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{currentSong.title}</Text>
          <Text style={styles.artistName}>{currentSong.artist}</Text>
          {isLoading && (
            <Text style={styles.loadingText}>Cargando audio...</Text>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{currentTime}</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
            <View style={styles.progressThumb} />
          </View>
          <Text style={styles.timeText}>{totalTime}</Text>
        </View>

        {/* Main Controls */}
        <View style={styles.mainControls}>
          <TouchableOpacity onPress={toggleShuffle} style={styles.controlButton}>
            <Ionicons 
              name="shuffle" 
              size={24} 
              color={isShuffled ? '#20B2AA' : '#ccc'} 
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="play-skip-back" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={togglePlayPause} 
            style={styles.playButton}
            disabled={isLoading}
          >
            <Ionicons
              name={isLoading ? 'hourglass' : isPlaying ? 'pause' : 'play'}
              size={32}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="play-skip-forward" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleRepeat} style={styles.controlButton}>
            <Ionicons 
              name="repeat" 
              size={24} 
              color={isRepeating ? '#20B2AA' : '#ccc'} 
            />
          </TouchableOpacity>
        </View>

        {/* Secondary Controls */}
        <View style={styles.secondaryControls}>
          <TouchableOpacity style={styles.secondaryButton}>
            <Ionicons name="heart-outline" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Ionicons name="add" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Ionicons name="share-outline" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Ionicons name="list" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Upcoming Songs */}
        <View style={styles.upcomingSection}>
          <Text style={styles.upcomingTitle}>Próximas canciones</Text>
          {upcomingSongs.map((song, index) => (
            <TouchableOpacity key={index} style={styles.upcomingItem}>
              <View style={styles.upcomingInfo}>
                <Text style={styles.upcomingTitle}>{song.title}</Text>
                <Text style={styles.upcomingArtist}>{song.artist}</Text>
              </View>
              <Text style={styles.upcomingDuration}>{song.duration}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerText: {
    color: '#ccc',
    fontSize: 14,
  },
  headerSubtext: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  albumContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  albumArt: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 12,
  },
  songInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  timeText: {
    color: '#ccc',
    fontSize: 14,
    minWidth: 40,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginHorizontal: 15,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#20B2AA',
    borderRadius: 2,
    width: '0%',
  },
  progressThumb: {
    position: 'absolute',
    left: 0,
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: '#20B2AA',
    borderRadius: 8,
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  controlButton: {
    padding: 15,
  },
  playButton: {
    backgroundColor: '#20B2AA',
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  secondaryButton: {
    padding: 15,
  },
  upcomingSection: {
    marginBottom: 30,
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  upcomingArtist: {
    fontSize: 14,
    color: '#ccc',
  },
  upcomingDuration: {
    fontSize: 14,
    color: '#888',
  },
  loadingText: {
    fontSize: 14,
    color: '#20B2AA',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
