import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { UploadService } from '../../../services/upload.service';
import { Product } from '../../../models/product.model';
import { User } from '../../../models/user.model';
import { environment } from '../../../../environments/environment';

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
            <option value="alimentation">Alimentation</option>
            <option value="beaute">Beauté</option>
            <option value="autre">Autre</option>
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Images</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngFor="let product of filteredProducts" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <!-- Miniature image ou placeholder -->
                    <div class="w-10 h-10 rounded-lg overflow-hidden mr-3 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                      <img
                        *ngIf="product.images && product.images.length > 0"
                        [src]="getProductImageUrl(product.images[0])"
                        [alt]="product.name"
                        class="w-full h-full object-cover"
                        (error)="onImgError($event)"
                      >
                      <i *ngIf="!product.images || product.images.length === 0" class="fas fa-image text-gray-400"></i>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">{{ product.name }}</p>
                      <p class="text-sm text-gray-500">{{ (product.description || '') | slice:0:50 }}{{ (product.description?.length || 0) > 50 ? '...' : '' }}</p>
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
                <td class="px-6 py-4 text-sm text-gray-500">
                  <button
                    (click)="openImageModal(product)"
                    class="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <i class="fas fa-images"></i>
                    <span>{{ product.images?.length || 0 }} photo(s)</span>
                  </button>
                </td>
                <td class="px-6 py-4">
                  <div class="flex space-x-2">
                    <button (click)="openEditModal(product)" class="text-blue-600 hover:text-blue-800" title="Modifier">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button (click)="deleteProduct(product._id!)" class="text-red-600 hover:text-red-800" title="Supprimer">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===== MODAL AJOUT/ÉDITION PRODUIT ===== -->
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
                <option value="alimentation">Alimentation</option>
                <option value="beaute">Beauté</option>
                <option value="autre">Autre</option>
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
    </div>

    <!-- ===== MODAL GESTION DES IMAGES PRODUIT ===== -->
    <div *ngIf="showImageModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">
              <i class="fas fa-images text-indigo-500 mr-2"></i>
              Images du produit
            </h3>
            <p class="text-sm text-gray-500 mt-1">{{ selectedProduct?.name }}</p>
          </div>
          <button (click)="closeImageModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Message image modal -->
          <div *ngIf="imageSuccess" class="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            <i class="fas fa-check-circle mr-2"></i>{{ imageSuccess }}
          </div>
          <div *ngIf="imageError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <i class="fas fa-exclamation-circle mr-2"></i>{{ imageError }}
          </div>

          <!-- Images actuelles -->
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Images actuelles ({{ selectedProduct?.images?.length || 0 }}/5)
            </h4>
            <div *ngIf="!selectedProduct?.images?.length"
                 class="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <i class="fas fa-image text-4xl text-gray-300 mb-2"></i>
              <p class="text-gray-500 text-sm">Aucune image pour ce produit</p>
            </div>
            <div *ngIf="selectedProduct?.images?.length"
                 class="grid grid-cols-3 gap-3">
              <div *ngFor="let img of selectedProduct?.images; let i = index"
                   class="relative group rounded-lg overflow-hidden aspect-square bg-gray-100">
                <img [src]="getProductImageUrl(img)" [alt]="'Image ' + (i+1)"
                     class="w-full h-full object-cover"
                     (error)="onImgError($event)">
                <!-- Overlay suppression -->
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                  <button
                    (click)="deleteProductImage(img)"
                    [disabled]="uploadingImages"
                    class="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
                    title="Supprimer cette image"
                  >
                    <i class="fas fa-trash text-xs"></i>
                  </button>
                </div>
                <div class="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                  {{ i === 0 ? 'Principale' : '#' + (i+1) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Zone d'upload -->
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Ajouter / Remplacer des images
            </h4>

            <!-- Zone drag & drop -->
            <label
              class="block border-2 border-dashed border-indigo-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
              [class.border-indigo-500]="selectedFiles.length > 0"
              [class.bg-indigo-50]="selectedFiles.length > 0"
            >
              <input
                type="file"
                multiple
                accept="image/*"
                (change)="onFilesSelected($event)"
                class="hidden"
                #fileInput
              >
              <i class="fas fa-cloud-upload-alt text-3xl text-indigo-400 mb-2"></i>
              <p class="text-sm font-medium text-gray-700">Cliquez pour sélectionner des images</p>
              <p class="text-xs text-gray-500 mt-1">JPEG, PNG, WebP • Max 5MB par image • Max 5 images</p>
            </label>

            <!-- Aperçu des fichiers sélectionnés -->
            <div *ngIf="selectedFiles.length > 0" class="mt-4">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-gray-700">
                  {{ selectedFiles.length }} fichier(s) sélectionné(s)
                </p>
                <button (click)="clearSelectedFiles()" class="text-xs text-red-500 hover:text-red-700">
                  <i class="fas fa-times mr-1"></i>Effacer
                </button>
              </div>
              <div class="grid grid-cols-4 gap-2">
                <div *ngFor="let preview of imagePreviews; let i = index"
                     class="relative rounded-lg overflow-hidden aspect-square bg-gray-100">
                  <img [src]="preview" [alt]="'Aperçu ' + (i+1)" class="w-full h-full object-cover">
                  <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 truncate">
                    {{ selectedFiles[i].name }}
                  </div>
                </div>
              </div>

              <!-- Mode d'upload -->
              <div class="mt-4 space-y-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="uploadMode" value="add" [(ngModel)]="uploadMode" class="text-indigo-600">
                  <span class="text-sm text-gray-700">
                    <strong>Ajouter</strong> aux images existantes
                  </span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="uploadMode" value="replace" [(ngModel)]="uploadMode" class="text-indigo-600">
                  <span class="text-sm text-gray-700">
                    <strong>Remplacer</strong> toutes les images existantes
                  </span>
                </label>
              </div>

              <!-- Bouton upload -->
              <button
                (click)="uploadProductImages()"
                [disabled]="uploadingImages"
                class="mt-4 w-full btn-primary flex items-center justify-center gap-2"
              >
                <i *ngIf="!uploadingImages" class="fas fa-upload"></i>
                <i *ngIf="uploadingImages" class="fas fa-spinner fa-spin"></i>
                <span>{{ uploadingImages ? 'Envoi en cours...' : 'Envoyer les images' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button (click)="closeImageModal()" class="btn-secondary">Fermer</button>
        </div>
      </div>
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

  // Gestion des images
  showImageModal = false;
  selectedProduct: Product | null = null;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  uploadingImages = false;
  uploadMode: 'add' | 'replace' = 'add';
  imageSuccess: string | null = null;
  imageError: string | null = null;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private uploadService: UploadService,
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
    if (product.stockStatus === 'rupture') return 'badge badge-danger';
    if (this.isLowStock(product)) return 'badge badge-warning';
    return 'badge badge-success';
  }

  getStockStatusLabel(product: Product): string {
    if (product.stockStatus === 'rupture') return 'Rupture';
    if (this.isLowStock(product)) return 'Stock Bas';
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
    this.productForm.reset({ price: 0, stockQuantity: 0, lowStockThreshold: 5 });
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

    const productData = { ...this.productForm.value, storeId: this.storeId };

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

  // =============================================
  // GESTION DES IMAGES
  // =============================================

  openImageModal(product: Product): void {
    this.selectedProduct = { ...product };
    this.clearSelectedFiles();
    this.imageSuccess = null;
    this.imageError = null;
    this.uploadMode = 'add';
    this.showImageModal = true;
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.selectedProduct = null;
    this.clearSelectedFiles();
    this.imageSuccess = null;
    this.imageError = null;
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    // Vérifier la limite de 5 images
    const currentCount = this.selectedProduct?.images?.length || 0;
    const maxNewFiles = this.uploadMode === 'replace' ? 5 : Math.max(0, 5 - currentCount);

    if (files.length > maxNewFiles) {
      this.imageError = `Vous pouvez ajouter au maximum ${maxNewFiles} image(s) supplémentaire(s). (Limite: 5 images par produit)`;
      return;
    }

    this.selectedFiles = files;
    this.imageError = null;

    // Générer les aperçus
    this.imagePreviews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviews.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  clearSelectedFiles(): void {
    this.selectedFiles = [];
    this.imagePreviews = [];
  }

  uploadProductImages(): void {
    if (!this.selectedProduct?._id || this.selectedFiles.length === 0) return;

    this.uploadingImages = true;
    this.imageSuccess = null;
    this.imageError = null;

    const upload$ = this.uploadMode === 'replace'
      ? this.uploadService.replaceProductImages(this.selectedProduct._id, this.selectedFiles)
      : this.uploadService.addProductImages(this.selectedProduct._id, this.selectedFiles);

    upload$.subscribe({
      next: (response) => {
        this.uploadingImages = false;
        if (response.success) {
          this.imageSuccess = response.message || 'Images mises à jour avec succès';
          // Mettre à jour le produit sélectionné localement
          if (this.selectedProduct) {
            this.selectedProduct.images = response.data.images;
          }
          this.clearSelectedFiles();
          // Mettre à jour la liste principale
          this.loadProducts();
        }
      },
      error: (error) => {
        this.uploadingImages = false;
        this.imageError = error.error?.message || 'Erreur lors de l\'upload des images';
        console.error('Upload error:', error);
      }
    });
  }

  deleteProductImage(imageUrl: string): void {
    if (!this.selectedProduct?._id) return;
    if (!confirm('Supprimer cette image ?')) return;

    this.uploadingImages = true;
    this.imageSuccess = null;
    this.imageError = null;

    this.uploadService.deleteProductImage(this.selectedProduct._id, imageUrl).subscribe({
      next: (response) => {
        this.uploadingImages = false;
        if (response.success) {
          this.imageSuccess = 'Image supprimée avec succès';
          if (this.selectedProduct) {
            this.selectedProduct.images = response.data.images;
          }
          this.loadProducts();
        }
      },
      error: (error) => {
        this.uploadingImages = false;
        this.imageError = error.error?.message || 'Erreur lors de la suppression';
        console.error('Delete image error:', error);
      }
    });
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  getProductImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/uploads/${imagePath}`;
  }
}