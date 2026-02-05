import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200">
        <div class="p-6">
          <h1 class="text-2xl font-bold text-blue-600">MallConnect</h1>
          <p class="text-sm text-gray-500">Administration</p>
        </div>
        
        <nav class="mt-6">
          <a routerLink="/admin" routerLinkActive="active" class="sidebar-link">
            <i class="fas fa-home w-6"></i>
            <span>Tableau de bord</span>
          </a>
          <a routerLink="/admin/stores" routerLinkActive="active" class="sidebar-link">
            <i class="fas fa-store w-6"></i>
            <span>Boutiques</span>
          </a>
          <div class="sidebar-link cursor-pointer" (click)="toggleValidationMenu()">
            <i class="fas fa-check-circle w-6"></i>
            <span>Validation</span>
            <i class="fas fa-chevron-down ml-auto text-sm" [class.rotate-180]="showValidationMenu"></i>
          </div>
          <div *ngIf="showValidationMenu" class="bg-gray-50 py-2">
            <a routerLink="/admin/approvals" routerLinkActive="active" class="sidebar-link pl-12 text-sm">
              <span>Boutiques</span>
              <span *ngIf="pendingBoutiquesCount > 0" class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {{ pendingBoutiquesCount }}
              </span>
            </a>
            <a routerLink="/admin/approvals/users" routerLinkActive="active" class="sidebar-link pl-12 text-sm">
              <span>Utilisateurs</span>
              <span *ngIf="pendingUsersCount > 0" class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {{ pendingUsersCount }}
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
          <a routerLink="/admin/map" routerLinkActive="active" class="sidebar-link">
            <i class="fas fa-map w-6"></i>
            <span>Plan du centre</span>
          </a>
        </nav>

        <div class="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <button (click)="logout()" class="sidebar-link w-full text-left text-red-600">
            <i class="fas fa-sign-out-alt w-6"></i>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="px-8 py-4 flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-800">Tableau de bord Admin</h2>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600" *ngIf="currentUser">
                {{ currentUser.firstName }} {{ currentUser.lastName }}
              </span>
            </div>
          </div>
        </header>

        <div class="p-8">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="mall-card">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                  <i class="fas fa-store text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Total Boutiques</p>
                  <p class="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>

            <div class="mall-card">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100 text-green-600">
                  <i class="fas fa-shopping-bag text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Ventes Totales</p>
                  <p class="text-2xl font-bold">0 Ar</p>
                </div>
              </div>
            </div>

            <div class="mall-card">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <i class="fas fa-users text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Clients</p>
                  <p class="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>

            <div class="mall-card">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                  <i class="fas fa-box text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Produits</p>
                  <p class="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Content placeholder -->
          <div class="mall-card">
            <h3 class="text-lg font-semibold mb-4">Boutiques en attente d'approbation</h3>
            <p class="text-gray-500">Aucune boutique en attente pour le moment.</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [``]
})
export class AdminDashboardComponent {
  currentUser: User | null = null;
  showValidationMenu = false;
  pendingBoutiquesCount = 0;
  pendingUsersCount = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
    this.loadPendingCounts();
  }

  toggleValidationMenu(): void {
    this.showValidationMenu = !this.showValidationMenu;
  }

  loadPendingCounts(): void {
    // Simulation - à remplacer par l'appel API réel
    this.pendingBoutiquesCount = 2;
    this.pendingUsersCount = 3;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
