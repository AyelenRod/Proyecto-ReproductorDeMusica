import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private progressSubject = new BehaviorSubject<number>(0);
  private endedSubject = new Subject<void>();

  public progress$ = this.progressSubject.asObservable();
  public ended$ = this.endedSubject.asObservable();

  constructor() { }

  load(url: string) { }

  play() { }

  pause() { }
}