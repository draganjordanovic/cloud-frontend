import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../shared/app.constants';

@Injectable({
  providedIn: 'root'
})
export class DiscoverService {
  private discoverUrl = `${BASE_URL}/discover`;

  constructor(private http: HttpClient) {}

  getContentByGenre(genre: string): Observable<any> {
    return this.http.get(this.discoverUrl, {
      params: { genre }
    });
  }
}
