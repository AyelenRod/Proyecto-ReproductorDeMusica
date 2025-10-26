import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPlayerUseCases } from  '../../../../core/domain/ports/in/i-player.use-cases';
import { Song } from '../../../../core/domain/models/song.model';

@Component({
  selector: 'app-playlist-view',
  templateUrl: './playlist-view.component.html',
  styleUrls: ['./playlist-view.component.scss'],
  standalone: false
})
export class PlaylistViewComponent implements OnInit {

  playlist$!: Observable<Song[]>;
  currentSong$: Observable<Song | null>;
  isPlaying$: Observable<boolean>;
  
  playlistCover = 'https://i.scdn.co/image/ab67616d0000b273c5d366537cc9414614c7c492';
  
  private playlistId = '37i9dQZF1DXcBWIGoYEmIw';

  constructor(private playerUseCases: IPlayerUseCases) {
    this.currentSong$ = this.playerUseCases.getState().pipe(map(s => s.currentSong));
    this.isPlaying$ = this.playerUseCases.getState().pipe(map(s => s.isPlaying));
  }

  ngOnInit(): void {
    this.playlist$ = this.playerUseCases.loadSongs(this.playlistId);
  }

  onSongClick(song: Song): void {
    this.playerUseCases.playSong(song);
  }
}