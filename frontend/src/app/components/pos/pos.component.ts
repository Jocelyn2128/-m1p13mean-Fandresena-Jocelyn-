import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stockQuantity: number;
  stockStatus: string;
  images?: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Payment {
  cashierId: string;
  amount: number;
}

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="h-screen flex flex-col bg-gray-100">
      <!-- Top Navigation -->
      <nav class="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
        <div class="flex items-center space-x-6">
          <h1 class="text-xl font-bold text-blue-600 flex items-center">
            <i class="fas fa-store mr-2"></i>
            {{ storeName }} - POS
          </h1>
          <div class="h-6 w-px bg-gray-200"></div>
          <div class="flex space-x-1">
            <button (click)="activeTab = 'sales'" [class.bg-blue-50]="activeTab === 'sales'" [class.text-blue-600]="activeTab === 'sales'" class="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <i class="fas fa-cash-register mr-2"></i>Vente
            </button>
            <button (click)="activeTab = 'orders'" [class.bg-blue-50]="activeTab === 'orders'" [class.text-blue-600]="activeTab === 'orders'" class="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <i class="fas fa-shopping-bag mr-2"></i>Commandes
              <span *ngIf="onlineOrders.length > 0" class="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {{ onlineOrders.length }}
              </span>
            </button>
            <button [routerLink]="['/pos', storeId, 'history']" class="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <i class="fas fa-history mr-2"></i>Historique
            </button>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <p class="text-xs text-gray-500">Caisse ouverte</p>
            <p class="text-sm font-medium">{{ availableCashiers.length }} disponible(s)</p>
          </div>
          <button routerLink="/boutique/my-stores" class="p-2 text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
      </nav>

      <div class="flex-1 flex overflow-hidden">
        <!-- Main Content (Products or Orders) -->
        <main class="flex-1 overflow-y-auto p-6">
          
          <!-- View: Sales -->
          <div *ngIf="activeTab === 'sales'">
            <div class="mb-6 flex justify-between items-center">
              <div class="relative w-96">
                <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (input)="filterProducts()"
                  placeholder="Rechercher un produit ou scanner code..."
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm transition-all"
                >
              </div>
              
              <div class="flex space-x-2">
                <button 
                  *ngFor="let cat of categories" 
                  (click)="selectedCategory = cat; filterProducts()"
                  [class.bg-blue-600]="selectedCategory === cat"
                  [class.text-white]="selectedCategory === cat"
                  class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                >
                  {{ cat }}
                </button>
              </div>
            </div>

            <!-- Products Grid -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <button
                *ngFor="let product of filteredProducts"
                (click)="addToCart(product)"
                [disabled]="product.stockStatus === 'rupture'"
                class="bg-white p-3 rounded-xl border border-gray-100 hover:shadow-md hover:border-blue-300 transition-all text-left flex flex-col items-center group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <!-- Image Produit -->
                <div class="w-full aspect-square bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden border border-gray-50">
                  <img 
                    *ngIf="product.images && product.images.length > 0"
                    [src]="getProductImageUrl(product.images[0])"
                    [alt]="product.name"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    (error)="onImgError($event)"
                  >
                  <i *ngIf="!product.images || product.images.length === 0" class="fas fa-image text-gray-400 text-3xl"></i>
                </div>
                <div class="w-full">
                  <p class="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">{{ product.name }}</p>
                  <div class="flex justify-between items-end mt-2">
                    <p class="text-lg font-bold text-blue-600">{{ product.price | number }} Ar</p>
                    <span [class]="product.stockStatus === 'rupture' ? 'text-red-500' : 'text-gray-500'" class="text-[10px]">
                      Stock: {{ product.stockQuantity }}
                    </span>
                  </div>
                </div>
              </button>
            </div>
            
            <div *ngIf="filteredProducts.length === 0" class="text-center py-20 text-gray-400">
              <i class="fas fa-box-open text-6xl mb-4 opacity-20"></i>
              <p>Aucun produit ne correspond à votre recherche</p>
            </div>
          </div>

          <!-- View: Online Orders -->
          <div *ngIf="activeTab === 'orders'">
            <div class="mb-6 flex justify-between items-center">
              <h2 class="text-2xl font-bold text-gray-800">Toutes les commandes</h2>
              <button (click)="loadOnlineOrders()" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <i class="fas fa-sync-alt mr-2"></i>Actualiser
              </button>
            </div>

            <div *ngIf="loadingOnlineOrders" class="text-center py-20">
              <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
            </div>

            <div *ngIf="!loadingOnlineOrders && onlineOrders.length === 0" class="text-center py-20 text-gray-400">
              <i class="fas fa-shopping-bag text-6xl mb-4 opacity-20"></i>
              <p>Aucune commande pour le moment</p>
            </div>

            <div *ngIf="!loadingOnlineOrders" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div *ngFor="let order of onlineOrders" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col h-full">
                <!-- Header part continues here from previous edit -->
                <div class="p-5 border-b border-gray-100 flex justify-between items-start bg-gray-50 flex-shrink-0">
                  <div>
                    <h3 class="font-bold text-gray-900 text-lg">#{{ order.receiptNumber || order._id.slice(-6) }}</h3>
                    <p class="text-sm text-gray-500">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
                  </div>
                  <span [class]="getOrderStatusClass(order.status)" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {{ (order.status || 'Inconnu') | uppercase }}
                  </span>
                </div>
                
                <div class="p-5 flex-grow flex flex-col justify-between">
                  <div class="space-y-3 mb-6 overflow-y-auto" style="min-height: 80px; max-height: 200px;">
                    <div *ngFor="let item of order.items" class="flex justify-between items-start text-sm border-b border-gray-50 pb-2">
                      <span class="text-gray-600 font-medium pr-2 line-clamp-2">{{ item.quantity }}x {{ item.name }}</span>
                      <span class="font-bold text-gray-900 whitespace-nowrap">{{ (item.subTotal || (item.quantity * item.unitPrice)) | number }} Ar</span>
                    </div>
                    <div *ngIf="!order.items || order.items.length === 0" class="text-center py-4 text-gray-400 italic text-xs">
                      Aucun article listé
                    </div>
                  </div>
                  
                  <div class="flex justify-between items-center pt-4 border-t border-gray-100 mb-6">
                    <span class="text-gray-500 font-medium uppercase tracking-widest text-[10px]">Total de la commande</span>
                    <span class="text-2xl font-black text-blue-600">{{ order.totalAmount | number }} Ar</span>
                  </div>
                  
                  <!-- Actions -->
                  <div class="flex gap-2">
                    <button 
                      *ngIf="canPayOrder(order)"
                      (click)="payExistingOrder(order)"
                      class="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                    >
                      <i class="fas fa-money-bill-wave"></i> PAYER {{ (order.paidAmount > 0) ? 'RESTE' : '' }}
                    </button>
                    
                    <button 
                      *ngIf="canMarkReady(order)"
                      (click)="updateOrderStatus(order._id, 'pret_pour_retrait')"
                      class="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      <i class="fas fa-check"></i> PRÊT
                    </button>
                    
                    <button 
                      *ngIf="canMarkDelivered(order)"
                      (click)="updateOrderStatus(order._id, 'retire')"
                      class="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                      <i class="fas fa-hand-holding-box"></i> RÉCUPÉRÉ
                    </button>

                    <button 
                      (click)="downloadTicket(order)"
                      class="px-4 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                      title="Imprimer le ticket"
                    >
                      <i class="fas fa-print"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- Sidebar: Cart and Summary -->
        <aside class="w-[420px] bg-white border-l border-gray-200 flex flex-col shadow-2xl">
          <div class="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-800">
              {{ isPayingExistingOrder ? 'Paiement Commande' : 'Panier Actuel' }}
            </h2>
            <button (click)="clearCart()" class="text-sm text-red-500 font-medium hover:text-red-700">
              {{ isPayingExistingOrder ? 'Annuler' : 'Vider' }}
            </button>
          </div>

          <!-- Banner mode paiement commande -->
          <div *ngIf="isPayingExistingOrder" class="bg-blue-600 text-white px-6 py-2 text-xs font-bold flex justify-between items-center">
            <span>MODE PAIEMENT : #{{ selectedExistingOrder?.receiptNumber }}</span>
            <i class="fas fa-info-circle"></i>
          </div>

          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            <div *ngFor="let item of cart" class="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl group relative">
              <div class="w-12 h-12 bg-white rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                <img 
                  *ngIf="item.product.images && item.product.images.length > 0"
                  [src]="getProductImageUrl(item.product.images[0])"
                  class="w-full h-full object-cover"
                >
                <i *ngIf="!item.product.images || item.product.images.length === 0" class="fas fa-image text-gray-300"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-gray-900 truncate text-sm">{{ item.product.name }}</p>
                <p class="text-blue-600 font-bold text-xs">{{ item.product.price | number }} Ar</p>
              </div>
              <div class="flex items-center space-x-2 bg-white p-1 rounded-lg border border-gray-100">
                <button (click)="removeFromCart(item)" class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-50 text-red-500">-</button>
                <span class="w-6 text-center font-bold text-sm">{{ item.quantity }}</span>
                <button (click)="addToCart(item.product)" class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-blue-50 text-blue-500">+</button>
              </div>
              <div class="text-right min-w-[70px]">
                <p class="font-bold text-gray-900 text-sm">{{ (item.product.price * item.quantity) | number }}</p>
              </div>
            </div>
            
            <div *ngIf="cart.length === 0" class="text-center py-20 text-gray-300">
              <i class="fas fa-shopping-cart text-5xl mb-4"></i>
              <p>Panier vide</p>
            </div>
          </div>

          <!-- Checkout Section -->
          <div class="p-6 bg-gray-50 border-t border-gray-200 space-y-6">
            <div class="space-y-3">
              <div class="flex justify-between text-gray-500">
                <span class="text-sm">Sous-total</span>
                <span class="font-medium">{{ total | number }} Ar</span>
              </div>
              <div class="flex justify-between items-center pt-2">
                <span class="text-lg font-bold text-gray-800">Total à payer</span>
                <span class="text-3xl font-black text-blue-600">{{ total | number }} Ar</span>
              </div>
            </div>

            <!-- Payment Methods Section -->
            <div *ngIf="cart.length > 0" class="space-y-4">
              <div class="flex justify-between items-center">
                <h3 class="font-bold text-gray-700 uppercase tracking-widest text-[10px]">Modes de Paiement</h3>
                <button (click)="addPayment()" class="text-blue-600 text-xs font-bold hover:underline">+ Ajouter</button>
              </div>

              <div *ngFor="let payment of payments; let i = index" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3 relative overflow-hidden">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-[10px] font-bold text-gray-400 uppercase">Paiement #{{ i + 1 }}</span>
                  <button (click)="removePayment(i)" class="text-red-300 hover:text-red-500">
                    <i class="fas fa-times-circle"></i>
                  </button>
                </div>
                <div class="flex gap-3">
                  <div class="flex-1">
                    <label class="text-[9px] text-gray-400 uppercase mb-1 block">Caisse</label>
                    <select [(ngModel)]="payment.cashierId" class="w-full text-xs font-bold outline-none border-b border-gray-100 pb-1 focus:border-blue-500 transition-colors">
                      <option value="">Sélectionner</option>
                      <option *ngFor="let cashier of availableCashiers" [value]="cashier._id">
                        {{ cashier.registerName }}
                      </option>
                    </select>
                  </div>
                  <div class="w-1/2">
                    <label class="text-[9px] text-gray-400 uppercase mb-1 block">Montant</label>
                    <input type="number" [(ngModel)]="payment.amount" class="w-full text-sm font-black outline-none border-b border-gray-100 pb-1 text-right focus:border-blue-500 transition-colors" placeholder="0">
                  </div>
                </div>
              </div>

              <!-- Payment Summary Alerts -->
              <div *ngIf="remainingAmount !== 0" class="p-3 rounded-xl text-xs font-medium" [class.bg-orange-50]="remainingAmount > 0" [class.text-orange-700]="remainingAmount > 0" [class.bg-red-50]="remainingAmount < 0" [class.text-red-700]="remainingAmount < 0">
                <i class="fas fa-info-circle mr-2"></i>
                <span *ngIf="remainingAmount > 0">Il reste {{ remainingAmount | number }} Ar à payer</span>
                <span *ngIf="remainingAmount < 0">Montant excédentaire de {{ -remainingAmount | number }} Ar</span>
              </div>
              
              <div *ngIf="remainingAmount === 0 && payments.length > 0" class="p-3 rounded-xl bg-green-50 text-green-700 text-xs font-bold flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                Montant exact configuré
              </div>
            </div>

            <div *ngIf="errorMessage" class="p-4 bg-red-50 rounded-xl border border-red-100">
              <p class="text-xs text-red-600 font-medium">{{ errorMessage }}</p>
            </div>

            <button
              (click)="checkout()"
              [disabled]="!isPaymentValid || cart.length === 0"
              class="w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-3"
            >
              <i class="fas fa-check-circle text-xl"></i>
              {{ isPayingExistingOrder ? 'CONFIRMER PAIEMENT' : 'VALIDER LA VENTE' }}
            </button>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class PosComponent implements OnInit {
  storeId: string = '';
  storeName: string = '';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = ['Tous', 'Alimentation', 'Mode', 'Electronique', 'Maison', 'Sport', 'Beaute'];
  selectedCategory: string = 'Tous';
  searchQuery: string = '';

  cart: CartItem[] = [];
  total: number = 0;

  activeTab: 'sales' | 'orders' = 'sales';
  onlineOrders: any[] = [];
  loadingOnlineOrders = false;

  availableCashiers: any[] = [];
  payments: Payment[] = [];

  errorMessage: string | null = null;

  isPayingExistingOrder = false;
  selectedExistingOrder: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storeId = params['id'];
      if (this.storeId) {
        this.loadStore();
        this.loadProducts();
        this.loadOnlineOrders();
        this.loadCashiers();
      }
    });

    // Initial payment method
    this.addPayment();
  }

  loadStore(): void {
    this.http.get(`${environment.apiUrl}/stores/${this.storeId}`).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.storeName = response.data.name;
        }
      }
    });
  }

  loadProducts(): void {
    this.http.get(`${environment.apiUrl}/products?storeId=${this.storeId}`).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.products = response.data;
          this.filterProducts();
        }
      }
    });
  }

  loadOnlineOrders(): void {
    this.loadingOnlineOrders = true;
    // On retire le filtre orderType=COMMANDE_LIGNE pour charger toutes les commandes
    this.http.get(`${environment.apiUrl}/orders?storeId=${this.storeId}`).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Normaliser les montants pour chaque commande
          this.onlineOrders = response.data.map((order: any) => {
            const paid = order.paidAmount !== undefined ? order.paidAmount : (order.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0);
            return {
              ...order,
              paidAmount: paid,
              remainingAmount: Math.max(0, (order.totalAmount || 0) - paid)
            };
          });
        }
        this.loadingOnlineOrders = false;
      },
      error: () => {
        this.loadingOnlineOrders = false;
      }
    });
  }

  loadCashiers(): void {
    this.http.get(`${environment.apiUrl}/cash-registers?storeId=${this.storeId}`).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Uniquement les caisses ouvertes
          this.availableCashiers = response.data.filter((c: any) => c.status === 'ouvert');
        }
      }
    });
  }

  filterProducts(): void {
    let filtered = this.products;

    if (this.selectedCategory !== 'Tous') {
      filtered = filtered.filter(p => p.category.toLowerCase() === this.selectedCategory.toLowerCase());
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    this.filteredProducts = filtered;
  }

  addToCart(product: Product): void {
    if (this.isPayingExistingOrder) {
      if (confirm('Vous êtes en train de payer une commande. Voulez-vous annuler pour démarrer une nouvelle vente directe ?')) {
        this.cancelExistingOrderPayment();
      } else {
        return;
      }
    }

    const existing = this.cart.find(item => item.product._id === product._id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
    this.calculateTotal();
  }

  removeFromCart(item: CartItem): void {
    if (this.isPayingExistingOrder) return; // Interdit de modifier une commande existante

    const index = this.cart.indexOf(item);
    if (index > -1) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity--;
      } else {
        this.cart.splice(index, 1);
      }
    }
    this.calculateTotal();
  }

  clearCart(): void {
    this.cart = [];
    this.total = 0;
    this.isPayingExistingOrder = false;
    this.selectedExistingOrder = null;
    this.payments = [{ cashierId: '', amount: 0 }];
    this.errorMessage = null;
  }

  calculateTotal(): void {
    this.total = this.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    // Auto-update first payment amount if total only 1 payment
    if (this.payments.length === 1) {
      this.payments[0].amount = this.total;
    }
  }

  getOrderStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'paye': return 'bg-green-500 text-white';
      case 'pret_pour_retrait': return 'bg-blue-500 text-white';
      case 'retire': return 'bg-gray-500 text-white';
      case 'annule':
      case 'avoir': return 'bg-red-500 text-white';
      case 'validee':
      case 'en_attente':
      case 'acompte': return 'bg-orange-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  }

  canPayOrder(order: any): boolean {
    const s = (order.status || '').toLowerCase();
    // On ne paye pas ce qui est déjà payé ou fini
    if (['paye', 'pret_pour_retrait', 'retire', 'annule', 'avoir'].includes(s)) return false;
    // Si c'est en attente, validé, ou acompte, et qu'il reste à payer
    return (order.paidAmount || 0) < order.totalAmount;
  }

  canMarkReady(order: any): boolean {
    const s = (order.status || '').toLowerCase();
    return s === 'paye';
  }

  canMarkDelivered(order: any): boolean {
    const s = (order.status || '').toLowerCase();
    return s === 'pret_pour_retrait';
  }

  updateOrderStatus(orderId: string, status: string): void {
    // Le backend utilise PUT pour le changement de statut
    this.http.put(`${environment.apiUrl}/orders/${orderId}/status`, { status }).subscribe({
      next: () => {
        alert('Statut mis à jour avec succès !');
        this.loadOnlineOrders();
      },
      error: (err) => {
        console.error('Erreur status update:', err);
        alert('Erreur lors de la mise à jour du statut');
      }
    });
  }

  // =============================================
  // LOGIQUE DE PAIEMENT COMMANDE EXISTANTE
  // =============================================

  payExistingOrder(order: any): void {
    this.isPayingExistingOrder = true;
    this.selectedExistingOrder = order;
    this.activeTab = 'sales'; // Switch to sales view to see side panel

    // Remplir le panier fictivement
    this.cart = order.items.map((item: any) => ({
      product: {
        _id: item.productId,
        name: item.name,
        price: item.unitPrice,
        category: '',
        stockQuantity: 0,
        stockStatus: 'disponible'
      },
      quantity: item.quantity
    }));

    const remaining = order.totalAmount - (order.paidAmount || 0);
    this.total = remaining;
    this.payments = [{ cashierId: '', amount: remaining }];
    this.errorMessage = null;
  }

  cancelExistingOrderPayment(): void {
    this.clearCart();
  }

  // =============================================
  // GESTION DES PAIEMENTS MULTIPLES
  // =============================================

  addPayment(): void {
    const amount = this.remainingAmount > 0 ? this.remainingAmount : 0;
    this.payments.push({ cashierId: '', amount });
  }

  removePayment(index: number): void {
    this.payments.splice(index, 1);
  }

  get totalPayments(): number {
    return this.payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  }

  get remainingAmount(): number {
    return this.total - this.totalPayments;
  }

  get isPaymentValid(): boolean {
    if (this.payments.length === 0) return false;

    for (const payment of this.payments) {
      if (!payment.cashierId || payment.cashierId === '' || payment.amount <= 0) {
        return false;
      }
    }

    const tolerance = 0.01;
    return Math.abs(this.remainingAmount) < tolerance;
  }

  checkout(): void {
    this.errorMessage = null;

    if (this.cart.length === 0) {
      this.errorMessage = 'Le panier est vide';
      return;
    }

    if (this.availableCashiers.length === 0) {
      this.errorMessage = 'Aucune caisse ouverte disponible';
      return;
    }

    if (!this.isPaymentValid) {
      this.errorMessage = 'Le paiement configuré est invalide ou incomplet';
      return;
    }

    if (this.isPayingExistingOrder) {
      // Paiement d'une commande existante (acompte, commande en ligne, etc.)
      const paymentData = {
        payments: this.payments.map(p => ({
          cashierId: p.cashierId,
          amount: Number(p.amount)
        }))
      };

      this.http.post(`${environment.apiUrl}/orders/${this.selectedExistingOrder._id}/pay`, paymentData).subscribe({
        next: () => {
          alert('Paiement enregistré avec succès !');
          this.downloadTicket(this.selectedExistingOrder);
          this.clearCart();
          this.loadOnlineOrders();
          this.loadCashiers();
        },
        error: (error: any) => {
          this.errorMessage = error.error?.message || 'Erreur lors du paiement de la commande';
          console.error('Pay order error:', error);
        }
      });
    } else {
      // Vente directe classique
      const orderData = {
        storeId: this.storeId,
        orderType: 'VENTE_DIRECTE',
        payments: this.payments.map(p => ({
          cashRegisterId: p.cashierId, // Utiliser cashRegisterId pour correspondre au backend
          amount: p.amount
        })),
        items: this.cart.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          unitPrice: item.product.price // Utiliser unitPrice pour le backend
        })),
        totalAmount: this.total
      };

      this.http.post(`${environment.apiUrl}/orders`, orderData).subscribe({
        next: () => {
          alert('Vente effectuée avec succès !');
          this.clearCart();
          this.loadProducts();
          this.loadOnlineOrders();
          this.loadCashiers();
        },
        error: (error: any) => {
          this.errorMessage = 'Erreur lors de la validation de la vente';
          console.error('Error creating order:', error);
        }
      });
    }
  }

  // =============================================
  // HELPERS IMAGES
  // =============================================

  getProductImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/uploads/${imagePath}`;
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  downloadTicket(order: any): void {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 102, 204);
    doc.text('MALLCONNECT', 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text('TICKET DE CAISSE', 105, 30, { align: 'center' });

    // Info
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Boutique: ${this.storeName}`, 20, 45);
    doc.text(`N° Facture: ${order.receiptNumber}`, 20, 50);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 55);
    doc.text(`Statut: ${order.status.toUpperCase()}`, 20, 60);

    // Table
    const tableData = order.items.map((item: any) => [
      item.name,
      item.quantity.toString(),
      `${item.unitPrice || item.price} Ar`,
      `${item.subTotal || (item.quantity * (item.unitPrice || item.price))} Ar`
    ]);

    autoTable(doc, {
      head: [['Article', 'Qté', 'Prix unitaire', 'Sous-total']],
      body: tableData,
      startY: 70,
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204] }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Summary
    doc.setFontSize(12);
    doc.text(`Montant Total: ${order.totalAmount} Ar`, 190, finalY, { align: 'right' });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Merci de votre visite !', 105, finalY + 30, { align: 'center' });

    doc.save(`ticket-${order.receiptNumber}.pdf`);
  }
}
