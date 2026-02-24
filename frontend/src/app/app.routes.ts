import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'forgot-password', loadComponent: () => import('./components/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },

  // Routes d'enregistrement séparées
  { path: 'register', loadComponent: () => import('./components/auth/register-choice/register-choice.component').then(m => m.RegisterChoiceComponent) },
  { path: 'register/admin', loadComponent: () => import('./components/auth/register-admin/register-admin.component').then(m => m.RegisterAdminComponent) },
  { path: 'register/boutique', loadComponent: () => import('./components/auth/register-boutique/register-boutique.component').then(m => m.RegisterBoutiqueComponent) },
  { path: 'register/acheteur', loadComponent: () => import('./components/auth/register-acheteur/register-acheteur.component').then(m => m.RegisterAcheteurComponent) },

  // Routes Admin avec Layout
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'stores', loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'approvals', loadComponent: () => import('./components/admin-dashboard/admin-approval/admin-approval.component').then(m => m.AdminApprovalComponent) },
      { path: 'approvals/users', loadComponent: () => import('./components/admin-dashboard/admin-user-approval/admin-user-approval.component').then(m => m.AdminUserApprovalComponent) },
      { path: 'approvals/password-requests', loadComponent: () => import('./components/admin-dashboard/admin-password-requests/admin-password-requests.component').then(m => m.AdminPasswordRequestsComponent) },
      { path: 'events', loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'statistics', loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
    ]
  },

  // Routes Boutique avec Layout (Gestion)
  {
    path: 'boutique',
    loadComponent: () => import('./layouts/boutique-layout/boutique-layout.component').then(m => m.BoutiqueLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./components/boutique/my-stores/my-stores.component').then(m => m.MyStoresComponent) },
      { path: 'stores', loadComponent: () => import('./components/boutique/my-stores/my-stores.component').then(m => m.MyStoresComponent) },
      { path: 'store/:id/cashiers', loadComponent: () => import('./components/boutique/store-cashiers/store-cashiers.component').then(m => m.StoreCashiersComponent) },
      { path: 'store/:id/products', loadComponent: () => import('./components/pos-system/inventory-management/inventory-management.component').then(m => m.InventoryManagementComponent) },
    ]
  },

  // Routes POS avec Layout (Ventes)
  {
    path: 'pos',
    loadComponent: () => import('./layouts/pos-layout/pos-layout.component').then(m => m.PosLayoutComponent),
    children: [
      { path: ':id', loadComponent: () => import('./components/pos/pos.component').then(m => m.PosComponent) },
      { path: ':id/history', loadComponent: () => import('./components/pos/sales-history/sales-history.component').then(m => m.SalesHistoryComponent) },
      { path: ':id/reports', loadComponent: () => import('./components/pos/sales-reports/sales-reports.component').then(m => m.SalesReportsComponent) },
    ]
  },

  // Route Acheteur (Catalog)
  {
    path: 'catalog',
    loadComponent: () => import('./components/catalog/catalog.component').then(m => m.CatalogComponent)
  },
  {
    path: 'catalog/product/:id',
    loadComponent: () => import('./components/catalog/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'catalog/store/:id',
    loadComponent: () => import('./components/catalog/store-detail/store-detail.component').then(m => m.StoreDetailComponent)
  },

  // Favoris
  {
    path: 'favorites',
    loadComponent: () => import('./components/favorites/favorites.component').then(m => m.FavoritesComponent)
  },

  // E-Commerce – Panier
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent)
  },

  // E-Commerce – Passage de commande
  {
    path: 'checkout',
    loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent)
  },

  // E-Commerce – Confirmation de commande
  {
    path: 'order-confirmation/:id',
    loadComponent: () => import('./components/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent)
  },

  // E-Commerce – Suivi de commande
  {
    path: 'order-tracking',
    loadComponent: () => import('./components/order-tracking/order-tracking.component').then(m => m.OrderTrackingComponent)
  },
  {
    path: 'order-tracking/:receiptNumber',
    loadComponent: () => import('./components/order-tracking/order-tracking.component').then(m => m.OrderTrackingComponent)
  },

  // E-Commerce – Historique des achats
  {
    path: 'order-history',
    loadComponent: () => import('./components/order-history/order-history.component').then(m => m.OrderHistoryComponent)
  },

  // E-Commerce – Portefeuille de tickets numériques
  {
    path: 'wallet',
    loadComponent: () => import('./components/wallet/wallet.component').then(m => m.WalletComponent)
  },

  { path: '**', redirectTo: '/login' }
];
