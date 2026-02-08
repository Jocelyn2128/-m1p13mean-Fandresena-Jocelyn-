import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Order {
  _id: string;
  receiptNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  customerName?: string;
}

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Historique des Ventes</h2>
        <div class="flex space-x-2">
          <button (click)="refreshData()" class="btn-secondary">
            <i class="fas fa-sync-alt mr-2"></i>
            Actualiser
          </button>
        </div>
      </div>
    </header>

    <div class="p-8">
      <!-- Filtres -->
      <div class="mall-card mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="form-label text-xs">Date début</label>
            <input type="date" [(ngModel)]="filters.startDate" (change)="applyFilters()" class="form-input text-sm">
          </div>
          <div>
            <label class="form-label text-xs">Date fin</label>
            <input type="date" [(ngModel)]="filters.endDate" (change)="applyFilters()" class="form-input text-sm">
          </div>
          <div>
            <label class="form-label text-xs">N° Commande</label>
            <input type="text" [(ngModel)]="filters.orderNumber" (input)="applyFilters()" placeholder="Rechercher..." class="form-input text-sm">
          </div>
          <div>
            <label class="form-label text-xs">Statut</label>
            <select [(ngModel)]="filters.status" (change)="applyFilters()" class="form-input text-sm">
              <option value="">Tous</option>
              <option value="completed">Complétée</option>
              <option value="pending">En attente</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Stats rapides -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="mall-card bg-blue-50">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <i class="fas fa-shopping-bag text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Total Ventes</p>
              <p class="text-2xl font-bold text-gray-800">{{ filteredOrders.length }}</p>
            </div>
          </div>
        </div>

        <div class="mall-card bg-green-50">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <i class="fas fa-money-bill-wave text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Chiffre d'affaires</p>
              <p class="text-2xl font-bold text-gray-800">{{ totalRevenue | number }} MGA</p>
            </div>
          </div>
        </div>

        <div class="mall-card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              <i class="fas fa-calculator text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Panier moyen</p>
              <p class="text-2xl font-bold text-gray-800">{{ averageOrder | number }} MGA</p>
            </div>
          </div>
        </div>

        <div class="mall-card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100 text-orange-600">
              <i class="fas fa-box text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Articles vendus</p>
              <p class="text-2xl font-bold text-gray-800">{{ totalItems }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-8">
        <i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
        <p class="mt-2 text-gray-500">Chargement...</p>
      </div>

      <!-- Tableau des ventes -->
      <div *ngIf="!loading" class="mall-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Commande</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Articles</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let order of filteredOrders" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="font-medium text-gray-900">{{ order.receiptNumber }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  <div *ngFor="let item of order.items" class="mb-1">
                    {{ item.quantity }}x {{ item.name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ order.totalAmount | number }} MGA
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusBadgeClass(order.status)">
                    {{ getStatusLabel(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button (click)="viewOrderDetails(order)" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button (click)="printReceipt(order)" class="text-gray-600 hover:text-gray-900">
                    <i class="fas fa-print"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="filteredOrders.length === 0" class="text-center py-8 text-gray-500">
          <i class="fas fa-inbox text-4xl mb-2"></i>
          <p>Aucune vente trouvée</p>
        </div>
      </div>
    </div>

    <!-- Modal détails commande -->
    <div *ngIf="selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold">Détails de la commande {{ selectedOrder.receiptNumber }}</h3>
          <button (click)="closeOrderDetails()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <p class="text-sm text-gray-500">Date: {{ selectedOrder.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
            <p class="text-sm text-gray-500">Statut: {{ getStatusLabel(selectedOrder.status) }}</p>
          </div>
          
          <div class="border-t pt-4 mb-4">
            <h4 class="font-medium mb-2">Articles</h4>
            <div *ngFor="let item of selectedOrder.items" class="flex justify-between py-2 border-b border-gray-100">
              <span>{{ item.quantity }}x {{ item.name }}</span>
              <span class="font-medium">{{ item.unitPrice * item.quantity | number }} MGA</span>
            </div>
          </div>
          
          <div class="border-t pt-4">
            <div class="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{{ selectedOrder.totalAmount | number }} MGA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class SalesHistoryComponent implements OnInit {
  storeId: string = '';
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = false;
  selectedOrder: Order | null = null;
  
  filters = {
    startDate: '',
    endDate: '',
    orderNumber: '',
    status: ''
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storeId = params['id'];
      if (this.storeId) {
        this.loadOrders();
      }
    });
  }

  loadOrders(): void {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/orders?storeId=${this.storeId}`).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.orders = response.data;
          this.applyFilters();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      // Filtrer par date (inclusif - toute la journée)
      let matchesDate = true;
      if (this.filters.startDate) {
        const startDate = new Date(this.filters.startDate);
        startDate.setHours(0, 0, 0, 0);
        matchesDate = matchesDate && new Date(order.createdAt) >= startDate;
      }
      if (this.filters.endDate) {
        const endDate = new Date(this.filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && new Date(order.createdAt) <= endDate;
      }
      
      const matchesOrderNumber = !this.filters.orderNumber || 
                                order.receiptNumber.toLowerCase().includes(this.filters.orderNumber.toLowerCase());
      const matchesStatus = !this.filters.status || order.status === this.filters.status;
      
      return matchesDate && matchesOrderNumber && matchesStatus;
    });
  }

  get totalRevenue(): number {
    return this.filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  }

  get averageOrder(): number {
    return this.filteredOrders.length > 0 ? this.totalRevenue / this.filteredOrders.length : 0;
  }

  get totalItems(): number {
    return this.filteredOrders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'badge badge-success';
      case 'pending':
        return 'badge badge-warning';
      case 'cancelled':
        return 'badge badge-danger';
      default:
        return 'badge';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed':
        return 'Complétée';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  printReceipt(order: Order): void {
    alert('Impression du reçu ' + order.receiptNumber);
  }

  refreshData(): void {
    this.loadOrders();
  }
}
