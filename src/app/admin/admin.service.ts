import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ALBUM_ENDPOINT, ARTIST_ENDPOINT, SONG_ENDPOINT } from '../shared/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private artistsUrl = ARTIST_ENDPOINT
  private songsUrl = SONG_ENDPOINT
  private albumsUrl = ALBUM_ENDPOINT

  constructor(private http: HttpClient) { }

  createArtist(artistData: any): Observable<any> {
    return this.http.post(this.artistsUrl, artistData);
  }
   getArtists(): Observable<any> {
    return this.http.get(this.artistsUrl);
  }

  createSong(songData: any): Observable<any> {
    return this.http.post(this.songsUrl, songData);
  } 

  getAlbums(): Observable<any> {
    return this.http.get(this.albumsUrl);
  }

  uploadToS3(url: string, file: File): Promise<Response> {
    return fetch(url, {
      method: 'PUT',
      body: file
    });
  }
}
