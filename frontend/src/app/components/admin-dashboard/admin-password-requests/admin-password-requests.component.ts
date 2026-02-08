import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface PasswordResetRequest {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  email: string;
  status: string;
  requestedAt: string;
}

@Component({
  selector: 'app-admin-password-requests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Demandes de changement de mot de passe</h2>
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
              <p class="text-2xl font-bold text-yellow-800">{{ pendingCount }}</p>
            </div>
          </div>
        </div>

        <div class="mall-card bg-green-50 border-green-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <i class="fas fa-check text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-green-700">Approuvées</p>
              <p class="text-2xl font-bold text-green-800">{{ approvedCount }}</p>
            </div>
          </div>
        </div>

        <div class="mall-card bg-red-50 border-red-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 text-red-600">
              <i class="fas fa-times text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-red-700">Rejetées</p>
              <p class="text-2xl font-bold text-red-800">{{ rejectedCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700">{{ errorMessage }}</p>
      </div>

      <!-- Success Message -->
      <div *ngIf="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-green-700">{{ successMessage }}</p>
      </div>

      <!-- Requests List -->
      <div class="mall-card">
        <h3 class="text-lg font-semibold mb-4">Demandes en attente de validation</h3>
        
        <div *ngIf="loading" class="text-center py-8 text-gray-500">
          <i class="fas fa-spinner fa-spin text-3xl text-blue-500 mb-4"></i>
          <p>Chargement des demandes...</p>
        </div>

        <div *ngIf="!loading && requests.length === 0" class="text-center py-8 text-gray-500">
          <i class="fas fa-check-circle text-5xl text-green-400 mb-4"></i>
          <p>Aucune demande en attente</p>
        </div>

        <div class="space-y-4" *ngIf="!loading && requests.length > 0">
          <div *ngFor="let request of requests" class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <i class="fas fa-lock text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900">{{ request.userId.firstName }} {{ request.userId.lastName }}</h4>
                  <p class="text-sm text-gray-500">{{ request.userId.email }}</p>
                </div>
              </div>
              <span class="badge badge-warning">En attente</span>
            </div>

            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">Téléphone:</span>
                  <span class="ml-2 font-medium">{{ request.userId.phone }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Date de demande:</span>
                  <span class="ml-2 font-medium">{{ request.requestedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
              </div>
            </div>

            <div class="flex space-x-3">
              <button 
                (click)="approveRequest(request._id)"
                class="flex-1 btn-success"
                [disabled]="processingId === request._id"
              >
                <i class="fas fa-check mr-2"></i>
                <span *ngIf="processingId !== request._id">Approuver et changer le mot de passe</span>
                <span *ngIf="processingId === request._id">Traitement...</span>
              </button>
              <button 
                (click)="rejectRequest(request._id)"
                class="flex-1 btn-danger"
                [disabled]="processingId === request._id"
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
export class AdminPasswordRequestsComponent implements OnInit {
  requests: PasswordResetRequest[] = [];
  pendingCount = 0;
  approvedCount = 0;
  rejectedCount = 0;
  processingId: string | null = null;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRequests();
    this.loadStats();
  }

  loadRequests(): void {
    this.loading = true;
    this.errorMessage = null;
    
    this.http.get(`${environment.apiUrl}/auth/password-reset-requests`).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.requests = response.data;
          this.pendingCount = response.data.length;
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des demandes';
        this.loading = false;
        console.error('Error loading requests:', error);
      }
    });
  }

  loadStats(): void {
    // TODO: Implement stats API call
    this.approvedCount = 0;
    this.rejectedCount = 0;
  }

  approveRequest(requestId: string): void {
    this.processingId = requestId;
    this.errorMessage = null;
    this.successMessage = null;
    
    this.http.put(`${environment.apiUrl}/auth/password-reset-requests/${requestId}/approve`, {}).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r._id !== requestId);
        this.pendingCount--;
        this.approvedCount++;
        this.processingId = null;
        this.successMessage = 'Mot de passe changé avec succès';
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de l\'approbation de la demande';
        this.processingId = null;
        console.error('Error approving request:', error);
      }
    });
  }

  rejectRequest(requestId: string): void {
    this.processingId = requestId;
    this.errorMessage = null;
    this.successMessage = null;
    
    this.http.put(`${environment.apiUrl}/auth/password-reset-requests/${requestId}/reject`, {}).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r._id !== requestId);
        this.pendingCount--;
        this.rejectedCount++;
        this.processingId = null;
        this.successMessage = 'Demande rejetée';
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du rejet de la demande';
        this.processingId = null;
        console.error('Error rejecting request:', error);
      }
    });
  }
}
