// Configuración de Spotify Web API
export const SPOTIFY_CONFIG = {
  // Credenciales de la aplicación (Client ID y Client Secret)
  CLIENT_ID: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  CLIENT_SECRET: 'q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
  
  // URLs de la API
  AUTH_URL: 'https://accounts.spotify.com/authorize',
  TOKEN_URL: 'https://accounts.spotify.com/api/token',
  API_BASE_URL: 'https://api.spotify.com/v1',
  
  // Scopes (permisos)
  SCOPES: [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'user-top-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-recently-played',
    'user-follow-read',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-library-modify',
    'user-library-read',
    'playlist-modify-public',
    'playlist-modify-private',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-follow-modify',
    'user-follow-read',
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-library-modify',
    'user-library-read',
    'playlist-modify-public',
    'playlist-modify-private',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-follow-modify',
    'user-follow-read'
  ],
  
  // Configuración de la aplicación
  REDIRECT_URI: 'exp://127.0.0.1:19000/--/spotify-callback',
  
  // Configuración de búsqueda
  SEARCH_LIMIT: 20,
  SEARCH_TYPES: 'track,artist,album',
  
  // Configuración de audio
  AUDIO_FEATURES: [
    'acousticness',
    'danceability',
    'duration_ms',
    'energy',
    'instrumentalness',
    'key',
    'liveness',
    'loudness',
    'mode',
    'speechiness',
    'tempo',
    'time_signature',
    'valence'
  ]
};

// Función para obtener el token de acceso
export const getSpotifyToken = async () => {
  try {
    console.log('🔑 Intentando obtener token de Spotify...');
    console.log('🔑 Client ID:', SPOTIFY_CONFIG.CLIENT_ID.substring(0, 8) + '...');
    
    const response = await fetch(SPOTIFY_CONFIG.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`)}`
      },
      body: 'grant_type=client_credentials'
    });
    
    console.log('🔑 Respuesta del servidor:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error del servidor:', errorText);
      
      // Mostrar instrucciones si las credenciales son inválidas
      if (response.status === 400 && errorText.includes('invalid_client')) {
        console.error('🚨 CREDENCIALES DE SPOTIFY INVÁLIDAS');
        console.error('📋 Para solucionarlo:');
        console.error('1. Ve a https://developer.spotify.com/dashboard');
        console.error('2. Crea una nueva aplicación');
        console.error('3. Copia tu Client ID y Client Secret');
        console.error('4. Reemplaza las credenciales en config/spotify.ts');
        console.error('5. Reinicia la app');
        console.error('📄 Ver SPOTIFY_SETUP_INSTRUCTIONS.md para más detalles');
      }
      
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Token obtenido exitosamente');
    return data.access_token;
  } catch (error) {
    console.error('❌ Error obteniendo token de Spotify:', error);
    console.error('❌ Detalles del error:', error.message);
    throw error;
  }
};

// Función para hacer búsquedas en Spotify
export const searchSpotify = async (query: string, token: string) => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `${SPOTIFY_CONFIG.API_BASE_URL}/search?q=${encodedQuery}&type=${SPOTIFY_CONFIG.SEARCH_TYPES}&limit=${SPOTIFY_CONFIG.SEARCH_LIMIT}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error buscando en Spotify:', error);
    throw error;
  }
};

// Función para obtener información de un track
export const getSpotifyTrack = async (trackId: string, token: string) => {
  try {
    const url = `${SPOTIFY_CONFIG.API_BASE_URL}/tracks/${trackId}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error obteniendo track de Spotify:', error);
    throw error;
  }
};

// Función para obtener audio features de un track
export const getSpotifyAudioFeatures = async (trackId: string, token: string) => {
  try {
    const url = `${SPOTIFY_CONFIG.API_BASE_URL}/audio-features/${trackId}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error obteniendo audio features de Spotify:', error);
    throw error;
  }
};
