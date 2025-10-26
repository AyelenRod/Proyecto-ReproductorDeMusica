import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SpotifyAuthService } from './spotify.auth.service';

@Injectable()
export class SpotifyInterceptor implements HttpInterceptor {
  constructor(private authService: SpotifyAuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo intercepta las peticiones a la API de Spotify
    if (req.url.includes('api.spotify.com')) {
      return this.authService.getToken().pipe(
        switchMap(token => {
          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(authReq);
        })
      );
    }
    return next.handle(req);
  }
}