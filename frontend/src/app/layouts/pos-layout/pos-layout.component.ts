import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';
import { User } from '../../models/user.model';
import { Store } from '../../models/store.model';

@Component({
  selector: 'app-pos-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar POS -->
      <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div class="p-6">
          <h1 class="text-2xl font-bold text-blue-600">MallConnect</h1>
          <p class="text-sm text-gray-500">Point de Vente</p>
          <div *ngIf="currentStore" class="mt-2 text-xs text-gray-600">
            <i class="fas fa-store mr-1"></i>
            {{ currentStore.name }}
          </div>
        </div>
        
        <nav class="mt-6 flex-1 overflow-y-auto">
          <a [routerLink]="['/pos', storeId]" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="sidebar-link">
            <i class="fas fa-cash-register w-6"></i>
            <span>POS</span>
          </a>
          <a [routerLink]="['/pos', storeId, 'history']" routerLinkActive="active" class="sidebar-link">
            <i class="fas fa-history w-6"></i>
            <span>Historique</span>
          </a>
          <a [routerLink]="['/pos', storeId, 'reports']" routerLinkActive="active" class="sidebar-link">
            <i class="fas fa-chart-bar w-6"></i>
            <span>Rapports</span>
          </a>
        </nav>

        <div class="p-4 border-t border-gray-200 space-y-2">
          <a routerLink="/boutique" class="sidebar-link text-gray-600 hover:bg-gray-50">
            <i class="fas fa-arrow-left w-6"></i>
            <span>Retour aux boutiques</span>
          </a>
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
export class PosLayoutComponent implements OnInit {
  currentUser: User | null = null;
  currentStore: Store | null = null;
  storeId: string = '';

  constructor(
    private authService: AuthService,
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    // Get storeId from URL
    this.updateStoreId();
    
    // Subscribe to route changes to update storeId
    this.router.events.subscribe(() => {
      this.updateStoreId();
    });
  }

  updateStoreId(): void {
    // Get the current route and extract storeId
    const currentRoute = this.route.firstChild || this.route;
    const params = currentRoute.snapshot.params;
    if (params['id'] && params['id'] !== this.storeId) {
      this.storeId = params['id'];
      this.loadStore();
    }
  }

  loadStore(): void {
    this.storeService.getStore(this.storeId).subscribe({
      next: (response) => {
        if (response.success) {
          this.currentStore = response.data;
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
