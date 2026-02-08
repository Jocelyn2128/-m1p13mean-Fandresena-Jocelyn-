import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AuthResponse } from '../../../models/user.model';

@Component({
  selector: 'app-register-boutique',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <!-- Étape 1: Formulaire d'inscription -->
        <div *ngIf="step === 1">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-store text-2xl text-green-600"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Inscription Commerçant</h1>
            <p class="text-gray-600">Créer votre compte propriétaire</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Prénom</label>
                <input 
                  type="text" 
                  formControlName="firstName"
                  class="form-input"
                  placeholder="Jean"
                >
              </div>
              <div>
                <label class="form-label">Nom</label>
                <input 
                  type="text" 
                  formControlName="lastName"
                  class="form-input"
                  placeholder="Dupont"
                >
              </div>
            </div>

            <div>
              <label class="form-label">Téléphone</label>
              <input 
                type="tel" 
                formControlName="phone"
                class="form-input"
                placeholder="034 XX XXX XX"
              >
            </div>

            <div>
              <label class="form-label">Email</label>
              <input 
                type="email" 
                formControlName="email"
                class="form-input"
                placeholder="boutique@email.com"
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
              [disabled]="registerForm.invalid || isLoading"
              class="w-full btn-success disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="!isLoading">Créer mon compte</span>
              <span *ngIf="isLoading">Création...</span>
            </button>
          </form>

          <div class="mt-6 text-center text-sm text-gray-600">
            <a routerLink="/register" class="text-blue-600 hover:text-blue-700">
              <i class="fas fa-arrow-left mr-1"></i> Retour
            </a>
          </div>
        </div>

        <!-- Étape 2: Confirmation d'attente -->
        <div *ngIf="step === 2" class="text-center py-8">
          <div class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fas fa-clock text-4xl text-yellow-600"></i>
          </div>
          <h3 class="text-xl font-semibold mb-2">Demande envoyée !</h3>
          <p class="text-gray-600 mb-6">
            Votre compte a été créé avec succès. Il doit être validé par un administrateur avant que vous puissiez accéder à votre espace.
          </p>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p class="text-sm text-yellow-800">
              <i class="fas fa-info-circle mr-2"></i>
              Une fois votre compte validé, vous pourrez créer vos boutiques et les soumettre à validation.
            </p>
          </div>
          <a routerLink="/login" class="btn-primary inline-block">
            Aller à la connexion
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class RegisterBoutiqueComponent {
  step = 1;
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const userData = {
      ...this.registerForm.value,
      role: 'BOUTIQUE'
    };

    this.authService.register(userData).subscribe({
      next: (response: AuthResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.step = 2; // Afficher la confirmation d'attente
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Erreur d\'inscription';
      }
    });
  }
}
