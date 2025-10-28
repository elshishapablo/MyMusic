import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAudio } from '../contexts/AudioProvider';
import { localSongs } from '../data/localMusic';

const TrackListScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { currentTrack, isPlaying, playNewSong } = useAudio();

  const handleTrackPress = async (track: any) => {
    console.log('TrackListScreen: Track pressed:', track.title);
    
    // Si es la misma canción que está reproduciendo, navegar al reproductor
    if (currentTrack?.id === track.id) {
      console.log('TrackListScreen: Same track, navigating to player');
      if (navigation) {
        navigation.navigate('NowPlaying');
      }
      return;
    }
    
    // Reproducir nueva canción
    await playNewSong(track);
  };

  const renderTrackItem = ({ item }: { item: any }) => {
    const isCurrentTrack = currentTrack?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.trackItem,
          isCurrentTrack && styles.currentTrackItem
        ]}
        onPress={() => handleTrackPress(item)}
      >
        <Image source={item.coverImage} style={styles.trackImage} />
        <View style={styles.trackInfo}>
          <Text style={[
            styles.trackTitle,
            isCurrentTrack && styles.currentTrackTitle
          ]}>
            {item.title}
          </Text>
          <Text style={styles.trackArtist}>{item.artist}</Text>
          <Text style={styles.trackAlbum}>{item.album}</Text>
        </View>
        <View style={styles.trackControls}>
          {isCurrentTrack && isPlaying ? (
            <Ionicons name="pause-circle" size={32} color="#FF6B9D" />
          ) : (
            <Ionicons name="play-circle" size={32} color="#FF6B9D" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Biblioteca</Text>
        <Text style={styles.headerSubtitle}>
          {currentTrack ? `Reproduciendo: ${currentTrack.title}` : 'Selecciona una canción'}
        </Text>
      </View>
      
      <FlatList
        data={localSongs}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id}
        style={styles.trackList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FF6B9D',
  },
  trackList: {
    flex: 1,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  currentTrackItem: {
    backgroundColor: '#2a1a2a',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B9D',
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  currentTrackTitle: {
    color: '#FF6B9D',
  },
  trackArtist: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 2,
  },
  trackAlbum: {
    fontSize: 12,
    color: '#888',
  },
  trackControls: {
    padding: 10,
  },
});

export default TrackListScreen;