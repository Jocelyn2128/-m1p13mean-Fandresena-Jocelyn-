import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface ReportData {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  totalItems: number;
  salesByProduct: Array<{ name: string; quantity: number; revenue: number }>;
  salesByDate: Array<{ date: string; sales: number; orders: number }>;
  salesByPaymentMethod: Array<{ method: string; amount: number }>;
}

@Component({
  selector: 'app-sales-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Rapports de Vente</h2>
        <div class="flex space-x-2">
          <button (click)="exportReport()" class="btn-secondary">
            <i class="fas fa-download mr-2"></i>
            Exporter
          </button>
        </div>
      </div>
    </header>

    <div class="p-8">
      <!-- Filtres multicritères -->
      <div class="mall-card mb-6">
        <h3 class="text-lg font-medium mb-4">Filtres</h3>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label class="form-label text-xs">Date début</label>
            <input type="date" [(ngModel)]="filters.startDate" class="form-input text-sm">
          </div>
          <div>
            <label class="form-label text-xs">Date fin</label>
            <input type="date" [(ngModel)]="filters.endDate" class="form-input text-sm">
          </div>
          <div>
            <label class="form-label text-xs">Produit</label>
            <input type="text" [(ngModel)]="filters.product" placeholder="Nom du produit" class="form-input text-sm">
          </div>
          <div>
            <label class="form-label text-xs">Montant min (MGA)</label>
            <input type="number" [(ngModel)]="filters.minAmount" placeholder="0" class="form-input text-sm">
          </div>
          <div>
            <label class="form-label text-xs">Montant max (MGA)</label>
            <input type="number" [(ngModel)]="filters.maxAmount" placeholder="Max" class="form-input text-sm">
          </div>
        </div>
        <div class="mt-4 flex justify-end space-x-2">
          <button (click)="resetFilters()" class="btn-secondary">
            <i class="fas fa-undo mr-2"></i>
            Réinitialiser
          </button>
          <button (click)="generateReport()" class="btn-primary">
            <i class="fas fa-search mr-2"></i>
            Générer le rapport
          </button>
        </div>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="mall-card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm">Chiffre d'affaires</p>
                <p class="text-3xl font-bold mt-1">{{ reportData?.totalSales || 0 | number }} MGA</p>
              </div>
              <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <i class="fas fa-money-bill-wave text-2xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="mall-card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm">Nombre de commandes</p>
                <p class="text-3xl font-bold mt-1">{{ reportData?.totalOrders || 0 }}</p>
              </div>
              <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <i class="fas fa-shopping-cart text-2xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="mall-card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm">Panier moyen</p>
                <p class="text-3xl font-bold mt-1">{{ reportData?.averageOrderValue || 0 | number }} MGA</p>
              </div>
              <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <i class="fas fa-calculator text-2xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="mall-card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-100 text-sm">Articles vendus</p>
                <p class="text-3xl font-bold mt-1">{{ reportData?.totalItems || 0 }}</p>
              </div>
              <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <i class="fas fa-box text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Détails du rapport -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" *ngIf="reportData">
        <!-- Ventes par produit -->
        <div class="mall-card">
          <h3 class="text-lg font-semibold mb-4">Ventes par produit</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2 text-sm font-medium text-gray-500">Produit</th>
                  <th class="text-right py-2 text-sm font-medium text-gray-500">Qté</th>
                  <th class="text-right py-2 text-sm font-medium text-gray-500">CA</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let product of reportData.salesByProduct" class="border-b border-gray-100">
                  <td class="py-3">{{ product.name }}</td>
                  <td class="py-3 text-right">{{ product.quantity }}</td>
                  <td class="py-3 text-right font-medium">{{ product.revenue | number }} MGA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Ventes par date -->
        <div class="mall-card">
          <h3 class="text-lg font-semibold mb-4">Ventes par date</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2 text-sm font-medium text-gray-500">Date</th>
                  <th class="text-right py-2 text-sm font-medium text-gray-500">Ventes</th>
                  <th class="text-right py-2 text-sm font-medium text-gray-500">CA</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let day of reportData.salesByDate" class="border-b border-gray-100">
                  <td class="py-3">{{ day.date | date:'dd/MM/yyyy' }}</td>
                  <td class="py-3 text-right">{{ day.orders }}</td>
                  <td class="py-3 text-right font-medium">{{ day.sales | number }} MGA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Ventes par mode de paiement -->
        <div class="mall-card lg:col-span-2">
          <h3 class="text-lg font-semibold mb-4">Ventes par mode de paiement</h3>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div *ngFor="let method of reportData.salesByPaymentMethod" class="bg-gray-50 rounded-lg p-4 text-center">
              <i class="fas fa-credit-card text-2xl text-blue-500 mb-2"></i>
              <p class="text-sm text-gray-600">{{ method.method }}</p>
              <p class="text-lg font-bold text-gray-900">{{ method.amount | number }} MGA</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Message si aucune donnée -->
      <div *ngIf="!reportData && !loading" class="text-center py-12">
        <i class="fas fa-chart-bar text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">Sélectionnez des critères et générez un rapport</p>
      </div>
    </div>
  `,
  styles: [``]
})
export class SalesReportsComponent implements OnInit {
  storeId: string = '';
  loading = false;
  reportData: ReportData | null = null;
  
  filters = {
    startDate: '',
    endDate: '',
    product: '',
    minAmount: null as number | null,
    maxAmount: null as number | null
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storeId = params['id'];
      if (this.storeId) {
        // Set default dates (last 30 days)
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        
        this.filters.endDate = end.toISOString().split('T')[0];
        this.filters.startDate = start.toISOString().split('T')[0];
        
        this.generateReport();
      }
    });
  }

  generateReport(): void {
    this.loading = true;
    
    // Récupérer les vraies données depuis l'API
    this.http.get(`${environment.apiUrl}/orders?storeId=${this.storeId}`).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Filtrer les commandes selon les critères
          let orders = response.data;
          
          // Filtrer par date (inclusif - toute la journée)
          if (this.filters.startDate) {
            const startDate = new Date(this.filters.startDate!);
            startDate.setHours(0, 0, 0, 0);
            orders = orders.filter((o: any) => new Date(o.createdAt) >= startDate);
          }
          if (this.filters.endDate) {
            const endDate = new Date(this.filters.endDate!);
            endDate.setHours(23, 59, 59, 999);
            orders = orders.filter((o: any) => new Date(o.createdAt) <= endDate);
          }
          
          // Filtrer par produit
          if (this.filters.product) {
            orders = orders.filter((o: any) => 
              o.items.some((i: any) => i.name?.toLowerCase().includes(this.filters.product!.toLowerCase()))
            );
          }
          
          // Filtrer par montant
          if (this.filters.minAmount) {
            orders = orders.filter((o: any) => o.totalAmount >= this.filters.minAmount!);
          }
          if (this.filters.maxAmount) {
            orders = orders.filter((o: any) => o.totalAmount <= this.filters.maxAmount!);
          }
          
          this.reportData = this.calculateReportData(orders);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading report data:', error);
        this.loading = false;
      }
    });
  }

  calculateReportData(orders: any[]): ReportData {
    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    // Calculer les articles vendus
    const productMap = new Map<string, { quantity: number; revenue: number }>();
    const dateMap = new Map<string, { sales: number; orders: number }>();
    const paymentMap = new Map<string, number>();
    let totalItems = 0;
    
    orders.forEach(order => {
      // Par produit
      order.items.forEach((item: any) => {
        totalItems += item.quantity;
        const productName = item.name || 'Produit inconnu';
        const existing = productMap.get(productName) || { quantity: 0, revenue: 0 };
        productMap.set(productName, {
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + (item.unitPrice * item.quantity)
        });
      });
      
      // Par date
      const date = order.createdAt?.split('T')[0] || 'Date inconnue';
      const existingDate = dateMap.get(date) || { sales: 0, orders: 0 };
      dateMap.set(date, {
        sales: existingDate.sales + order.totalAmount,
        orders: existingDate.orders + 1
      });
      
      // Par mode de paiement - utiliser les payments s'ils existent
      if (order.payments && order.payments.length > 0) {
        order.payments.forEach((payment: any) => {
          const cashRegisterName = payment.cashRegisterName || 'Caisse';
          const existingPayment = paymentMap.get(cashRegisterName) || 0;
          paymentMap.set(cashRegisterName, existingPayment + payment.amount);
        });
      } else {
        // Fallback sur paymentMethod si pas de payments
        const paymentMethod = order.paymentMethod || 'Non spécifié';
        const existingPayment = paymentMap.get(paymentMethod) || 0;
        paymentMap.set(paymentMethod, existingPayment + order.totalAmount);
      }
    });
    
    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      totalItems,
      salesByProduct: Array.from(productMap.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue),
      salesByDate: Array.from(dateMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      salesByPaymentMethod: Array.from(paymentMap.entries())
        .map(([method, amount]) => ({ method, amount }))
        .sort((a, b) => b.amount - a.amount)
    };
  }

  resetFilters(): void {
    this.filters = {
      startDate: '',
      endDate: '',
      product: '',
      minAmount: null,
      maxAmount: null
    };
    this.reportData = null;
  }

  exportReport(): void {
    alert('Export du rapport en cours...');
  }
}
