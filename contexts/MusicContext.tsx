import React, { createContext, ReactNode, useContext, useState } from 'react';
import LocalMusicAPI from '../services/LocalMusicAPI';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  image: string;
  previewUrl: string | null;
  externalUrl: string;
  genre: string;
  year: number;
  isLiked: boolean;
  playCount: number;
  likes: number;
}

interface MusicState {
  isLoading: boolean;
  error: string | null;
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
}

interface MusicContextType {
  state: MusicState;
  searchTracks: (query: string) => Promise<MusicTrack[]>;
  getPopularTracks: () => Promise<MusicTrack[]>;
  getTracksByGenre: (genre: string) => Promise<MusicTrack[]>;
  getTrackDetails: (trackId: string) => Promise<MusicTrack | null>;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  stopTrack: () => void;
  clearError: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<MusicState>({
    isLoading: false,
    error: null,
    currentTrack: null,
    isPlaying: false,
  });

  const searchTracks = async (query: string): Promise<MusicTrack[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const tracks = await LocalMusicAPI.searchTracks(query);
      setState(prev => ({ ...prev, isLoading: false }));
      return tracks;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error buscando canciones';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  };

  const getPopularTracks = async (): Promise<MusicTrack[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const tracks = await LocalMusicAPI.getPopularTracks();
      setState(prev => ({ ...prev, isLoading: false }));
      return tracks;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error obteniendo canciones populares';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  };

  const getTracksByGenre = async (genre: string): Promise<MusicTrack[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const tracks = await LocalMusicAPI.getTracksByGenre(genre);
      setState(prev => ({ ...prev, isLoading: false }));
      return tracks;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error obteniendo canciones por género';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  };

  const getTrackDetails = async (trackId: string): Promise<MusicTrack | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const track = await LocalMusicAPI.getTrackDetails(trackId);
      setState(prev => ({ ...prev, isLoading: false }));
      return track;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error obteniendo detalles de la canción';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  };

  const playTrack = (track: MusicTrack) => {
    setState(prev => ({ 
      ...prev, 
      currentTrack: track, 
      isPlaying: true,
      error: null 
    }));
  };

  const pauseTrack = () => {
    setState(prev => ({ ...prev, isPlaying: false }));
  };

  const resumeTrack = () => {
    setState(prev => ({ ...prev, isPlaying: true }));
  };

  const stopTrack = () => {
    setState(prev => ({ 
      ...prev, 
      currentTrack: null, 
      isPlaying: false 
    }));
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: MusicContextType = {
    state,
    searchTracks,
    getPopularTracks,
    getTracksByGenre,
    getTrackDetails,
    playTrack,
    pauseTrack,
    resumeTrack,
    stopTrack,
    clearError,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};