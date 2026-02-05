import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { StoreService } from '../../services/store.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
              <div class="relative">
                <input 
                  type="text" 
                  placeholder="Rechercher..."
                  class="form-input w-64"
                >
                <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
              </div>
              
              <button class="relative p-2 text-gray-600 hover:text-blue-600">
                <i class="fas fa-shopping-cart text-xl"></i>
                <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>

              <div *ngIf="currentUser; else loginBtn" class="flex items-center space-x-2">
                <span class="text-sm text-gray-700">{{ currentUser.firstName }}</span>
                <button (click)="logout()" class="text-sm text-red-600 hover:text-red-700">
                  Déconnexion
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

      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 class="text-4xl font-bold mb-4">Bienvenue sur MallConnect</h2>
          <p class="text-xl text-blue-100">Découvrez les meilleures boutiques et produits de votre centre commercial</p>
        </div>
      </div>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Categories -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4">Catégories</h3>
          <div class="flex space-x-3 overflow-x-auto pb-2">
            <button class="px-6 py-2 bg-blue-600 text-white rounded-full whitespace-nowrap">
              Tous
            </button>
            <button class="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-full whitespace-nowrap hover:bg-gray-50">
              Mode
            </button>
            <button class="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-full whitespace-nowrap hover:bg-gray-50">
              Électronique
            </button>
            <button class="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-full whitespace-nowrap hover:bg-gray-50">
              Alimentation
            </button>
            <button class="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-full whitespace-nowrap hover:bg-gray-50">
              Maison
            </button>
          </div>
        </div>

        <!-- Products Grid -->
        <div>
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold">Produits en vedette</h3>
            <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">
              Voir tout <i class="fas fa-arrow-right ml-1"></i>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Product Card Placeholder -->
            <div class="mall-card p-0 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" *ngFor="let i of [1,2,3,4]">
              <div class="h-48 bg-gray-200 flex items-center justify-center">
                <i class="fas fa-image text-gray-400 text-4xl"></i>
              </div>
              <div class="p-4">
                <span class="text-xs text-blue-600 font-medium">Catégorie</span>
                <h4 class="font-semibold text-gray-900 mt-1">Nom du produit</h4>
                <p class="text-sm text-gray-500 mb-2">Boutique exemple</p>
                <div class="flex justify-between items-center">
                  <span class="text-lg font-bold text-gray-900">50,000 Ar</span>
                  <button class="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stores Section -->
        <div class="mt-12">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold">Nos boutiques</h3>
            <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">
              Voir tout <i class="fas fa-arrow-right ml-1"></i>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Store Card Placeholder -->
            <div class="mall-card p-0 overflow-hidden" *ngFor="let i of [1,2,3]">
              <div class="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <div class="p-6">
                <div class="flex items-center -mt-12 mb-4">
                  <div class="h-20 w-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
                    <i class="fas fa-store text-3xl text-gray-400"></i>
                  </div>
                </div>
                <h4 class="font-semibold text-lg">Nom de la boutique</h4>
                <p class="text-gray-500 text-sm mb-3">Catégorie • Étage 1</p>
                <p class="text-gray-600 text-sm mb-4">Description courte de la boutique...</p>
                <button class="w-full btn-secondary text-sm">
                  Visiter la boutique
                </button>
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
  styles: [``]
})
export class CatalogComponent implements OnInit {
  currentUser: User | null = null;
  products: any[] = [];
  stores: any[] = [];

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private storeService: StoreService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadStores();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.products = response.data;
        }
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
      }
    });
  }

  loadStores(): void {
    this.storeService.getStores().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.stores = response.data;
        }
      },
      error: (error: any) => {
        console.error('Error loading stores:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
