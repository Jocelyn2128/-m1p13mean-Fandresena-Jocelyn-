import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { StoreService } from '../../services/store.service';
import { FavoriteService } from '../../services/favorite.service';
import { CartService } from '../../services/cart.service';
import { BannerComponent } from '../shared/banner/banner.component';
import { User } from '../../models/user.model';
import { Product } from '../../models/product.model';
import { Store } from '../../models/store.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BannerComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-blue-600">MallConnect</h1>
            </div>
            
            <div class="flex items-center space-x-6">
              <div class="flex items-center space-x-3">
                <div class="relative">
                  <input 
                    type="text" 
                    [(ngModel)]="searchQueryProducts"
                    (ngModelChange)="onSearchProducts()"
                    placeholder="Rechercher produits..."
                    class="form-input w-48 text-sm"
                  >
                  <i class="fas fa-box absolute right-3 top-2.5 text-gray-400 text-xs"></i>
                </div>
                <div class="relative">
                  <input 
                    type="text" 
                    [(ngModel)]="searchQueryStores"
                    (ngModelChange)="onSearchStores()"
                    placeholder="Rechercher boutiques..."
                    class="form-input w-48 text-sm"
                  >
                  <i class="fas fa-store absolute right-3 top-2.5 text-gray-400 text-xs"></i>
                </div>
              </div>
              
              <a routerLink="/favorites" class="relative p-2 text-gray-600 hover:text-blue-600">
                <i class="fas fa-heart text-xl"></i>
              </a>

              <button (click)="goToCart()" class="relative p-2 text-gray-600 hover:text-blue-600">
                <i class="fas fa-shopping-cart text-xl"></i>
                <span *ngIf="cartCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {{ cartCount }}
                </span>
              </button>

              <div *ngIf="currentUser; else loginBtn" class="flex items-center space-x-3">
                <a routerLink="/order-history" class="text-sm text-gray-600 hover:text-blue-600" title="Mes commandes">
                  <i class="fas fa-shopping-bag"></i>
                </a>
                <a routerLink="/wallet" class="text-sm text-purple-600 hover:text-purple-700" title="Mon portefeuille">
                  <i class="fas fa-wallet"></i>
                </a>
                <span class="text-sm text-gray-700 font-medium">{{ currentUser.firstName }}</span>
                <button (click)="logout()" class="text-sm text-red-500 hover:text-red-600">
                  <i class="fas fa-sign-out-alt"></i>
                </button>
              </div>
              <ng-template #loginBtn>
                <a routerLink="/login" class="btn-primary text-sm">
                  Connexion
                </a>
              </ng-template>
            </div>
          </div>
        </div>
      </header>

      <!-- Hero Section with Banner -->
      <app-banner 
        imageUrl="assets/images/banner.jpg"
        height="24rem"
        [overlayOpacity]="0.35">
      </app-banner>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Filters Bar -->
        <div class="mb-8 bg-white rounded-xl shadow-sm p-4">
          <div class="flex flex-wrap items-center gap-4">
            <!-- Category Filter -->
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Catégorie:</label>
              <select [(ngModel)]="filters.category" (change)="applyFilters()" class="form-input w-40 text-sm">
                <option value="">Toutes</option>
                <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
              </select>
            </div>

            <!-- Price Range -->
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Prix:</label>
              <input 
                type="number" 
                [(ngModel)]="filters.minPrice"
                (input)="applyFilters()"
                placeholder="Min"
                class="form-input w-24 text-sm"
              >
              <span class="text-gray-400">-</span>
              <input 
                type="number" 
                [(ngModel)]="filters.maxPrice"
                (input)="applyFilters()"
                placeholder="Max"
                class="form-input w-24 text-sm"
              >
            </div>

            <!-- Promotion Filter -->
            <div class="flex items-center">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  [(ngModel)]="filters.promotionOnly"
                  (change)="applyFilters()"
                  class="w-4 h-4 text-blue-600 rounded"
                >
                <span class="text-sm text-gray-700">En promotion</span>
              </label>
            </div>

            <!-- Stock Filter -->
            <div class="flex items-center">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  [(ngModel)]="filters.inStockOnly"
                  (change)="applyFilters()"
                  class="w-4 h-4 text-blue-600 rounded"
                >
                <span class="text-sm text-gray-700">En stock</span>
              </label>
            </div>

            <!-- Sort -->
            <div class="flex items-center space-x-2 ml-auto">
              <label class="text-sm font-medium text-gray-700">Trier:</label>
              <select [(ngModel)]="filters.sort" (change)="applyFilters()" class="form-input w-40 text-sm">
                <option value="name_asc">Nom A-Z</option>
                <option value="name_desc">Nom Z-A</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="newest">Plus récents</option>
              </select>
            </div>

            <!-- Reset Filters -->
            <button (click)="resetFilters()" class="text-sm text-gray-500 hover:text-gray-700">
              <i class="fas fa-times mr-1"></i>Réinitialiser
            </button>
          </div>
        </div>

        <!-- Categories Pills -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4">Catégories</h3>
          <div class="flex space-x-3 overflow-x-auto pb-2">
            <button 
              (click)="filterByCategory('')"
              [class.bg-blue-600]="filters.category === ''"
              [class.text-white]="filters.category === ''"
              class="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-full whitespace-nowrap hover:bg-gray-50">
              Tous
            </button>
            <button 
              *ngFor="let cat of categories"
              (click)="filterByCategory(cat)"
              [ngClass]="{
                'bg-blue-600 text-white': filters.category === cat,
                'bg-white text-gray-700': filters.category !== cat
              }"
              class="px-6 py-2 border border-gray-300 rounded-full whitespace-nowrap hover:bg-gray-50">
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Products Section -->
        <div>
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold">
              Produits 
              <span class="text-sm font-normal text-gray-500">({{ filteredProducts.length }} résultat(s))</span>
            </h3>
          </div>

          <!-- Loading -->
          <div *ngIf="loadingProducts" class="text-center py-12">
            <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
            <p class="mt-4 text-gray-500">Chargement des produits...</p>
          </div>

          <!-- Empty State -->
       
          <!-- Products Grid -->
          <div *ngIf="!loadingProducts && filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              *ngFor="let product of paginatedProducts" 
              class="mall-card p-0 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              (click)="viewProductDetail(product)"
            >
              <div class="h-48 bg-gray-200 relative">
                <img 
                  *ngIf="product.images && product.images.length > 0"
                  [src]="getProductImageUrl(product.images[0])" 
                  [alt]="product.name"
                  class="w-full h-full object-cover"
                  (error)="onImageError($event)"
                >
                <div *ngIf="!product.images || product.images.length === 0" class="w-full h-full flex items-center justify-center">
                  <i class="fas fa-image text-gray-400 text-4xl"></i>
                </div>
                <!-- Promotion Badge -->
                <div *ngIf="product.promotion?.isOnSale" class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  -{{ calculateDiscount(product) }}%
                </div>
                <!-- Out of Stock Badge -->
                <div *ngIf="product.stockStatus === 'rupture'" class="absolute top-2 left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                  Rupture
                </div>
              </div>
              <div class="p-4">
                <span class="text-xs text-blue-600 font-medium">{{ product.category }}</span>
                <h4 class="font-semibold text-gray-900 mt-1 line-clamp-2">{{ product.name }}</h4>
                <p class="text-sm text-gray-500 mb-2">{{ product.storeName }}</p>
                <div class="flex justify-between items-center">
                  <div>
                    <span *ngIf="product.promotion?.isOnSale" class="text-lg font-bold text-red-600">{{ product.promotion.discountPrice | number }} Ar</span>
                    <span *ngIf="!product.promotion?.isOnSale" class="text-lg font-bold text-gray-900">{{ product.price | number }} Ar</span>
                    <span *ngIf="product.promotion?.isOnSale" class="text-sm text-gray-400 line-through ml-2">{{ product.price | number }} Ar</span>
                  </div>
                  <div class="flex items-center justify-between mt-1">
                    <span *ngIf="product.stockStatus === 'rupture'" class="text-xs text-red-500">Rupture</span>
                    <span *ngIf="product.stockStatus !== 'rupture' && product.stockQuantity" class="text-xs" [class.text-green-600]="product.stockQuantity > 5" [class.text-orange-500]="product.stockQuantity <= 5">
                      Stock: {{ product.stockQuantity }}
                    </span>
                  </div>
                  <div class="flex items-center space-x-2 mt-2">
                    <button 
                      (click)="toggleProductFavorite(product._id, $event)"
                      class="p-2 rounded-full hover:bg-gray-100"
                      [class.text-red-500]="isProductFavorite(product._id)"
                      [class.text-gray-400]="!isProductFavorite(product._id)"
                      title="Ajouter aux favoris">
                      <i [class]="isProductFavorite(product._id) ? 'fas' : 'far'" class="fa-heart"></i>
                    </button>
                    <button 
                      (click)="addToCart(product, $event)"
                      [disabled]="product.stockStatus === 'rupture'"
                      [class.opacity-50]="product.stockStatus === 'rupture'"
                      class="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 disabled:cursor-not-allowed">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div *ngIf="totalPages > 1" class="mt-8 flex justify-center">
          <nav class="flex items-center space-x-2">
            <button 
              (click)="goToPage(currentPage - 1)"
              [disabled]="currentPage === 1"
              class="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button 
              *ngFor="let page of visiblePages"
              (click)="goToPage(page)"
              [class.bg-blue-600]="page === currentPage"
              [class.text-white]="page === currentPage"
              class="px-4 py-2 border rounded-lg hover:bg-gray-50">
              {{ page }}
            </button>
            <button 
              (click)="goToPage(currentPage + 1)"
              [disabled]="currentPage === totalPages"
              class="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
              <i class="fas fa-chevron-right"></i>
            </button>
          </nav>
        </div>

        <!-- Stores Section -->
        <div class="mt-12">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold">
              Nos boutiques
              <span class="text-sm font-normal text-gray-500">({{ filteredStores.length }} boutique(s))</span>
            </h3>
          </div>

          <!-- Loading -->
          <div *ngIf="loadingStores" class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
          </div>

          <!-- Stores Grid -->
          <div *ngIf="!loadingStores" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              *ngFor="let store of filteredStores" 
              class="mall-card p-0 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div class="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative cursor-pointer" (click)="viewStoreDetail(store)">
                <img 
                  *ngIf="store.coverImage"
                  [src]="getStoreImageUrl(store.coverImage)"
                  class="w-full h-full object-cover"
                  (error)="onImageError($event)"
                >
              </div>
              <div class="p-6">
                <div class="flex items-center -mt-12 mb-4">
                  <div class="h-20 w-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                    <img 
                      *ngIf="store.logo"
                      [src]="getStoreImageUrl(store.logo)"
                      class="w-full h-full object-cover"
                      (error)="onImageError($event)"
                    >
                    <i *ngIf="!store.logo" class="fas fa-store text-3xl text-gray-400"></i>
                  </div>
                </div>
                <h4 class="font-semibold text-lg">{{ store.name }}</h4>
                <p class="text-gray-500 text-sm mb-3">{{ store.category }} • {{ store.location?.floor || 'Étage' }}</p>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ store.description }}</p>
                <div class="flex space-x-2">
                  <button (click)="viewStoreDetail(store)" class="flex-1 btn-secondary text-sm">
                    Visiter la boutique
                  </button>
                  <button 
                    (click)="toggleStoreFavorite(store._id, $event)"
                    class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    [class.text-red-500]="isStoreFavorite(store._id)"
                    [class.text-gray-400]="!isStoreFavorite(store._id)"
                    title="Ajouter aux favoris">
                    <i [class]="isStoreFavorite(store._id) ? 'fas' : 'far'" class="fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex justify-between items-center">
            <p class="text-gray-500">© 2024 MallConnect. Tous droits réservés.</p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-gray-600">
                <i class="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-600">
                <i class="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-600">
                <i class="fab fa-twitter text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
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
export class CatalogComponent implements OnInit {
  currentUser: User | null = null;
  products: any[] = [];
  filteredProducts: any[] = [];
  stores: any[] = [];
  filteredStores: any[] = [];
  loadingProducts = false;
  loadingStores = false;
  searchQueryProducts = '';
  searchQueryStores = '';
  cartCount = 0;
  cartItems: any[] = [];

  categories: string[] = ['Mode', 'Électronique', 'Alimentation', 'Maison', 'Beauté', 'Sports', 'Jouets', 'Autre'];

  filters = {
    category: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    promotionOnly: false,
    inStockOnly: false,
    sort: 'name_asc'
  };

  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;

  // Favorites
  favoriteProductIds: Set<string> = new Set();
  favoriteStoreIds: Set<string> = new Set();

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private storeService: StoreService,
    private favoriteService: FavoriteService,
    private cartService: CartService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      if (user) {
        this.loadFavorites();
      }
    });
    // Subscribe to cart count
    this.cartService.cartItems$.subscribe(() => {
      this.cartCount = this.cartService.getItemCount();
    });
  }

  ngOnInit(): void {
    if (!this.currentUser) {
      this.currentUser = this.authService.getCurrentUser();
    }
    this.loadProducts();
    this.loadStores();
    if (this.currentUser) {
      this.loadFavorites();
    }
  }

  loadFavorites(): void {
    if (!this.currentUser) return;

    const userId = this.currentUser.id || this.currentUser._id;
    if (!userId) return;

    this.favoriteService.getFavorites(userId, 'Product').subscribe({
      next: (response: any) => {
        if (response.success) {
          (response.data || []).forEach((fav: any) => {
            if (fav.targetId?._id) {
              this.favoriteProductIds.add(fav.targetId._id);
            }
          });
        }
      }
    });

    this.favoriteService.getFavorites(userId, 'Store').subscribe({
      next: (response: any) => {
        if (response.success) {
          (response.data || []).forEach((fav: any) => {
            if (fav.targetId?._id) {
              this.favoriteStoreIds.add(fav.targetId._id);
            }
          });
        }
      }
    });
  }

  isProductFavorite(productId: string): boolean {
    return this.favoriteProductIds.has(productId);
  }

  isStoreFavorite(storeId: string): boolean {
    return this.favoriteStoreIds.has(storeId);
  }

  toggleProductFavorite(productId: string, event: Event): void {
    event.stopPropagation();

    let userId = this.currentUser?.id || this.currentUser?._id;
    if (!userId) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        userId = parsed.id || parsed._id;
      }
    }

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.isProductFavorite(productId)) {
      this.favoriteService.removeFavorite(userId, productId, 'Product').subscribe({
        next: () => {
          this.favoriteProductIds.delete(productId);
        },
        error: (err) => console.error('Error removing favorite:', err)
      });
    } else {
      this.favoriteService.addFavorite(userId, productId, 'Product').subscribe({
        next: () => {
          this.favoriteProductIds.add(productId);
        },
        error: (err) => console.error('Error adding favorite:', err)
      });
    }
  }

  toggleStoreFavorite(storeId: string, event: Event): void {
    event.stopPropagation();

    let userId = this.currentUser?.id || this.currentUser?._id;
    if (!userId) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        userId = parsed.id || parsed._id;
      }
    }

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.isStoreFavorite(storeId)) {
      this.favoriteService.removeFavorite(userId, storeId, 'Store').subscribe({
        next: () => {
          this.favoriteStoreIds.delete(storeId);
        },
        error: (err) => console.error('Error removing favorite:', err)
      });
    } else {
      this.favoriteService.addFavorite(userId, storeId, 'Store').subscribe({
        next: () => {
          this.favoriteStoreIds.add(storeId);
        },
        error: (err) => console.error('Error adding favorite:', err)
      });
    }
  }

  getProductImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${environment.apiUrl.replace('/api', '')}/uploads/${imagePath}`;
  }

  getStoreImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${environment.apiUrl.replace('/api', '')}/uploads/${imagePath}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  calculateDiscount(product: any): number {
    if (!product.promotion?.isOnSale || !product.promotion.discountPrice) return 0;
    return Math.round((1 - product.promotion.discountPrice / product.price) * 100);
  }

  loadProducts(): void {
    this.loadingProducts = true;
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.products = response.data || [];
          this.loadStoreNames();
          this.applyFilters();
        }
        this.loadingProducts = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.loadingProducts = false;
      }
    });
  }

  loadStoreNames(): void {
    this.products.forEach(product => {
      if (product.storeId) {
        this.storeService.getStore(product.storeId).subscribe({
          next: (response: any) => {
            if (response.success) {
              product.storeName = response.data.name;
            }
          }
        });
      }
    });
  }

  loadStores(): void {
    this.loadingStores = true;
    this.storeService.getStores().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.stores = response.data || [];
          this.filteredStores = [...this.stores];
        }
        this.loadingStores = false;
      },
      error: (error: any) => {
        console.error('Error loading stores:', error);
        this.loadingStores = false;
      }
    });
  }

  onSearchProducts(): void {
    this.applyFilters();
  }

  onSearchStores(): void {
    this.applyStoreFilters();
  }

  applyStoreFilters(): void {
    if (!this.stores || this.stores.length === 0) {
      this.filteredStores = [];
      return;
    }

    let filtered = [...this.stores];

    if (this.searchQueryStores && this.searchQueryStores.trim()) {
      const query = this.searchQueryStores.toLowerCase().trim();
      filtered = filtered.filter(s =>
        (s.name && s.name.toLowerCase().includes(query)) ||
        (s.category && s.category.toLowerCase().includes(query)) ||
        (s.description && s.description.toLowerCase().includes(query))
      );
    }

    this.filteredStores = filtered;
  }

  filterByCategory(category: string): void {
    this.filters.category = category;
    this.applyFilters();
  }

  applyFilters(): void {
    if (!this.products || this.products.length === 0) {
      this.filteredProducts = [];
      return;
    }

    let filtered = [...this.products];

    // Search filter for products
    if (this.searchQueryProducts && this.searchQueryProducts.trim()) {
      const query = this.searchQueryProducts.toLowerCase().trim();
      filtered = filtered.filter(p =>
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.storeName && p.storeName.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (this.filters.category) {
      const filterCat = this.filters.category.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.category && p.category.toLowerCase().trim() === filterCat
      );
    }

    // Price filter
    if (this.filters.minPrice !== null && this.filters.minPrice !== undefined) {
      filtered = filtered.filter(p => {
        const price = p.promotion?.isOnSale ? p.promotion.discountPrice : p.price;
        return price >= this.filters.minPrice!;
      });
    }
    if (this.filters.maxPrice !== null && this.filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => {
        const price = p.promotion?.isOnSale ? p.promotion.discountPrice : p.price;
        return price <= this.filters.maxPrice!;
      });
    }

    // Promotion filter
    if (this.filters.promotionOnly) {
      filtered = filtered.filter(p => p.promotion?.isOnSale === true);
    }

    // Stock filter
    if (this.filters.inStockOnly) {
      filtered = filtered.filter(p => p.stockStatus === 'disponible');
    }

    // Sort
    filtered.sort((a, b) => {
      switch (this.filters.sort) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'price_asc':
          const priceA = a.promotion?.isOnSale ? a.promotion.discountPrice : a.price;
          const priceB = b.promotion?.isOnSale ? b.promotion.discountPrice : b.price;
          return priceA - priceB;
        case 'price_desc':
          const priceA2 = a.promotion?.isOnSale ? a.promotion.discountPrice : a.price;
          const priceB2 = b.promotion?.isOnSale ? b.promotion.discountPrice : b.price;
          return priceB2 - priceA2;
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    this.filteredProducts = filtered;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  resetFilters(): void {
    this.searchQueryProducts = '';
    this.searchQueryStores = '';
    this.filters = {
      category: '',
      minPrice: null,
      maxPrice: null,
      promotionOnly: false,
      inStockOnly: false,
      sort: 'name_asc'
    };
    this.applyFilters();
    this.applyStoreFilters();
  }

  get paginatedProducts(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProducts.slice(start, end);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  viewProductDetail(product: any): void {
    this.router.navigate(['/catalog/product', product._id]);
  }

  viewStoreDetail(store: any): void {
    this.router.navigate(['/catalog/store', store._id]);
  }

  addToCart(product: any, event: Event): void {
    event.stopPropagation();
    if (product.stockStatus === 'rupture') {
      alert('Produit en rupture de stock');
      return;
    }
    this.cartService.addToCart(product);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
