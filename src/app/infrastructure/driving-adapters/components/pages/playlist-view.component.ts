import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IPlayerUseCases } from  '../../../../../app/core/domain/ports/in/i-player.use-cases';
import { Song } from '../../../../core/domain/models/song.model';
import { PlayerState } from '../../../../core/domain/models/player-state.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-playlist-view',
  templateUrl: './playlist-view.component.html',
  styleUrls: ['./playlist-view.component.scss']
})
export class PlaylistViewComponent implements OnInit {

  playlist$!: Observable<Song[]>;
  currentSong$: Observable<Song | null>;
  
  // ID de una playlist pública de Spotify (ej. "Today's Top Hits")
  private playlistId = '37i9dQZF1DXcBWIGoYEmIw';

  // ¡Inyectamos el Puerto de Casos de Uso!
  constructor(private playerUseCases: IPlayerUseCases) {
    // Observamos el estado para saber qué canción está sonando
    this.currentSong$ = this.playerUseCases.getState().pipe(map(s => s.currentSong));
  }

  ngOnInit(): void {
    // Al iniciar, le pedimos al caso de uso que cargue las canciones
    this.playlist$ = this.playerUseCases.loadSongs(this.playlistId);
  }

  onSongClick(song: Song): void {
    // Le decimos al caso de uso que reproduzca la canción
    this.playerUseCases.playSong(song);
  }
}