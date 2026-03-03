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

  constructor(private http: HttpClient) { }

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

  /** Commande en ligne sans caisse (COMMANDE_LIGNE) */
  createOnlineOrder(orderData: {
    storeId: string;
    buyerId?: string;
    items: { productId: string; quantity: number }[];
    paymentMethod: string;
    notes?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/online`, orderData);
  }

  /** Historique des commandes d'un acheteur */
  getMyOrders(buyerId: string, filters?: { status?: string; page?: number }): Observable<any> {
    let params = new HttpParams().set('buyerId', buyerId);
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.page) params = params.set('page', String(filters.page));
    return this.http.get(`${this.apiUrl}/my-orders`, { params });
  }

  /** Annuler une commande */
  cancelOrder(id: string, reason?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/cancel`, { reason, returnToStock: true, decaisser: false });
  }

  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }

  getReceipt(receiptNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/receipt/${receiptNumber}`);
  }

  getOpenRegisters(storeId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/cash-registers?storeId=${storeId}&status=ouvert`);
  }
}

