import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success) {
          this.setSession(response.data);
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        if (response.success) {
          this.setSession(response.data);
        }
      })
    );
  }

  private setSession(authData: { token: string; user: User }): void {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    this.currentUserSubject.next(authData.user);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  getPendingAccounts(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/pending-accounts`);
  }

  getPendingBoutiqueUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/pending-boutiques`);
  }

  approveUser(userId: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/${userId}/approve`, {});
  }

  rejectUser(userId: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/${userId}/reject`, {});
  }

  approveBoutiqueUser(userId: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/${userId}/approve`, {});
  }

  rejectBoutiqueUser(userId: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/${userId}/reject`, {});
  }
}
