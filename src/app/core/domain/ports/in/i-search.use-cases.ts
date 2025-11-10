import { Observable } from 'rxjs';
import { SearchResult } from '../../models/search.model';

export abstract class ISearchUseCases {
  abstract search(query: string): Observable<SearchResult>;
  abstract getSearchHistory(): string[];
  abstract addToHistory(query: string): void;
  abstract clearHistory(): void;
}