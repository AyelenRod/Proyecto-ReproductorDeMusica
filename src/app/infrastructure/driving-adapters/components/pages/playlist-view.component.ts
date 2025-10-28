import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { IPlayerUseCases } from '../../../../core/domain/ports/in/i-player.use-cases';
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
  filteredSongs$!: Observable<Song[]>;
  currentSong$: Observable<Song | null>;
  isPlaying$: Observable<boolean>;
  playerState$: Observable<PlayerState>;
  
  searchQuery: string = '';
  playlistTitle: string = 'MAP OF THE SOUL 7';
  
  private searchQuery$ = new BehaviorSubject<string>('');
  private playlistId = '67iNkhe5Dfzxuo5mDDgmya';

  constructor(private playerUseCases: IPlayerUseCases) {
    this.playerState$ = this.playerUseCases.getState();
    this.currentSong$ = this.playerState$.pipe(map(s => s.currentSong));
    this.isPlaying$ = this.playerState$.pipe(map(s => s.isPlaying));
  }

  ngOnInit(): void {
    console.log('🎵 Cargando playlist ID:', this.playlistId);
    this.playlist$ = this.playerUseCases.loadSongs(this.playlistId);
    
    this.filteredSongs$ = combineLatest([
      this.playlist$,
      this.searchQuery$
    ]).pipe(
      map(([songs, query]) => {
        if (!query || query.trim() === '') {
          return songs;
        }
        
        const lowerQuery = query.toLowerCase().trim();
        return songs.filter(song => 
          song.title.toLowerCase().includes(lowerQuery) ||
          song.artist.toLowerCase().includes(lowerQuery) ||
          song.album.toLowerCase().includes(lowerQuery)
        );
      })
    );
    
    this.playlist$.subscribe({
      next: (songs) => {
        console.log('✅ Canciones cargadas:', songs.length);
      },
      error: (error) => {
        console.error('❌ Error al cargar:', error);
      }
    });
  }

  onSearchInput(): void {
    this.searchQuery$.next(this.searchQuery);
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