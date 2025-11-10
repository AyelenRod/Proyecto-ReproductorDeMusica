import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlayerState } from '../../domain/models/player-state.model';
import { Song } from '../../domain/models/song.model';

@Injectable({ providedIn: 'root' })
export class PlayerStateService {
  private playlist: Song[] = [];
  
  private stateSubject = new BehaviorSubject<PlayerState>({
    currentSong: null,
    isPlaying: false,
    progress: 0,
  });

  getState(): Observable<PlayerState> {
    return this.stateSubject.asObservable();
  }

  setPlaylist(songs: Song[]) {
    this.playlist = songs;
  }

  play(song: Song) {
    this.stateSubject.next({
      ...this.stateSubject.value,
      currentSong: song,
      isPlaying: true,
      progress: 0,
    });
  }

  pause() {
    this.stateSubject.next({ ...this.stateSubject.value, isPlaying: false });
  }

  resume() {
    this.stateSubject.next({ ...this.stateSubject.value, isPlaying: true });
  }

  setCurrentSong(song: Song) {
    this.stateSubject.next({ ...this.stateSubject.value, currentSong: song, progress: 0 });
  }

  setProgress(progress: number) {
    this.stateSubject.next({ ...this.stateSubject.value, progress });
  }

  getNextSong(): Song | null {
    const currentSong = this.stateSubject.value.currentSong;
    if (!currentSong || this.playlist.length === 0) {
      return null;
    }

    const currentIndex = this.playlist.findIndex(s => s.id === currentSong.id);
    if (currentIndex === -1 || currentIndex === this.playlist.length - 1) {
      return null; // No hay siguiente o no se encontró
    }

    return this.playlist[currentIndex + 1];
  }

  getPreviousSong(): Song | null {
    const currentSong = this.stateSubject.value.currentSong;
    if (!currentSong || this.playlist.length === 0) {
      return null;
    }

    const currentIndex = this.playlist.findIndex(s => s.id === currentSong.id);
    if (currentIndex === -1 || currentIndex === 0) {
      return null; // No hay anterior o no se encontró
    }

    return this.playlist[currentIndex - 1];
  }
}