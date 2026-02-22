import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { StoreService } from '../../../services/store.service';
import { ProductService } from '../../../services/product.service';
import { FavoriteService } from '../../../services/favorite.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-store-detail',
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
            <h1 class="text-xl font-bold text-blue-600">MallConnect</h1>
            <div class="w-32"></div>
          </div>
        </div>
      </header>

      <!-- Loading -->
      <div *ngIf="loading" class="max-w-7xl mx-auto px-4 py-12 text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
        <p class="mt-4 text-gray-500">Chargement de la boutique...</p>
      </div>

      <!-- Store Content -->
      <main *ngIf="!loading && store" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Cover Image -->
        <div class="h-64 md:h-80 relative -mx-4 md:-mx-0 md:rounded-xl overflow-hidden">
          <img 
            *ngIf="store.coverImage"
            [src]="getImageUrl(store.coverImage)" 
            [alt]="store.name"
            class="w-full h-full object-cover"
            (error)="onImageError($event)"
          >
          <div *ngIf="!store.coverImage" class="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <div class="absolute inset-0 bg-black bg-opacity-30 flex items-end">
            <div class="p-8 text-white">
              <div class="flex items-end space-x-6">
                <div class="h-32 w-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                  <img *ngIf="store.logo" [src]="getImageUrl(store.logo)" class="w-full h-full object-cover">
                  <i *ngIf="!store.logo" class="fas fa-store text-4xl text-gray-400"></i>
                </div>
                <div class="mb-2">
                  <h1 class="text-4xl font-bold">{{ store.name }}</h1>
                  <p class="text-lg text-blue-100">{{ store.category }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Store Info -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <!-- Main Info -->
          <div class="md:col-span-2">
            <!-- Description -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 class="text-lg font-semibold mb-3">À propos</h2>
              <p class="text-gray-600">{{ store.description || 'Aucune description disponible.' }}</p>
            </div>

            <!-- Products -->
            <div>
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold">Produits ({{ products.length }})</h2>
              </div>

              <!-- Loading Products -->
              <div *ngIf="loadingProducts" class="text-center py-8">
                <i class="fas fa-spinner fa-spin text-2xl text-blue-500"></i>
              </div>

              <!-- Empty -->
              <div *ngIf="!loadingProducts && products.length === 0" class="text-center py-8 bg-white rounded-xl">
                <i class="fas fa-box-open text-3xl text-gray-300 mb-3"></i>
                <p class="text-gray-500">Aucun produit disponible</p>
              </div>

              <!-- Products Grid -->
              <div *ngIf="!loadingProducts && products.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div 
                  *ngFor="let product of products" 
                  class="mall-card p-0 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  (click)="viewProduct(product)"
                >
                  <div class="h-36 bg-gray-200 relative">
                    <img 
                      *ngIf="product.images && product.images.length > 0"
                      [src]="getImageUrl(product.images[0])" 
                      [alt]="product.name"
                      class="w-full h-full object-cover"
                    >
                    <div *ngIf="!product.images || product.images.length === 0" class="w-full h-full flex items-center justify-center">
                      <i class="fas fa-image text-gray-400 text-2xl"></i>
                    </div>
                    <div *ngIf="product.promotion?.isOnSale" class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      -{{ calculateDiscount(product) }}%
                    </div>
                  </div>
                  <div class="p-3">
                    <h4 class="font-semibold text-sm line-clamp-1">{{ product.name }}</h4>
                    <p class="text-blue-600 font-bold mt-1">
                      {{ product.promotion?.isOnSale ? product.promotion.discountPrice : product.price | number }} Ar
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div>
            <!-- Info Card -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 class="font-semibold mb-4">Informations</h3>
              
              <div class="space-y-4">
                <div class="flex items-start">
                  <i class="fas fa-map-marker-alt text-blue-600 mt-1 w-6"></i>
                  <div>
                    <p class="text-sm text-gray-500">Localisation</p>
                    <p class="font-medium">Étage {{ store.location?.floor || '-' }}, Boutique {{ store.location?.shopNumber || '-' }}</p>
                  </div>
                </div>

                <div *ngIf="store.openingHours" class="flex items-start">
                  <i class="fas fa-clock text-blue-600 mt-1 w-6"></i>
                  <div>
                    <p class="text-sm text-gray-500">Horaires</p>
                    <p class="font-medium">{{ store.openingHours }}</p>
                  </div>
                </div>

                <div *ngIf="store.acceptedPaymentMethods && store.acceptedPaymentMethods.length > 0" class="flex items-start">
                  <i class="fas fa-credit-card text-blue-600 mt-1 w-6"></i>
                  <div>
                    <p class="text-sm text-gray-500">Moyens de paiement</p>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span *ngFor="let method of store.acceptedPaymentMethods" class="text-xs bg-gray-100 px-2 py-1 rounded">
                        {{ method }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <button class="w-full btn-primary mb-3">
                <i class="fas fa-store mr-2"></i>
                Visiter la boutique
              </button>
              <button 
                (click)="toggleFavorite()"
                [class.text-red-500]="isFavorite"
                class="w-full btn-secondary">
                <i [class]="isFavorite ? 'fas' : 'far'" class="fa-heart mr-2"></i>
                {{ isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
              </button>
            </div>
          </div>
        </div>
      </main>

      <!-- Not Found -->
      <div *ngIf="!loading && !store" class="max-w-7xl mx-auto px-4 py-12 text-center">
        <i class="fas fa-store text-4xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">Boutique non trouvée</p>
        <a routerLink="/catalog" class="mt-4 inline-block text-blue-600 hover:text-blue-700">
          Retour au catalogue
        </a>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class StoreDetailComponent implements OnInit {
  store: any = null;
  products: any[] = [];
  loading = true;
  loadingProducts = false;
  isFavorite = false;
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private productService: ProductService,
    private favoriteService: FavoriteService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    const storeId = this.route.snapshot.paramMap.get('id');
    if (storeId) {
      this.loadStore(storeId);
    }
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${environment.apiUrl.replace('/api', '')}/uploads/${imagePath}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  loadStore(id: string): void {
    this.loading = true;
    this.storeService.getStore(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.store = response.data;
          this.loadProducts();
          this.checkFavorite();
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  checkFavorite(): void {
    if (!this.currentUser || !this.store?._id) return;

    const userId = this.currentUser.id || this.currentUser._id;
    if (!userId) return;

    this.favoriteService.checkFavorite(userId, this.store._id, 'Store').subscribe({
      next: (response: any) => {
        this.isFavorite = response.isFavorite;
      }
    });
  }

  loadProducts(): void {
    if (!this.store?._id) return;
    
    this.loadingProducts = true;
    this.productService.getProducts({ storeId: this.store._id }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.products = response.data || [];
        }
        this.loadingProducts = false;
      },
      error: () => {
        this.loadingProducts = false;
      }
    });
  }

  calculateDiscount(product: any): number {
    if (!product.promotion?.isOnSale || !product.promotion.discountPrice) return 0;
    return Math.round((1 - product.promotion.discountPrice / product.price) * 100);
  }

  toggleFavorite(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.store?._id) {
      return;
    }

    const userId = this.currentUser.id || this.currentUser._id;
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.isFavorite) {
      this.favoriteService.removeFavorite(userId, this.store._id, 'Store').subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (err) => {
          console.error('Error removing favorite:', err);
        }
      });
    } else {
      this.favoriteService.addFavorite(userId, this.store._id, 'Store').subscribe({
        next: () => {
          this.isFavorite = true;
        },
        error: (err) => {
          console.error('Error adding favorite:', err);
        }
      });
    }
  }

  viewProduct(product: any): void {
    this.router.navigate(['/catalog/product', product._id]);
  }
}
