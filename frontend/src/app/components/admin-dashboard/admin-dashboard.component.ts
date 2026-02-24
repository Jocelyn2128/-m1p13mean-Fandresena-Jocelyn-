import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-4 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Tableau de bord Admin</h2>
          <p class="text-xs text-gray-400 mt-0.5">Vue d'ensemble de MallConnect</p>
        </div>
        <span class="text-sm text-gray-600" *ngIf="currentUser">
          {{ currentUser.firstName }} {{ currentUser.lastName }}
        </span>
      </div>
    </header>

    <div class="p-8 bg-gray-50 min-h-screen">
      <!-- Stats Cards with REAL data -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <!-- Boutiques -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <i class="fas fa-store text-blue-600 text-lg"></i>
            </div>
            <span class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">Actives</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ isLoading ? '…' : totalStores }}</p>
          <p class="text-sm text-gray-500 mt-1">Boutiques</p>
        </div>

        <!-- Revenus -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <i class="fas fa-chart-line text-green-600 text-lg"></i>
            </div>
            <span class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">Total</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ isLoading ? '…' : formatAmount(totalRevenue) }}</p>
          <p class="text-sm text-gray-500 mt-1">Revenus (Ar)</p>
        </div>

        <!-- Commandes -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <i class="fas fa-shopping-bag text-yellow-600 text-lg"></i>
            </div>
            <span class="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full font-medium">Ventes</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ isLoading ? '…' : totalOrders }}</p>
          <p class="text-sm text-gray-500 mt-1">Commandes</p>
        </div>

        <!-- Clients -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <i class="fas fa-users text-purple-600 text-lg"></i>
            </div>
            <span class="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full font-medium">Acheteurs</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ isLoading ? '…' : uniqueBuyers }}</p>
          <p class="text-sm text-gray-500 mt-1">Clients uniques</p>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <a routerLink="/admin/approvals"
           class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <i class="fas fa-check-circle text-orange-500 text-lg"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-800">Validations</p>
              <p class="text-sm text-gray-500">Boutiques en attente</p>
            </div>
          </div>
        </a>

        <a routerLink="/admin/statistics"
           class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <i class="fas fa-chart-bar text-blue-600 text-lg"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-800">Statistiques</p>
              <p class="text-sm text-gray-500">Graphiques & rapports</p>
            </div>
          </div>
        </a>

        <a routerLink="/admin/events"
           class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <i class="fas fa-calendar-alt text-purple-600 text-lg"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-800">Événements</p>
              <p class="text-sm text-gray-500">Gérer les événements</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = true;

  totalStores = 0;
  totalRevenue = 0;
  totalOrders = 0;
  uniqueBuyers = 0;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Load stats from our new endpoint
    this.http.get<any>(`${environment.apiUrl}/orders/stats`).subscribe({
      next: (res) => {
        if (res.success) {
          this.totalRevenue = res.data.kpi.totalRevenue;
          this.totalOrders = res.data.kpi.totalOrders;
          this.uniqueBuyers = res.data.kpi.uniqueBuyers;
        }
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });

    // Load total stores
    this.http.get<any>(`${environment.apiUrl}/stores`).subscribe({
      next: (res) => {
        this.totalStores = res.success ? (res.data?.length || res.count || 0) : 0;
      },
      error: () => { }
    });
  }

  formatAmount(val: number): string {
    if (!val) return '0';
    if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'M';
    if (val >= 1_000) return (val / 1_000).toFixed(0) + 'K';
    return val.toFixed(0);
  }
}
