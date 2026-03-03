import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl = `${environment.apiUrl}/stores`;

  constructor(private http: HttpClient) { }

  getStores(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get(this.apiUrl, { params });
  }

  getStore(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createStore(store: Store): Observable<any> {
    return this.http.post(this.apiUrl, store);
  }

  getPendingStores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pending/all`);
  }

  approveStore(storeId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${storeId}/approve`, {});
  }

  rejectStore(storeId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${storeId}/reject`, {});
  }

  getMyStores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my/stores`);
  }

  updateStore(storeId: string, data: Partial<Store>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${storeId}`, data);
  }
}
