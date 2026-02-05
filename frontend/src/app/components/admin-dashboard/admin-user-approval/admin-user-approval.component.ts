import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

interface PendingBoutiqueUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  storeInfo: {
    storeName: string;
    category: string;
    description: string;
    floor: string;
    shopNumber: string;
  };
  createdAt: string;
}

@Component({
  selector: 'app-admin-user-approval',
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
          <a routerLink="/admin" class="sidebar-link">
            <i class="fas fa-home w-6"></i>
            <span>Tableau de bord</span>
          </a>
          <a routerLink="/admin/stores" class="sidebar-link">
            <i class="fas fa-store w-6"></i>
            <span>Boutiques</span>
          </a>
          <div class="sidebar-link bg-blue-50 text-blue-600">
            <i class="fas fa-check-circle w-6"></i>
            <span>Validation</span>
            <i class="fas fa-chevron-down ml-auto text-sm rotate-180"></i>
          </div>
          <div class="bg-gray-50 py-2">
            <a routerLink="/admin/approvals" class="sidebar-link pl-12 text-sm">
              <span>Boutiques</span>
            </a>
            <a routerLink="/admin/approvals/users" class="sidebar-link pl-12 text-sm active">
              <span>Utilisateurs</span>
              <span *ngIf="pendingUsers.length > 0" class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {{ pendingUsers.length }}
              </span>
            </a>
          </div>
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
            <h2 class="text-xl font-semibold text-gray-800">Validation des Comptes Boutique</h2>
          </div>
        </header>

        <div class="p-8">
          <!-- Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="mall-card bg-yellow-50 border-yellow-200">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <i class="fas fa-clock text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-yellow-700">En attente</p>
                  <p class="text-2xl font-bold text-yellow-800">{{ pendingUsers.length }}</p>
                </div>
              </div>
            </div>

            <div class="mall-card bg-green-50 border-green-200">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100 text-green-600">
                  <i class="fas fa-check text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-green-700">Approuvés aujourd'hui</p>
                  <p class="text-2xl font-bold text-green-800">{{ approvedToday }}</p>
                </div>
              </div>
            </div>

            <div class="mall-card bg-red-50 border-red-200">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-red-100 text-red-600">
                  <i class="fas fa-times text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-red-700">Refusés</p>
                  <p class="text-2xl font-bold text-red-800">{{ rejectedCount }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pending Users List -->
          <div class="mall-card">
            <h3 class="text-lg font-semibold mb-4">Comptes boutique en attente de validation</h3>
            
            <div *ngIf="pendingUsers.length === 0" class="text-center py-8 text-gray-500">
              <i class="fas fa-check-circle text-5xl text-green-400 mb-4"></i>
              <p>Aucun compte en attente de validation</p>
            </div>

            <div class="space-y-4" *ngIf="pendingUsers.length > 0">
              <div *ngFor="let user of pendingUsers" class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <i class="fas fa-store text-green-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 class="text-lg font-semibold text-gray-900">{{ user.storeInfo.storeName }}</h4>
                      <p class="text-sm text-gray-500">{{ user.storeInfo.category }} • {{ user.firstName }} {{ user.lastName }}</p>
                    </div>
                  </div>
                  <span class="badge badge-warning">En attente</span>
                </div>

                <div class="grid grid-cols-2 gap-6 mb-4">
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h5 class="text-sm font-medium text-gray-700 mb-2">Propriétaire</h5>
                    <div class="space-y-1 text-sm">
                      <p><span class="text-gray-500">Nom:</span> {{ user.firstName }} {{ user.lastName }}</p>
                      <p><span class="text-gray-500">Email:</span> {{ user.email }}</p>
                      <p><span class="text-gray-500">Téléphone:</span> {{ user.phone }}</p>
                    </div>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h5 class="text-sm font-medium text-gray-700 mb-2">Boutique</h5>
                    <div class="space-y-1 text-sm">
                      <p><span class="text-gray-500">Catégorie:</span> {{ user.storeInfo.category }}</p>
                      <p><span class="text-gray-500">Emplacement:</span> Étage {{ user.storeInfo.floor }}, Local {{ user.storeInfo.shopNumber }}</p>
                      <p><span class="text-gray-500">Date de demande:</span> {{ user.createdAt | date:'dd/MM/yyyy' }}</p>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-lg p-4 mb-4">
                  <h5 class="text-sm font-medium text-gray-700 mb-2">Description</h5>
                  <p class="text-sm text-gray-600">{{ user.storeInfo.description }}</p>
                </div>

                <div class="flex space-x-3">
                  <button 
                    (click)="approveUser(user._id)"
                    class="flex-1 btn-success"
                    [disabled]="processingId === user._id"
                  >
                    <i class="fas fa-check mr-2"></i>
                    <span *ngIf="processingId !== user._id">Approuver</span>
                    <span *ngIf="processingId === user._id">Traitement...</span>
                  </button>
                  <button 
                    (click)="rejectUser(user._id)"
                    class="flex-1 btn-danger"
                    [disabled]="processingId === user._id"
                  >
                    <i class="fas fa-times mr-2"></i>
                    Refuser
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [``]
})
export class AdminUserApprovalComponent implements OnInit {
  currentUser: User | null = null;
  pendingUsers: PendingBoutiqueUser[] = [];
  approvedToday = 0;
  rejectedCount = 0;
  processingId: string | null = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.loadPendingUsers();
    this.loadStats();
  }

  loadPendingUsers(): void {
    // Simulation de données pour démonstration
    this.pendingUsers = [
      {
        _id: '1',
        firstName: 'Jean',
        lastName: 'Rakoto',
        email: 'jean.rakoto@email.com',
        phone: '034 12 345 67',
        storeInfo: {
          storeName: 'Électronique Plus',
          category: 'Électronique',
          description: 'Vente de produits électroniques et accessoires high-tech de qualité',
          floor: '1',
          shopNumber: 'B-15'
        },
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        firstName: 'Marie',
        lastName: 'Rasoanirina',
        email: 'marie.fashion@email.com',
        phone: '034 98 765 43',
        storeInfo: {
          storeName: 'Fashion Style',
          category: 'Mode',
          description: 'Boutique de vêtements tendance pour hommes et femmes',
          floor: 'RDC',
          shopNumber: 'A-08'
        },
        createdAt: new Date().toISOString()
      },
      {
        _id: '3',
        firstName: 'Paul',
        lastName: 'Randria',
        email: 'paul.sport@email.com',
        phone: '034 55 123 45',
        storeInfo: {
          storeName: 'Sport Max',
          category: 'Sport',
          description: 'Équipements sportifs et articles de fitness',
          floor: '2',
          shopNumber: 'C-22'
        },
        createdAt: new Date().toISOString()
      }
    ];
  }

  loadStats(): void {
    this.approvedToday = 2;
    this.rejectedCount = 1;
  }

  approveUser(userId: string): void {
    this.processingId = userId;
    
    setTimeout(() => {
      this.pendingUsers = this.pendingUsers.filter(u => u._id !== userId);
      this.approvedToday++;
      this.processingId = null;
    }, 1000);
  }

  rejectUser(userId: string): void {
    this.processingId = userId;
    
    setTimeout(() => {
      this.pendingUsers = this.pendingUsers.filter(u => u._id !== userId);
      this.rejectedCount++;
      this.processingId = null;
    }, 1000);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
