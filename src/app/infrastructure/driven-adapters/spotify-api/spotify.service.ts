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

  constructor(private http: HttpClient) {}

  getPlaylistTracks(playlistId: string): Observable<Song[]> {
    const url = `${this.baseUrl}/playlists/${playlistId}/tracks`;
    console.log('GET:', url);
    
    return this.http.get<any>(url).pipe(
      tap(response => {
        console.log('Respuesta de Spotify recibida');
        console.log('Items:', response.items?.length || 0);
      }),
      map(response => {
        if (!response.items || response.items.length === 0) {
          console.warn('La playlist está vacía o no tiene items');
          return [];
        }
        
        const songs = TrackMapper.DtoToDomainList(response.items);
        console.log('Canciones procesadas:', songs.length);
        
        if (songs.length > 0) {
          console.log('Primera canción:', songs[0]);
        }
        
        return songs;
      }),
      catchError(error => {
        console.error('ERROR en Spotify Service:');
        console.error('Status:', error.status);
        console.error('StatusText:', error.statusText);
        console.error('URL:', error.url);
        console.error('Error completo:', error);
        
        if (error.status === 404) {
          console.error('Playlist no encontrada. Verifica el ID de la playlist.');
          console.error('Playlist ID usado:', playlistId);
        } else if (error.status === 401) {
          console.error('Token inválido o expirado. Verifica las credenciales de Spotify.');
        }
        
        return throwError(() => error);
      })
    );
  }

  search(query: string): Observable<SearchResult> {
    const url = `${this.baseUrl}/search?q=${encodeURIComponent(query)}&type=track,album,artist&limit=20`;
    console.log('Buscando:', query);
    
    return this.http.get<any>(url).pipe(
      tap(response => console.log('Resultados de búsqueda recibidos')),
      map(response => SearchMapper.DtoToDomain(response)),
      catchError(error => {
        console.error('Error en búsqueda:', error);
        return throwError(() => error);
      })
    );
  }

  getAlbumTracks(albumId: string): Observable<Song[]> {
    const url = `${this.baseUrl}/albums/${albumId}/tracks`;
    console.log('GET Album tracks:', url);
    
    return this.http.get<any>(url).pipe(
      tap(response => console.log('Tracks del álbum recibidos')),
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
        console.error('Error al obtener tracks del álbum:', error);
        return throwError(() => error);
      })
    );
  }
}