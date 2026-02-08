import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Tableau de bord Admin</h2>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600" *ngIf="currentUser">
            {{ currentUser.firstName }} {{ currentUser.lastName }}
          </span>
        </div>
      </div>
    </header>

    <div class="p-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="mall-card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <i class="fas fa-store text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-500">Total Boutiques</p>
              <p class="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>

        <div class="mall-card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <i class="fas fa-shopping-bag text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-500">Ventes Totales</p>
              <p class="text-2xl font-bold">0 Ar</p>
            </div>
          </div>
        </div>

        <div class="mall-card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <i class="fas fa-users text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-500">Clients</p>
              <p class="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>

        <div class="mall-card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              <i class="fas fa-box text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-500">Produits</p>
              <p class="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Content placeholder -->
      <div class="mall-card">
        <h3 class="text-lg font-semibold mb-4">Boutiques en attente d'approbation</h3>
        <p class="text-gray-500">Aucune boutique en attente pour le moment.</p>
      </div>
    </div>
  `,
  styles: [``]
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
  }
}
