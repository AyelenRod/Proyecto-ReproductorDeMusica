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
  
  // Autocompletado
  showSuggestions: boolean = false;
  suggestions: string[] = [];
  private searchHistory: string[] = [];
  private debounceTimer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private musicRepository: IMusicRepository,
    private playerUseCases: IPlayerUseCases
  ) {
    // Cargar historial de búsqueda del localStorage
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      this.searchHistory = JSON.parse(savedHistory);
    }
  }

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

  onSearchInputWithDebounce(): void {
    // Cancelar el timer anterior
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Actualizar sugerencias
    this.updateSuggestions();

    // Esperar 500ms antes de hacer la búsqueda real
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
    
    // Filtrar historial que coincida con la búsqueda
    this.suggestions = this.searchHistory
      .filter(item => item.toLowerCase().includes(query))
      .slice(0, 5); // Máximo 5 sugerencias

    // Si no hay sugerencias del historial, agregar la búsqueda actual
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
    // Delay para permitir click en sugerencias
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  private saveToHistory(query: string): void {
    if (!query || query.trim().length === 0) return;

    // Remover duplicados
    this.searchHistory = this.searchHistory.filter(item => 
      item.toLowerCase() !== query.toLowerCase()
    );

    // Agregar al inicio
    this.searchHistory.unshift(query);

    // Mantener solo los últimos 10
    this.searchHistory = this.searchHistory.slice(0, 10);

    // Guardar en localStorage
    localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
  }

  performSearch(query: string): void {
    if (!query || query.trim().length === 0) {
      this.searchResults$ = of(null);
      this.hasSearched = false;
      return;
    }

    // Guardar en historial
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
    this.suggestions = [];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }
}
