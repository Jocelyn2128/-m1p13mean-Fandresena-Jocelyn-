import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-order-history',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <a routerLink="/catalog" class="p-2 hover:bg-gray-100 rounded-full">
              <i class="fas fa-arrow-left text-gray-600"></i>
            </a>
            <h1 class="text-xl font-bold text-gray-900">Mes commandes</h1>
          </div>
          <a routerLink="/wallet" class="flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
            <i class="fas fa-ticket-alt"></i>
            <span>Mon portefeuille</span>
          </a>
        </div>
      </header>

      <div class="max-w-5xl mx-auto px-4 py-8">
        <!-- Filters -->
        <div class="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3">
          <button *ngFor="let f of statusFilters"
            (click)="filterByStatus(f.value)"
            class="px-4 py-2 rounded-full text-sm font-medium border transition-all"
            [class.bg-blue-600]="selectedStatus === f.value"
            [class.text-white]="selectedStatus === f.value"
            [class.border-blue-600]="selectedStatus === f.value"
            [class.text-gray-600]="selectedStatus !== f.value"
            [class.border-gray-200]="selectedStatus !== f.value"
            [class.hover:bg-gray-50]="selectedStatus !== f.value"
          >
            {{ f.label }}
          </button>
        </div>

        <!-- Loading -->
        <div *ngIf="isLoading" class="text-center py-12">
          <i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
          <p class="mt-3 text-gray-500">Chargement des commandes...</p>
        </div>

        <!-- Not logged in -->
        <div *ngIf="!currentUser && !isLoading" class="bg-white rounded-xl shadow-sm p-12 text-center">
          <i class="fas fa-lock text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-700 font-medium mb-4">Connexion requise</p>
          <a routerLink="/login" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Se connecter
          </a>
        </div>

        <!-- empty state -->
        <div *ngIf="!isLoading && currentUser && orders.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center">
          <i class="fas fa-shopping-bag text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 mb-4">Aucune commande trouvée</p>
          <a routerLink="/catalog" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm">
            Commencer mes achats
          </a>
        </div>

        <!-- Orders List -->
        <div *ngIf="!isLoading && orders.length > 0" class="space-y-4">
          <div
            *ngFor="let order of orders"
            class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <!-- Order Header -->
            <div class="p-4 border-b border-gray-50 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="font-mono text-sm font-bold text-gray-800">{{ order.receiptNumber }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ order.createdAt | date:'dd MMMM yyyy à HH:mm' }}</p>
              </div>
              <div class="flex items-center space-x-3">
                <span class="px-3 py-1 rounded-full text-xs font-medium"
                  [class.bg-green-100]="order.status === 'paye' || order.status === 'retire'"
                  [class.text-green-700]="order.status === 'paye' || order.status === 'retire'"
                  [class.bg-yellow-100]="order.status === 'en_attente' || order.status === 'acompte'"
                  [class.text-yellow-700]="order.status === 'en_attente' || order.status === 'acompte'"
                  [class.bg-blue-100]="order.status === 'pret_pour_retrait'"
                  [class.text-blue-700]="order.status === 'pret_pour_retrait'"
                  [class.bg-red-100]="order.status === 'annule'"
                  [class.text-red-700]="order.status === 'annule'"
                  [class.bg-purple-100]="order.status === 'avoir'"
                  [class.text-purple-700]="order.status === 'avoir'"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
                <span class="font-bold text-blue-600">{{ order.totalAmount | number }} Ar</span>
              </div>
            </div>

            <!-- Items Preview -->
            <div class="px-4 py-3">
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let item of order.items.slice(0, 3)" class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {{ item.name }} x{{ item.quantity }}
                </span>
                <span *ngIf="order.items.length > 3" class="text-xs text-gray-500">
                  +{{ order.items.length - 3 }} autre(s)
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="px-4 pb-4 flex space-x-2">
              <a [routerLink]="['/order-tracking', order.receiptNumber]"
                 class="flex-1 text-center py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <i class="fas fa-map-marker-alt mr-1"></i>Suivre
              </a>
              <button
                *ngIf="order.status === 'en_attente'"
                (click)="cancelOrder(order)"
                class="px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50"
              >
                <i class="fas fa-times mr-1"></i>Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrderHistoryComponent implements OnInit {
    orders: any[] = [];
    isLoading = false;
    selectedStatus = '';
    currentUser: any = null;

    statusFilters = [
        { value: '', label: 'Toutes' },
        { value: 'en_attente', label: 'En attente' },
        { value: 'paye', label: 'Payées' },
        { value: 'pret_pour_retrait', label: 'Prêtes' },
        { value: 'retire', label: 'Retirées' },
        { value: 'annule', label: 'Annulées' }
    ];

    constructor(
        private orderService: OrderService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.currentUser = this.authService.getCurrentUser();
        if (this.currentUser) {
            this.loadOrders();
        }
    }

    loadOrders(): void {
        const buyerId = this.currentUser?.id || this.currentUser?._id;
        if (!buyerId) return;

        this.isLoading = true;
        const filters = this.selectedStatus ? { status: this.selectedStatus } : undefined;

        this.orderService.getMyOrders(buyerId, filters).subscribe({
            next: (res: any) => {
                this.orders = res.success ? (res.data || []) : [];
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    filterByStatus(status: string): void {
        this.selectedStatus = status;
        this.loadOrders();
    }

    cancelOrder(order: any): void {
        if (!confirm(`Annuler la commande ${order.receiptNumber} ?`)) return;
        this.orderService.cancelOrder(order._id, 'Annulation par le client').subscribe({
            next: () => this.loadOrders(),
            error: (err: any) => alert(err.error?.message || 'Erreur lors de l\'annulation')
        });
    }

    getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            en_attente: 'En attente', paye: 'Payée', acompte: 'Acompte',
            annule: 'Annulée', pret_pour_retrait: 'Prête', retire: 'Retirée', avoir: 'Avoir'
        };
        return labels[status] || status;
    }
}
