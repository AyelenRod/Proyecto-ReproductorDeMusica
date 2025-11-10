import { Injectable } from '@angular/core';
import { ISearchHistoryRepository } from '../../../core/domain/ports/out/i-search-history.repository';

@Injectable({
  providedIn: 'root',
})
export class SearchHistoryStorageService implements ISearchHistoryRepository {
  private readonly STORAGE_KEY = 'search_history';

  save(history: string[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  load(): string[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading search history:', error);
      return [];
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }
}