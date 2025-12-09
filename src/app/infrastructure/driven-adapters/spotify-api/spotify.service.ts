import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { IMusicRepository } from '../../../core/domain/ports/out/i-music.repository';
import { Song } from '../../../core/domain/models/song.model';
import { SearchResult } from '../../../core/domain/models/search.model';
import { TrackMapper } from './mappers/track.mapper';
import { SearchMapper } from './mappers/search.mappers'
@Injectable({ providedIn: 'root' })
export class SpotifyService implements IMusicRepository {
  private baseUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient) { }

  getPlaylistTracks(playlistId: string): Observable<Song[]> {
    const url = `${this.baseUrl}/playlists/${playlistId}/tracks`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (!response.items || response.items.length === 0) {
          return [];
        }

        const songs = TrackMapper.DtoToDomainList(response.items);

        return songs;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  search(query: string): Observable<SearchResult> {
    const url = `${this.baseUrl}/search?q=${encodeURIComponent(query)}&type=track,album,artist&limit=20`;

    return this.http.get<any>(url).pipe(
      map(response => SearchMapper.DtoToDomain(response)),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getAlbumTracks(albumId: string): Observable<Song[]> {
    const url = `${this.baseUrl}/albums/${albumId}/tracks`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (!response.items || response.items.length === 0) {
          return [];
        }
        return response.items.map((item: any) => ({
          id: item.id,
          title: item.name,
          artist: item.artists.map((a: any) => a.name).join(', '),
          album: '',
          imageUrl: '',
          previewUrl: item.preview_url
        }));
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}