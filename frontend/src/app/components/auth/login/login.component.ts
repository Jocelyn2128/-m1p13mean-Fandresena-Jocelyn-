import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AuthResponse } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">MallConnect</h1>
          <p class="text-gray-600">Connexion à votre compte</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="form-label">Email</label>
            <input 
              type="email" 
              formControlName="email"
              class="form-input"
              placeholder="votre@email.com"
            >
          </div>

          <div>
            <label class="form-label">Mot de passe</label>
            <input 
              type="password" 
              formControlName="password"
              class="form-input"
              placeholder="••••••••"
            >
          </div>

          <!-- Message d'erreur normal -->
          <div *ngIf="errorMessage && !isPendingApproval" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <!-- Message compte en attente -->
          <div *ngIf="isPendingApproval" class="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
            <div class="flex items-start">
              <i class="fas fa-clock text-yellow-600 mt-1 mr-3"></i>
              <div>
                <p class="font-medium mb-1">Compte en attente de validation</p>
                <p class="text-sm">Votre compte doit être validé par un administrateur avant que vous puissiez vous connecter. Veuillez réessayer plus tard ou contactez l'administration.</p>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            [disabled]="loginForm.invalid || isLoading"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span *ngIf="!isLoading">Se connecter</span>
            <span *ngIf="isLoading">Connexion...</span>
          </button>
          
          <div class="mt-4 text-center">
            <a routerLink="/forgot-password" class="text-sm text-blue-600 hover:text-blue-700">
              Mot de passe oublié ?
            </a>
          </div>
        </form>

        <!-- Séparateur -->
        <div class="my-6 flex items-center">
          <div class="flex-1 border-t border-gray-200"></div>
          <span class="px-3 text-xs text-gray-400 font-medium">CONNEXION RAPIDE (DEV)</span>
          <div class="flex-1 border-t border-gray-200"></div>
        </div>

        <!-- Boutons de connexion rapide -->
        <div class="space-y-3">
          <button 
            type="button"
            (click)="quickLogin('boutique')"
            [disabled]="isLoading"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-purple-200 bg-purple-50 text-purple-700 font-medium text-sm hover:bg-purple-100 hover:border-purple-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-store text-purple-600"></i>
            <span *ngIf="!isLoadingBoutique">Se connecter en tant que Boutique</span>
            <span *ngIf="isLoadingBoutique">Connexion...</span>
          </button>

          <button 
            type="button"
            (click)="quickLogin('admin')"
            [disabled]="isLoading"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-red-200 bg-red-50 text-red-700 font-medium text-sm hover:bg-red-100 hover:border-red-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-shield-alt text-red-600"></i>
            <span *ngIf="!isLoadingAdmin">Se connecter en tant qu'Admin</span>
            <span *ngIf="isLoadingAdmin">Connexion...</span>
          </button>
        </div>

        <div class="mt-6 text-center text-sm text-gray-600">
          Pas encore de compte? 
          <a routerLink="/register" class="text-blue-600 hover:text-blue-700 font-medium">
            S'inscrire
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  isLoadingBoutique = false;
  isLoadingAdmin = false;
  errorMessage = '';
  isPendingApproval = false;

  // Crédentiels pré-définis pour dev
  private readonly CREDENTIALS = {
    client: { email: 'jean@gmail.com', password: 'jean123' },
    boutique: { email: 'fandresena@gmail.com', password: 'fandresena' },
    admin: { email: 'admin@gmail.com', password: 'admin1234' }
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [this.CREDENTIALS.client.email, [Validators.required, Validators.email]],
      password: [this.CREDENTIALS.client.password, [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.isPendingApproval = false;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: AuthResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.redirectBasedOnRole(response.data.user.role);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        if (error.status === 403 && error.error?.isPending) {
          this.isPendingApproval = true;
        } else {
          this.errorMessage = error.error?.message || 'Erreur de connexion';
        }
      }
    });
  }

  quickLogin(type: 'boutique' | 'admin'): void {
    const credentials = this.CREDENTIALS[type];

    if (type === 'boutique') this.isLoadingBoutique = true;
    if (type === 'admin') this.isLoadingAdmin = true;
    this.isLoading = true;
    this.errorMessage = '';
    this.isPendingApproval = false;

    this.authService.login(credentials).subscribe({
      next: (response: AuthResponse) => {
        this.isLoadingBoutique = false;
        this.isLoadingAdmin = false;
        this.isLoading = false;
        if (response.success) {
          this.redirectBasedOnRole(response.data.user.role);
        }
      },
      error: (error: any) => {
        this.isLoadingBoutique = false;
        this.isLoadingAdmin = false;
        this.isLoading = false;
        if (error.status === 403 && error.error?.isPending) {
          this.isPendingApproval = true;
        } else {
          this.errorMessage = error.error?.message || `Erreur de connexion en tant que ${type}`;
        }
      }
    });
  }

  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'ADMIN_MALL':
        this.router.navigate(['/admin']);
        break;
      case 'BOUTIQUE':
        this.router.navigate(['/boutique']);
        break;
      case 'ACHETEUR':
        this.router.navigate(['/catalog']);
        break;
      default:
        this.router.navigate(['/catalog']);
    }
  }
}
