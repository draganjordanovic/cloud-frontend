import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ARTIST_ENDPOINT } from '../shared/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = ARTIST_ENDPOINT

  constructor(private http: HttpClient) { }

  createArtist(artistData: any): Observable<any> {
    return this.http.post(this.apiUrl, artistData);
  }
}
