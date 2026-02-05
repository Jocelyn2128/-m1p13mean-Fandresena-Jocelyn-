import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) },
  { 
    path: 'admin', 
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  { 
    path: 'boutique', 
    loadComponent: () => import('./components/pos-system/pos-system.component').then(m => m.PosSystemComponent)
  },
  { 
    path: 'catalog', 
    loadComponent: () => import('./components/catalog/catalog.component').then(m => m.CatalogComponent)
  },
  { path: '**', redirectTo: '/login' }
];
