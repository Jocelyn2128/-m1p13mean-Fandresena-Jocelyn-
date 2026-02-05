import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-choice',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">MallConnect</h1>
          <p class="text-gray-600">Choisissez votre type de compte</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Admin Registration -->
          <div 
            class="border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all duration-200 group"
            (click)="selectRole('admin')"
          >
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors">
              <i class="fas fa-user-shield text-2xl text-blue-600 group-hover:text-white"></i>
            </div>
            <h3 class="text-xl font-semibold text-center mb-2">Administrateur</h3>
            <p class="text-gray-500 text-sm text-center">
              Gestion complète du centre commercial
            </p>
            <button class="w-full mt-4 btn-primary">
              S'inscrire
            </button>
          </div>

          <!-- Boutique Registration -->
          <div 
            class="border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-green-500 hover:shadow-lg transition-all duration-200 group"
            (click)="selectRole('boutique')"
          >
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors">
              <i class="fas fa-store text-2xl text-green-600 group-hover:text-white"></i>
            </div>
            <h3 class="text-xl font-semibold text-center mb-2">Boutique</h3>
            <p class="text-gray-500 text-sm text-center">
              Vendez vos produits dans le centre
            </p>
            <button class="w-full mt-4 btn-success">
              S'inscrire
            </button>
          </div>

          <!-- Acheteur Registration -->
          <div 
            class="border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-purple-500 hover:shadow-lg transition-all duration-200 group"
            (click)="selectRole('acheteur')"
          >
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500 transition-colors">
              <i class="fas fa-shopping-bag text-2xl text-purple-600 group-hover:text-white"></i>
            </div>
            <h3 class="text-xl font-semibold text-center mb-2">Acheteur</h3>
            <p class="text-gray-500 text-sm text-center">
              Faites vos achats en ligne
            </p>
            <button class="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
              S'inscrire
            </button>
          </div>
        </div>

        <div class="mt-8 text-center">
          <p class="text-gray-600">
            Déjà un compte? 
            <a routerLink="/login" class="text-blue-600 hover:text-blue-700 font-medium">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class RegisterChoiceComponent {
  constructor(private router: Router) {}

  selectRole(role: string): void {
    switch(role) {
      case 'admin':
        this.router.navigate(['/register/admin']);
        break;
      case 'boutique':
        this.router.navigate(['/register/boutique']);
        break;
      case 'acheteur':
        this.router.navigate(['/register/acheteur']);
        break;
    }
  }
}
