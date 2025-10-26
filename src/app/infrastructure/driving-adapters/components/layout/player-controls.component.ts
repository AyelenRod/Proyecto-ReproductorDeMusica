import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IPlayerUseCases } from '../../../../core/domain/ports/in/i-player.use-cases';
import { PlayerState } from '../../../../core/domain/models/player-state.model';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss']
})
export class PlayerControlsComponent {
  
  playerState$: Observable<PlayerState>;

  constructor(private playerUseCases: IPlayerUseCases) {
    this.playerState$ = this.playerUseCases.getState();
  }

  togglePlayPause(isPlaying: boolean) {
    if (isPlaying) {
      this.playerUseCases.pause();
    } else {
      this.playerUseCases.resume();
    }
  }
}