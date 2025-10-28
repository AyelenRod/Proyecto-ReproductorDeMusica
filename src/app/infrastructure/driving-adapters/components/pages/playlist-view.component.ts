import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { IPlayerUseCases } from  '../../../../core/domain/ports/in/i-player.use-cases';
import { Song } from '../../../../core/domain/models/song.model';
import { PlayerState } from '../../../../core/domain/models/player-state.model';

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
  playerState$: Observable<PlayerState>;
  
  // Playlist pública de Spotify (Top 50 Global)
  private playlistId = '67iNkhe5Dfzxuo5mDDgmya';
filteredSongs$: Observable<unknown>|Subscribable<unknown>|PromiseLike<unknown>;
searchQuery: any;
playlistTitle: any;
onSearchInput: any;

  constructor(private playerUseCases: IPlayerUseCases) {
    this.playerState$ = this.playerUseCases.getState();
    this.currentSong$ = this.playerState$.pipe(map(s => s.currentSong));
    this.isPlaying$ = this.playerState$.pipe(map(s => s.isPlaying));
  }

  ngOnInit(): void {
    console.log('🎵 Cargando playlist ID:', this.playlistId);
    this.playlist$ = this.playerUseCases.loadSongs(this.playlistId);
    
    this.playlist$.subscribe({
      next: (songs) => {
        console.log('Canciones cargadas:', songs.length);
        songs.forEach((song, i) => console.log(`${i + 1}. ${song.title} - ${song.artist}`));
      },
      error: (error) => {
        console.error('Error al cargar:', error);
      }
    });
  }

  onSongClick(song: Song): void {
    console.log('🎵 Reproduciendo:', song.title);
    this.playerUseCases.playSong(song);
  }

  onIndicatorClick(event: Event): void {
    event.stopPropagation();
    this.isPlaying$.pipe(take(1)).subscribe(isPlaying => {
      if (isPlaying) {
        this.playerUseCases.pause();
      } else {
        this.playerUseCases.resume();
      }
    });
  }

  onPlayPauseClick(): void {
    this.isPlaying$.pipe(take(1)).subscribe(isPlaying => {
      if (isPlaying) {
        this.playerUseCases.pause();
      } else {
        this.playerUseCases.resume();
      }
    });
  }

  onNextClick(): void {
    this.playerUseCases.playNext();
  }

  onPreviousClick(): void {
    this.playerUseCases.playPrevious();
  }
}