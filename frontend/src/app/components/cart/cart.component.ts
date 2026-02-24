import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button (click)="goBack()" class="p-2 hover:bg-gray-100 rounded-full">
              <i class="fas fa-arrow-left text-gray-600"></i>
            </button>
            <h1 class="text-xl font-bold text-gray-900">Mon Panier</h1>
            <span class="bg-blue-100 text-blue-700 text-sm font-medium px-2 py-0.5 rounded-full">
              {{ totalItems }} article(s)
            </span>
          </div>
          <a routerLink="/catalog" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Continuer mes achats
          </a>
        </div>
      </header>

      <div class="max-w-5xl mx-auto px-4 py-8">
        <!-- Empty Cart -->
        <div *ngIf="cartItems.length === 0" class="text-center py-20">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fas fa-shopping-cart text-4xl text-gray-300"></i>
          </div>
          <h2 class="text-xl font-semibold text-gray-700 mb-2">Votre panier est vide</h2>
          <p class="text-gray-500 mb-6">Ajoutez des produits depuis le catalogue</p>
          <a routerLink="/catalog" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
            Parcourir le catalogue
          </a>
        </div>

        <!-- Cart Items + Summary -->
        <div *ngIf="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Items List -->
          <div class="lg:col-span-2 space-y-4">
            <div
              *ngFor="let item of cartItems"
              class="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-4 hover:shadow-md transition-shadow"
            >
              <!-- Product Image Placeholder -->
              <div class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="fas fa-box text-gray-300 text-2xl"></i>
              </div>

              <!-- Product Info -->
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 truncate">{{ item.product.name }}</h3>
                <p class="text-sm text-gray-500">{{ item.product.category }}</p>
                <p class="text-blue-600 font-bold mt-1">
                  {{ getItemPrice(item) | number }} Ar
                </p>
              </div>

              <!-- Quantity Controls -->
              <div class="flex items-center space-x-2">
                <button
                  (click)="decreaseQty(item)"
                  class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700"
                >-</button>
                <span class="w-6 text-center font-semibold">{{ item.quantity }}</span>
                <button
                  (click)="increaseQty(item)"
                  class="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center font-bold text-blue-700"
                >+</button>
              </div>

              <!-- Subtotal & Remove -->
              <div class="text-right ml-4">
                <p class="font-semibold text-gray-900">{{ getItemSubtotal(item) | number }} Ar</p>
                <button
                  (click)="removeItem(item)"
                  class="text-red-400 hover:text-red-600 text-sm mt-1"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <!-- Clear Cart -->
            <div class="text-right">
              <button (click)="clearCart()" class="text-sm text-gray-500 hover:text-red-500">
                <i class="fas fa-times mr-1"></i> Vider le panier
              </button>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-sm p-6 sticky top-20">
              <h2 class="text-lg font-bold text-gray-900 mb-4">Récapitulatif</h2>

              <div class="space-y-3 mb-4">
                <div *ngFor="let item of cartItems" class="flex justify-between text-sm">
                  <span class="text-gray-600 truncate mr-2">{{ item.product.name }} x{{ item.quantity }}</span>
                  <span class="font-medium">{{ getItemSubtotal(item) | number }} Ar</span>
                </div>
              </div>

              <div class="border-t pt-4">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-semibold text-gray-900">Total</span>
                  <span class="text-xl font-bold text-blue-600">{{ total | number }} Ar</span>
                </div>
              </div>

              <!-- Store Warning -->
              <div *ngIf="hasMultipleStores" class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p class="text-xs text-yellow-700">
                  <i class="fas fa-exclamation-triangle mr-1"></i>
                  Votre panier contient des produits de {{ storeCount }} boutiques différentes.
                </p>
              </div>

              <button
                (click)="goToCheckout()"
                class="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                <i class="fas fa-lock mr-2"></i>Commander ({{ total | number }} Ar)
              </button>

              <div class="mt-4 flex items-center justify-center space-x-4 text-gray-400 text-xs">
                <span><i class="fas fa-shield-alt mr-1"></i>Paiement sécurisé</span>
                <span><i class="fas fa-undo mr-1"></i>Retour facile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit, OnDestroy {
    cartItems: CartItem[] = [];
    total = 0;
    private sub!: Subscription;

    constructor(
        private cartService: CartService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.sub = this.cartService.cartItems$.subscribe(items => {
            this.cartItems = items;
            this.total = this.cartService.getTotal();
        });
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    get totalItems(): number {
        return this.cartService.getItemCount();
    }

    get storeCount(): number {
        const stores = new Set(this.cartItems.map(i => (i.product as any).storeId));
        return stores.size;
    }

    get hasMultipleStores(): boolean {
        return this.storeCount > 1;
    }

    getItemPrice(item: CartItem): number {
        const p = item.product;
        return (p.promotion?.isOnSale && p.promotion.discountPrice) ? p.promotion.discountPrice : p.price;
    }

    getItemSubtotal(item: CartItem): number {
        return this.getItemPrice(item) * item.quantity;
    }

    increaseQty(item: CartItem): void {
        this.cartService.updateQuantity(item.product._id!, item.quantity + 1);
    }

    decreaseQty(item: CartItem): void {
        if (item.quantity > 1) {
            this.cartService.updateQuantity(item.product._id!, item.quantity - 1);
        } else {
            this.removeItem(item);
        }
    }

    removeItem(item: CartItem): void {
        this.cartService.removeFromCart(item.product._id!);
    }

    clearCart(): void {
        if (confirm('Vider le panier ?')) {
            this.cartService.clearCart();
        }
    }

    goBack(): void {
        this.router.navigate(['/catalog']);
    }

    goToCheckout(): void {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
            return;
        }
        this.router.navigate(['/checkout']);
    }
}
