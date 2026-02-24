import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-wallet',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-4xl mx-auto px-4 py-4 flex items-center space-x-4">
          <a routerLink="/order-history" class="p-2 hover:bg-gray-100 rounded-full">
            <i class="fas fa-arrow-left text-gray-600"></i>
          </a>
          <h1 class="text-xl font-bold text-gray-900">Mon Portefeuille</h1>
        </div>
      </header>

      <div class="max-w-4xl mx-auto px-4 py-8">
        <!-- Wallet Card -->
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white p-6 mb-8 shadow-lg">
          <div class="flex justify-between items-start mb-6">
            <div>
              <p class="text-purple-200 text-sm">Solde disponible en avoirs</p>
              <p class="text-4xl font-bold mt-1">{{ totalBalance | number }} Ar</p>
            </div>
            <div class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <i class="fas fa-wallet text-2xl"></i>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4 text-center border-t border-white/20 pt-4">
            <div>
              <p class="text-3xl font-bold">{{ activeTickets }}</p>
              <p class="text-purple-200 text-xs">Tickets actifs</p>
            </div>
            <div>
              <p class="text-3xl font-bold">{{ usedTickets }}</p>
              <p class="text-purple-200 text-xs">Utilisés</p>
            </div>
            <div>
              <p class="text-3xl font-bold">{{ totalTickets }}</p>
              <p class="text-purple-200 text-xs">Total</p>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div *ngIf="isLoading" class="text-center py-12">
          <i class="fas fa-spinner fa-spin text-3xl text-purple-500"></i>
        </div>

        <!-- Not logged in -->
        <div *ngIf="!currentUser && !isLoading" class="bg-white rounded-xl shadow-sm p-12 text-center">
          <i class="fas fa-lock text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-700 font-medium mb-4">Connexion requise</p>
          <a routerLink="/login" class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">Se connecter</a>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && currentUser && tickets.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center">
          <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-ticket-alt text-3xl text-purple-400"></i>
          </div>
          <h2 class="text-lg font-semibold text-gray-700 mb-2">Aucun ticket numérique</h2>
          <p class="text-gray-500 text-sm mb-6">
            Vos avoirs apparaîtront ici lors d'annulations de commandes payées.
          </p>
          <a routerLink="/catalog" class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 text-sm">
            Parcourir le catalogue
          </a>
        </div>

        <!-- Tickets -->
        <div *ngIf="!isLoading && tickets.length > 0">
          <!-- Active Tickets -->
          <div *ngIf="activeTicketsList.length > 0" class="mb-6">
            <h2 class="text-lg font-bold text-gray-800 mb-3">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>Tickets disponibles
            </h2>
            <div class="space-y-4">
              <div *ngFor="let ticket of activeTicketsList"
                   class="bg-white rounded-xl shadow-sm overflow-hidden border-l-4 border-green-500">
                <!-- Ticket Header -->
                <div class="p-4 border-b border-gray-50">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-mono font-bold text-gray-800">{{ ticket.receiptNumber }}</p>
                      <p class="text-xs text-gray-500 mt-0.5">{{ ticket.createdAt | date:'dd/MM/yyyy' }}</p>
                    </div>
                    <span class="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">Actif</span>
                  </div>
                </div>

                <!-- Ticket Body -->
                <div class="p-4">
                  <div class="flex justify-between items-center mb-3">
                    <div>
                      <p class="text-sm text-gray-500">Montant restant</p>
                      <p class="text-2xl font-bold text-green-600">{{ ticket.remainingAmount | number }} Ar</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm text-gray-500">Montant initial</p>
                      <p class="text-lg font-semibold text-gray-700">{{ ticket.originalAmount | number }} Ar</p>
                    </div>
                  </div>

                  <!-- Progress bar -->
                  <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full bg-green-500 rounded-full transition-all"
                         [style.width]="(ticket.remainingAmount / ticket.originalAmount * 100) + '%'"></div>
                  </div>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ ticket.usedAmount | number }} Ar utilisés sur {{ ticket.originalAmount | number }} Ar
                  </p>

                  <!-- Raison -->
                  <div class="mt-3 text-xs text-gray-500">
                    <i class="fas fa-info-circle mr-1"></i>
                    Raison : {{ getRaisonLabel(ticket.reason) }}
                  </div>

                  <!-- Articles (si dispo) -->
                  <div *ngIf="ticket.items?.length" class="mt-3 pt-3 border-t border-gray-50">
                    <p class="text-xs font-medium text-gray-600 mb-2">Articles concernés :</p>
                    <div class="flex flex-wrap gap-1">
                      <span *ngFor="let item of ticket.items" class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                        {{ item.name }} x{{ item.quantity }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Dashed divider (ticket tear) -->
                <div class="border-t-2 border-dashed border-gray-200 mx-4"></div>

                <!-- QR Zone -->
                <div class="p-4 bg-gray-50 flex items-center justify-between">
                  <div class="text-xs text-gray-500">
                    <i class="fas fa-store mr-1"></i>{{ ticket.storeId?.name || 'Boutique' }}
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="w-10 h-10 bg-white border border-gray-200 rounded flex items-center justify-center">
                      <i class="fas fa-qrcode text-gray-400"></i>
                    </div>
                    <p class="font-mono text-xs text-gray-600">{{ ticket.receiptNumber }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Used / Expired Tickets -->
          <div *ngIf="usedTicketsList.length > 0">
            <h2 class="text-lg font-bold text-gray-500 mb-3">
              <i class="fas fa-history mr-2"></i>Tickets utilisés
            </h2>
            <div class="space-y-3">
              <div *ngFor="let ticket of usedTicketsList"
                   class="bg-white rounded-xl shadow-sm p-4 opacity-60 border-l-4 border-gray-300 flex justify-between items-center">
                <div>
                  <p class="font-mono text-sm text-gray-600">{{ ticket.receiptNumber }}</p>
                  <p class="text-xs text-gray-400">{{ ticket.createdAt | date:'dd/MM/yyyy' }}</p>
                </div>
                <div class="text-right">
                  <span class="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-1 rounded-full">Utilisé</span>
                  <p class="text-sm font-semibold text-gray-500 mt-1">{{ ticket.originalAmount | number }} Ar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class WalletComponent implements OnInit {
    tickets: any[] = [];
    isLoading = false;
    currentUser: any = null;

    constructor(
        private authService: AuthService,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.currentUser = this.authService.getCurrentUser();
        if (this.currentUser) {
            this.loadTickets();
        }
    }

    loadTickets(): void {
        const userId = this.currentUser?.id || this.currentUser?._id;
        if (!userId) return;

        this.isLoading = true;
        const params = new HttpParams().set('buyerId', userId);

        this.http.get<any>(`${environment.apiUrl}/credit-notes`, { params }).subscribe({
            next: (res) => {
                this.tickets = res.success ? (res.data || []) : [];
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    get activeTicketsList(): any[] {
        return this.tickets.filter(t => t.status === 'actif');
    }

    get usedTicketsList(): any[] {
        return this.tickets.filter(t => t.status !== 'actif');
    }

    get totalBalance(): number {
        return this.activeTicketsList.reduce((sum, t) => sum + (t.remainingAmount || 0), 0);
    }

    get totalTickets(): number {
        return this.tickets.length;
    }

    get activeTickets(): number {
        return this.activeTicketsList.length;
    }

    get usedTickets(): number {
        return this.usedTicketsList.length;
    }

    getRaisonLabel(reason: string): string {
        const labels: Record<string, string> = {
            annulation: 'Annulation de commande',
            avoir_partiel: 'Retour partiel',
            remboursement: 'Remboursement'
        };
        return labels[reason] || reason;
    }
}
