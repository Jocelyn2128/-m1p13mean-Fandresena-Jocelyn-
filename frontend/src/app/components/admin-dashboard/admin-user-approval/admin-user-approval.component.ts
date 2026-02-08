import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-admin-user-approval',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Validation des Comptes Commerçants</h2>
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
              <p class="text-sm text-yellow-700">Comptes en attente</p>
              <p class="text-2xl font-bold text-yellow-800">{{ pendingUsersCount }}</p>
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

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700">{{ errorMessage }}</p>
      </div>

      <!-- Pending Users List -->
      <div class="mall-card">
        <h3 class="text-lg font-semibold mb-4">Comptes commerçants en attente de validation</h3>
        
        <div *ngIf="loading" class="text-center py-8 text-gray-500">
          <i class="fas fa-spinner fa-spin text-3xl text-blue-500 mb-4"></i>
          <p>Chargement des comptes...</p>
        </div>

        <div *ngIf="!loading && pendingUsers.length === 0" class="text-center py-8 text-gray-500">
          <i class="fas fa-check-circle text-5xl text-green-400 mb-4"></i>
          <p>Aucun compte en attente de validation</p>
        </div>

        <div class="space-y-4" *ngIf="!loading && pendingUsers.length > 0">
          <div *ngFor="let user of pendingUsers" class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <i class="fas fa-user text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900">{{ user.firstName }} {{ user.lastName }}</h4>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                </div>
              </div>
              <span class="badge badge-warning">En attente</span>
            </div>

            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">Téléphone:</span>
                  <span class="ml-2 font-medium">{{ user.phone }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Date d'inscription:</span>
                  <span class="ml-2 font-medium">{{ user.createdAt | date:'dd/MM/yyyy' }}</span>
                </div>
              </div>
            </div>

            <div class="flex space-x-3">
              <button 
                (click)="approveUser(user._id!)"
                class="flex-1 btn-success"
                [disabled]="processingId === user._id"
              >
                <i class="fas fa-check mr-2"></i>
                <span *ngIf="processingId !== user._id">Approuver le compte</span>
                <span *ngIf="processingId === user._id">Traitement...</span>
              </button>
              <button 
                (click)="rejectUser(user._id!)"
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
  `,
  styles: [``]
})
export class AdminUserApprovalComponent implements OnInit {
  currentUser: User | null = null;
  pendingUsers: User[] = [];
  pendingUsersCount = 0;
  approvedToday = 0;
  rejectedCount = 0;
  processingId: string | null = null;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
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
    this.loading = true;
    this.errorMessage = null;
    
    this.authService.getPendingAccounts().subscribe({
      next: (response) => {
        if (response.success) {
          this.pendingUsers = response.data;
          this.pendingUsersCount = response.data.length;
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des comptes en attente';
        this.loading = false;
        console.error('Error loading pending accounts:', error);
      }
    });
  }

  loadStats(): void {
    // TODO: Implement stats API call
    this.approvedToday = 0;
    this.rejectedCount = 0;
  }

  approveUser(userId: string): void {
    this.processingId = userId;
    this.errorMessage = null;
    
    this.authService.approveUser(userId).subscribe({
      next: () => {
        this.pendingUsers = this.pendingUsers.filter(u => u._id !== userId);
        this.pendingUsersCount--;
        this.approvedToday++;
        this.processingId = null;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de l\'approbation du compte';
        this.processingId = null;
        console.error('Error approving user:', error);
      }
    });
  }

  rejectUser(userId: string): void {
    this.processingId = userId;
    this.errorMessage = null;
    
    this.authService.rejectUser(userId).subscribe({
      next: () => {
        this.pendingUsers = this.pendingUsers.filter(u => u._id !== userId);
        this.pendingUsersCount--;
        this.rejectedCount++;
        this.processingId = null;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du refus du compte';
        this.processingId = null;
        console.error('Error rejecting user:', error);
      }
    });
  }
}
