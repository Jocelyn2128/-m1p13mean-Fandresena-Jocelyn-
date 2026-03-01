import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Product, Store } from '../../models';
import { StoreService } from '../../services/store.service';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../environments/environment';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CashRegister {
  _id: string;
  registerName: string;
  status: string;
  currentBalance: number;
}

interface PaymentMethod {
  cashierId: string;
  amount: number;
}

interface OnlineOrder {
  _id: string;
  receiptNumber: string;
  status: string;
  orderType: string;
  totalAmount: number;
  createdAt: string;
  buyerId?: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
    subTotal: number;
  }[];
}

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-4 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Point de Vente</h2>
          <p *ngIf="store" class="text-sm text-gray-500">{{ store.name }}</p>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">
            <i class="fas fa-cash-register mr-1"></i>
            {{ availableCashiers.length }} caisse(s) ouverte(s)
          </span>
        </div>
      </div>
    </header>

    <div class="p-8">
      <!-- Error Message -->
      <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700">{{ errorMessage }}</p>
      </div>

      <!-- Warning if no cashier available -->
      <div *ngIf="availableCashiers.length === 0" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-800">
          <i class="fas fa-exclamation-circle mr-2"></i>
          Aucune caisse ouverte. Veuillez ouvrir une caisse pour effectuer des ventes.
        </p>
        <button (click)="goToCashiers()" class="mt-3 btn-primary text-sm">
          <i class="fas fa-cash-register mr-1"></i>
          Gérer les caisses
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Products Section -->
        <div class="lg:col-span-2">
          <!-- Search -->
          <div class="mall-card mb-6">
            <div class="flex space-x-4">
              <input 
                type="text" 
                [(ngModel)]="searchQuery"
                (input)="filterProducts()"
                placeholder="Rechercher un produit..."
                class="form-input flex-1"
              >
              <button class="btn-primary" (click)="clearSearch()">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div *ngIf="loading" class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
            <p class="mt-2 text-gray-500">Chargement des produits...</p>
          </div>

          <!-- Products Grid -->
          <div *ngIf="!loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div 
              *ngFor="let product of filteredProducts" 
              class="mall-card p-4 cursor-pointer hover:shadow-md transition-shadow"
              [class.opacity-50]="product.stockQuantity === 0"
              (click)="addToCart(product)"
            >
              <div class="h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <i class="fas fa-image text-gray-400 text-3xl"></i>
              </div>
              <h4 class="font-medium text-sm">{{ product.name }}</h4>
              <p class="text-blue-600 font-bold">{{ product.price | number }} MGA</p>
              <p class="text-xs" [class.text-red-500]="product.stockQuantity === 0" [class.text-gray-500]="(product.stockQuantity || 0) > 0">
                Stock: {{ product.stockQuantity }}
              </p>
            </div>
          </div>
        </div>

        <!-- Cart Section -->
        <div>
          <div class="mall-card">
            <h3 class="text-lg font-semibold mb-4">
              <i class="fas fa-shopping-cart mr-2"></i>
              Panier
            </h3>
            
            <div class="space-y-3 mb-4 max-h-96 overflow-y-auto">
              <div *ngIf="cart.length === 0" class="text-center py-8 text-gray-500">
                <i class="fas fa-shopping-basket text-4xl mb-2"></i>
                <p>Panier vide</p>
              </div>

              <div *ngFor="let item of cart" class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div class="flex-1">
                  <p class="font-medium text-sm">{{ item.product.name }}</p>
                  <p class="text-xs text-gray-500">{{ item.product.price | number }} MGA x {{ item.quantity }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <button (click)="decreaseQuantity(item)" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
                    <i class="fas fa-minus text-xs"></i>
                  </button>
                  <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                  <button (click)="increaseQuantity(item)" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
                    <i class="fas fa-plus text-xs"></i>
                  </button>
                  <button (click)="removeFromCart(item)" class="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center ml-2">
                    <i class="fas fa-trash text-xs"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="border-t pt-4">
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Sous-total</span>
                <span class="font-medium">{{ subtotal | number }} MGA</span>
              </div>
              <div class="flex justify-between mb-4 text-lg font-bold">
                <span>Total</span>
                <span>{{ total | number }} MGA</span>
              </div>

              <!-- Multiple Payment Methods -->
              <div *ngIf="cart.length > 0" class="mb-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Modes de paiement</h4>
                <div *ngFor="let payment of payments; let i = index" class="flex items-center space-x-3 mb-3">
                  <select [(ngModel)]="payment.cashierId" class="form-input text-base py-3 flex-1 min-w-[200px]">
                    <option value="">Sélectionner une caisse</option>
                    <option *ngFor="let cashier of availableCashiers" [value]="cashier._id">
                      {{ cashier.registerName }}
                    </option>
                  </select>
                  <input 
                    type="number" 
                    [(ngModel)]="payment.amount" 
                    class="form-input text-base py-3 w-32" 
                    placeholder="Montant"
                  >
                  <button (click)="removePayment(i)" class="text-red-600 hover:text-red-800 p-2">
                    <i class="fas fa-trash text-lg"></i>
                  </button>
                </div>
                <button (click)="addPayment()" class="text-sm text-blue-600 hover:text-blue-800 mt-2">
                  <i class="fas fa-plus mr-1"></i>
                  Ajouter un mode de paiement
                </button>
                <div *ngIf="remainingAmount > 0" class="text-sm text-orange-600 mt-2">
                  Reste à payer: {{ remainingAmount | number }} MGA
                </div>
                <div *ngIf="remainingAmount < 0" class="text-sm text-red-600 mt-2">
                  Montant excédentaire: {{ -remainingAmount | number }} MGA
                </div>
                <div *ngIf="remainingAmount === 0 && payments.length > 0" class="text-sm text-green-600 mt-2">
                  <i class="fas fa-check-circle mr-1"></i>
                  Montant complet
                </div>
              </div>
              
              <button 
                (click)="checkout()"
                class="w-full btn-success mb-2" 
                [disabled]="cart.length === 0 || !isPaymentValid || availableCashiers.length === 0"
                [class.opacity-50]="cart.length === 0 || !isPaymentValid || availableCashiers.length === 0"
                [class.cursor-not-allowed]="cart.length === 0 || !isPaymentValid || availableCashiers.length === 0"
              >
                <i class="fas fa-check mr-2"></i>
                Valider la vente
              </button>
              <button 
                (click)="clearCart()"
                class="w-full btn-secondary"
                [disabled]="cart.length === 0"
              >
                <i class="fas fa-trash mr-2"></i>
                Vider le panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Online Orders Section -->
    <div class="p-8 pt-0">
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">
            <i class="fas fa-shopping-bag mr-2 text-blue-600"></i>
            Commandes en ligne à préparer
          </h3>
          <button (click)="loadOnlineOrders()" class="text-sm text-blue-600 hover:text-blue-800">
            <i class="fas fa-sync-alt mr-1"></i>Actualiser
          </button>
        </div>

        <div *ngIf="loadingOnlineOrders" class="text-center py-4">
          <i class="fas fa-spinner fa-spin text-blue-500"></i>
        </div>

        <div *ngIf="!loadingOnlineOrders && onlineOrders.length === 0" class="bg-gray-50 rounded-lg p-6 text-center">
          <i class="fas fa-check-circle text-4xl text-green-500 mb-2"></i>
          <p class="text-gray-500">Aucune commande en attente</p>
        </div>

        <div *ngIf="!loadingOnlineOrders && onlineOrders.length > 0" class="space-y-3">
          <div *ngFor="let order of onlineOrders" class="mall-card p-4">
            <div class="flex justify-between items-start mb-3">
              <div>
                <span class="font-mono font-bold text-sm">{{ order.receiptNumber }}</span>
                <span class="ml-2 text-xs" [class]="order.status === 'paye' ? 'bg-yellow-100 text-yellow-800' : order.status === 'pret_pour_retrait' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
                  {{ order.status === 'paye' ? 'À préparer' : order.status === 'pret_pour_retrait' ? 'Prête' : order.status }}
                </span>
                <p class="text-xs text-gray-500 mt-1">
                  {{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}
                  <span *ngIf="order.buyerId"> • {{ order.buyerId.firstName }} {{ order.buyerId.lastName }}</span>
                  <span *ngIf="order.buyerId?.phone"> ({{ order.buyerId?.phone }})</span>
                </p>
              </div>
              <span class="font-bold text-lg">{{ order.totalAmount | number }} MGA</span>
            </div>
            
            <div class="border-t pt-2 mb-3">
              <div *ngFor="let item of order.items" class="flex justify-between text-sm py-1">
                <span>{{ item.name }} x{{ item.quantity }}</span>
                <span class="text-gray-600">{{ item.subTotal | number }} MGA</span>
              </div>
            </div>

            <div class="flex space-x-2">
              <button 
                *ngIf="order.status === 'paye'"
                (click)="updateOrderStatus(order._id, 'pret_pour_retrait')"
                class="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                <i class="fas fa-check mr-1"></i>Marquer comme prête
              </button>
              <button 
                *ngIf="order.status === 'pret_pour_retrait'"
                (click)="updateOrderStatus(order._id, 'retire')"
                class="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700"
              >
                <i class="fas fa-hand-holding mr-1"></i>Remise client
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class PosComponent implements OnInit {
  store: Store | null = null;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  cashiers: CashRegister[] = [];
  cart: CartItem[] = [];
  payments: PaymentMethod[] = [];
  storeId: string = '';
  loading = false;
  errorMessage: string | null = null;
  searchQuery = '';
  onlineOrders: OnlineOrder[] = [];
  loadingOnlineOrders = false;

  constructor(
    private http: HttpClient,
    private storeService: StoreService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storeId = params['id'];
      if (this.storeId) {
        this.loadStore();
        this.loadProducts();
        this.loadCashiers();
        this.loadOnlineOrders();
      }
    });
  }

  loadOnlineOrders(): void {
    this.loadingOnlineOrders = true;
    this.http.get(`${environment.apiUrl}/orders?storeId=${this.storeId}&orderType=COMMANDE_LIGNE`).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.onlineOrders = response.data;
        }
        this.loadingOnlineOrders = false;
      },
      error: (error) => {
        console.error('Error loading online orders:', error);
        this.loadingOnlineOrders = false;
      }
    });
  }

  updateOrderStatus(orderId: string, newStatus: string): void {
    this.http.put(`${environment.apiUrl}/orders/${orderId}/status`, { status: newStatus }).subscribe({
      next: (response: any) => {
        if (response.success) {
          const order = this.onlineOrders.find(o => o._id === orderId);
          if (order) {
            order.status = newStatus;
          }
        }
      },
      error: (error) => {
        console.error('Error updating order status:', error);
      }
    });
  }

  goToCashiers(): void {
    this.router.navigate(['/boutique/store', this.storeId, 'cashiers']);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filterProducts();
  }

  loadStore(): void {
    this.storeService.getStore(this.storeId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.store = response.data;
        }
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts({ storeId: this.storeId }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.products = response.data.filter((p: Product) => p.stockStatus === 'disponible');
          this.filteredProducts = this.products;
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Erreur lors du chargement des produits';
        this.loading = false;
        console.error('Error loading products:', error);
      }
    });
  }

  loadCashiers(): void {
    this.http.get(`${environment.apiUrl}/cash-registers?storeId=${this.storeId}`).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.cashiers = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading cashiers:', error);
      }
    });
  }

  get availableCashiers(): CashRegister[] {
    return this.cashiers.filter(c => c.status === 'ouvert');
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchQuery || 
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesSearch;
    });
  }

  addToCart(product: Product): void {
    const stockQty = product.stockQuantity || 0;
    if (stockQty === 0) {
      this.errorMessage = 'Produit en rupture de stock';
      setTimeout(() => this.errorMessage = null, 3000);
      return;
    }

    const existingItem = this.cart.find(item => item.product._id === product._id);
    if (existingItem) {
      if (existingItem.quantity < stockQty) {
        existingItem.quantity++;
      } else {
        this.errorMessage = 'Stock insuffisant';
        setTimeout(() => this.errorMessage = null, 3000);
      }
    } else {
      this.cart.push({ product, quantity: 1 });
    }
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity < (item.product.stockQuantity || 0)) {
      item.quantity++;
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  removeFromCart(item: CartItem): void {
    const index = this.cart.indexOf(item);
    if (index > -1) {
      this.cart.splice(index, 1);
    }
  }

  clearCart(): void {
    this.cart = [];
    this.payments = [];
  }

  get subtotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  get total(): number {
    return this.subtotal;
  }

  addPayment(): void {
    if (this.availableCashiers.length === 0) {
      this.errorMessage = 'Aucune caisse ouverte disponible';
      setTimeout(() => this.errorMessage = null, 3000);
      return;
    }
    
    // Pré-remplir avec le montant restant
    const remaining = Math.max(0, this.remainingAmount);
    this.payments.push({ 
      cashierId: '', 
      amount: remaining > 0 ? remaining : 0 
    });
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
    
    // Vérifier que chaque paiement a une caisse sélectionnée et un montant valide
    for (const payment of this.payments) {
      if (!payment.cashierId || payment.cashierId === '' || payment.amount <= 0) {
        return false;
      }
    }
    
    // Vérifier que le montant total correspond exactement (tolérance de 0.01)
    const tolerance = 0.01;
    return Math.abs(this.remainingAmount) < tolerance;
  }

  checkout(): void {
    // Clear previous error
    this.errorMessage = null;
    
    // Vérification stricte avant validation
    if (this.cart.length === 0) {
      this.errorMessage = 'Le panier est vide';
      return;
    }

    if (this.availableCashiers.length === 0) {
      this.errorMessage = 'Aucune caisse ouverte disponible';
      return;
    }

    if (this.payments.length === 0) {
      this.errorMessage = 'Veuillez ajouter au moins un mode de paiement';
      return;
    }

    // Check for payments without cashier selected
    const paymentsWithoutCashier = this.payments.filter(p => !p.cashierId || p.cashierId === '');
    if (paymentsWithoutCashier.length > 0) {
      this.errorMessage = `Veuillez sélectionner une caisse pour tous les paiements (${paymentsWithoutCashier.length} paiement(s) sans caisse)`;
      return;
    }

    // Check for payments with invalid amount
    const paymentsWithInvalidAmount = this.payments.filter(p => !p.amount || p.amount <= 0);
    if (paymentsWithInvalidAmount.length > 0) {
      this.errorMessage = `Le montant doit être supérieur à 0 pour tous les paiements`;
      return;
    }

    // Check for partial payment - must pay exact amount
    const tolerance = 0.01;
    if (Math.abs(this.remainingAmount) > tolerance) {
      if (this.remainingAmount > 0) {
        this.errorMessage = `Paiement incomplet. Il manque ${this.remainingAmount} MGA pour atteindre le total de ${this.total} MGA. Les ventes directes nécessitent un paiement complet.`;
      } else {
        this.errorMessage = `Montant excédentaire de ${Math.abs(this.remainingAmount)} MGA. Le montant exact est requis.`;
      }
      return;
    }

    const orderData = {
      storeId: this.storeId,
      orderType: 'VENTE_DIRECTE',
      payments: this.payments.map(p => ({
        cashierId: p.cashierId,
        amount: p.amount
      })),
      items: this.cart.map(item => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalAmount: this.total
    };

    this.http.post(`${environment.apiUrl}/orders`, orderData).subscribe({
      next: () => {
        alert('Vente effectuée avec succès !');
        this.clearCart();
        this.loadProducts();
        this.loadCashiers();
      },
      error: (error: any) => {
        this.errorMessage = 'Erreur lors de la validation de la vente';
        console.error('Error creating order:', error);
      }
    });
  }
}
