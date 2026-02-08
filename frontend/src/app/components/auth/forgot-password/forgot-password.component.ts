import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <!-- Étape 1: Formulaire -->
        <div *ngIf="step === 1">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-lock text-2xl text-blue-600"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Mot de passe oublié</h1>
            <p class="text-gray-600">Entrez votre email et votre nouveau mot de passe</p>
          </div>

          <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="space-y-4">
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
              <label class="form-label">Nouveau mot de passe</label>
              <input 
                type="password" 
                formControlName="newPassword"
                class="form-input"
                placeholder="••••••••"
              >
              <p class="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
            </div>

            <div>
              <label class="form-label">Confirmer le mot de passe</label>
              <input 
                type="password" 
                formControlName="confirmPassword"
                class="form-input"
                placeholder="••••••••"
              >
            </div>

            <div *ngIf="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {{ errorMessage }}
            </div>

            <button 
              type="submit"
              [disabled]="forgotForm.invalid || isLoading"
              class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="!isLoading">Envoyer la demande</span>
              <span *ngIf="isLoading">Envoi...</span>
            </button>
          </form>

          <div class="mt-6 text-center text-sm text-gray-600">
            <a routerLink="/login" class="text-blue-600 hover:text-blue-700">
              <i class="fas fa-arrow-left mr-1"></i> Retour à la connexion
            </a>
          </div>
        </div>

        <!-- Étape 2: Confirmation -->
        <div *ngIf="step === 2" class="text-center py-8">
          <div class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fas fa-clock text-4xl text-yellow-600"></i>
          </div>
          <h3 class="text-xl font-semibold mb-2">Demande envoyée !</h3>
          <p class="text-gray-600 mb-6">
            Votre demande de changement de mot de passe a été soumise. Un administrateur doit la valider avant que votre mot de passe soit modifié.
          </p>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p class="text-sm text-yellow-800">
              <i class="fas fa-info-circle mr-2"></i>
              Vous recevrez un email de confirmation une fois votre demande approuvée.
            </p>
          </div>
          <a routerLink="/login" class="btn-primary inline-block">
            Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class ForgotPasswordComponent {
  step = 1;
  forgotForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      if (this.forgotForm.hasError('mismatch')) {
        this.errorMessage = 'Les mots de passe ne correspondent pas';
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, newPassword } = this.forgotForm.value;

    this.http.post(`${environment.apiUrl}/auth/forgot-password`, {
      email,
      newPassword
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.step = 2;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Erreur lors de l\'envoi de la demande';
      }
    });
  }
}
