import { Observable } from 'rxjs';
import { Song } from '../../models/song.model';
import { PlayerState } from '../../models/player-state.model';

export abstract class IPlayerUseCases {
  abstract loadSongs(playlistId: string): Observable<Song[]>;
  abstract playSong(song: Song): void;
  abstract pause(): void;
  abstract resume(): void;
  abstract selectSong(song: Song): void; // Solo la selecciona, no la reproduce
  abstract getState(): Observable<PlayerState>;
}