import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private apiUrl = '';

  constructor(private http: HttpClient) {}

  createArtist(artistData: any): Observable<any> {
    return this.http.post(this.apiUrl, artistData);
  }
}
