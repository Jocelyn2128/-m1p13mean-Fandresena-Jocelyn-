import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-pos-system',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Point de Vente</h2>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600" *ngIf="currentUser">
            {{ currentUser.firstName }} {{ currentUser.lastName }}
          </span>
        </div>
      </div>
    </header>

    <div class="p-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Products Section -->
        <div class="lg:col-span-2">
          <div class="mall-card mb-6">
            <div class="flex space-x-4">
              <input 
                type="text" 
                placeholder="Rechercher un produit..."
                class="form-input flex-1"
              >
              <button class="btn-primary">
                <i class="fas fa-search mr-2"></i>
                Rechercher
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <!-- Product Card Placeholder -->
            <div class="mall-card p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div class="h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <i class="fas fa-image text-gray-400 text-3xl"></i>
              </div>
              <h4 class="font-medium text-sm">Produit exemple</h4>
              <p class="text-blue-600 font-bold">25,000 Ar</p>
              <p class="text-xs text-gray-500">Stock: 10</p>
            </div>
          </div>
        </div>

        <!-- Cart Section -->
        <div>
          <div class="mall-card">
            <h3 class="text-lg font-semibold mb-4">Panier</h3>
            
            <div class="space-y-3 mb-4">
              <p class="text-gray-500 text-center py-8">Panier vide</p>
            </div>

            <div class="border-t pt-4">
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Sous-total</span>
                <span class="font-medium">0 Ar</span>
              </div>
              <div class="flex justify-between mb-4 text-lg font-bold">
                <span>Total</span>
                <span>0 Ar</span>
              </div>
              
              <button class="w-full btn-success mb-2" disabled>
                <i class="fas fa-check mr-2"></i>
                Valider la vente
              </button>
              <button class="w-full btn-secondary">
                <i class="fas fa-trash mr-2"></i>
                Vider le panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class PosSystemComponent {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
