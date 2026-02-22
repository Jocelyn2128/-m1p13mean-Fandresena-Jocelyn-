import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FavoriteService } from '../../services/favorite.service';
import { ProductService } from '../../services/product.service';
import { StoreService } from '../../services/store.service';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <a routerLink="/catalog" class="flex items-center text-gray-600 hover:text-blue-600">
                <i class="fas fa-arrow-left mr-2"></i>
                <span>Retour au catalogue</span>
              </a>
            </div>
            <h1 class="text-xl font-bold text-blue-600">Mes Favoris</h1>
            <div class="w-32"></div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Tabs -->
        <div class="flex space-x-4 mb-8 border-b border-gray-200">
          <button 
            (click)="activeTab = 'products'"
            [class.border-blue-600]="activeTab === 'products'"
            [class.text-blue-600]="activeTab === 'products'"
            class="pb-3 px-4 border-b-2 font-medium transition-colors">
            <i class="fas fa-box mr-2"></i>
            Produits ({{ favoriteProducts.length }})
          </button>
          <button 
            (click)="activeTab = 'stores'"
            [class.border-blue-600]="activeTab === 'stores'"
            [class.text-blue-600]="activeTab === 'stores'"
            class="pb-3 px-4 border-b-2 font-medium transition-colors">
            <i class="fas fa-store mr-2"></i>
            Boutiques ({{ favoriteStores.length }})
          </button>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="text-center py-12">
          <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
          <p class="mt-4 text-gray-500">Chargement...</p>
        </div>

        <!-- Empty State - Not Logged In -->
        <div *ngIf="!loading && !currentUser" class="text-center py-12 bg-white rounded-xl">
          <i class="fas fa-user-lock text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 mb-4">Connectez-vous pour voir vos favoris</p>
          <a routerLink="/login" class="btn-primary">Se connecter</a>
        </div>

        <!-- Empty State - No Favorites -->
        <div *ngIf="!loading && currentUser && activeTab === 'products' && favoriteProducts.length === 0" class="text-center py-12 bg-white rounded-xl">
          <i class="fas fa-heart text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 mb-4">Vous n'avez pas encore de produits favoris</p>
          <a routerLink="/catalog" class="text-blue-600 hover:text-blue-700">Parcourir le catalogue</a>
        </div>

        <div *ngIf="!loading && currentUser && activeTab === 'stores' && favoriteStores.length === 0" class="text-center py-12 bg-white rounded-xl">
          <i class="fas fa-store text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 mb-4">Vous n'avez pas encore de boutiques favorites</p>
          <a routerLink="/catalog" class="text-blue-600 hover:text-blue-700">Parcourir le catalogue</a>
        </div>

        <!-- Products Grid -->
        <div *ngIf="!loading && activeTab === 'products' && favoriteProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            *ngFor="let item of favoriteProducts"
            class="mall-card p-0 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div class="h-48 bg-gray-200 relative cursor-pointer" (click)="viewProduct(item.targetId)">
              <img
                *ngIf="item.targetId?.images && item.targetId.images.length > 0"
                [src]="getProductImageUrl(item.targetId.images[0])"
                [alt]="item.targetId.name"
                class="w-full h-full object-cover"
                (error)="onImageError($event)"
              >
              <div *ngIf="!item.targetId?.images || item.targetId.images.length === 0" class="w-full h-full flex items-center justify-center">
                <i class="fas fa-image text-gray-400 text-4xl"></i>
              </div>
              <div *ngIf="item.targetId?.promotion?.isOnSale" class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                -{{ calculateDiscount(item.targetId) }}%
              </div>
              <div *ngIf="item.targetId?.stockStatus === 'rupture'" class="absolute top-2 left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                Rupture
              </div>
            </div>
            <div class="p-4">
              <span class="text-xs text-blue-600 font-medium">{{ item.targetId?.category }}</span>
              <h4 class="font-semibold text-gray-900 mt-1 line-clamp-2 cursor-pointer" (click)="viewProduct(item.targetId)">
                {{ item.targetId?.name }}
              </h4>
              <p class="text-sm text-gray-500 mb-2">{{ item.targetId?.storeName || 'Chargement...' }}</p>
              <div class="flex justify-between items-center">
                <div>
                  <span *ngIf="item.targetId?.promotion?.isOnSale" class="text-lg font-bold text-red-600">{{ item.targetId.promotion.discountPrice | number }} Ar</span>
                  <span *ngIf="!item.targetId?.promotion?.isOnSale" class="text-lg font-bold text-gray-900">{{ item.targetId?.price | number }} Ar</span>
                  <span *ngIf="item.targetId?.promotion?.isOnSale" class="text-sm text-gray-400 line-through ml-2">{{ item.targetId?.price | number }} Ar</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span *ngIf="item.targetId?.stockStatus === 'rupture'" class="text-xs text-red-500">Rupture</span>
                  <span *ngIf="item.targetId?.stockStatus !== 'rupture' && item.targetId?.stockQuantity" class="text-xs" [class.text-green-600]="item.targetId.stockQuantity > 5" [class.text-orange-500]="item.targetId.stockQuantity <= 5">
                    {{ item.targetId.stockQuantity }}
                  </span>
                </div>
              </div>
              <div class="flex items-center justify-between mt-3">
                <button
                  (click)="removeFavorite(item.targetId._id, 'Product')"
                  class="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  title="Retirer des favoris">
                  <i class="fas fa-heart"></i>
                </button>
                <button
                  (click)="viewProduct(item.targetId)"
                  class="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                  Voir
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Stores Grid -->
        <div *ngIf="!loading && activeTab === 'stores' && favoriteStores.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let item of favoriteStores"
            class="mall-card p-0 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            (click)="viewStore(item.targetId)"
          >
            <div class="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
              <img
                *ngIf="item.targetId?.coverImage"
                [src]="getStoreImageUrl(item.targetId.coverImage)"
                class="w-full h-full object-cover"
                (error)="onImageError($event)"
              >
            </div>
            <div class="p-6">
              <div class="flex items-center -mt-12 mb-4">
                <div class="h-20 w-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                  <img *ngIf="item.targetId?.logo" [src]="getStoreImageUrl(item.targetId.logo)" class="w-full h-full object-cover">
                  <i *ngIf="!item.targetId?.logo" class="fas fa-store text-3xl text-gray-400"></i>
                </div>
              </div>
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-semibold text-lg">{{ item.targetId?.name }}</h4>
                  <p class="text-gray-500 text-sm">{{ item.targetId?.category }} • {{ item.targetId?.location?.floor || 'Étage' }}</p>
                </div>
                <button
                  (click)="removeFavorite(item.targetId._id, 'Store', $event)"
                  class="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  title="Retirer des favoris">
                  <i class="fas fa-heart"></i>
                </button>
              </div>
              <p class="text-gray-600 text-sm mt-2 line-clamp-2">{{ item.targetId?.description }}</p>
              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center space-x-2 text-xs text-gray-500">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ item.targetId?.location?.mall || 'Mall' }}</span>
                </div>
                <button
                  (click)="viewStore(item.targetId); $event.stopPropagation()"
                  class="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                  Visiter
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
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
export class FavoritesComponent implements OnInit {
  currentUser: User | null = null;
  activeTab: 'products' | 'stores' = 'products';
  loading = false;
  
  favoriteProducts: any[] = [];
  favoriteStores: any[] = [];

  constructor(
    private authService: AuthService,
    private favoriteService: FavoriteService,
    private productService: ProductService,
    private storeService: StoreService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      if (user) {
        this.loadFavorites();
      }
    });
  }

  ngOnInit(): void {}

  loadFavorites(): void {
    if (!this.currentUser) return;

    const userId = this.currentUser.id || this.currentUser._id;
    if (!userId) return;

    this.loading = true;

    // Load product favorites
    this.favoriteService.getFavorites(userId, 'Product').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.favoriteProducts = response.data || [];
          this.loadProductStores();
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    // Load store favorites
    this.favoriteService.getFavorites(userId, 'Store').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.favoriteStores = response.data || [];
        }
      }
    });
  }

  loadProductStores(): void {
    this.favoriteProducts.forEach(item => {
      if (item.targetId?.storeId) {
        this.storeService.getStore(item.targetId.storeId).subscribe({
          next: (response: any) => {
            if (response.success && item.targetId) {
              item.targetId.storeName = response.data.name;
            }
          },
          error: (err) => {
            console.error('Error loading store name:', err);
          }
        });
      }
    });
  }

  getProductImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${environment.apiUrl.replace('/api', '')}/uploads/${imagePath}`;
  }

  getStoreImageUrl(imagePath: string): string {
    return this.getProductImageUrl(imagePath);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  calculateDiscount(product: any): number {
    if (!product?.promotion?.isOnSale || !product.promotion.discountPrice) return 0;
    return Math.round((1 - product.promotion.discountPrice / product.price) * 100);
  }

  viewProduct(product: any): void {
    const productId = product?._id || product?.id;
    if (productId) {
      this.router.navigate(['/catalog/product', productId]);
    }
  }

  viewStore(store: any): void {
    const storeId = store?._id || store?.id;
    if (storeId) {
      this.router.navigate(['/catalog/store', storeId]);
    }
  }

  removeFavorite(targetId: string, type: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (!this.currentUser) return;

    const userId = this.currentUser.id || this.currentUser._id;
    if (!userId) return;

    this.favoriteService.removeFavorite(userId, targetId, type).subscribe({
      next: () => {
        if (type === 'Product') {
          this.favoriteProducts = this.favoriteProducts.filter(f => f.targetId?._id !== targetId);
        } else {
          this.favoriteStores = this.favoriteStores.filter(f => f.targetId?._id !== targetId);
        }
      },
      error: (err) => {
        console.error('Error removing favorite:', err);
      }
    });
  }
}
