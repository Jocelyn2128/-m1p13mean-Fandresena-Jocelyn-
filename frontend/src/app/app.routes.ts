import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  
  // Routes d'enregistrement séparées
  { path: 'register', loadComponent: () => import('./components/auth/register-choice/register-choice.component').then(m => m.RegisterChoiceComponent) },
  { path: 'register/admin', loadComponent: () => import('./components/auth/register-admin/register-admin.component').then(m => m.RegisterAdminComponent) },
  { path: 'register/boutique', loadComponent: () => import('./components/auth/register-boutique/register-boutique.component').then(m => m.RegisterBoutiqueComponent) },
  { path: 'register/acheteur', loadComponent: () => import('./components/auth/register-acheteur/register-acheteur.component').then(m => m.RegisterAcheteurComponent) },
  
  // Routes Admin
  { 
    path: 'admin', 
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  { 
    path: 'admin/approvals', 
    loadComponent: () => import('./components/admin-dashboard/admin-approval/admin-approval.component').then(m => m.AdminApprovalComponent)
  },
  
  // Route Boutique (POS)
  { 
    path: 'boutique', 
    loadComponent: () => import('./components/pos-system/pos-system.component').then(m => m.PosSystemComponent)
  },
  
  // Route Acheteur (Catalog)
  { 
    path: 'catalog', 
    loadComponent: () => import('./components/catalog/catalog.component').then(m => m.CatalogComponent)
  },
  
  { path: '**', redirectTo: '/login' }
];
