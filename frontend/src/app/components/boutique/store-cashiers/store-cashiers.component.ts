import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Store } from '../../../models/store.model';
import { StoreService } from '../../../services/store.service';

interface CashRegister {
  _id?: string;
  storeId: string;
  registerName: string;
  status: 'ouvert' | 'ferme' | 'maintenance';
  currentBalance: number;
  openingAmount?: number;
  openedAt?: string;
  closedAt?: string;
  openedBy?: { firstName: string; lastName: string };
}

@Component({
  selector: 'app-store-cashiers',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-4 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Gestion des Caisses</h2>
          <p *ngIf="store" class="text-sm text-gray-500">{{ store.name }}</p>
        </div>
        <button (click)="openCreateModal()" class="btn-primary">
          <i class="fas fa-plus mr-2"></i>
          Nouvelle Caisse
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

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="mall-card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <i class="fas fa-cash-register text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Total Caisses</p>
              <p class="text-2xl font-bold text-gray-800">{{ cashRegisters.length }}</p>
            </div>
          </div>
        </div>

        <div class="mall-card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <i class="fas fa-door-open text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Ouvertes</p>
              <p class="text-2xl font-bold text-gray-800">{{ openCount }}</p>
            </div>
          </div>
        </div>

        <div class="mall-card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-gray-100 text-gray-600">
              <i class="fas fa-door-closed text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Fermées</p>
              <p class="text-2xl font-bold text-gray-800">{{ closedCount }}</p>
            </div>
          </div>
        </div>

        <div class="mall-card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <i class="fas fa-tools text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">En maintenance</p>
              <p class="text-2xl font-bold text-gray-800">{{ maintenanceCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-8">
        <i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
        <p class="mt-2 text-gray-500">Chargement des caisses...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && cashRegisters.length === 0" class="text-center py-12">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-cash-register text-3xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune caisse</h3>
        <p class="text-gray-500 mb-6">Cette boutique n'a pas encore de caisse.</p>
        <button (click)="openCreateModal()" class="btn-primary">
          <i class="fas fa-plus mr-2"></i>
          Créer une caisse
        </button>
      </div>

      <!-- Cash Registers List -->
      <div *ngIf="!loading && cashRegisters.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let cash of cashRegisters" class="mall-card hover:shadow-lg transition-shadow">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-cash-register text-blue-600 text-xl"></i>
            </div>
            <span [class]="getStatusBadgeClass(cash)">
              {{ getStatusLabel(cash) }}
            </span>
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ cash.registerName }}</h3>
          
          <div class="bg-gray-50 rounded-lg p-3 mb-4">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-500">Solde actuel:</span>
              <span class="font-medium">{{ cash.currentBalance | number }} MGA</span>
            </div>
            <div *ngIf="cash.openedBy" class="flex justify-between text-sm">
              <span class="text-gray-500">Opérateur:</span>
              <span class="font-medium">{{ cash.openedBy.firstName }} {{ cash.openedBy.lastName }}</span>
            </div>
          </div>

          <div class="flex space-x-2">
            <button *ngIf="cash.status === 'ferme'" (click)="openOpenModal(cash)" class="flex-1 btn-success text-sm">
              <i class="fas fa-door-open mr-1"></i>
              Ouvrir
            </button>
            <button *ngIf="cash.status === 'ouvert'" (click)="closeCashier(cash._id!)" class="flex-1 btn-danger text-sm">
              <i class="fas fa-door-closed mr-1"></i>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Open Cash Register Modal -->
    <div *ngIf="showOpenModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md m-4">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold">Ouvrir la caisse</h3>
          <p *ngIf="selectedCashierForOpen" class="text-sm text-gray-500 mt-1">{{ selectedCashierForOpen.registerName }}</p>
        </div>
        
        <form [formGroup]="openCashierForm" (ngSubmit)="confirmOpenCashier()" class="p-6">
          <div class="space-y-4">
            <div>
              <label class="form-label">Montant initial (MGA)</label>
              <input type="number" formControlName="openingAmount" class="form-input" placeholder="0">
              <p class="text-xs text-gray-500 mt-1">Entrez le montant en caisse au démarrage</p>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" (click)="closeOpenModal()" class="btn-secondary">Annuler</button>
            <button type="submit" [disabled]="openCashierForm.invalid" class="btn-success">
              <i class="fas fa-door-open mr-2"></i>
              Ouvrir la caisse
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Cash Register Modal -->
    <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md m-4">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold">Créer une nouvelle caisse</h3>
        </div>
        
        <form [formGroup]="cashierForm" (ngSubmit)="createCashier()" class="p-6">
          <div class="space-y-4">
            <div>
              <label class="form-label">Nom de la caisse</label>
              <input type="text" formControlName="name" class="form-input" placeholder="Caisse 1">
            </div>
            
            <div>
              <label class="form-label">Solde initial (MGA)</label>
              <input type="number" formControlName="openingAmount" class="form-input" placeholder="0">
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" (click)="closeModal()" class="btn-secondary">Annuler</button>
            <button type="submit" [disabled]="cashierForm.invalid || saving" class="btn-primary">
              <span *ngIf="!saving">Créer</span>
              <span *ngIf="saving">Création...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [``]
})
export class StoreCashiersComponent implements OnInit {
  store: Store | null = null;
  cashRegisters: CashRegister[] = [];
  storeId: string = '';
  loading = false;
  saving = false;
  showModal = false;
  showOpenModal = false;
  selectedCashierForOpen: CashRegister | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  cashierForm: FormGroup;
  openCashierForm: FormGroup;

  constructor(
    private http: HttpClient,
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.cashierForm = this.fb.group({
      name: ['', Validators.required],
      openingAmount: [0, [Validators.required, Validators.min(0)]]
    });
    
    this.openCashierForm = this.fb.group({
      openingAmount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storeId = params['id'];
      if (this.storeId) {
        this.loadStore();
        this.loadCashiers();
      }
    });
  }

  loadStore(): void {
    this.storeService.getStore(this.storeId).subscribe({
      next: (response) => {
        if (response.success) {
          this.store = response.data;
        }
      }
    });
  }

  loadCashiers(): void {
    this.loading = true;
    this.errorMessage = null;

    this.http.get(`${environment.apiUrl}/cash-registers?storeId=${this.storeId}`).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.cashRegisters = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des caisses';
        this.loading = false;
        console.error('Error loading cashiers:', error);
      }
    });
  }

  get openCount(): number {
    return this.cashRegisters.filter(c => c.status === 'ouvert').length;
  }

  get closedCount(): number {
    return this.cashRegisters.filter(c => c.status === 'ferme').length;
  }

  get maintenanceCount(): number {
    return this.cashRegisters.filter(c => c.status === 'maintenance').length;
  }

  getStatusBadgeClass(cash: CashRegister): string {
    switch (cash.status) {
      case 'ouvert':
        return 'badge badge-success';
      case 'ferme':
        return 'badge';
      case 'maintenance':
        return 'badge badge-warning';
      default:
        return 'badge';
    }
  }

  getStatusLabel(cash: CashRegister): string {
    switch (cash.status) {
      case 'ouvert':
        return 'Ouverte';
      case 'ferme':
        return 'Fermée';
      case 'maintenance':
        return 'Maintenance';
      default:
        return cash.status;
    }
  }

  openCreateModal(): void {
    this.cashierForm.reset({ openingAmount: 0 });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  createCashier(): void {
    if (this.cashierForm.invalid) return;

    this.saving = true;
    this.errorMessage = null;

    const cashierData = {
      registerName: this.cashierForm.value.name,
      openingAmount: this.cashierForm.value.openingAmount,
      storeId: this.storeId
    };

    this.http.post(`${environment.apiUrl}/cash-registers`, cashierData).subscribe({
      next: () => {
        this.successMessage = 'Caisse créée avec succès';
        this.saving = false;
        this.closeModal();
        this.loadCashiers();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la création de la caisse';
        this.saving = false;
        console.error('Error creating cashier:', error);
      }
    });
  }

  openOpenModal(cashier: CashRegister): void {
    this.selectedCashierForOpen = cashier;
    this.openCashierForm.reset({ openingAmount: 0 });
    this.showOpenModal = true;
  }

  closeOpenModal(): void {
    this.showOpenModal = false;
    this.selectedCashierForOpen = null;
  }

  confirmOpenCashier(): void {
    if (this.openCashierForm.invalid || !this.selectedCashierForOpen) return;

    const openingAmount = this.openCashierForm.value.openingAmount;
    
    this.http.post(`${environment.apiUrl}/cash-registers/${this.selectedCashierForOpen._id}/open`, { 
      initialBalance: openingAmount 
    }).subscribe({
      next: () => {
        this.successMessage = `Caisse "${this.selectedCashierForOpen?.registerName}" ouverte avec ${openingAmount} MGA`;
        this.closeOpenModal();
        this.loadCashiers();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de l\'ouverture de la caisse';
        console.error('Error opening cashier:', error);
      }
    });
  }

  closeCashier(cashierId: string): void {
    this.http.post(`${environment.apiUrl}/cash-registers/${cashierId}/close`, {}).subscribe({
      next: () => {
        this.successMessage = 'Caisse fermée avec succès';
        this.loadCashiers();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la fermeture de la caisse';
        console.error('Error closing cashier:', error);
      }
    });
  }

  goToPos(cashierId: string): void {
    this.router.navigate(['/pos', this.storeId], { queryParams: { cashierId } });
  }
}
