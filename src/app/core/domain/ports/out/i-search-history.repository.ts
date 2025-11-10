export abstract class ISearchHistoryRepository {
  abstract save(history: string[]): void;
  abstract load(): string[];
  abstract clear(): void;
}