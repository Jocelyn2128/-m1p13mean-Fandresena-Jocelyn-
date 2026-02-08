import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div class="p-6">
          <h1 class="text-2xl font-bold text-blue-600">MallConnect</h1>
          <p class="text-sm text-gray-500">Administration</p>
        </div>
        
        <nav class="mt-6 flex-1 overflow-y-auto">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="sidebar-link">
            <i class="fas fa-home w-6"></i>
            <span>Tableau de bord</span>
          </a>
          <a routerLink="/admin/stores" routerLinkActive="active" class="sidebar-link">
            <i class="fas fa-store w-6"></i>
            <span>Boutiques</span>
          </a>
          <div class="sidebar-link cursor-pointer" (click)="toggleValidationMenu()" [class.bg-blue-50]="showValidationMenu" [class.text-blue-600]="showValidationMenu">
            <i class="fas fa-check-circle w-6"></i>
            <span>Validation</span>
            <i class="fas fa-chevron-down ml-auto text-sm transition-transform" [class.rotate-180]="showValidationMenu"></i>
          </div>
          <div *ngIf="showValidationMenu" class="bg-gray-50 py-2">
            <a routerLink="/admin/approvals" routerLinkActive="active" class="sidebar-link pl-12 text-sm">
              <span>Boutiques</span>
              <span *ngIf="pendingStoresCount > 0" class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {{ pendingStoresCount }}
              </span>
            </a>
            <a routerLink="/admin/approvals/users" routerLinkActive="active" class="sidebar-link pl-12 text-sm">
              <span>Utilisateurs</span>
              <span *ngIf="pendingUsersCount > 0" class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {{ pendingUsersCount }}
              </span>
            </a>
            <a routerLink="/admin/approvals/password-requests" routerLinkActive="active" class="sidebar-link pl-12 text-sm">
              <span>Mot de passe</span>
              <span *ngIf="pendingPasswordRequestsCount > 0" class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {{ pendingPasswordRequestsCount }}
              </span>
            </a>
          </div>
          <a routerLink="/admin/events" routerLinkActive="active" class="sidebar-link">
            <i class="fas fa-calendar w-6"></i>
            <span>Événements</span>
          </a>
          <a routerLink="/admin/statistics" routerLinkActive="active" class="sidebar-link">
            <i class="fas fa-chart-bar w-6"></i>
            <span>Statistiques</span>
          </a>
        </nav>

        <div class="p-4 border-t border-gray-200">
          <button (click)="logout()" class="sidebar-link w-full text-left text-red-600 hover:bg-red-50">
            <i class="fas fa-sign-out-alt w-6"></i>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [``]
})
export class AdminLayoutComponent implements OnInit {
  currentUser: User | null = null;
  showValidationMenu = false;
  pendingStoresCount = 0;
  pendingUsersCount = 0;
  pendingPasswordRequestsCount = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.loadPendingCounts();
    // Check if we're on a validation page to auto-expand menu
    const currentUrl = this.router.url;
    if (currentUrl.includes('/admin/approvals')) {
      this.showValidationMenu = true;
    }
  }

  toggleValidationMenu(): void {
    this.showValidationMenu = !this.showValidationMenu;
  }

  loadPendingCounts(): void {
    // Load pending user accounts
    this.authService.getPendingAccounts().subscribe({
      next: (response) => {
        if (response.success) {
          this.pendingUsersCount = response.data.length;
        }
      }
    });
    
    // Load pending stores
    this.authService.getPendingBoutiqueUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.pendingStoresCount = response.data.length;
        }
      }
    });
    
    // Load pending password reset requests
    this.http.get(`${environment.apiUrl}/auth/password-reset-requests`).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.pendingPasswordRequestsCount = response.data.length;
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}