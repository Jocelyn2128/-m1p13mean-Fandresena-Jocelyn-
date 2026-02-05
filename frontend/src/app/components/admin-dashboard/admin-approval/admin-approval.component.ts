import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface PendingStore {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: {
    floor: string;
    shopNumber: string;
  };
  owner: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  status: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin-approval',
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
          <a routerLink="/admin/approvals" class="sidebar-link active">
            <i class="fas fa-check-circle w-6"></i>
            <span>Approbations</span>
            <span *ngIf="pendingCount > 0" class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {{ pendingCount }}
            </span>
          </a>
          <a routerLink="/admin/stores" class="sidebar-link">
            <i class="fas fa-store w-6"></i>
            <span>Boutiques</span>
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="px-8 py-4 flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-800">Approbation des Boutiques</h2>
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
                  <p class="text-2xl font-bold text-yellow-800">{{ pendingStores.length }}</p>
                </div>
              </div>
            </div>

            <div class="mall-card bg-green-50 border-green-200">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100 text-green-600">
                  <i class="fas fa-check text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-green-700">Approuvées aujourd'hui</p>
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
                  <p class="text-sm text-red-700">Refusées</p>
                  <p class="text-2xl font-bold text-red-800">{{ rejectedCount }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pending Stores List -->
          <div class="mall-card">
            <h3 class="text-lg font-semibold mb-4">Boutiques en attente d'approbation</h3>
            
            <div *ngIf="pendingStores.length === 0" class="text-center py-8 text-gray-500">
              <i class="fas fa-check-circle text-5xl text-green-400 mb-4"></i>
              <p>Aucune boutique en attente d'approbation</p>
            </div>

            <div class="space-y-4" *ngIf="pendingStores.length > 0">
              <div *ngFor="let store of pendingStores" class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h4 class="text-lg font-semibold text-gray-900">{{ store.name }}</h4>
                    <p class="text-sm text-gray-500">{{ store.category }} • Étage {{ store.location.floor }} • Local {{ store.location.shopNumber }}</p>
                  </div>
                  <span class="badge badge-warning">En attente</span>
                </div>

                <p class="text-gray-600 mb-4">{{ store.description }}</p>

                <div class="bg-gray-50 rounded-lg p-4 mb-4">
                  <h5 class="text-sm font-medium text-gray-700 mb-2">Propriétaire</h5>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-gray-500">Nom:</span>
                      <span class="ml-2 font-medium">{{ store.owner.firstName }} {{ store.owner.lastName }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Email:</span>
                      <span class="ml-2 font-medium">{{ store.owner.email }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Téléphone:</span>
                      <span class="ml-2 font-medium">{{ store.owner.phone }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Date de demande:</span>
                      <span class="ml-2 font-medium">{{ store.createdAt | date:'dd/MM/yyyy' }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex space-x-3">
                  <button 
                    (click)="approveStore(store._id)"
                    class="flex-1 btn-success"
                    [disabled]="processingId === store._id"
                  >
                    <i class="fas fa-check mr-2"></i>
                    <span *ngIf="processingId !== store._id">Approuver</span>
                    <span *ngIf="processingId === store._id">Traitement...</span>
                  </button>
                  <button 
                    (click)="rejectStore(store._id)"
                    class="flex-1 btn-danger"
                    [disabled]="processingId === store._id"
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
export class AdminApprovalComponent implements OnInit {
  pendingStores: PendingStore[] = [];
  pendingCount = 0;
  approvedToday = 0;
  rejectedCount = 0;
  processingId: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPendingStores();
    this.loadStats();
  }

  loadPendingStores(): void {
    // Simulation de données pour démonstration
    // Remplacer par l'appel API réel
    this.pendingStores = [
      {
        _id: '1',
        name: 'Boutique Électronique Plus',
        description: 'Vente de produits électroniques et accessoires high-tech',
        category: 'electronique',
        location: { floor: '1', shopNumber: 'B-15' },
        owner: {
          firstName: 'Jean',
          lastName: 'Rakoto',
          email: 'jean.rakoto@email.com',
          phone: '034 12 345 67'
        },
        status: 'pending_approval',
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        name: 'Fashion Style',
        description: 'Boutique de vêtements tendance pour hommes et femmes',
        category: 'mode',
        location: { floor: 'RDC', shopNumber: 'A-08' },
        owner: {
          firstName: 'Marie',
          lastName: 'Rasoanirina',
          email: 'marie.fashion@email.com',
          phone: '034 98 765 43'
        },
        status: 'pending_approval',
        createdAt: new Date().toISOString()
      }
    ];
    this.pendingCount = this.pendingStores.length;
  }

  loadStats(): void {
    // Simulation de statistiques
    this.approvedToday = 3;
    this.rejectedCount = 1;
  }

  approveStore(storeId: string): void {
    this.processingId = storeId;
    
    // Appel API pour approuver
    // this.http.put(`${environment.apiUrl}/stores/${storeId}/approve`, {}).subscribe({
    //   next: () => {
    //     this.pendingStores = this.pendingStores.filter(s => s._id !== storeId);
    //     this.pendingCount--;
    //     this.approvedToday++;
    //     this.processingId = null;
    //   },
    //   error: () => {
    //     this.processingId = null;
    //   }
    // });

    // Simulation
    setTimeout(() => {
      this.pendingStores = this.pendingStores.filter(s => s._id !== storeId);
      this.pendingCount--;
      this.approvedToday++;
      this.processingId = null;
    }, 1000);
  }

  rejectStore(storeId: string): void {
    this.processingId = storeId;
    
    // Appel API pour refuser
    // this.http.put(`${environment.apiUrl}/stores/${storeId}/reject`, {}).subscribe({
    //   next: () => {
    //     this.pendingStores = this.pendingStores.filter(s => s._id !== storeId);
    //     this.pendingCount--;
    //     this.rejectedCount++;
    //     this.processingId = null;
    //   },
    //   error: () => {
    //     this.processingId = null;
    //   }
    // });

    // Simulation
    setTimeout(() => {
      this.pendingStores = this.pendingStores.filter(s => s._id !== storeId);
      this.pendingCount--;
      this.rejectedCount++;
      this.processingId = null;
    }, 1000);
  }
}
