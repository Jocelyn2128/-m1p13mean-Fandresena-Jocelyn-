import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { StoreService } from '../../../services/store.service';
import { FavoriteService } from '../../../services/favorite.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
        <p class="mt-4 text-gray-500">Chargement du produit...</p>
      </div>

      <!-- Product Content -->
      <main *ngIf="!loading && product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Images -->
          <div>
            <div class="mb-4">
              <div class="h-96 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
                <img 
                  *ngIf="selectedImage"
                  [src]="getImageUrl(selectedImage)" 
                  [alt]="product.name"
                  class="w-full h-full object-cover"
                  (error)="onImageError($event)"
                >
                <i *ngIf="!selectedImage && (!product.images || product.images.length === 0)" class="fas fa-image text-gray-400 text-6xl"></i>
              </div>
            </div>
            <!-- Thumbnails -->
            <div *ngIf="product.images && product.images.length > 1" class="flex space-x-2 overflow-x-auto">
              <button 
                *ngFor="let img of product.images"
                (click)="selectedImage = img"
                [class.border-blue-600]="selectedImage === img"
                [class.border-2]="selectedImage === img"
                class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200"
              >
                <img [src]="getImageUrl(img)" class="w-full h-full object-cover">
              </button>
            </div>
          </div>

          <!-- Info -->
          <div>
            <div class="mb-2">
              <span class="text-sm text-blue-600 font-medium">{{ product.category }}</span>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
            <p class="text-gray-500 text-sm mb-4">{{ storeName }}</p>

            <!-- Price -->
            <div class="mb-6">
              <div *ngIf="product.promotion?.isOnSale" class="flex items-center space-x-3">
                <span class="text-3xl font-bold text-red-600">{{ product.promotion.discountPrice | number }} Ar</span>
                <span class="text-xl text-gray-400 line-through">{{ product.price | number }} Ar</span>
                <span class="bg-red-500 text-white text-sm px-2 py-1 rounded-full">-{{ calculateDiscount() }}%</span>
              </div>
              <div *ngIf="!product.promotion?.isOnSale">
                <span class="text-3xl font-bold text-gray-900">{{ product.price | number }} Ar</span>
              </div>
            </div>

            <!-- Stock Status -->
            <div class="mb-6">
              <span *ngIf="product.stockStatus === 'disponible'" class="inline-flex items-center text-green-600">
                <i class="fas fa-check-circle mr-2"></i>
                En stock ({{ product.stockQuantity }} disponibles)
              </span>
              <span *ngIf="product.stockStatus === 'rupture'" class="inline-flex items-center text-red-600">
                <i class="fas fa-times-circle mr-2"></i>
                Rupture de stock
              </span>
              <span *ngIf="product.stockStatus === 'precommande'" class="inline-flex items-center text-yellow-600">
                <i class="fas fa-clock mr-2"></i>
                Pré-commande
              </span>
            </div>

            <!-- Quantity -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
              <div class="flex items-center space-x-3">
                <button 
                  (click)="decreaseQuantity()"
                  [disabled]="quantity <= 1"
                  class="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50">
                  <i class="fas fa-minus"></i>
                </button>
                <span class="text-xl font-medium w-12 text-center">{{ quantity }}</span>
                <button 
                  (click)="increaseQuantity()"
                  [disabled]="quantity >= getMaxQuantity()"
                  class="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <p *ngIf="product.stockStatus === 'rupture'" class="text-xs text-red-500 mt-1">Produit en rupture de stock</p>
              <p *ngIf="product.stockStatus !== 'rupture' && product.stockQuantity" class="text-xs text-gray-500 mt-1">Stock disponible: {{ product.stockQuantity }}</p>
            </div>

            <!-- Add to Cart -->
            <div class="flex space-x-4 mb-8">
              <button 
                (click)="addToCart()"
                [disabled]="product.stockStatus === 'rupture'"
                class="flex-1 btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-shopping-cart mr-2"></i>
                Ajouter au panier
              </button>
              <button 
                (click)="toggleFavorite()"
                [class.text-red-500]="isFavorite"
                class="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <i [class]="isFavorite ? 'fas' : 'far'" class="fa-heart text-xl"></i>
              </button>
            </div>

            <!-- Description -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-semibold mb-3">Description</h3>
              <p class="text-gray-600">{{ product.description || 'Aucune description disponible.' }}</p>
            </div>

            <!-- Store Info -->
            <div *ngIf="store" class="border-t pt-6 mt-6">
              <h3 class="text-lg font-semibold mb-3">Boutique</h3>
              <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg cursor-pointer" (click)="viewStore()">
                <div class="h-16 w-16 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                  <img *ngIf="store.logo" [src]="getStoreImageUrl(store.logo)" class="w-full h-full object-cover">
                  <i *ngIf="!store.logo" class="fas fa-store text-gray-400 text-2xl"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold">{{ store.name }}</h4>
                  <p class="text-sm text-gray-500">{{ store.category }} • {{ store.location?.floor || 'Étage' }}</p>
                </div>
                <i class="fas fa-chevron-right text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        <div class="mt-16">
          <h3 class="text-xl font-semibold mb-6">Produits similaires</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              *ngFor="let p of relatedProducts" 
              class="mall-card p-0 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              (click)="viewProduct(p)"
            >
              <div class="h-40 bg-gray-200 relative">
                <img 
                  *ngIf="p.images && p.images.length > 0"
                  [src]="getImageUrl(p.images[0])" 
                  [alt]="p.name"
                  class="w-full h-full object-cover"
                >
                <div *ngIf="!p.images || p.images.length === 0" class="w-full h-full flex items-center justify-center">
                  <i class="fas fa-image text-gray-400 text-3xl"></i>
                </div>
                <div *ngIf="p.promotion?.isOnSale" class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  -{{ calculateProductDiscount(p) }}%
                </div>
              </div>
              <div class="p-4">
                <h4 class="font-semibold text-sm line-clamp-2">{{ p.name }}</h4>
                <p class="text-blue-600 font-bold mt-1">{{ p.promotion?.isOnSale ? p.promotion.discountPrice : p.price | number }} Ar</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Not Found -->
      <div *ngIf="!loading && !product" class="max-w-7xl mx-auto px-4 py-12 text-center">
        <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">Produit non trouvé</p>
        <a routerLink="/catalog" class="mt-4 inline-block text-blue-600 hover:text-blue-700">
          Retour au catalogue
        </a>
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
export class ProductDetailComponent implements OnInit {
  product: any = null;
  store: any = null;
  relatedProducts: any[] = [];
  storeName = '';
  loading = true;
  selectedImage = '';
  quantity = 1;
  isFavorite = false;
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private storeService: StoreService,
    private favoriteService: FavoriteService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${environment.apiUrl.replace('/api', '')}/uploads/${imagePath}`;
  }

  getStoreImageUrl(imagePath: string): string {
    return this.getImageUrl(imagePath);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.product = response.data;
          if (this.product.images && this.product.images.length > 0) {
            this.selectedImage = this.product.images[0];
          }
          this.loadStore();
          this.loadRelatedProducts();
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
    if (!this.currentUser || !this.product?._id) return;

    const userId = this.currentUser.id || this.currentUser._id;
    if (!userId) return;

    this.favoriteService.checkFavorite(userId, this.product._id, 'Product').subscribe({
      next: (response: any) => {
        this.isFavorite = response.isFavorite;
      }
    });
  }

  loadStore(): void {
    if (this.product?.storeId) {
      this.storeService.getStore(this.product.storeId).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.store = response.data;
            this.storeName = this.store.name;
          }
        }
      });
    }
  }

  loadRelatedProducts(): void {
    this.productService.getProducts({ category: this.product.category }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.relatedProducts = (response.data || [])
            .filter((p: any) => p._id !== this.product._id)
            .slice(0, 4);
        }
      }
    });
  }

  calculateDiscount(): number {
    if (!this.product?.promotion?.isOnSale || !this.product.promotion.discountPrice) return 0;
    return Math.round((1 - this.product.promotion.discountPrice / this.product.price) * 100);
  }

  calculateProductDiscount(product: any): number {
    if (!product?.promotion?.isOnSale || !product.promotion.discountPrice) return 0;
    return Math.round((1 - product.promotion.discountPrice / product.price) * 100);
  }

  getMaxQuantity(): number {
    if (!this.product) return 0;
    if (this.product.stockStatus === 'rupture') return 0;
    return this.product.stockQuantity || 0;
  }

  increaseQuantity(): void {
    const max = this.getMaxQuantity();
    if (max > 0 && this.quantity < max) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product || this.product.stockStatus === 'rupture') {
      return;
    }
    alert(`Ajouté ${this.quantity} x ${this.product.name} au panier!`);
  }

  toggleFavorite(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.product?._id) {
      return;
    }

    const userId = this.currentUser.id || this.currentUser._id;
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.isFavorite) {
      this.favoriteService.removeFavorite(userId, this.product._id, 'Product').subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (err) => {
          console.error('Error removing favorite:', err);
        }
      });
    } else {
      this.favoriteService.addFavorite(userId, this.product._id, 'Product').subscribe({
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

  viewStore(): void {
    if (this.store?._id) {
      this.router.navigate(['/catalog/store', this.store._id]);
    }
  }
}
