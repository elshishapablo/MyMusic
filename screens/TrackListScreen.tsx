import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, GenrePalette, Shadows } from '../constants/Colors';
import { useAudio } from '../contexts/AudioProvider';
import { useUser } from '../contexts/UserProvider';
import { artistImages } from '../data/artists';
import { getLocalSongsByGenre, localSongs } from '../data/localMusic';

const { width } = Dimensions.get('window');

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
};

const getUniqueArtists = () => {
  const artistMap = new Map<string, { name: string; cover: any }>();
  localSongs.forEach((song) => {
    const primaryArtist = song.artist.split(' ft.')[0].split(' &')[0].split(',')[0].trim();
    if (!artistMap.has(primaryArtist)) {
      artistMap.set(primaryArtist, {
        name: primaryArtist,
        cover: artistImages[primaryArtist] || song.coverImage,
      });
    }
  });
  return Array.from(artistMap.values());
};

const getUniqueGenres = () => {
  const genreSet = new Set<string>();
  localSongs.forEach((song) => {
    if (song.genre) genreSet.add(song.genre);
  });
  return Array.from(genreSet);
};

const getPlaylists = () => {
  const playlistMap = new Map<
    string,
    { id: string; name: string; artist: string; cover: any; songCount: number }
  >();
  localSongs.forEach((song) => {
    if (!song.album || playlistMap.has(song.album)) return;
    const primaryArtist = song.artist.split(' ft.')[0].split(' &')[0].split(',')[0].trim();
    const songsInAlbum = localSongs.filter((s) => s.album === song.album);
    let coverImage = song.coverImage;
    if (song.album === 'Un Verano Sin Ti') {
      const aguacero = localSongs.find((s) => s.id === 'aguacero');
      if (aguacero) coverImage = aguacero.coverImage;
    }
    playlistMap.set(song.album, {
      id: song.album,
      name: song.album,
      artist: primaryArtist,
      cover: coverImage,
      songCount: songsInAlbum.length,
    });
  });
  return Array.from(playlistMap.values());
};

const TrackListScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { currentTrack, isPlaying, playNewSong } = useAudio();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  const greeting = getGreeting();
  const featured = localSongs[0];
  // Evitar duplicar la portada del hero en la fila "Tu música"
  const topSongs = localSongs.slice(1, 13);
  const artists = useMemo(() => getUniqueArtists(), []);
  const genres = useMemo(() => getUniqueGenres(), []);
  const playlists = useMemo(() => getPlaylists(), []);

  const handleTrackPress = async (track: any) => {
    if (currentTrack?.id === track.id) {
      navigation?.navigate('NowPlaying');
      return;
    }
    await playNewSong(track);
    navigation?.navigate('NowPlaying');
  };

  const renderSongCard = ({ item }: { item: any }) => {
    const isCurrentTrack = currentTrack?.id === item.id;
    return (
      <TouchableOpacity
        style={styles.songCard}
        onPress={() => handleTrackPress(item)}
        activeOpacity={0.85}
      >
        <View style={styles.songCardImageWrap}>
          <Image source={item.coverImage} style={styles.songCardImage} resizeMode="cover" />
          {isCurrentTrack && isPlaying && (
            <View style={styles.playingBadge}>
              <Ionicons name="musical-notes" size={12} color={Colors.background} />
            </View>
          )}
        </View>
        <Text style={styles.songCardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.songCardArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderArtistCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.artistCard} activeOpacity={0.85}>
      <Image source={item.cover} style={styles.artistCardImage} resizeMode="cover" />
      <Text style={styles.artistCardName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderGenreCard = ({ item, index }: { item: string; index: number }) => {
    const genreSongs = getLocalSongsByGenre(item);
    const tint = GenrePalette[index % GenrePalette.length];
    return (
      <TouchableOpacity
        style={[styles.genreCard, { backgroundColor: tint + '22', borderColor: tint + '55' }]}
        activeOpacity={0.85}
      >
        <View style={[styles.genreDot, { backgroundColor: tint }]} />
        <Text style={styles.genreCardName}>{item}</Text>
        <Text style={styles.genreCardCount}>{genreSongs.length} tracks</Text>
      </TouchableOpacity>
    );
  };

  const renderPlaylistCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.playlistCard} activeOpacity={0.85}>
      <Image source={item.cover} style={styles.playlistCardImage} resizeMode="cover" />
      <Text style={styles.playlistCardTitle} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.playlistCardMeta} numberOfLines={1}>
        {item.artist} · {item.songCount}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brand}>MyMusic</Text>
            <Text style={styles.greeting}>
              {greeting}, <Text style={styles.userName}>{user?.username || 'listener'}</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={20} color={Colors.text} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar canciones, artistas…"
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {featured && (
          <TouchableOpacity
            style={styles.hero}
            activeOpacity={0.9}
            onPress={() => handleTrackPress(featured)}
          >
            <Image source={featured.coverImage} style={styles.heroImage} resizeMode="cover" />
            <View style={styles.heroScrim} />
            <View style={styles.heroContent}>
              <Text style={styles.heroKicker}>Escucha ahora</Text>
              <Text style={styles.heroTitle} numberOfLines={2}>
                {featured.title}
              </Text>
              <Text style={styles.heroArtist}>{featured.artist}</Text>
              <View style={styles.heroCta}>
                <Ionicons name="play" size={16} color={Colors.background} />
                <Text style={styles.heroCtaText}>Reproducir</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tu música</Text>
            <Text style={styles.sectionLink}>Ver todo</Text>
          </View>
          <FlatList
            data={topSongs}
            renderItem={renderSongCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Artistas</Text>
            <Text style={styles.sectionLink}>Ver todo</Text>
          </View>
          <FlatList
            data={artists}
            renderItem={renderArtistCard}
            keyExtractor={(item) => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorías</Text>
          </View>
          <FlatList
            data={genres}
            renderItem={renderGenreCard}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Álbumes</Text>
            <Text style={styles.sectionLink}>Ver todo</Text>
          </View>
          <FlatList
            data={playlists}
            renderItem={renderPlaylistCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brand: {
    fontSize: 13,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: 6,
  },
  greeting: { fontSize: 15, color: Colors.textSecondary },
  userName: { color: Colors.text, fontWeight: '700' },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 11,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  searchWrap: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 18,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: { flex: 1, color: Colors.text, fontSize: 15, paddingVertical: 0 },
  hero: {
    marginHorizontal: 20,
    height: 210,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 28,
    ...Shadows.large,
  },
  heroImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9,9,11,0.45)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 18,
  },
  heroKicker: {
    color: Colors.secondary,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 6,
  },
  heroTitle: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroArtist: { color: Colors.textSecondary, fontSize: 14, marginBottom: 14 },
  heroCta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  heroCtaText: { color: Colors.background, fontWeight: '700', fontSize: 13 },
  section: { marginBottom: 26 },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  sectionLink: { fontSize: 13, color: Colors.textTertiary, fontWeight: '600' },
  horizontalList: { paddingHorizontal: 20 },
  songCard: { width: 136, marginRight: 14 },
  songCardImageWrap: { position: 'relative', marginBottom: 10 },
  songCardImage: {
    width: 136,
    height: 136,
    borderRadius: 18,
    backgroundColor: Colors.surface,
  },
  playingBadge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songCardTitle: { color: Colors.text, fontSize: 14, fontWeight: '700', marginBottom: 3 },
  songCardArtist: { color: Colors.textSecondary, fontSize: 12 },
  artistCard: { width: 92, marginRight: 14, alignItems: 'center' },
  artistCardImage: {
    width: 92,
    height: 92,
    borderRadius: 46,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  artistCardName: { color: Colors.text, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  genreCard: {
    width: 148,
    height: 96,
    marginRight: 12,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'flex-end',
  },
  genreDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 10 },
  genreCardName: { color: Colors.text, fontSize: 16, fontWeight: '800' },
  genreCardCount: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  playlistCard: { width: 156, marginRight: 14 },
  playlistCardImage: {
    width: 156,
    height: 156,
    borderRadius: 18,
    marginBottom: 10,
    backgroundColor: Colors.surface,
  },
  playlistCardTitle: { color: Colors.text, fontSize: 14, fontWeight: '700', marginBottom: 3 },
  playlistCardMeta: { color: Colors.textSecondary, fontSize: 12 },
});

export default TrackListScreen;
