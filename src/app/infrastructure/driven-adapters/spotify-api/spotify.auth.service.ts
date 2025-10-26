import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment'; // Guarda tus keys aquí

@Injectable({ providedIn: 'root' })
export class SpotifyAuthService {
  private tokenUrl = 'https://accounts.spotify.com/api/token';
  private currentToken: string | null = null;
  
  // Pon esto en environment.ts
  // export const environment = {
  //   production: false,
  //   spotify: {
  //     clientId: 'TU_CLIENT_ID',
  //     clientSecret: 'TU_CLIENT_SECRET'
  //   }
  // };

  constructor(private http: HttpClient) {}

  getToken(): Observable<string> {
    if (this.currentToken) {
      return new Observable(obs => obs.next(this.currentToken!));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(environment.spotify.clientId + ':' + environment.spotify.clientSecret)
    });

    const body = new HttpParams().set('grant_type', 'client_credentials');

    return this.http.post<any>(this.tokenUrl, body.toString(), { headers }).pipe(
      map(response => {
        this.currentToken = response.access_token;
        // Spotify da tokens que expiran, pero para este proyecto lo simplificamos
        return this.currentToken!;
      })
    );
  }
}