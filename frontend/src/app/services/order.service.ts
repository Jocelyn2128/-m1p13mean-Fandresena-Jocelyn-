import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getOrders(filters?: any): Observable<any> {
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

  getOrder(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createOrder(order: Order): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }

  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }

  getReceipt(receiptNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/receipt/${receiptNumber}`);
  }
}
