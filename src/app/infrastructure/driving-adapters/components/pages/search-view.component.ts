import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { IMusicRepository } from '../../../../core/domain/ports/out/i-music.repository';
import { IPlayerUseCases } from '../../../../core/domain/ports/in/i-player.use-cases';
import { SearchResult, SearchTrack } from '../../../../core/domain/models/search.model';
import { Song } from '../../../../core/domain/models/song.model';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss'],
  standalone: false
})
export class SearchViewComponent implements OnInit {
  searchQuery: string = '';
  searchResults$: Observable<SearchResult | null> = of(null);
  isLoading: boolean = false;
  hasSearched: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private musicRepository: IMusicRepository,
    private playerUseCases: IPlayerUseCases
  ) {}

  ngOnInit(): void {
    // Obtener el query de la URL
    this.route.queryParams.subscribe(params => {
      const query = params['q'];
      if (query) {
        this.searchQuery = query;
        this.performSearch(query);
      }
    });
  }

  onSearchInput(): void {
    if (this.searchQuery.trim().length > 0) {
      // Actualizar la URL con el nuevo query
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { q: this.searchQuery },
        queryParamsHandling: 'merge'
      });
      
      this.performSearch(this.searchQuery);
    }
  }

  performSearch(query: string): void {
    if (!query || query.trim().length === 0) {
      this.searchResults$ = of(null);
      this.hasSearched = false;
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;
    
    this.searchResults$ = this.musicRepository.search(query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(results => {
        this.isLoading = false;
        return of(results);
      }),
      catchError(error => {
        console.error('Error en búsqueda:', error);
        this.isLoading = false;
        return of(null);
      })
    );
  }

  playTrack(track: SearchTrack): void {
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

  loadAlbum(albumId: string): void {
    this.musicRepository.getAlbumTracks(albumId).subscribe(songs => {
      if (songs.length > 0) {
        this.playerUseCases.playSong(songs[0]);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults$ = of(null);
    this.hasSearched = false;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }
}