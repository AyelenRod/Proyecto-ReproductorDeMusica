import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, takeUntil } from 'rxjs/operators';
import { IMusicRepository } from '../../../../core/domain/ports/out/i-music.repository';
import { IPlayerUseCases } from '../../../../core/domain/ports/in/i-player.use-cases';
import { SearchResult, SearchTrack } from '../../../../core/domain/models/search.model';
import { Song } from '../../../../core/domain/models/song.model';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.css'], 
  standalone: false
})
export class SearchViewComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  searchResults$: Observable<SearchResult | null> = of(null);
  isLoading: boolean = false;
  hasSearched: boolean = false;
  
  showSuggestions: boolean = false;
  suggestions: string[] = [];
  private searchHistory: string[] = []; 
  private debounceTimer: any;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private musicRepository: IMusicRepository,
    private playerUseCases: IPlayerUseCases
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const query = params['q'];
        if (query) {
          this.searchQuery = query;
          this.performSearch(query);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  onSearchInput(): void {
    if (this.searchQuery.trim().length > 0) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { q: this.searchQuery },
        queryParamsHandling: 'merge'
      });
      
      this.performSearch(this.searchQuery);
    }
  }

  onSearchInputWithDebounce(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.updateSuggestions();

    this.debounceTimer = setTimeout(() => {
      if (this.searchQuery.trim().length > 0) {
        this.onSearchInput();
      }
    }, 500);
  }

  updateSuggestions(): void {
    if (this.searchQuery.trim().length === 0) {
      this.suggestions = [];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    
    this.suggestions = this.searchHistory
      .filter(item => item.toLowerCase().includes(query))
      .slice(0, 5); 

    if (this.suggestions.length === 0 && this.searchQuery.trim().length > 2) {
      this.suggestions = [this.searchQuery];
    }
  }

  selectSuggestion(suggestion: string): void {
    this.searchQuery = suggestion;
    this.showSuggestions = false;
    this.onSearchInput();
  }

  hideSuggestions(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  private saveToHistory(query: string): void {
    if (!query || query.trim().length === 0) return;

    this.searchHistory = this.searchHistory.filter(item => 
      item.toLowerCase() !== query.toLowerCase()
    );

    this.searchHistory.unshift(query);
    this.searchHistory = this.searchHistory.slice(0, 10);
  }

  performSearch(query: string): void {
    if (!query || query.trim().length === 0) {
      this.searchResults$ = of(null);
      this.hasSearched = false;
      return;
    }

    this.saveToHistory(query);

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
      }),
      takeUntil(this.destroy$)
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
    this.musicRepository.getAlbumTracks(albumId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(songs => {
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
    this.suggestions = [];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }
}