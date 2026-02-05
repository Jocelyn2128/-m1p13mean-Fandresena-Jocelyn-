import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AuthResponse } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">MallConnect</h1>
          <p class="text-gray-600">Créer un nouveau compte</p>
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

          <div>
            <label class="form-label">Type de compte</label>
            <select formControlName="role" class="form-input">
              <option value="ACHETEUR">Acheteur</option>
              <option value="BOUTIQUE">Boutique / Commerçant</option>
            </select>
          </div>

          <div *ngIf="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            [disabled]="registerForm.invalid || isLoading"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span *ngIf="!isLoading">S'inscrire</span>
            <span *ngIf="isLoading">Inscription...</span>
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-600">
          Déjà un compte? 
          <a routerLink="/login" class="text-blue-600 hover:text-blue-700 font-medium">
            Se connecter
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class RegisterComponent {
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
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['ACHETEUR', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (response: AuthResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.router.navigate(['/catalog']);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Erreur d\'inscription';
      }
    });
  }
}
