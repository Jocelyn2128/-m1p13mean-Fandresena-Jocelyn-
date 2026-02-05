import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CashRegister } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CashRegisterService {
  private apiUrl = `${environment.apiUrl}/cash-registers`;

  constructor(private http: HttpClient) {}

  getCashRegisters(storeId: string): Observable<any> {
    let params = new HttpParams().set('storeId', storeId);
    return this.http.get(this.apiUrl, { params });
  }

  getCashRegister(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createCashRegister(register: CashRegister): Observable<any> {
    return this.http.post(this.apiUrl, register);
  }

  openCashRegister(id: string, userId: string, initialBalance: number = 0): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/open`, { userId, initialBalance });
  }

  closeCashRegister(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/close`, {});
  }

  getReport(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/report`);
  }
}
