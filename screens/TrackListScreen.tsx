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
import { Colors, Shadows } from '../constants/Colors';

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
            <View style={styles.playingButton}>
              <Ionicons name="pause-circle" size={36} color={Colors.primary} />
            </View>
          ) : (
            <View style={styles.playButton}>
              <Ionicons name="play-circle" size={36} color={Colors.primary} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inicio</Text>
        <Text style={styles.headerSubtitle}>
          {currentTrack ? `Reproduciendo: ${currentTrack.title}` : `${localSongs.length} canciones disponibles`}
        </Text>
      </View>
      
      <FlatList
        data={localSongs}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id}
        style={styles.trackList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.trackListContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '500',
  },
  trackList: {
    flex: 1,
  },
  trackListContent: {
    paddingTop: 8,
    paddingBottom: 200,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  currentTrackItem: {
    backgroundColor: Colors.overlayLight,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    paddingLeft: 16,
    marginHorizontal: 0,
    borderRadius: 0,
  },
  trackImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
    ...Shadows.small,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 5,
    letterSpacing: 0.2,
  },
  currentTrackTitle: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  trackArtist: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 3,
  },
  trackAlbum: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  trackControls: {
    padding: 8,
  },
  playButton: {
    opacity: 0.8,
  },
  playingButton: {
    opacity: 1,
  },
});

export default TrackListScreen;