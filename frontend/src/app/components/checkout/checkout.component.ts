import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-5xl mx-auto px-4 py-4 flex items-center space-x-4">
          <button (click)="goBack()" class="p-2 hover:bg-gray-100 rounded-full">
            <i class="fas fa-arrow-left text-gray-600"></i>
          </button>
          <h1 class="text-xl font-bold text-gray-900">Passer la commande</h1>
        </div>
      </header>

      <!-- Steps indicator -->
      <div class="max-w-5xl mx-auto px-4 pt-6">
        <div class="flex items-center justify-center space-x-4 mb-8">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              <i class="fas fa-check text-xs"></i>
            </div>
            <span class="text-sm font-medium text-gray-700">Panier</span>
          </div>
          <div class="w-12 h-0.5 bg-blue-400"></div>
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <span class="text-sm font-medium text-blue-600">Commande</span>
          </div>
          <div class="w-12 h-0.5 bg-gray-200"></div>
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <span class="text-sm text-gray-500">Confirmation</span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left: Details form -->
          <div class="lg:col-span-2 space-y-6">

            <!-- Buyer Information -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4">
                <i class="fas fa-user-circle mr-2 text-blue-500"></i>Informations
              </h2>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="font-medium text-gray-900">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>
                <p class="text-sm text-gray-500">{{ currentUser?.email }}</p>
                <p *ngIf="currentUser?.phone" class="text-sm text-gray-500">{{ currentUser?.phone }}</p>
              </div>
            </div>

            <!-- Delivery Note -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4">
                <i class="fas fa-store mr-2 text-blue-500"></i>Mode de retrait
              </h2>
              <div class="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p class="text-sm text-blue-800 font-medium">
                  <i class="fas fa-info-circle mr-2"></i>Retrait en boutique
                </p>
                <p class="text-sm text-blue-700 mt-1">
                  Votre commande sera prête à être retirée en boutique une fois confirmée et marquée "Prête".
                </p>
              </div>
              <textarea
                [(ngModel)]="notes"
                placeholder="Instructions particulières, horaires préférés..."
                rows="3"
                class="mt-4 w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <!-- Payment Method -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4">
                <i class="fas fa-credit-card mr-2 text-blue-500"></i>Mode de paiement
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  *ngFor="let method of paymentMethods"
                  class="flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                  [class.border-blue-500]="selectedPaymentMethod === method.value"
                  [class.bg-blue-50]="selectedPaymentMethod === method.value"
                  [class.border-gray-200]="selectedPaymentMethod !== method.value"
                >
                  <input
                    type="radio"
                    [value]="method.value"
                    [(ngModel)]="selectedPaymentMethod"
                    name="paymentMethod"
                    class="text-blue-600"
                  >
                  <div class="flex items-center space-x-2">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                         [style.background]="method.color + '20'">
                      <i [class]="method.icon" [style.color]="method.color"></i>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 text-sm">{{ method.label }}</p>
                      <p class="text-xs text-gray-500">{{ method.desc }}</p>
                    </div>
                  </div>
                </label>
              </div>

              <!-- Payment simulation UI -->
              <div *ngIf="selectedPaymentMethod && selectedPaymentMethod !== 'Espèces'" class="mt-4 bg-gray-50 rounded-lg p-4 border">
                <p class="text-sm font-medium text-gray-700 mb-2">
                  <i class="fas fa-mobile-alt mr-2"></i>Simulation {{ selectedPaymentMethod }}
                </p>
                <div class="bg-white border border-gray-200 rounded-lg p-3">
                  <p class="text-xs text-gray-500">Numéro à débiter :</p>
                  <p class="font-mono font-bold text-gray-800">+261 XX XXX XXX</p>
                  <p class="text-xs text-gray-400 mt-1">Un code de confirmation vous sera envoyé</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4">Ma commande</h2>

              <div class="space-y-3 mb-4 max-h-48 overflow-y-auto">
                <div *ngFor="let item of cartItems" class="flex justify-between text-sm">
                  <div>
                    <p class="font-medium text-gray-900 truncate">{{ item.product.name }}</p>
                    <p class="text-gray-500">x{{ item.quantity }}</p>
                  </div>
                  <span class="font-semibold ml-2 whitespace-nowrap">{{ getItemSubtotal(item) | number }} Ar</span>
                </div>
              </div>

              <div class="border-t pt-4 mb-6">
                <div class="flex justify-between items-center">
                  <span class="font-semibold text-gray-700">Total</span>
                  <span class="text-xl font-bold text-blue-600">{{ total | number }} Ar</span>
                </div>
              </div>

              <!-- Error Message -->
              <div *ngIf="errorMessage" class="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                <i class="fas fa-exclamation-circle mr-2"></i>{{ errorMessage }}
              </div>

              <button
                (click)="placeOrder()"
                [disabled]="!selectedPaymentMethod || isLoading || cartItems.length === 0"
                class="w-full py-3 rounded-xl font-semibold transition-all text-white"
                [class.bg-blue-600]="selectedPaymentMethod && !isLoading"
                [class.hover:bg-blue-700]="selectedPaymentMethod && !isLoading"
                [class.bg-gray-300]="!selectedPaymentMethod || isLoading"
                [class.cursor-not-allowed]="!selectedPaymentMethod || isLoading"
              >
                <span *ngIf="!isLoading">
                  <i class="fas fa-check-circle mr-2"></i>Confirmer la commande
                </span>
                <span *ngIf="isLoading">
                  <i class="fas fa-spinner fa-spin mr-2"></i>Traitement...
                </span>
              </button>

              <p class="text-xs text-gray-400 text-center mt-3">
                <i class="fas fa-shield-alt mr-1"></i>Transaction sécurisée
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
    cartItems: CartItem[] = [];
    total = 0;
    selectedPaymentMethod = '';
    notes = '';
    isLoading = false;
    errorMessage = '';
    currentUser: any = null;

    paymentMethods = [
        { value: 'MVola', label: 'MVola', icon: 'fas fa-mobile-alt', color: '#E53E3E', desc: 'Paiement mobile' },
        { value: 'Orange Money', label: 'Orange Money', icon: 'fas fa-phone', color: '#ED8936', desc: 'Paiement mobile' },
        { value: 'Airtel Money', label: 'Airtel Money', icon: 'fas fa-sim-card', color: '#E53E3E', desc: 'Paiement mobile' },
        { value: 'Carte Bancaire', label: 'Carte Bancaire', icon: 'fas fa-credit-card', color: '#4299E1', desc: 'Visa / Mastercard' },
        { value: 'Espèces', label: 'Espèces', icon: 'fas fa-money-bill', color: '#48BB78', desc: 'Payer à la boutique' },
    ];

    constructor(
        private cartService: CartService,
        private orderService: OrderService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.currentUser = this.authService.getCurrentUser();
        if (!this.currentUser) {
            this.router.navigate(['/login']);
            return;
        }
        this.cartService.cartItems$.subscribe(items => {
            this.cartItems = items;
            this.total = this.cartService.getTotal();
        });
    }

    getItemPrice(item: CartItem): number {
        const p = item.product;
        return (p.promotion?.isOnSale && p.promotion.discountPrice) ? p.promotion.discountPrice : p.price;
    }

    getItemSubtotal(item: CartItem): number {
        return this.getItemPrice(item) * item.quantity;
    }

    goBack(): void {
        this.router.navigate(['/cart']);
    }

    placeOrder(): void {
        if (!this.selectedPaymentMethod || this.cartItems.length === 0) return;

        this.isLoading = true;
        this.errorMessage = '';

        // Group items by storeId (use first store if multiple)
        const storeId = (this.cartItems[0].product as any).storeId;

        const orderData = {
            storeId,
            buyerId: this.currentUser?.id || this.currentUser?._id,
            items: this.cartItems.map(item => ({
                productId: item.product._id!,
                quantity: item.quantity
            })),
            paymentMethod: this.selectedPaymentMethod,
            notes: this.notes
        };

        this.orderService.createOnlineOrder(orderData).subscribe({
            next: (response: any) => {
                this.isLoading = false;
                if (response.success) {
                    this.cartService.clearCart();
                    this.router.navigate(['/order-confirmation', response.data._id]);
                }
            },
            error: (error: any) => {
                this.isLoading = false;
                this.errorMessage = error.error?.message || 'Erreur lors de la commande. Veuillez réessayer.';
            }
        });
    }
}
