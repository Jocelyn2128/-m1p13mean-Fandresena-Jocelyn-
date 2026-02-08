import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { StoreService } from '../../../services/store.service';
import { AuthService } from '../../../services/auth.service';

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
                  <p class="text-2xl font-bold text-yellow-800">{{ pendingStoresCount }}</p>
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

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-700">{{ errorMessage }}</p>
          </div>

          <!-- Pending Stores List -->
          <div class="mall-card">
            <h3 class="text-lg font-semibold mb-4">Boutiques en attente d'approbation</h3>
            
            <div *ngIf="loading" class="text-center py-8 text-gray-500">
              <i class="fas fa-spinner fa-spin text-3xl text-blue-500 mb-4"></i>
              <p>Chargement des boutiques...</p>
            </div>

            <div *ngIf="!loading && pendingStores.length === 0" class="text-center py-8 text-gray-500">
              <i class="fas fa-check-circle text-5xl text-green-400 mb-4"></i>
              <p>Aucune boutique en attente d'approbation</p>
            </div>

            <div class="space-y-4" *ngIf="!loading && pendingStores.length > 0">
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
  `,
  styles: [``]
})
export class AdminApprovalComponent implements OnInit {
  pendingStores: PendingStore[] = [];
  pendingStoresCount = 0;
  pendingUsersCount = 0;
  approvedToday = 0;
  rejectedCount = 0;
  processingId: string | null = null;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPendingStores();
    this.loadStats();
  }

  loadPendingStores(): void {
    this.loading = true;
    this.errorMessage = null;
    
    this.storeService.getPendingStores().subscribe({
      next: (response) => {
        if (response.success) {
          this.pendingStores = response.data.map((store: any) => ({
            _id: store._id,
            name: store.name,
            description: store.description,
            category: store.category,
            location: store.location,
            owner: {
              firstName: store.ownerId.firstName,
              lastName: store.ownerId.lastName,
              email: store.ownerId.email,
              phone: store.ownerId.phone
            },
            status: store.status,
            createdAt: store.createdAt
          }));
          this.pendingStoresCount = this.pendingStores.length;
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des boutiques en attente';
        this.loading = false;
        console.error('Error loading pending stores:', error);
      }
    });
  }

  loadStats(): void {
    // TODO: Implement stats API call
    this.approvedToday = 0;
    this.rejectedCount = 0;
  }

  approveStore(storeId: string): void {
    this.processingId = storeId;
    this.errorMessage = null;
    
    this.storeService.approveStore(storeId).subscribe({
      next: () => {
        this.pendingStores = this.pendingStores.filter(s => s._id !== storeId);
        this.pendingStoresCount--;
        this.approvedToday++;
        this.processingId = null;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de l\'approbation de la boutique';
        this.processingId = null;
        console.error('Error approving store:', error);
      }
    });
  }

  rejectStore(storeId: string): void {
    this.processingId = storeId;
    this.errorMessage = null;
    
    this.storeService.rejectStore(storeId).subscribe({
      next: () => {
        this.pendingStores = this.pendingStores.filter(s => s._id !== storeId);
        this.pendingStoresCount--;
        this.rejectedCount++;
        this.processingId = null;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du refus de la boutique';
        this.processingId = null;
        console.error('Error rejecting store:', error);
      }
    });
  }
}
