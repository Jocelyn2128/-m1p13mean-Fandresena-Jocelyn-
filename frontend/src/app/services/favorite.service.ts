import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = `${environment.apiUrl}/favorites`;

  constructor(private http: HttpClient) {}

  getFavorites(userId: string, type?: string): Observable<any> {
    let params = `?userId=${userId}`;
    if (type) {
      params += `&type=${type}`;
    }
    return this.http.get(`${this.apiUrl}${params}`);
  }

  addFavorite(userId: string, targetId: string, type: string): Observable<any> {
    return this.http.post(this.apiUrl, { userId, targetId, type });
  }

  removeFavorite(userId: string, targetId: string, type: string): Observable<any> {
    return this.http.delete(this.apiUrl, { body: { userId, targetId, type } });
  }

  checkFavorite(userId: string, targetId: string, type: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/check?userId=${userId}&targetId=${targetId}&type=${type}`);
  }
}
