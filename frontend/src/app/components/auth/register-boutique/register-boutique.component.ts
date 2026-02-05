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
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-store text-2xl text-green-600"></i>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Inscription Boutique</h1>
          <p class="text-gray-600">Créer un compte commerçant</p>
        </div>

        <!-- Étape 1: Informations du propriétaire -->
        <div *ngIf="step === 1">
          <h3 class="text-lg font-medium mb-4">Informations du propriétaire</h3>
          <form [formGroup]="ownerForm" class="space-y-4">
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

            <button 
              type="button"
              (click)="nextStep()"
              [disabled]="ownerForm.invalid"
              class="w-full btn-success disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant <i class="fas fa-arrow-right ml-2"></i>
            </button>
          </form>
        </div>

        <!-- Étape 2: Informations de la boutique -->
        <div *ngIf="step === 2">
          <h3 class="text-lg font-medium mb-4">Informations de la boutique</h3>
          <form [formGroup]="storeForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="form-label">Nom de la boutique</label>
              <input 
                type="text" 
                formControlName="storeName"
                class="form-input"
                placeholder="Ma Boutique"
              >
            </div>

            <div>
              <label class="form-label">Catégorie</label>
              <select formControlName="category" class="form-input">
                <option value="">Sélectionnez une catégorie</option>
                <option value="mode">Mode & Vêtements</option>
                <option value="electronique">Électronique</option>
                <option value="alimentation">Alimentation</option>
                <option value="maison">Maison & Déco</option>
                <option value="sport">Sport</option>
                <option value="beaute">Beauté & Bien-être</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label class="form-label">Description</label>
              <textarea 
                formControlName="description"
                class="form-input"
                rows="3"
                placeholder="Décrivez votre boutique..."
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Étage</label>
                <select formControlName="floor" class="form-input">
                  <option value="RDC">RDC</option>
                  <option value="1">1er étage</option>
                  <option value="2">2ème étage</option>
                  <option value="3">3ème étage</option>
                </select>
              </div>
              <div>
                <label class="form-label">N° Local</label>
                <input 
                  type="text" 
                  formControlName="shopNumber"
                  class="form-input"
                  placeholder="A-12"
                >
              </div>
            </div>

            <div *ngIf="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {{ errorMessage }}
            </div>

            <div class="flex space-x-3">
              <button 
                type="button"
                (click)="previousStep()"
                class="flex-1 btn-secondary"
              >
                <i class="fas fa-arrow-left mr-2"></i> Retour
              </button>
              <button 
                type="submit"
                [disabled]="storeForm.invalid || isLoading"
                class="flex-1 btn-success disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isLoading">Envoyer la demande</span>
                <span *ngIf="isLoading">Envoi...</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Étape 3: Confirmation d'attente -->
        <div *ngIf="step === 3" class="text-center py-8">
          <div class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fas fa-clock text-4xl text-yellow-600"></i>
          </div>
          <h3 class="text-xl font-semibold mb-2">Demande envoyée !</h3>
          <p class="text-gray-600 mb-6">
            Votre demande d'inscription a été soumise. Un administrateur doit valider votre boutique avant que vous puissiez accéder à votre compte.
          </p>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p class="text-sm text-yellow-800">
              <i class="fas fa-info-circle mr-2"></i>
              Vous recevrez un email de confirmation une fois votre compte approuvé.
            </p>
          </div>
          <a routerLink="/login" class="btn-primary inline-block">
            Aller à la connexion
          </a>
        </div>

        <div class="mt-6 text-center text-sm text-gray-600" *ngIf="step !== 3">
          <a routerLink="/register" class="text-blue-600 hover:text-blue-700">
            <i class="fas fa-arrow-left mr-1"></i> Retour
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class RegisterBoutiqueComponent {
  step = 1;
  ownerForm: FormGroup;
  storeForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.ownerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.storeForm = this.fb.group({
      storeName: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      floor: ['RDC', Validators.required],
      shopNumber: ['', Validators.required]
    });
  }

  nextStep(): void {
    if (this.ownerForm.valid) {
      this.step = 2;
    }
  }

  previousStep(): void {
    this.step = 1;
  }

  onSubmit(): void {
    if (this.storeForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const userData = {
      ...this.ownerForm.value,
      role: 'BOUTIQUE',
      storeInfo: this.storeForm.value
    };

    this.authService.register(userData).subscribe({
      next: (response: AuthResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.step = 3; // Afficher la confirmation d'attente
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Erreur d\'inscription';
      }
    });
  }
}
