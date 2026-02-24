import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
    selector: 'app-order-confirmation',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div class="max-w-lg w-full">
        <!-- Success Animation -->
        <div *ngIf="!isLoading && order" class="text-center mb-8">
          <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
            <i class="fas fa-check-circle text-5xl text-green-500"></i>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
          <p class="text-gray-600">Merci pour votre commande. Vous serez notifié quand elle sera prête.</p>
        </div>

        <!-- Loading -->
        <div *ngIf="isLoading" class="text-center py-12">
          <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
          <p class="mt-4 text-gray-500">Chargement de la confirmation...</p>
        </div>

        <!-- Order Card -->
        <div *ngIf="!isLoading && order" class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <!-- Receipt Header -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-blue-200 text-sm">N° de reçu</p>
                <p class="text-2xl font-mono font-bold">{{ order.receiptNumber }}</p>
              </div>
              <div class="text-right">
                <p class="text-blue-200 text-sm">Date</p>
                <p class="font-medium">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
              </div>
            </div>
          </div>

          <!-- Order Details -->
          <div class="p-6">
            <!-- Status Badge -->
            <div class="flex items-center space-x-2 mb-6">
              <span class="px-3 py-1 rounded-full text-sm font-medium"
                    [class.bg-green-100]="order.status === 'paye'"
                    [class.text-green-700]="order.status === 'paye'"
                    [class.bg-yellow-100]="order.status === 'en_attente'"
                    [class.text-yellow-700]="order.status === 'en_attente'"
                    [class.bg-blue-100]="order.status === 'pret_pour_retrait'"
                    [class.text-blue-700]="order.status === 'pret_pour_retrait'">
                <i class="fas fa-circle mr-1 text-xs"></i>
                {{ getStatusLabel(order.status) }}
              </span>
              <span class="text-sm text-gray-500">via {{ order.paymentMethod }}</span>
            </div>

            <!-- Items -->
            <h3 class="font-semibold text-gray-700 mb-3">Articles commandés</h3>
            <div class="space-y-2 mb-4">
              <div *ngFor="let item of order.items" class="flex justify-between items-center py-2 border-b border-gray-50">
                <div>
                  <p class="font-medium text-gray-900">{{ item.name }}</p>
                  <p class="text-sm text-gray-500">x{{ item.quantity }} × {{ item.unitPrice | number }} Ar</p>
                </div>
                <span class="font-semibold">{{ item.subTotal | number }} Ar</span>
              </div>
            </div>

            <!-- Total -->
            <div class="bg-gray-50 rounded-lg p-4 flex justify-between items-center mb-6">
              <span class="font-semibold text-gray-700">Total payé</span>
              <span class="text-2xl font-bold text-blue-600">{{ order.totalAmount | number }} Ar</span>
            </div>

            <!-- QR Ticket placeholder -->
            <div class="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center mb-6">
              <div class="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <i class="fas fa-qrcode text-3xl text-gray-400"></i>
              </div>
              <p class="text-xs text-gray-500">Présentez ce ticket lors du retrait</p>
              <p class="font-mono text-sm font-bold text-gray-700 mt-1">{{ order.receiptNumber }}</p>
            </div>

            <!-- Actions -->
            <div class="grid grid-cols-2 gap-3">
              <a [routerLink]="['/order-tracking', order.receiptNumber]"
                 class="flex items-center justify-center space-x-2 py-3 border-2 border-blue-500 text-blue-600 rounded-xl font-medium hover:bg-blue-50">
                <i class="fas fa-map-marker-alt"></i>
                <span>Suivre</span>
              </a>
              <a routerLink="/order-history"
                 class="flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
                <i class="fas fa-list"></i>
                <span>Mes commandes</span>
              </a>
            </div>

            <a routerLink="/catalog" class="block text-center text-sm text-gray-500 hover:text-gray-700 mt-4">
              Continuer mes achats
            </a>
          </div>
        </div>

        <!-- Error -->
        <div *ngIf="!isLoading && !order" class="bg-white rounded-2xl shadow-xl p-8 text-center">
          <i class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
          <h2 class="text-xl font-bold text-gray-800 mb-2">Commande introuvable</h2>
          <a routerLink="/order-history" class="text-blue-600 hover:underline">Voir mes commandes</a>
        </div>
      </div>
    </div>
  `,
    styles: [`
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .animate-bounce-slow { animation: bounce-slow 2s ease-in-out; }
  `]
})
export class OrderConfirmationComponent implements OnInit {
    order: any = null;
    isLoading = true;

    constructor(
        private route: ActivatedRoute,
        private orderService: OrderService,
        private router: Router
    ) { }

    ngOnInit(): void {
        const orderId = this.route.snapshot.paramMap.get('id');
        if (orderId) {
            this.orderService.getOrder(orderId).subscribe({
                next: (res: any) => {
                    this.order = res.success ? res.data : null;
                    this.isLoading = false;
                },
                error: () => {
                    this.isLoading = false;
                }
            });
        } else {
            this.isLoading = false;
        }
    }

    getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            en_attente: 'En attente',
            paye: 'Payé',
            acompte: 'Acompte',
            annule: 'Annulé',
            pret_pour_retrait: 'Prêt pour retrait',
            retire: 'Retiré',
            avoir: 'Avoir'
        };
        return labels[status] || status;
    }
}
