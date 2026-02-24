import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
    selector: 'app-order-tracking',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-4xl mx-auto px-4 py-4 flex items-center space-x-4">
          <a routerLink="/catalog" class="p-2 hover:bg-gray-100 rounded-full">
            <i class="fas fa-arrow-left text-gray-600"></i>
          </a>
          <h1 class="text-xl font-bold text-gray-900">Suivi de commande</h1>
        </div>
      </header>

      <div class="max-w-4xl mx-auto px-4 py-8">
        <!-- Search Box -->
        <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 class="text-base font-semibold text-gray-700 mb-3">
            <i class="fas fa-search mr-2 text-blue-500"></i>Rechercher par numéro de reçu
          </h2>
          <div class="flex space-x-3">
            <input
              type="text"
              [(ngModel)]="searchReceipt"
              placeholder="Ex: ONL-20260224-1234"
              class="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              (keyup.enter)="searchOrder()"
            >
            <button
              (click)="searchOrder()"
              [disabled]="isLoading"
              class="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              <i class="fas fa-search mr-1"></i>Chercher
            </button>
          </div>
          <div *ngIf="searchError" class="mt-3 text-sm text-red-600">
            <i class="fas fa-exclamation-circle mr-1"></i>{{ searchError }}
          </div>
        </div>

        <!-- Loading -->
        <div *ngIf="isLoading" class="text-center py-12">
          <i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
        </div>

        <!-- Order Tracking Card -->
        <div *ngIf="order && !isLoading" class="bg-white rounded-xl shadow-sm overflow-hidden">
          <!-- Header Info -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <p class="text-blue-200 text-xs mb-1">Reçu</p>
                <p class="font-mono font-bold text-sm">{{ order.receiptNumber }}</p>
              </div>
              <div>
                <p class="text-blue-200 text-xs mb-1">Total</p>
                <p class="font-bold">{{ order.totalAmount | number }} Ar</p>
              </div>
              <div>
                <p class="text-blue-200 text-xs mb-1">Date</p>
                <p class="font-medium text-sm">{{ order.createdAt | date:'dd/MM/yy' }}</p>
              </div>
            </div>
          </div>

          <!-- Status Timeline -->
          <div class="p-6">
            <h3 class="font-semibold text-gray-800 mb-6">Progression de votre commande</h3>
            <div class="relative">
              <!-- Timeline Line -->
              <div class="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              <div *ngFor="let step of trackingSteps; let i = index" class="relative flex items-start space-x-4 pb-8 last:pb-0">
                <!-- Step Icon -->
                <div class="relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                     [class.bg-green-100]="isStepDone(step.status)"
                     [class.border-2]="isCurrentStep(step.status)"
                     [class.border-blue-500]="isCurrentStep(step.status)"
                     [class.bg-blue-50]="isCurrentStep(step.status)"
                     [class.bg-gray-100]="!isStepDone(step.status) && !isCurrentStep(step.status)">
                  <i [class]="step.icon + ' text-sm'"
                     [class.text-green-600]="isStepDone(step.status)"
                     [class.text-blue-600]="isCurrentStep(step.status)"
                     [class.text-gray-400]="!isStepDone(step.status) && !isCurrentStep(step.status)"></i>
                </div>

                <!-- Step Info -->
                <div class="flex-1 pt-1.5">
                  <p class="font-semibold text-sm"
                     [class.text-green-700]="isStepDone(step.status)"
                     [class.text-blue-700]="isCurrentStep(step.status)"
                     [class.text-gray-400]="!isStepDone(step.status) && !isCurrentStep(step.status)">
                    {{ step.label }}
                  </p>
                  <p class="text-xs text-gray-500">{{ step.description }}</p>
                  <p *ngIf="isCurrentStep(step.status)" class="text-xs text-blue-600 font-medium mt-1">
                    <i class="fas fa-circle text-xs animate-pulse mr-1"></i>Statut actuel
                  </p>
                </div>
              </div>
            </div>

            <!-- Order Items Summary -->
            <div class="mt-6 pt-6 border-t">
              <h3 class="font-semibold text-gray-800 mb-3">Articles</h3>
              <div class="space-y-2">
                <div *ngFor="let item of order.items" class="flex justify-between text-sm">
                  <span class="text-gray-700">{{ item.name }} <span class="text-gray-400">x{{ item.quantity }}</span></span>
                  <span class="font-medium">{{ item.subTotal | number }} Ar</span>
                </div>
              </div>
            </div>

            <!-- Payment Info -->
            <div class="mt-4 pt-4 border-t flex justify-between items-center">
              <div class="text-sm text-gray-500">
                <i class="fas fa-credit-card mr-1"></i>{{ order.paymentMethod || 'Non défini' }}
              </div>
              <div class="text-sm font-semibold">
                Boutique : {{ order.storeId?.name || '—' }}
              </div>
            </div>

            <!-- Navigation -->
            <div class="mt-6 flex space-x-3">
              <a routerLink="/order-history" class="flex-1 text-center py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Mes commandes
              </a>
              <a routerLink="/catalog" class="flex-1 text-center py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Continuer les achats
              </a>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!order && !isLoading && searched" class="bg-white rounded-xl shadow-sm p-12 text-center">
          <i class="fas fa-receipt text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">Aucune commande trouvée avec ce numéro de reçu.</p>
        </div>
      </div>
    </div>
  `
})
export class OrderTrackingComponent implements OnInit {
    searchReceipt = '';
    order: any = null;
    isLoading = false;
    searchError = '';
    searched = false;

    trackingSteps = [
        { status: 'en_attente', label: 'Commande reçue', description: 'Votre commande a été enregistrée', icon: 'fas fa-clipboard-check' },
        { status: 'paye', label: 'Paiement confirmé', description: 'Le paiement a été validé', icon: 'fas fa-check-circle' },
        { status: 'pret_pour_retrait', label: 'Prête pour retrait', description: 'Votre commande vous attend en boutique', icon: 'fas fa-store' },
        { status: 'retire', label: 'Retirée', description: 'Vous avez retiré votre commande', icon: 'fas fa-check-double' }
    ];

    statusOrder = ['en_attente', 'paye', 'pret_pour_retrait', 'retire'];

    constructor(
        private orderService: OrderService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const receiptNumber = this.route.snapshot.paramMap.get('receiptNumber');
        if (receiptNumber) {
            this.searchReceipt = receiptNumber;
            this.searchOrder();
        }
    }

    searchOrder(): void {
        if (!this.searchReceipt.trim()) return;
        this.isLoading = true;
        this.searchError = '';
        this.searched = true;
        this.order = null;

        this.orderService.getReceipt(this.searchReceipt.trim()).subscribe({
            next: (res: any) => {
                this.order = res.success ? res.data : null;
                this.isLoading = false;
            },
            error: () => {
                this.searchError = 'Commande introuvable. Vérifiez le numéro de reçu.';
                this.isLoading = false;
            }
        });
    }

    isStepDone(status: string): boolean {
        if (!this.order) return false;
        const currentIdx = this.statusOrder.indexOf(this.order.status);
        const stepIdx = this.statusOrder.indexOf(status);
        return stepIdx < currentIdx;
    }

    isCurrentStep(status: string): boolean {
        return this.order?.status === status;
    }
}
