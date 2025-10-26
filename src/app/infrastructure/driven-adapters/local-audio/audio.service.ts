import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private audio = new Audio();
  private progressSubject = new BehaviorSubject<number>(0);
  private endedSubject = new Subject<void>();

  public progress$ = this.progressSubject.asObservable();
  public ended$ = this.endedSubject.asObservable();

  constructor() {
    this.audio.addEventListener('timeupdate', () => {
      const progress = (this.audio.currentTime / this.audio.duration) * 100 || 0;
      this.progressSubject.next(progress);
    });
    this.audio.addEventListener('ended', () => this.endedSubject.next());
  }

  load(url: string) {
    this.audio.src = url;
    this.audio.load();
  }

  play() {
    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }
}