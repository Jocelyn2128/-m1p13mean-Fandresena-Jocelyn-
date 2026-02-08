import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StoreService } from '../../../services/store.service';
import { AuthService } from '../../../services/auth.service';
import { Store } from '../../../models/store.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-my-stores',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
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
        <div *ngFor="let store of stores" class="mall-card hover:shadow-lg transition-shadow">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-store text-blue-600 text-xl"></i>
            </div>
            <span [class]="getStatusBadgeClass(store)">
              {{ getStatusLabel(store) }}
            </span>
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ store.name }}</h3>
          <p class="text-sm text-gray-500 mb-3">{{ store.category }} • Étage {{ store.location?.floor }} • Local {{ store.location?.shopNumber }}</p>
          
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

    <!-- Create Store Modal -->
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

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
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

    this.storeService.getStores({ ownerId: this.currentUser?._id }).subscribe({
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
    if (store.status === 'pending_approval') {
      return 'badge badge-warning';
    } else if (store.status === 'active') {
      return 'badge badge-success';
    } else if (store.status === 'suspended') {
      return 'badge badge-danger';
    }
    return 'badge';
  }

  getStatusLabel(store: Store): string {
    if (store.status === 'pending_approval') {
      return 'En attente';
    } else if (store.status === 'active') {
      return 'Active';
    } else if (store.status === 'suspended') {
      return 'Suspendue';
    }
    return store.status || 'Inconnu';
  }

  openCreateModal(): void {
    this.storeForm.reset({
      floor: 'RDC',
      openingHours: '9h00 - 18h00'
    });
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
}
