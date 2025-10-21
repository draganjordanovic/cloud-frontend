import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CREATE_ARTIST_ENDPOINT } from '../shared/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private apiUrl = CREATE_ARTIST_ENDPOINT

  constructor(private http: HttpClient) {}

  createArtist(artistData: any): Observable<any> {
    return this.http.post(this.apiUrl, artistData);
  }
}
