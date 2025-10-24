// API para música local - Solo tu archivo
import { Asset } from 'expo-asset';

class LocalMusicAPI {
  // Solo tu música - Don't Cry
  private localTracks = [
    {
      id: '1',
      title: 'Don\'t Cry',
      artist: 'Guns N\' Roses',
      album: 'Use Your Illusion I',
      duration: 284,
      file: 'dont_cry.mp3',
      cover: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=DC',
      genre: 'Rock',
      year: 1991,
      isLiked: false,
      playCount: 100,
      likes: 0,
    },
    {
      id: '2',
      title: 'Test Audio',
      artist: 'Test Artist',
      album: 'Test Album',
      duration: 30,
      file: 'test_audio.mp3',
      cover: 'https://via.placeholder.com/300x300/20B2AA/FFFFFF?text=TA',
      genre: 'Test',
      year: 2024,
      isLiked: false,
      playCount: 0,
      likes: 0,
    },
  ];

  // Buscar canciones locales
  async searchTracks(query: string, limit: number = 20) {
    try {
      console.log('🔍 Buscando en tu música:', query);
      
      const filteredTracks = this.localTracks.filter(track => 
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase()) ||
        track.album.toLowerCase().includes(query.toLowerCase()) ||
        track.genre.toLowerCase().includes(query.toLowerCase())
      );

      console.log('🎵 Resultados encontrados:', filteredTracks.length);

      const results = await Promise.all(filteredTracks.slice(0, limit).map(async (track) => {
        console.log('🎵 Procesando track:', track.title);
        const audioUrl = await this.getAudioUrl(track.file);
        console.log('🎵 Audio URL generada:', audioUrl);
        
        return {
          id: track.id,
          title: track.title,
          artist: track.artist,
          album: track.album,
          duration: track.duration,
          image: track.cover,
          previewUrl: audioUrl,
          externalUrl: null,
          genre: track.genre,
          year: track.year,
          isLiked: track.isLiked,
          playCount: track.playCount,
          likes: track.likes,
        };
      }));

      console.log('✅ Resultados finales:', results.length);
      return results;
    } catch (error) {
      console.error('❌ Error searching tracks:', error);
      return [];
    }
  }

  // Obtener canciones populares
  async getPopularTracks(limit: number = 20) {
    try {
      console.log('🎵 Obteniendo tu música popular');
      
      const results = await Promise.all(this.localTracks.slice(0, limit).map(async (track) => {
        console.log('🎵 Procesando track popular:', track.title);
        const audioUrl = await this.getAudioUrl(track.file);
        console.log('🎵 Audio URL generada:', audioUrl);
        
        return {
          id: track.id,
          title: track.title,
          artist: track.artist,
          album: track.album,
          duration: track.duration,
          image: track.cover,
          previewUrl: audioUrl,
          externalUrl: null,
          genre: track.genre,
          year: track.year,
          isLiked: track.isLiked,
          playCount: track.playCount,
          likes: track.likes,
        };
      }));

      console.log('✅ Tracks populares generados:', results.length);
      return results;
    } catch (error) {
      console.error('❌ Error getting popular tracks:', error);
      return [];
    }
  }

  // Obtener canciones por género
  async getTracksByGenre(genre: string, limit: number = 20) {
    try {
      console.log('🎵 Obteniendo canciones por género:', genre);
      
      const filteredTracks = this.localTracks.filter(track => 
        track.genre.toLowerCase() === genre.toLowerCase()
      );

      console.log('🎵 Tracks filtrados por género:', filteredTracks.length);

      const results = await Promise.all(filteredTracks.slice(0, limit).map(async (track) => {
        console.log('🎵 Procesando track por género:', track.title);
        const audioUrl = await this.getAudioUrl(track.file);
        console.log('🎵 Audio URL generada:', audioUrl);
        
        return {
          id: track.id,
          title: track.title,
          artist: track.artist,
          album: track.album,
          duration: track.duration,
          image: track.cover,
          previewUrl: audioUrl,
          externalUrl: null,
          genre: track.genre,
          year: track.year,
          isLiked: track.isLiked,
          playCount: track.playCount,
          likes: track.likes,
        };
      }));

      console.log('✅ Tracks por género generados:', results.length);
      return results;
    } catch (error) {
      console.error('❌ Error getting tracks by genre:', error);
      return [];
    }
  }

  // Obtener detalles de una canción
  async getTrackDetails(trackId: string) {
    try {
      console.log('🔍 Obteniendo detalles del track:', trackId);
      
      const track = this.localTracks.find(t => t.id === trackId);
      if (!track) {
        console.log('❌ Track no encontrado:', trackId);
        return null;
      }

      console.log('✅ Track encontrado:', track.title);
      const audioUrl = await this.getAudioUrl(track.file);
      console.log('🎵 Audio URL para detalles:', audioUrl);

      const result = {
        id: track.id,
        title: track.title,
        artist: track.artist,
        album: track.album,
        duration: track.duration,
        image: track.cover,
        previewUrl: audioUrl,
        externalUrl: null,
        genre: track.genre,
        year: track.year,
        isLiked: track.isLiked,
        playCount: track.playCount,
        likes: track.likes,
      };

      console.log('✅ Detalles del track generados:', result.title);
      return result;
    } catch (error) {
      console.error('❌ Error getting track details:', error);
      return null;
    }
  }

  // Obtener URL del archivo de audio
  private async getAudioUrl(filename: string): Promise<string> {
    console.log('🔍 getAudioUrl llamado con filename:', filename);
    
    // Para tu canción Don't Cry, usar require() estático
    if (filename === 'dont_cry.mp3') {
      console.log('🎵 Archivo dont_cry.mp3 detectado');
      
      try {
        console.log('📁 Intentando con expo-asset...');
        const asset = Asset.fromModule(require('../../assets/dont_cry.mp3'));
        await asset.downloadAsync();
        console.log('✅ Asset cargado exitosamente:', asset.uri);
        console.log('🎵 URI del asset:', asset.uri);
        return asset.uri;
      } catch (error) {
        console.error('❌ Error con expo-asset:', error);
        console.log('🔧 Error details:', error.message);
        
        // ÚLTIMO RECURSO: Usar URL de prueba que funcione
        console.log('🚨 ÚLTIMO RECURSO: Usando URL de prueba');
        const testUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        console.log('🎵 Usando URL de prueba para que funcione:', testUrl);
        return testUrl;
      }
    }
    
    // Para test_audio.mp3
    if (filename === 'test_audio.mp3') {
      console.log('🎵 Archivo test_audio.mp3 detectado');
      
      try {
        console.log('📁 Intentando con expo-asset...');
        const asset = Asset.fromModule(require('../../assets/test_audio.mp3'));
        await asset.downloadAsync();
        console.log('✅ Asset cargado exitosamente:', asset.uri);
        console.log('🎵 URI del asset:', asset.uri);
        return asset.uri;
      } catch (error) {
        console.error('❌ Error con expo-asset:', error);
        console.log('🔧 Error details:', error.message);
        
        // ÚLTIMO RECURSO: Usar URL de prueba que funcione
        console.log('🚨 ÚLTIMO RECURSO: Usando URL de prueba');
        const testUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';
        console.log('🎵 Usando URL de prueba para que funcione:', testUrl);
        return testUrl;
      }
    }
    
    console.log('❌ Archivo no reconocido:', filename);
    return null;
  }


  // Agregar nueva canción (para uso futuro)
  addTrack(trackData: any) {
    const newTrack = {
      id: (this.localTracks.length + 1).toString(),
      ...trackData,
      isLiked: false,
      playCount: 0,
      likes: 0,
    };
    
    this.localTracks.push(newTrack);
    console.log('Nueva canción agregada:', newTrack.title);
  }

  // Obtener todas las canciones locales
  getAllTracks() {
    return this.localTracks.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album,
      duration: track.duration,
      image: this.getCoverUrl(track.cover),
      previewUrl: this.getAudioUrl(track.file),
      externalUrl: null,
      genre: track.genre,
      year: track.year,
      isLiked: track.isLiked,
      playCount: track.playCount,
      likes: track.likes,
    }));
  }
}

export default new LocalMusicAPI();
