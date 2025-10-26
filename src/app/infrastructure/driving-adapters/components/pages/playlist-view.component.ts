import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IPlayerUseCases } from  '../../../../core/domain/ports/in/i-player.use-cases';
import { Song } from '../../../../core/domain/models/song.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-playlist-view',
  templateUrl: './playlist-view.component.html',
  styleUrls: ['./playlist-view.component.scss'],
  standalone: false // ← AÑADE ESTO
})
export class PlaylistViewComponent implements OnInit {

  playlist$!: Observable<Song[]>;
  currentSong$: Observable<Song | null>;
  
  private playlistId = '37i9dQZF1DXcBWIGoYEmIw';

  constructor(private playerUseCases: IPlayerUseCases) {
    this.currentSong$ = this.playerUseCases.getState().pipe(map(s => s.currentSong));
  }

  ngOnInit(): void {
    this.playlist$ = this.playerUseCases.loadSongs(this.playlistId);
  }

  onSongClick(song: Song): void {
    this.playerUseCases.playSong(song);
  }
}