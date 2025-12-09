import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IPlayerUseCases } from '../../domain/ports/in/i-player.use-cases';
import { IMusicRepository } from '../../domain/ports/out/i-music.repository';
import { Song } from '../../domain/models/song.model';
import { PlayerState } from '../../domain/models/player-state.model';
import { PlayerStateService } from './player-state.service';
import { AudioService } from '../../../infrastructure/driven-adapters/local-audio/audio.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService implements IPlayerUseCases {

  constructor(
    private musicRepository: IMusicRepository,
    private state: PlayerStateService,
    private audio: AudioService
  ) {
    this.audio.progress$.subscribe(progress => this.state.setProgress(progress));
    this.audio.ended$.subscribe(() => {
      this.state.pause();
      this.playNext();
    });
  }

  getState(): Observable<PlayerState> {
    return this.state.getState();
  }

  loadSongs(playlistId: string): Observable<Song[]> {
    return this.musicRepository.getPlaylistTracks(playlistId).pipe(
      tap(songs => this.state.setPlaylist(songs))
    );
  }

  playSong(song: Song): void {
    this.state.play(song);
  }

  pause(): void {
    this.state.pause();
  }

  resume(): void {
    this.state.resume();
  }

  selectSong(song: Song): void {
    this.state.setCurrentSong(song);
  }

  playNext(): void {
    const nextSong = this.state.getNextSong();
    if (nextSong) {
      this.playSong(nextSong);
    }
  }

  playPrevious(): void {
    const prevSong = this.state.getPreviousSong();
    if (prevSong) {
      this.playSong(prevSong);
    }
  }
}