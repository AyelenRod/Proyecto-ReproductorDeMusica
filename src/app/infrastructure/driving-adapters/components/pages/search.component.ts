import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { IMusicRepository } from '../../../../core/domain/ports/out/i-music.repository';
import { IPlayerUseCases } from '../../../../core/domain/ports/in/i-player.use-cases';
import { SearchResult } from '../../../../core/domain/models/search.model';
import { Song } from '../../../../core/domain/models/song.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: false
})
export class SearchComponent {
  searchQuery$ = new Subject<string>();
  searchResults: SearchResult = { tracks: [], albums: [], artists: [] };
  isSearching = false;
  hasSearched = false;
  activeTab: 'tracks' | 'albums' | 'artists' = 'tracks';

  constructor(
    private musicRepo: IMusicRepository,
    private playerUseCases: IPlayerUseCases
  ) {
    this.searchQuery$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.trim().length < 2) {
          this.hasSearched = false;
          return [];
        }
        this.isSearching = true;
        return this.musicRepo.search(query);
      })
    ).subscribe({
      next: (results: any) => {
        if (results) {
          this.searchResults = results;
          this.hasSearched = true;
        }
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Error en búsqueda:', error);
        this.isSearching = false;
      }
    });
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery$.next(query);
  }

  playTrack(track: any): void {
    const song: Song = {
      id: track.id,
      title: track.name,
      artist: track.artists,
      album: track.album,
      imageUrl: track.imageUrl,
      previewUrl: track.previewUrl
    };
    this.playerUseCases.playSong(song);
  }

  playAlbum(album: any): void {
    console.log('Reproducir álbum:', album.name);
    this.musicRepo.getAlbumTracks(album.id).subscribe(songs => {
      if (songs.length > 0) {
        songs.forEach(song => {
          song.album = album.name;
          song.imageUrl = album.imageUrl;
        });
        this.playerUseCases.loadSongs('').subscribe();
        this.playerUseCases.playSong(songs[0]);
      }
    });
  }

  setActiveTab(tab: 'tracks' | 'albums' | 'artists'): void {
    this.activeTab = tab;
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}