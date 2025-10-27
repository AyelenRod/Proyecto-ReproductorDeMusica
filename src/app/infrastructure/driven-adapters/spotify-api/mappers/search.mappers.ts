import { SearchResult, SearchTrack, SearchAlbum, SearchArtist } from '../../../../core/domain/models/search.model';

export class SearchMapper {
  static DtoToDomain(dto: any): SearchResult {
    return {
      tracks: this.mapTracks(dto.tracks?.items || []),
      albums: this.mapAlbums(dto.albums?.items || []),
      artists: this.mapArtists(dto.artists?.items || [])
    };
  }

  private static mapTracks(items: any[]): SearchTrack[] {
    return items.map(item => ({
      id: item.id,
      name: item.name,
      artists: item.artists.map((a: any) => a.name).join(', '),
      album: item.album.name,
      imageUrl: item.album.images?.[0]?.url || 'default-image.png',
      previewUrl: item.preview_url,
      duration: item.duration_ms
    }));
  }

  private static mapAlbums(items: any[]): SearchAlbum[] {
    return items.map(item => ({
      id: item.id,
      name: item.name,
      artist: item.artists.map((a: any) => a.name).join(', '),
      imageUrl: item.images?.[0]?.url || 'default-image.png',
      releaseDate: item.release_date,
      totalTracks: item.total_tracks
    }));
  }

  private static mapArtists(items: any[]): SearchArtist[] {
    return items.map(item => ({
      id: item.id,
      name: item.name,
      imageUrl: item.images?.[0]?.url || 'default-image.png',
      genres: item.genres || [],
      popularity: item.popularity
    }));
  }
}