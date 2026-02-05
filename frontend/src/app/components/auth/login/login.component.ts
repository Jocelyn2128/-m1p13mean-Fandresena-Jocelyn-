import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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

          <div *ngIf="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            [disabled]="loginForm.invalid || isLoading"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span *ngIf="!isLoading">Se connecter</span>
            <span *ngIf="isLoading">Connexion...</span>
          </button>
        </form>

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
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.redirectBasedOnRole(response.data.user.role);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Erreur de connexion';
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
