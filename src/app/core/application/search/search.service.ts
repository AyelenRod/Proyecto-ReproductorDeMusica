import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISearchUseCases } from '../../domain/ports/in/i-search.use-cases';
import { IMusicRepository } from '../../domain/ports/out/i-music.repository';
import { ISearchHistoryRepository } from '../../domain/ports/out/i-search-history.repository';
import { SearchResult } from '../../domain/models/search.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService implements ISearchUseCases {
  private readonly MAX_HISTORY_SIZE = 10;

  constructor(
    private musicRepository: IMusicRepository,
    private searchHistoryRepository: ISearchHistoryRepository
  ) {}

  search(query: string): Observable<SearchResult> {
    if (query && query.trim().length > 0) {
      this.addToHistory(query);
    }
    return this.musicRepository.search(query);
  }

  getSearchHistory(): string[] {
    return this.searchHistoryRepository.load();
  }

  addToHistory(query: string): void {
    if (!query || query.trim().length === 0) return;

    let history = this.getSearchHistory();
    
    // Remover duplicados
    history = history.filter(item => 
      item.toLowerCase() !== query.toLowerCase()
    );

    // Agregar al inicio
    history.unshift(query);

    // Mantener solo los últimos N
    history = history.slice(0, this.MAX_HISTORY_SIZE);

    this.searchHistoryRepository.save(history);
  }

  clearHistory(): void {
    this.searchHistoryRepository.clear();
  }
}