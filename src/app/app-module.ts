import { NgModule } from '@angular/core';
 
import { IMusicRepository } from '../app/core/domain/ports/out/i-music.repository';
import { IPlayerUseCases } from '../app/core/domain/ports/in/i-player.use-cases';
import { SpotifyService } from '../app/infrastructure/driven-adapters/spotify-api/spotify.service';
import { PlayerService } from './core/application/player.service';
import { SpotifyInterceptor } from './infrastructure/driven-adapters/spotify-api/spotify.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './infrastructure/driving-adapters/app/app.component';
import { PlayerControlsComponent } from './infrastructure/driving-adapters/components/layout/player-controls.component';
import { SidebarComponent } from './infrastructure/driving-adapters/components/layout/sidebar.component';
import { PlaylistViewComponent } from './infrastructure/driving-adapters/components/pages/playlist-view.component';


@NgModule({
  declarations: [
    AppComponent,
    PlaylistViewComponent,
    PlayerControlsComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: IPlayerUseCases, useClass: PlayerService },
    { provide: IMusicRepository, useClass: SpotifyService },
    { provide: HTTP_INTERCEPTORS, useClass: SpotifyInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }