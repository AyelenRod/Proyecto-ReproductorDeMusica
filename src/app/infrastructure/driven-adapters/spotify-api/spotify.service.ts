import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IMusicRepository } from '../../../core/domain/ports/out/i-music.repository';
import { Song } from '../../../core/domain/models/song.model';
import { TrackMapper } from './mappers/track.mapper';

@Injectable({ providedIn: 'root' })
export class SpotifyService implements IMusicRepository {
  private baseUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient) {}

  getPlaylistTracks(playlistId: string): Observable<Song[]> {
    // Hacemos la llamada HTTP (el interceptor pondrá el token)
    return this.http.get<any>(`${this.baseUrl}/playlists/${playlistId}/tracks`).pipe(
      // Mapeamos la respuesta (DTO) a nuestro modelo de dominio (Song[])
      map(response => TrackMapper.DtoToDomainList(response.items))
    );
  }
}