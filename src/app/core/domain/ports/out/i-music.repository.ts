import { Observable } from 'rxjs';
import { Song } from '../../models/song.model';

// Definimos lo que necesitamos: "Quiero una lista de canciones de una playlist"
export abstract class IMusicRepository {
  abstract getPlaylistTracks(playlistId: string): Observable<Song[]>;
}