import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Routing
import { AppRoutingModule } from './app-routing-module';

// Core - Ports
import { IMusicRepository } from './core/domain/ports/out/i-music.repository';
import { IPlayerUseCases } from './core/domain/ports/in/i-player.use-cases';
import { ISearchUseCases } from './core/domain/ports/in/i-search.use-cases';
import { ISearchHistoryRepository } from './core/domain/ports/out/i-search-history.repository';

// Core - Application
import { PlayerService } from './core/application/player/player.service';
import { SearchService } from './core/application/search/search.service';

// Infrastructure - Driven Adapters
import { SpotifyService } from './infrastructure/driven-adapters/spotify-api/spotify.service';
import { SpotifyInterceptor } from './infrastructure/driven-adapters/spotify-api/spotify.interceptor';
import { SearchHistoryStorageService } from './infrastructure/driven-adapters/local-storage/search-history-storage.service';

// Infrastructure - Driving Adapters (Components)
import { App } from './app';
import { PlaylistViewComponent } from './infrastructure/driving-adapters/components/playlist/playlist-view.component';
import { SearchViewComponent } from './infrastructure/driving-adapters/components/search/search-view.component';
import { PlayerControlsComponent } from './infrastructure/driving-adapters/components/shared/player-controls/player-controls.component';

@NgModule({
  declarations: [
    App,
    PlaylistViewComponent,
    SearchViewComponent,
    PlayerControlsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    // Use Cases
    { provide: IPlayerUseCases, useClass: PlayerService },
    { provide: ISearchUseCases, useClass: SearchService },
    
    // Repositories
    { provide: IMusicRepository, useClass: SpotifyService },
    { provide: ISearchHistoryRepository, useClass: SearchHistoryStorageService },
    
    // Interceptors
    { provide: HTTP_INTERCEPTORS, useClass: SpotifyInterceptor, multi: true }
  ],
  bootstrap: [App]
})
export class AppModule { }