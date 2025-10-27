export interface SearchResult {
  tracks: SearchTrack[];
  albums: SearchAlbum[];
  artists: SearchArtist[];
}

export interface SearchTrack {
  id: string;
  name: string;
  artists: string;
  album: string;
  imageUrl: string;
  previewUrl: string | null;
  duration: number;
}

export interface SearchAlbum {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  releaseDate: string;
  totalTracks: number;
}

export interface SearchArtist {
  id: string;
  name: string;
  imageUrl: string;
  genres: string[];
  popularity: number;
}