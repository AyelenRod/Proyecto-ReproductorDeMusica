import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// Componentes
import { AppComponent } from './infrastructure/driving-adapters/components/app/app.component';
import { PlaylistViewComponent } from './infrastructure/driving-adapters/components/pages/playlist-view.component.ts/playlist-view.component';
import { PlayerControlsComponent } from './infrastructure/driving-adapters/components/layout/player-controls.component.ts/player-controls.component';
import { SidebarComponent } from './infrastructure/driving-adapters/components/layout/sidebar.component.ts/sidebar.component';

// --- ARQUITECTURA HEXAGONAL: CONEXIÓN ---

// 1. Puertos
import { IMusicRepository } from './core/domain/ports/out/i-music.repository';
import { IPlayerUseCases } from './core/domain/ports/in/i-player.use-cases';

// 2. Adaptadores y Casos de Uso
import { SpotifyService } from './infrastructure/driven-adapters/spotify-api/spotify.service';
import { PlayerService } from './core/application/player.service';
import { SpotifyInterceptor } from './infrastructure/driven-adapters/spotify-api/spotify.interceptor';

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
    HttpClientModule // Importante para la API
  ],
  providers: [
    // Aquí le decimos a Angular:
    // "Cuando alguien pida el Puerto `IPlayerUseCases`...
    // ... entrégale la implementación `PlayerService`"
    { provide: IPlayerUseCases, useClass: PlayerService },

    // "Cuando alguien pida el Puerto `IMusicRepository`...
    // ... entrégale la implementación `SpotifyService`"
    { provide: IMusicRepository, useClass: SpotifyService },

    // Configuramos el Interceptor para el token de Spotify
    { provide: HTTP_INTERCEPTORS, useClass: SpotifyInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }