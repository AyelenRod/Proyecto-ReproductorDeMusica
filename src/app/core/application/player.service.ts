import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IPlayerUseCases } from '../domain/ports/in/i-player.use-cases';
import { IMusicRepository } from '../domain/ports/out/i-music.repository';
import { Song } from '../domain/models/song.model';
import { PlayerState } from '../domain/models/player-state.model';

// Servicios de Infraestructura que necesita para funcionar
// (Los inyectamos usando DI de Angular, pero son interfaces/abstracciones)
import { PlayerStateService } from '../../infrastructure/services/player-state.service';
import { AudioService } from '../../infrastructure/driven-adapters/local-audio/audio.service';

@Injectable({
  providedIn: 'root',
})
// Esta clase implementa los Casos de Uso (Puerto de Entrada)
export class PlayerService implements IPlayerUseCases {

  // Recibe el Puerto de Salida (IMusicRepository) y los servicios de infra
  constructor(
    private musicRepository: IMusicRepository,
    private state: PlayerStateService,
    private audio: AudioService
  ) {
    // Conecta el progreso del audio al estado
    this.audio.progress$.subscribe(progress => this.state.setProgress(progress));
    this.audio.ended$.subscribe(() => this.state.pause());
  }

  getState(): Observable<PlayerState> {
    return this.state.getState();
  }

  loadSongs(playlistId: string): Observable<Song[]> {
    return this.musicRepository.getPlaylistTracks(playlistId).pipe(
      tap(songs => this.state.setPlaylist(songs)) // Guarda la playlist en el estado
    );
  }

  playSong(song: Song): void {
    if (song.previewUrl) {
      this.audio.load(song.previewUrl);
      this.audio.play();
      this.state.play(song);
    } else {
      console.warn('Esta canción no tiene preview y no se puede reproducir.');
      this.selectSong(song); // Al menos la seleccionamos
    }
  }

  pause(): void {
    this.audio.pause();
    this.state.pause();
  }

  resume(): void {
    this.audio.play();
    this.state.resume();
  }

  selectSong(song: Song): void {
    this.state.setCurrentSong(song);
  }
}