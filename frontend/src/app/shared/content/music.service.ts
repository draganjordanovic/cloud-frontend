import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ALBUM_ENDPOINT, SONG_ENDPOINT } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private albumsUrl = ALBUM_ENDPOINT
  private songsUrl = SONG_ENDPOINT

  constructor(private http: HttpClient) { }

  getAlbums(limit = 20, cursor?: string): Observable<any> {
    const params: any = { limit };
    if (cursor) params.cursor = cursor;
    return this.http.get(`${this.albumsUrl}/data`, { params });
  }

  getAlbumDetails(id: string, limit = 50, cursor?: string): Observable<any> {
    const params: any = { limit };
    if (cursor) params.cursor = cursor;
    return this.http.get(`${this.albumsUrl}/${id}`, { params });
  }

  getSingles(limit = 20, cursor?: string): Observable<any> {
    const params: any = { limit };
    if (cursor) params.cursor = cursor;
    return this.http.get(`${this.songsUrl}`, { params });
  }

  getSongStreamUrl(id: string): Observable<any> {
    return this.http.get(`${this.songsUrl}/${id}/stream-url`);
  }

  getSongCoverUrl(id: string): Observable<any> {
    return this.http.get(`${this.songsUrl}/${id}/cover-url`);
  }
}
