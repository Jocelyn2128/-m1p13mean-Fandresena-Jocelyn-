import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { Product } from '../../../models/product.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-inventory-management',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Gestion des Stocks</h2>
        <button (click)="openAddModal()" class="btn-primary">
          <i class="fas fa-plus mr-2"></i>
          Nouveau Produit
        </button>
      </div>
    </header>

    <div class="p-8">
          <!-- Alert Messages -->
          <div *ngIf="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-green-700">{{ successMessage }}</p>
          </div>
          <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-700">{{ errorMessage }}</p>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="mall-card">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                  <i class="fas fa-box text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-600">Total Produits</p>
                  <p class="text-2xl font-bold text-gray-800">{{ products.length }}</p>
                </div>
              </div>
            </div>

            <div class="mall-card">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100 text-green-600">
                  <i class="fas fa-check-circle text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-600">En Stock</p>
                  <p class="text-2xl font-bold text-gray-800">{{ inStockCount }}</p>
                </div>
              </div>
            </div>

            <div class="mall-card">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <i class="fas fa-exclamation-triangle text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-600">Stock Bas</p>
                  <p class="text-2xl font-bold text-gray-800">{{ lowStockCount }}</p>
                </div>
              </div>
            </div>

            <div class="mall-card">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-red-100 text-red-600">
                  <i class="fas fa-times-circle text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-600">Rupture</p>
                  <p class="text-2xl font-bold text-gray-800">{{ outOfStockCount }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="mall-card mb-6">
            <div class="flex flex-wrap gap-4">
              <div class="flex-1 min-w-[200px]">
                <input 
                  type="text" 
                  [(ngModel)]="searchQuery"
                  (input)="filterProducts()"
                  placeholder="Rechercher un produit..."
                  class="form-input"
                >
              </div>
              <select [(ngModel)]="categoryFilter" (change)="filterProducts()" class="form-input w-auto">
                <option value="">Toutes les catégories</option>
                <option value="electronique">Électronique</option>
                <option value="mode">Mode</option>
                <option value="sport">Sport</option>
                <option value="maison">Maison</option>
                <option value="alimentaire">Alimentaire</option>
              </select>
              <select [(ngModel)]="stockFilter" (change)="filterProducts()" class="form-input w-auto">
                <option value="">Tous les stocks</option>
                <option value="disponible">Disponible</option>
                <option value="rupture">Rupture</option>
                <option value="low">Stock Bas</option>
              </select>
            </div>
          </div>

          <!-- Products Table -->
          <div class="mall-card">
            <div *ngIf="loading" class="text-center py-8">
              <i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
              <p class="mt-2 text-gray-500">Chargement des produits...</p>
            </div>

            <div *ngIf="!loading && filteredProducts.length === 0" class="text-center py-8 text-gray-500">
              <i class="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
              <p>Aucun produit trouvé</p>
            </div>

            <div *ngIf="!loading && filteredProducts.length > 0" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr *ngFor="let product of filteredProducts" class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                          <i class="fas fa-image text-gray-400"></i>
                        </div>
                        <div>
                          <p class="font-medium text-gray-900">{{ product.name }}</p>
                          <p class="text-sm text-gray-500">{{ product.description | slice:0:50 }}...</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ product.category }}</td>
                    <td class="px-6 py-4 text-sm font-medium">{{ product.price | number }} MGA</td>
                    <td class="px-6 py-4 text-sm">{{ product.stockQuantity }}</td>
                    <td class="px-6 py-4">
                      <span [class]="getStockBadgeClass(product)">
                        {{ getStockStatusLabel(product) }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex space-x-2">
                        <button (click)="openEditModal(product)" class="text-blue-600 hover:text-blue-800">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button (click)="deleteProduct(product._id!)" class="text-red-600 hover:text-red-800">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>

    <!-- Add/Edit Product Modal -->
    <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold">{{ editingProduct ? 'Modifier le Produit' : 'Nouveau Produit' }}</h3>
        </div>
        
        <form [formGroup]="productForm" (ngSubmit)="saveProduct()" class="p-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="form-label">Nom du produit</label>
              <input type="text" formControlName="name" class="form-input">
            </div>
            
            <div class="col-span-2">
              <label class="form-label">Description</label>
              <textarea formControlName="description" rows="3" class="form-input"></textarea>
            </div>
            
            <div>
              <label class="form-label">Catégorie</label>
              <select formControlName="category" class="form-input">
                <option value="">Sélectionner...</option>
                <option value="electronique">Électronique</option>
                <option value="mode">Mode</option>
                <option value="sport">Sport</option>
                <option value="maison">Maison</option>
                <option value="alimentaire">Alimentaire</option>
              </select>
            </div>
            
            <div>
              <label class="form-label">Prix (MGA)</label>
              <input type="number" formControlName="price" class="form-input">
            </div>
            
            <div>
              <label class="form-label">Quantité en stock</label>
              <input type="number" formControlName="stockQuantity" class="form-input">
            </div>
            
            <div>
              <label class="form-label">Seuil d'alerte stock bas</label>
              <input type="number" formControlName="lowStockThreshold" class="form-input">
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" (click)="closeModal()" class="btn-secondary">Annuler</button>
            <button type="submit" [disabled]="productForm.invalid || saving" class="btn-primary">
              <span *ngIf="!saving">{{ editingProduct ? 'Modifier' : 'Créer' }}</span>
              <span *ngIf="saving">Enregistrement...</span>
            </button>
          </div>
        </form>
      </div>
  `,
  styles: [``]
})
export class InventoryManagementComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  currentUser: User | null = null;
  storeId: string = '';
  loading = false;
  saving = false;
  showModal = false;
  editingProduct: Product | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  
  searchQuery = '';
  categoryFilter = '';
  stockFilter = '';

  productForm: FormGroup;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      lowStockThreshold: [5, [Validators.required, Validators.min(1)]]
    });

    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storeId = params['id'];
      if (this.storeId) {
        this.loadProducts();
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = null;
    
    this.productService.getProducts({ storeId: this.storeId }).subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data;
          this.filterProducts();
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des produits';
        this.loading = false;
        console.error('Error loading products:', error);
      }
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchQuery || 
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesCategory = !this.categoryFilter || product.category === this.categoryFilter;
      
      let matchesStock = true;
      if (this.stockFilter === 'disponible') {
        matchesStock = product.stockStatus === 'disponible';
      } else if (this.stockFilter === 'rupture') {
        matchesStock = product.stockStatus === 'rupture';
      } else if (this.stockFilter === 'low') {
        matchesStock = this.isLowStock(product);
      }
      
      return matchesSearch && matchesCategory && matchesStock;
    });
  }

  isLowStock(product: Product): boolean {
    return (product.stockQuantity || 0) <= (product.lowStockThreshold || 5) && (product.stockQuantity || 0) > 0;
  }

  getStockBadgeClass(product: Product): string {
    if (product.stockStatus === 'rupture') {
      return 'badge badge-danger';
    } else if (this.isLowStock(product)) {
      return 'badge badge-warning';
    }
    return 'badge badge-success';
  }

  getStockStatusLabel(product: Product): string {
    if (product.stockStatus === 'rupture') {
      return 'Rupture';
    } else if (this.isLowStock(product)) {
      return 'Stock Bas';
    }
    return 'Disponible';
  }

  get inStockCount(): number {
    return this.products.filter(p => p.stockStatus === 'disponible').length;
  }

  get lowStockCount(): number {
    return this.products.filter(p => this.isLowStock(p)).length;
  }

  get outOfStockCount(): number {
    return this.products.filter(p => p.stockStatus === 'rupture').length;
  }

  openAddModal(): void {
    this.editingProduct = null;
    this.productForm.reset({
      price: 0,
      stockQuantity: 0,
      lowStockThreshold: 5
    });
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.editingProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stockQuantity: product.stockQuantity,
      lowStockThreshold: product.lowStockThreshold
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingProduct = null;
    this.productForm.reset();
  }

  saveProduct(): void {
    if (this.productForm.invalid) return;

    this.saving = true;
    this.errorMessage = null;
    this.successMessage = null;

    const productData = {
      ...this.productForm.value,
      storeId: this.storeId
    };

    if (this.editingProduct?._id) {
      this.productService.updateProduct(this.editingProduct._id, productData).subscribe({
        next: () => {
          this.successMessage = 'Produit modifié avec succès';
          this.saving = false;
          this.closeModal();
          this.loadProducts();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la modification du produit';
          this.saving = false;
          console.error('Error updating product:', error);
        }
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.successMessage = 'Produit créé avec succès';
          this.saving = false;
          this.closeModal();
          this.loadProducts();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la création du produit';
          this.saving = false;
          console.error('Error creating product:', error);
        }
      });
    }
  }

  deleteProduct(productId: string): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    this.errorMessage = null;
    this.successMessage = null;

    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.successMessage = 'Produit supprimé avec succès';
        this.loadProducts();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la suppression du produit';
        console.error('Error deleting product:', error);
      }
    });
  }
}