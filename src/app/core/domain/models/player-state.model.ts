import { Song } from './song.model';

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number; 
}