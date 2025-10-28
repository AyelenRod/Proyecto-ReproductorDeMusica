import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // IMPORTANTE: Para usar ngModel
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Routing
import { AppRoutingModule } from './app-routing-module';

// Core
import { IMusicRepository } from './core/domain/ports/out/i-music.repository';
import { IPlayerUseCases } from './core/domain/ports/in/i-player.use-cases';
import { PlayerService } from './core/application/player.service';

// Infrastructure
import { SpotifyService } from './infrastructure/driven-adapters/spotify-api/spotify.service';
import { SpotifyInterceptor } from './infrastructure/driven-adapters/spotify-api/spotify.interceptor';

// Components
import { App } from './app';
import { PlaylistViewComponent } from './infrastructure/driving-adapters/components/pages/playlist-view.component';
import { SearchViewComponent } from './infrastructure/driving-adapters/components/pages/search-view.component';

@NgModule({
  declarations: [
    App,
    PlaylistViewComponent,
    SearchViewComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: IPlayerUseCases, useClass: PlayerService },
    { provide: IMusicRepository, useClass: SpotifyService },
    { provide: HTTP_INTERCEPTORS, useClass: SpotifyInterceptor, multi: true }
  ],
  bootstrap: [App]
})
export class AppModule { }