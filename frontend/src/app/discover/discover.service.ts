import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {ALBUM_ENDPOINT, BASE_URL} from '../shared/app.constants';

@Injectable({
  providedIn: 'root'
})
export class DiscoverService {
  private discoverUrl = `${BASE_URL}/discover`;

  constructor(private http: HttpClient) {}

  getContentByGenre(genre: string, type: string = ''): Observable<any> {
    let params = new HttpParams().set('genre', genre);
    if (type) params = params.set('type', type);
    return this.http.get<any[]>(this.discoverUrl,  {
      params: params,
    });
  }

  getAlbumById(id: string): Observable<any> {
    return this.http.get(`${ALBUM_ENDPOINT}/${id}`);
  }
}
