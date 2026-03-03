import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreService } from '../../../services/store.service';
import { AuthService } from '../../../services/auth.service';
import { UploadService } from '../../../services/upload.service';
import { Store } from '../../../models/store.model';
import { User } from '../../../models/user.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-stores',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Mes Boutiques</h2>
        <button (click)="openCreateModal()" class="btn-primary">
          <i class="fas fa-plus mr-2"></i>
          Nouvelle Boutique
        </button>
      </div>
    </header>

    <div class="p-8">
      <!-- Messages -->
      <div *ngIf="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-green-700">{{ successMessage }}</p>
      </div>
      <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700">{{ errorMessage }}</p>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-8">
        <i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
        <p class="mt-2 text-gray-500">Chargement de vos boutiques...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && stores.length === 0" class="text-center py-12">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-store text-3xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune boutique</h3>
        <p class="text-gray-500 mb-6">Vous n'avez pas encore créé de boutique.</p>
        <button (click)="openCreateModal()" class="btn-primary">
          <i class="fas fa-plus mr-2"></i>
          Créer ma première boutique
        </button>
      </div>

      <!-- Stores Grid -->
      <div *ngIf="!loading && stores.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let store of stores" class="mall-card hover:shadow-lg transition-shadow overflow-hidden">

          <!-- Image de couverture -->
          <div class="relative -mx-6 -mt-6 mb-4 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
            <img
              *ngIf="store.coverImage"
              [src]="getStoreImageUrl(store.coverImage)"
              [alt]="store.name + ' cover'"
              class="w-full h-full object-cover"
              (error)="onImgError($event)"
            >
            <div *ngIf="!store.coverImage" class="w-full h-full flex items-center justify-center">
              <i class="fas fa-store text-4xl text-blue-300"></i>
            </div>
            <!-- Bouton changer couverture -->
            <button
              *ngIf="store.isApproved"
              (click)="openStoreImageModal(store, 'cover')"
              class="absolute top-2 right-2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white text-xs px-2 py-1 rounded-lg transition-all"
              title="Changer l'image de couverture"
            >
              <i class="fas fa-camera mr-1"></i>Cover
            </button>
          </div>

          <div class="flex items-start justify-between mb-3">
            <!-- Logo -->
            <div class="relative">
              <div class="w-14 h-14 rounded-xl overflow-hidden bg-blue-100 flex items-center justify-center border-2 border-white shadow">
                <img
                  *ngIf="store.logo"
                  [src]="getStoreImageUrl(store.logo)"
                  [alt]="store.name + ' logo'"
                  class="w-full h-full object-cover"
                  (error)="onImgError($event)"
                >
                <i *ngIf="!store.logo" class="fas fa-store text-blue-600 text-xl"></i>
              </div>
              <!-- Bouton modifier logo -->
              <button
                *ngIf="store.isApproved"
                (click)="openStoreImageModal(store, 'logo')"
                class="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center text-xs transition-all"
                title="Changer le logo"
              >
                <i class="fas fa-pen" style="font-size:8px"></i>
              </button>
            </div>

            <span [class]="getStatusBadgeClass(store)">
              {{ getStatusLabel(store) }}
            </span>
          </div>

          <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ store.name }}</h3>
          <p class="text-sm text-gray-500 mb-3">{{ store.category }} • Étage {{ store.location.floor }} • Local {{ store.location.shopNumber }}</p>

          <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ store.description }}</p>

          <div class="flex flex-wrap gap-2">
            <button
              *ngIf="store.isApproved"
              (click)="goToPos(store._id!)"
              class="flex-1 btn-primary text-sm"
            >
              <i class="fas fa-shopping-cart mr-1"></i>
              Vente
            </button>
            <button
              *ngIf="store.isApproved"
              (click)="manageProducts(store._id!)"
              class="flex-1 btn-secondary text-sm"
            >
              <i class="fas fa-box mr-1"></i>
              Produits
            </button>
            <button
              *ngIf="store.isApproved"
              (click)="manageCashiers(store._id!)"
              class="flex-1 btn-secondary text-sm"
            >
              <i class="fas fa-cash-register mr-1"></i>
              Caisses
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MODAL CRÉER BOUTIQUE ===== -->
    <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold">Créer une nouvelle boutique</h3>
        </div>

        <form [formGroup]="storeForm" (ngSubmit)="createStore()" class="p-6">
          <div class="space-y-4">
            <div>
              <label class="form-label">Nom de la boutique</label>
              <input type="text" formControlName="name" class="form-input" placeholder="Ma Boutique">
            </div>

            <div>
              <label class="form-label">Catégorie</label>
              <select formControlName="category" class="form-input">
                <option value="">Sélectionnez une catégorie</option>
                <option value="mode">Mode & Vêtements</option>
                <option value="electronique">Électronique</option>
                <option value="alimentation">Alimentation</option>
                <option value="maison">Maison & Déco</option>
                <option value="sport">Sport</option>
                <option value="beaute">Beauté & Bien-être</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label class="form-label">Description</label>
              <textarea formControlName="description" rows="3" class="form-input" placeholder="Décrivez votre boutique..."></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Étage</label>
                <select formControlName="floor" class="form-input">
                  <option value="RDC">RDC</option>
                  <option value="1">1er étage</option>
                  <option value="2">2ème étage</option>
                  <option value="3">3ème étage</option>
                </select>
              </div>
              <div>
                <label class="form-label">N° Local</label>
                <input type="text" formControlName="shopNumber" class="form-input" placeholder="A-12">
              </div>
            </div>

            <div>
              <label class="form-label">Horaires d'ouverture</label>
              <input type="text" formControlName="openingHours" class="form-input" placeholder="9h00 - 18h00">
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" (click)="closeModal()" class="btn-secondary">Annuler</button>
            <button type="submit" [disabled]="storeForm.invalid || saving" class="btn-primary">
              <span *ngIf="!saving">Créer la boutique</span>
              <span *ngIf="saving">Création...</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ===== MODAL IMAGE BOUTIQUE (logo / couverture) ===== -->
    <div *ngIf="showStoreImageModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md m-4">
        <!-- Header -->
        <div class="p-5 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800">
            <i class="fas fa-camera text-indigo-500 mr-2"></i>
            {{ storeImageType === 'logo' ? 'Logo de la boutique' : 'Image de couverture' }}
          </h3>
          <button (click)="closeStoreImageModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div class="p-5 space-y-5">
          <!-- Messages -->
          <div *ngIf="storeImageSuccess" class="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            <i class="fas fa-check-circle mr-2"></i>{{ storeImageSuccess }}
          </div>
          <div *ngIf="storeImageError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <i class="fas fa-exclamation-circle mr-2"></i>{{ storeImageError }}
          </div>

          <!-- Image actuelle -->
          <div>
            <p class="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Image actuelle</p>
            <div class="rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center"
                 [class.h-28]="storeImageType === 'logo'"
                 [class.h-44]="storeImageType === 'cover'">
              <img
                *ngIf="currentStoreImage"
                [src]="getStoreImageUrl(currentStoreImage)"
                alt="Image actuelle"
                class="w-full h-full object-cover"
                [class.max-w-28]="storeImageType === 'logo'"
                (error)="onImgError($event)"
              >
              <div *ngIf="!currentStoreImage" class="text-center text-gray-400">
                <i class="fas fa-image text-3xl mb-1"></i>
                <p class="text-xs">Aucune image</p>
              </div>
            </div>
          </div>

          <!-- Zone upload -->
          <div>
            <p class="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Nouvelle image</p>
            <label class="block border-2 border-dashed border-indigo-300 rounded-xl p-5 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                   [class.border-indigo-500]="storeImagePreview"
                   [class.bg-indigo-50]="storeImagePreview">
              <input
                type="file"
                accept="image/*"
                (change)="onStoreImageSelected($event)"
                class="hidden"
              >
              <div *ngIf="!storeImagePreview">
                <i class="fas fa-cloud-upload-alt text-3xl text-indigo-400 mb-2"></i>
                <p class="text-sm font-medium text-gray-700">Cliquez pour choisir une image</p>
                <p class="text-xs text-gray-500 mt-1">JPEG, PNG, WebP • Max 5MB</p>
              </div>
              <div *ngIf="storeImagePreview">
                <img [src]="storeImagePreview" alt="Aperçu"
                     class="mx-auto rounded-lg object-cover max-h-32">
                <p class="text-xs text-indigo-600 mt-2">{{ storeSelectedFile?.name }}</p>
              </div>
            </label>
          </div>

          <!-- Bouton upload -->
          <button
            *ngIf="storeSelectedFile"
            (click)="uploadStoreImage()"
            [disabled]="uploadingStoreImage"
            class="w-full btn-primary flex items-center justify-center gap-2"
          >
            <i *ngIf="!uploadingStoreImage" class="fas fa-upload"></i>
            <i *ngIf="uploadingStoreImage" class="fas fa-spinner fa-spin"></i>
            <span>{{ uploadingStoreImage ? 'Envoi...' : 'Enregistrer' }}</span>
          </button>
        </div>

        <div class="px-5 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button (click)="closeStoreImageModal()" class="btn-secondary">Fermer</button>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class MyStoresComponent implements OnInit {
  stores: Store[] = [];
  currentUser: User | null = null;
  loading = false;
  saving = false;
  showModal = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  storeForm: FormGroup;

  // Gestion images boutique
  showStoreImageModal = false;
  selectedStore: Store | null = null;
  storeImageType: 'logo' | 'cover' = 'logo';
  storeSelectedFile: File | null = null;
  storeImagePreview: string | null = null;
  currentStoreImage: string | null = null;
  uploadingStoreImage = false;
  storeImageSuccess: string | null = null;
  storeImageError: string | null = null;

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    private uploadService: UploadService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.storeForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      floor: ['RDC', Validators.required],
      shopNumber: ['', Validators.required],
      openingHours: ['9h00 - 18h00', Validators.required]
    });

    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.loadStores();
  }

  loadStores(): void {
    this.loading = true;
    this.errorMessage = null;

    this.storeService.getMyStores().subscribe({
      next: (response) => {
        if (response.success) {
          this.stores = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement de vos boutiques';
        this.loading = false;
        console.error('Error loading stores:', error);
      }
    });
  }

  getStatusBadgeClass(store: Store): string {
    if (store.status === 'pending_approval') return 'badge badge-warning';
    if (store.status === 'active') return 'badge badge-success';
    if (store.status === 'suspended') return 'badge badge-danger';
    return 'badge';
  }

  getStatusLabel(store: Store): string {
    if (store.status === 'pending_approval') return 'En attente';
    if (store.status === 'active') return 'Active';
    if (store.status === 'suspended') return 'Suspendue';
    return store.status || 'Inconnu';
  }

  openCreateModal(): void {
    this.storeForm.reset({ floor: 'RDC', openingHours: '9h00 - 18h00' });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  createStore(): void {
    if (this.storeForm.invalid) return;

    this.saving = true;
    this.errorMessage = null;
    this.successMessage = null;

    const storeData = {
      name: this.storeForm.value.name,
      category: this.storeForm.value.category,
      description: this.storeForm.value.description,
      location: {
        floor: this.storeForm.value.floor,
        shopNumber: this.storeForm.value.shopNumber
      },
      openingHours: this.storeForm.value.openingHours
    };

    this.storeService.createStore(storeData).subscribe({
      next: () => {
        this.successMessage = 'Boutique créée avec succès. Elle sera visible après validation par un administrateur.';
        this.saving = false;
        this.closeModal();
        this.loadStores();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la création de la boutique';
        this.saving = false;
        console.error('Error creating store:', error);
      }
    });
  }

  goToPos(storeId: string): void {
    this.router.navigate(['/pos', storeId]);
  }

  manageProducts(storeId: string): void {
    this.router.navigate(['/boutique/store', storeId, 'products']);
  }

  manageCashiers(storeId: string): void {
    this.router.navigate(['/boutique/store', storeId, 'cashiers']);
  }

  // =============================================
  // GESTION DES IMAGES BOUTIQUE
  // =============================================

  openStoreImageModal(store: Store, type: 'logo' | 'cover'): void {
    this.selectedStore = store;
    this.storeImageType = type;
    this.currentStoreImage = type === 'logo' ? (store.logo || null) : (store.coverImage || null);
    this.storeSelectedFile = null;
    this.storeImagePreview = null;
    this.storeImageSuccess = null;
    this.storeImageError = null;
    this.showStoreImageModal = true;
  }

  closeStoreImageModal(): void {
    this.showStoreImageModal = false;
    this.selectedStore = null;
    this.storeSelectedFile = null;
    this.storeImagePreview = null;
    this.storeImageSuccess = null;
    this.storeImageError = null;
  }

  onStoreImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      this.storeImageError = 'Le fichier dépasse la limite de 5MB';
      return;
    }

    this.storeSelectedFile = file;
    this.storeImageError = null;

    // Aperçu
    const reader = new FileReader();
    reader.onload = (e) => {
      this.storeImagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  uploadStoreImage(): void {
    if (!this.selectedStore?._id || !this.storeSelectedFile) return;

    this.uploadingStoreImage = true;
    this.storeImageSuccess = null;
    this.storeImageError = null;

    const upload$ = this.storeImageType === 'logo'
      ? this.uploadService.uploadStoreLogo(this.selectedStore._id, this.storeSelectedFile)
      : this.uploadService.uploadStoreCover(this.selectedStore._id, this.storeSelectedFile);

    upload$.subscribe({
      next: (response) => {
        this.uploadingStoreImage = false;
        if (response.success) {
          this.storeImageSuccess = response.message || 'Image mise à jour avec succès';
          // Mettre à jour localement
          const newUrl = this.storeImageType === 'logo' ? response.data.logo : response.data.coverImage;
          this.currentStoreImage = newUrl;
          this.storeImagePreview = null;
          this.storeSelectedFile = null;
          // Recharger la liste
          this.loadStores();
        }
      },
      error: (error) => {
        this.uploadingStoreImage = false;
        this.storeImageError = error.error?.message || 'Erreur lors de l\'upload';
        console.error('Upload store image error:', error);
      }
    });
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  getStoreImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/uploads/${imagePath}`;
  }
}
