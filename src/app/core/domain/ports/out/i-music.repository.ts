import { Observable } from 'rxjs';
import { Song } from '../../models/song.model';
import { SearchResult } from '../../models/search.model';

export abstract class IMusicRepository {
  abstract getPlaylistTracks(playlistId: string): Observable<Song[]>;
  abstract search(query: string): Observable<SearchResult>;
  abstract getAlbumTracks(albumId: string): Observable<Song[]>;
}