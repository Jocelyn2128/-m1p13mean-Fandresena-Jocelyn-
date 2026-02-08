import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Payment {
  cashRegisterId: string;
  cashRegisterName: string;
  amount: number;
}

interface Order {
  _id: string;
  receiptNumber: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subTotal: number;
  }>;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'paye' | 'acompte' | 'annule' | 'avoir';
  payments: Payment[];
  createdAt: string;
  customerName?: string;
}

interface CreditNote {
  _id: string;
  receiptNumber: string;
  amount: number;
  status: 'disponible' | 'utilise' | 'expire';
  createdAt: string;
}

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Historique des Ventes</h2>
        <div class="flex space-x-2">
          <button (click)="showCreditNotes()" class="btn-secondary">
            <i class="fas fa-file-invoice-dollar mr-2"></i>
            Avoirs
          </button>
          <button (click)="refreshData()" class="btn-secondary">
            <i class="fas fa-sync-alt mr-2"></i>
            Actualiser
          </button>
        </div>
      </div>
    </header>

    <div class="p-8">
      <!-- Filtres -->
      <div class="mall-card mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="form-label text-xs">Date début</label>
            <input type="date" [(ngModel)]="filters.startDate" (change)="applyFilters()" class="form-input text-sm">
          </div>
          <div>
            <label class="form-label text-xs">Date fin</label>
            <input type="date" [(ngModel)]="filters.endDate" (change)="applyFilters()" class="form-input text-sm">
          </div>
          <div>
            <label class="form-label text-xs">N° Commande</label>
            <input type="text" [(ngModel)]="filters.orderNumber" (input)="applyFilters()" placeholder="Rechercher..." class="form-input text-sm">
          </div>
          <div>
            <label class="form-label text-xs">Statut</label>
            <select [(ngModel)]="filters.status" (change)="applyFilters()" class="form-input text-sm">
              <option value="">Tous</option>
              <option value="paye">Payé</option>
              <option value="acompte">Acompte</option>
              <option value="annule">Annulé</option>
              <option value="avoir">Avoir</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Stats rapides -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="mall-card bg-blue-50">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <i class="fas fa-shopping-bag text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Total Ventes</p>
              <p class="text-2xl font-bold text-gray-800">{{ filteredOrders.length }}</p>
            </div>
          </div>
        </div>

        <div class="mall-card bg-green-50">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <i class="fas fa-money-bill-wave text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Chiffre d'affaires</p>
              <p class="text-2xl font-bold text-gray-800">{{ totalRevenue | number }} MGA</p>
            </div>
          </div>
        </div>

        <div class="mall-card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              <i class="fas fa-calculator text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Panier moyen</p>
              <p class="text-2xl font-bold text-gray-800">{{ averageOrder | number }} MGA</p>
            </div>
          </div>
        </div>

        <div class="mall-card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100 text-orange-600">
              <i class="fas fa-box text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Articles vendus</p>
              <p class="text-2xl font-bold text-gray-800">{{ totalItems }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-8">
        <i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
        <p class="mt-2 text-gray-500">Chargement...</p>
      </div>

      <!-- Tableau des ventes -->
      <div *ngIf="!loading" class="mall-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Commande</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Articles</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payé</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reste</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let order of filteredOrders" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="font-medium text-gray-900">{{ order.receiptNumber }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  <div *ngFor="let item of order.items" class="mb-1">
                    {{ item.quantity }}x {{ item.name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ order.totalAmount | number }} MGA
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  {{ order.paidAmount | number }} MGA
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm" [class.text-red-600]="order.remainingAmount > 0" [class.text-gray-400]="order.remainingAmount === 0">
                  {{ order.remainingAmount | number }} MGA
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusBadgeClass(order.status)">
                    {{ getStatusLabel(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="relative">
                    <button (click)="toggleMenu(order._id)" class="text-gray-600 hover:text-gray-900 p-2">
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                    
                    <!-- Menu déroulant -->
                    <div *ngIf="activeMenu === order._id" class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <div class="py-1">
                        <button (click)="viewOrderDetails(order); toggleMenu(order._id)" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <i class="fas fa-eye mr-2"></i> Voir détails
                        </button>
                        
                        <button *ngIf="order.status === 'acompte'" (click)="openPaymentModal(order); toggleMenu(order._id)" class="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100">
                          <i class="fas fa-money-bill-wave mr-2"></i> Payer le reste
                        </button>
                        
                        <button *ngIf="order.status === 'paye' || order.status === 'acompte'" (click)="openCancelModal(order); toggleMenu(order._id)" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          <i class="fas fa-times-circle mr-2"></i> Annuler la vente
                        </button>
                        
                        <button *ngIf="order.status === 'paye'" (click)="openPartialCreditModal(order); toggleMenu(order._id)" class="block w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-100">
                          <i class="fas fa-undo mr-2"></i> Avoir partiel
                        </button>
                        
                        <button *ngIf="order.status === 'paye'" (click)="openCreditNotePaymentModal(order); toggleMenu(order._id)" class="block w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-gray-100">
                          <i class="fas fa-file-invoice-dollar mr-2"></i> Payer par avoir
                        </button>
                        
                        <button (click)="printReceipt(order); toggleMenu(order._id)" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <i class="fas fa-print mr-2"></i> Imprimer reçu
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="filteredOrders.length === 0" class="text-center py-8 text-gray-500">
          <i class="fas fa-inbox text-4xl mb-2"></i>
          <p>Aucune vente trouvée</p>
        </div>
      </div>
    </div>

    <!-- Modal Payer le reste (acompte) -->
    <div *ngIf="showPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg m-4">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold">Payer le reste - {{ selectedOrder?.receiptNumber }}</h3>
          <p class="text-sm text-gray-500">Reste à payer: {{ selectedOrder?.remainingAmount | number }} MGA</p>
        </div>
        <div class="p-6">
          <div *ngFor="let payment of paymentForm.payments; let i = index" class="flex items-center space-x-3 mb-3">
            <select [(ngModel)]="payment.cashierId" class="form-input flex-1">
              <option value="">Sélectionner une caisse</option>
              <option *ngFor="let cashier of availableCashiers" [value]="cashier._id">
                {{ cashier.registerName }}
              </option>
            </select>
            <input type="number" [(ngModel)]="payment.amount" class="form-input w-32" placeholder="Montant">
            <button (click)="removePaymentForm(i)" class="text-red-600 hover:text-red-800">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <button (click)="addPaymentForm()" class="text-blue-600 hover:text-blue-800 text-sm mb-4">
            <i class="fas fa-plus mr-1"></i> Ajouter un paiement
          </button>
          
          <div *ngIf="remainingPayment > 0" class="text-orange-600 mb-4">
            Reste à payer: {{ remainingPayment | number }} MGA
          </div>
          <div *ngIf="remainingPayment < 0" class="text-red-600 mb-4">
            Montant excédentaire: {{ -remainingPayment | number }} MGA
          </div>
          <div *ngIf="remainingPayment === 0" class="text-green-600 mb-4">
            <i class="fas fa-check-circle mr-1"></i> Montant complet
          </div>
        </div>
        <div class="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button (click)="closePaymentModal()" class="btn-secondary">Annuler</button>
          <button (click)="confirmPayment()" [disabled]="remainingPayment !== 0" class="btn-success">
            Confirmer le paiement
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Annuler vente -->
    <div *ngIf="showCancelModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg m-4">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-red-600">Annuler la vente - {{ selectedOrder?.receiptNumber }}</h3>
        </div>
        <div class="p-6">
          <p class="text-gray-600 mb-4">
            Cette action va transformer la vente en avoir de {{ selectedOrder?.paidAmount | number }} MGA.
            Tous les produits seront retournés au stock.
          </p>
          
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" [(ngModel)]="cancelForm.decaisser" class="mr-2">
              <span>Décaisser le montant payé ({{ selectedOrder?.paidAmount | number }} MGA)</span>
            </label>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-medium mb-2">Produits à retourner:</h4>
            <div *ngFor="let item of selectedOrder?.items" class="flex justify-between py-1">
              <span>{{ item.quantity }}x {{ item.name }}</span>
              <span>{{ item.unitPrice * item.quantity | number }} MGA</span>
            </div>
          </div>
        </div>
        <div class="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button (click)="closeCancelModal()" class="btn-secondary">Annuler</button>
          <button (click)="confirmCancel()" class="btn-danger">
            Confirmer l'annulation
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Avoir partiel -->
    <div *ngIf="showPartialCreditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-orange-600">Avoir partiel - {{ selectedOrder?.receiptNumber }}</h3>
        </div>
        <div class="p-6">
          <p class="text-gray-600 mb-4">Sélectionnez les produits à retourner:</p>
          
          <div *ngFor="let item of partialCreditForm.items" class="flex items-center justify-between p-3 border rounded-lg mb-2">
            <div class="flex items-center">
              <input type="checkbox" [(ngModel)]="item.selected" class="mr-3">
              <span>{{ item.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">Qté:</span>
              <input type="number" [(ngModel)]="item.returnQuantity" [max]="item.quantity" min="1" class="form-input w-20 text-sm">
              <span class="text-sm text-gray-500">/ {{ item.quantity }}</span>
            </div>
          </div>
          
          <div class="mt-4 p-4 bg-gray-50 rounded-lg">
            <div class="flex justify-between font-medium">
              <span>Montant total de l'avoir:</span>
              <span>{{ calculatePartialCreditAmount() | number }} MGA</span>
            </div>
          </div>
          
          <div class="mt-4">
            <label class="flex items-center">
              <input type="checkbox" [(ngModel)]="partialCreditForm.decaisser" class="mr-2">
              <span>Décaisser le montant de l'avoir</span>
            </label>
          </div>
        </div>
        <div class="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button (click)="closePartialCreditModal()" class="btn-secondary">Annuler</button>
          <button (click)="confirmPartialCredit()" [disabled]="calculatePartialCreditAmount() === 0" class="btn-primary">
            Créer l'avoir
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Payer par avoir -->
    <div *ngIf="showCreditNotePaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg m-4">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-purple-600">Payer par avoir - {{ selectedOrder?.receiptNumber }}</h3>
          <p class="text-sm text-gray-500">Montant à payer: {{ selectedOrder?.remainingAmount || selectedOrder?.totalAmount | number }} MGA</p>
        </div>
        <div class="p-6">
          <div *ngIf="availableCreditNotes.length === 0" class="text-center py-4 text-gray-500">
            <i class="fas fa-info-circle text-2xl mb-2"></i>
            <p>Aucun avoir disponible</p>
          </div>
          
          <div *ngFor="let creditNote of availableCreditNotes" class="flex items-center justify-between p-3 border rounded-lg mb-2">
            <div>
              <span class="font-medium">{{ creditNote.receiptNumber }}</span>
              <span class="text-sm text-gray-500 ml-2">({{ creditNote.createdAt | date:'dd/MM/yyyy' }})</span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="font-medium">{{ creditNote.amount | number }} MGA</span>
              <button (click)="useCreditNote(creditNote)" class="btn-primary text-sm">
                Utiliser
              </button>
            </div>
          </div>
        </div>
        <div class="p-6 border-t border-gray-200 flex justify-end">
          <button (click)="closeCreditNotePaymentModal()" class="btn-secondary">Fermer</button>
        </div>
      </div>
    </div>

    <!-- Modal Liste des avoirs -->
    <div *ngIf="showCreditNotesList" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold">Liste des Avoirs</h3>
          <button (click)="closeCreditNotesList()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <div *ngIf="allCreditNotes.length === 0" class="text-center py-8 text-gray-500">
            <i class="fas fa-inbox text-4xl mb-2"></i>
            <p>Aucun avoir trouvé</p>
          </div>
          
          <table *ngIf="allCreditNotes.length > 0" class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">N° Avoir</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                <th class="px-4 py-2 text-right text-xs font-medium text-gray-500">Montant</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let cn of allCreditNotes" class="border-b">
                <td class="px-4 py-2">{{ cn.receiptNumber }}</td>
                <td class="px-4 py-2">{{ cn.createdAt | date:'dd/MM/yyyy' }}</td>
                <td class="px-4 py-2 text-right">{{ cn.amount | number }} MGA</td>
                <td class="px-4 py-2">
                  <span [class]="getCreditNoteStatusClass(cn.status)">
                    {{ getCreditNoteStatusLabel(cn.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal détails commande -->
    <div *ngIf="selectedOrder && !showPaymentModal && !showCancelModal && !showPartialCreditModal && !showCreditNotePaymentModal && !showCreditNotesList" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold">Détails - {{ selectedOrder.receiptNumber }}</h3>
          <button (click)="closeOrderDetails()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <p class="text-sm text-gray-500">Date: {{ selectedOrder.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
            <p class="text-sm text-gray-500">Statut: {{ getStatusLabel(selectedOrder.status) }}</p>
          </div>
          
          <div class="border-t pt-4 mb-4">
            <h4 class="font-medium mb-2">Articles</h4>
            <div *ngFor="let item of selectedOrder.items" class="flex justify-between py-2 border-b border-gray-100">
              <span>{{ item.quantity }}x {{ item.name }}</span>
              <span class="font-medium">{{ item.unitPrice * item.quantity | number }} MGA</span>
            </div>
          </div>
          
          <div class="border-t pt-4">
            <div class="flex justify-between mb-1">
              <span>Total:</span>
              <span class="font-medium">{{ selectedOrder.totalAmount | number }} MGA</span>
            </div>
            <div class="flex justify-between mb-1">
              <span>Payé:</span>
              <span class="text-green-600">{{ selectedOrder.paidAmount | number }} MGA</span>
            </div>
            <div class="flex justify-between text-lg font-bold">
              <span>Reste:</span>
              <span [class.text-red-600]="selectedOrder.remainingAmount > 0">{{ selectedOrder.remainingAmount | number }} MGA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .relative { position: relative; }
    .absolute { position: absolute; }
    .z-50 { z-index: 50; }
  `]
})
export class SalesHistoryComponent implements OnInit {
  storeId: string = '';
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = false;
  selectedOrder: Order | null = null;
  activeMenu: string | null = null;
  availableCashiers: any[] = [];
  availableCreditNotes: CreditNote[] = [];
  allCreditNotes: CreditNote[] = [];
  
  // Modals
  showPaymentModal = false;
  showCancelModal = false;
  showPartialCreditModal = false;
  showCreditNotePaymentModal = false;
  showCreditNotesList = false;
  
  paymentForm = {
    payments: [{ cashierId: '', amount: 0 }]
  };
  
  cancelForm = {
    decaisser: false
  };
  
  partialCreditForm = {
    items: [] as Array<{
      productId: string;
      name: string;
      quantity: number;
      unitPrice: number;
      selected: boolean;
      returnQuantity: number;
    }>,
    decaisser: false
  };
  
  filters = {
    startDate: '',
    endDate: '',
    orderNumber: '',
    status: ''
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storeId = params['id'];
      if (this.storeId) {
        this.loadOrders();
        this.loadCashiers();
        this.loadCreditNotes();
      }
    });
    
    // Fermer le menu quand on clique ailleurs
    document.addEventListener('click', (e) => {
      if (!(e.target as HTMLElement).closest('.relative')) {
        this.activeMenu = null;
      }
    });
  }

  loadOrders(): void {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/orders?storeId=${this.storeId}`).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Adapter les données pour inclure paidAmount et remainingAmount
          this.orders = response.data.map((order: any) => ({
            ...order,
            paidAmount: order.payments?.reduce((sum: number, p: Payment) => sum + p.amount, 0) || 0,
            remainingAmount: order.totalAmount - (order.payments?.reduce((sum: number, p: Payment) => sum + p.amount, 0) || 0)
          }));
          this.applyFilters();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  loadCashiers(): void {
    this.http.get(`${environment.apiUrl}/cash-registers?storeId=${this.storeId}`).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.availableCashiers = response.data.filter((c: any) => c.status === 'ouvert');
        }
      },
      error: (error) => {
        console.error('Error loading cashiers:', error);
      }
    });
  }

  loadCreditNotes(): void {
    // TODO: Implémenter endpoint pour charger les avoirs
    this.availableCreditNotes = [];
    this.allCreditNotes = [];
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      let matchesDate = true;
      if (this.filters.startDate) {
        const startDate = new Date(this.filters.startDate);
        startDate.setHours(0, 0, 0, 0);
        matchesDate = matchesDate && new Date(order.createdAt) >= startDate;
      }
      if (this.filters.endDate) {
        const endDate = new Date(this.filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && new Date(order.createdAt) <= endDate;
      }
      
      const matchesOrderNumber = !this.filters.orderNumber || 
                                order.receiptNumber.toLowerCase().includes(this.filters.orderNumber.toLowerCase());
      const matchesStatus = !this.filters.status || order.status === this.filters.status;
      
      return matchesDate && matchesOrderNumber && matchesStatus;
    });
  }

  toggleMenu(orderId: string): void {
    this.activeMenu = this.activeMenu === orderId ? null : orderId;
  }

  get totalRevenue(): number {
    return this.filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  }

  get averageOrder(): number {
    return this.filteredOrders.length > 0 ? this.totalRevenue / this.filteredOrders.length : 0;
  }

  get totalItems(): number {
    return this.filteredOrders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'paye':
        return 'badge badge-success';
      case 'acompte':
        return 'badge badge-warning';
      case 'annule':
        return 'badge badge-danger';
      case 'avoir':
        return 'badge';
      default:
        return 'badge';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'paye':
        return 'Payé';
      case 'acompte':
        return 'Acompte';
      case 'annule':
        return 'Annulé';
      case 'avoir':
        return 'Avoir';
      default:
        return status;
    }
  }

  // Modal Paiement
  openPaymentModal(order: Order): void {
    this.selectedOrder = order;
    this.paymentForm.payments = [{ cashierId: '', amount: order.remainingAmount }];
    this.showPaymentModal = true;
    this.activeMenu = null;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedOrder = null;
  }

  addPaymentForm(): void {
    this.paymentForm.payments.push({ cashierId: '', amount: 0 });
  }

  removePaymentForm(index: number): void {
    this.paymentForm.payments.splice(index, 1);
  }

  get remainingPayment(): number {
    const total = this.paymentForm.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    return (this.selectedOrder?.remainingAmount || 0) - total;
  }

  confirmPayment(): void {
    // TODO: Appeler API pour enregistrer le paiement
    alert('Paiement enregistré!');
    this.closePaymentModal();
    this.loadOrders();
  }

  // Modal Annulation
  openCancelModal(order: Order): void {
    this.selectedOrder = order;
    this.cancelForm.decaisser = false;
    this.showCancelModal = true;
    this.activeMenu = null;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.selectedOrder = null;
  }

  confirmCancel(): void {
    // TODO: Appeler API pour annuler la vente
    alert('Vente annulée - Avoir créé!');
    this.closeCancelModal();
    this.loadOrders();
  }

  // Modal Avoir partiel
  openPartialCreditModal(order: Order): void {
    this.selectedOrder = order;
    this.partialCreditForm.items = order.items.map(item => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      selected: false,
      returnQuantity: 1
    }));
    this.partialCreditForm.decaisser = false;
    this.showPartialCreditModal = true;
    this.activeMenu = null;
  }

  closePartialCreditModal(): void {
    this.showPartialCreditModal = false;
    this.selectedOrder = null;
  }

  calculatePartialCreditAmount(): number {
    return this.partialCreditForm.items
      .filter(item => item.selected)
      .reduce((sum, item) => sum + (item.unitPrice * item.returnQuantity), 0);
  }

  confirmPartialCredit(): void {
    // TODO: Appeler API pour créer l'avoir partiel
    alert('Avoir partiel créé!');
    this.closePartialCreditModal();
    this.loadOrders();
  }

  // Modal Payer par avoir
  openCreditNotePaymentModal(order: Order): void {
    this.selectedOrder = order;
    this.showCreditNotePaymentModal = true;
    this.activeMenu = null;
  }

  closeCreditNotePaymentModal(): void {
    this.showCreditNotePaymentModal = false;
    this.selectedOrder = null;
  }

  useCreditNote(creditNote: CreditNote): void {
    // TODO: Appeler API pour utiliser l'avoir
    alert(`Avoir ${creditNote.receiptNumber} utilisé!`);
    this.closeCreditNotePaymentModal();
    this.loadOrders();
  }

  // Liste des avoirs
  showCreditNotes(): void {
    this.showCreditNotesList = true;
  }

  closeCreditNotesList(): void {
    this.showCreditNotesList = false;
  }

  getCreditNoteStatusClass(status: string): string {
    switch (status) {
      case 'disponible':
        return 'badge badge-success';
      case 'utilise':
        return 'badge';
      case 'expire':
        return 'badge badge-danger';
      default:
        return 'badge';
    }
  }

  getCreditNoteStatusLabel(status: string): string {
    switch (status) {
      case 'disponible':
        return 'Disponible';
      case 'utilise':
        return 'Utilisé';
      case 'expire':
        return 'Expiré';
      default:
        return status;
    }
  }

  // Détails commande
  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  printReceipt(order: Order): void {
    alert('Impression du reçu ' + order.receiptNumber);
  }

  refreshData(): void {
    this.loadOrders();
    this.loadCashiers();
    this.loadCreditNotes();
  }
}
